import bcrypt from 'bcrypt';
import {builder} from '../../builder';
import {prisma} from '../../db';
import {SignupInput, MyUserUpdate, AuthenticateInput} from './inputs';
import {Prisma} from '@prisma/client';
import {GraphQLError} from 'graphql';
import {Authentication} from './index';
import {serialize} from 'cookie';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

builder.mutationFields((t) => ({
  authenticate: t.field({
    type: Authentication,
    args: {
      input: t.arg({
        type: AuthenticateInput,
        required: true,
      }),
    },
    resolve: async (_parent, args, context) => {
      const user = await prisma.user.findUnique({
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

      // Create a cookie if authentication is successful
      if (context) {
        const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token';
        const cookieValue = Buffer.from(JSON.stringify({userId: user.id})).toString('base64');
        const cookie = serialize(COOKIE_NAME, cookieValue, {
          httpOnly: false,
          maxAge: COOKIE_MAX_AGE,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
        // @ts-ignore
        context.res.setHeader('Set-Cookie', cookie);
      }

      return {
        userId: user.id
      };
    },
  }),

  signup: t.prismaField({
    type: 'User',
    args: {
      input: t.arg({
        type: SignupInput,
        required: true,
      }),
    },
    resolve: async (query, _parent, args, context) => {
      if (context.user) {
        throw new GraphQLError('You are already logged in');
      }

      try {
        const hashedPassword = await bcrypt.hash(args.input.password, 10);
        return await prisma.user.create({
          ...query,
          data: {
            username: args.input.username,
            email: args.input.email,
            firstName: args.input.firstName ?? undefined,
            lastName: args.input.lastName ?? undefined,
            password: hashedPassword,
          },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new GraphQLError('Username or email already exists');
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
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new GraphQLError('Username or email already exists');
          }
        }
        throw new Error('Error updating user');
      }
    },
  }),

  deleteMyUser: t.withAuth({loggedIn: true}).prismaField({
    type: 'User',
    resolve: async (query, _parent, args, context) => {
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
