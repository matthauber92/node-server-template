import bcrypt from 'bcrypt';
import {builder} from '../../builder';
import {prisma} from '../../db';
import {SignupInput, MyUserUpdate, AuthenticateInput} from './inputs';
import {Prisma} from '@prisma/client';
import {GraphQLError} from 'graphql';
import {Authentication} from "./index";
import {signJwt} from "../../utils/authentication";
import {isUserRegistered} from "../../accessControl/user";

builder.mutationFields((t) => ({
  authenticate: t.field({
    type: Authentication, // Assuming you have an Authentication type defined
    args: {
      input: t.arg({
        type: AuthenticateInput, // Username and password input
        required: true,
      }),
    },
    resolve: async (_parent, args) => {
      // Fetch user by username
      let user = await prisma.user.findUnique({
        where: {username: args.input.username},
      });

      if (!user) {
        throw new GraphQLError('Invalid username or password');
      }

      // If user exists, verify the provided password matches the stored hash
      const isPasswordValid = await bcrypt.compare(args.input.password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid username or password');
      }

      // Create a JWT token if authentication is successful
      return {
        token: signJwt({
          userId: user.id,
        }),
        userId: isUserRegistered({target: user}) ? user.id : undefined,
      };
    },
  }),
  signup: t
    .prismaField({
      type: 'User',
      args: {
        input: t.arg({
          type: SignupInput,
          required: true,
        }),
      },
      resolve: async (query, _parent, args, context) => {
        // Check authentication logic explicitly if necessary
        if (!context.user) {
          throw new GraphQLError('Authentication required');
        }
        if (context.user) {
          throw new GraphQLError('You are already logged in');
        }

        try {
          return await prisma.user.create({
            ...query,
            data: {
              username: args.input.username,
              email: args.input.email,
              firstName: args.input.firstName ?? undefined,
              lastName: args.input.lastName ?? undefined,
              password: args.input.password ?? undefined,
            },
          });
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
              throw new GraphQLError(`Username or email already exists`);
            }
            if (err.code === 'P2003') {
              throw new GraphQLError(`Invalid home club`);
            }
          }
          throw new Error('Error signing up');
        }
      },
    }),
  updateMyUser: t.withAuth({loggedIn: true}).prismaField({
    type: 'User',
    args: {
      data: t.arg({
        type: MyUserUpdate,
        required: true,
      }),
    },
    resolve: async (query, _parent, args, context) => {
      // Ensure user is logged in
      if (!context.user) {
        throw new GraphQLError('You must be logged in to update user details');
      }

      try {
        return await prisma.user.update({
          ...query,
          data: {
            username: args.data.username || undefined,
            email: args.data.email || undefined,
            firstName: args.data.firstName ?? undefined,
            lastName: args.data.lastName ?? undefined,
          },
          where: {id: context.user.id},
        });
      } catch (err) {
        console.error(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new GraphQLError(`Username or email already exists`);
          }
          if (err.code === 'P2003') {
            throw new GraphQLError(`Invalid home club`);
          }
        }
        throw new Error('Error updating user');
      }
    },
  }),

  deleteMyUser: t.withAuth({loggedIn: true}).prismaField({
    type: 'User',
    resolve: async (query, _parent, args, context) => {
      // Ensure user is logged in
      if (!context.user) {
        throw new GraphQLError('You must be logged in to delete your account');
      }

      try {
        return await prisma.user.delete({
          ...query,
          where: {
            id: context.user.id,
          },
        });
      } catch (err) {
        console.error(err);
        throw new Error('Error deleting user');
      }
    },
  }),
}));
