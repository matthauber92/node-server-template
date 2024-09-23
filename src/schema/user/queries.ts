import { builder } from '../../builder';
import { prisma } from '../../db';
import { UserOrderBy, UserFilter, UserWhere } from './inputs';

builder.queryFields((t) => ({
  myUser: t.prismaField({
    type: 'User',
    resolve: async (query, _parent, _args, context) => {
      if (!context.user || !context.user.id) {
        throw new Error('User must be logged in');
      }
      return await prisma.user.findUniqueOrThrow({
        ...query,
        where: { id: context.user.id },
      });
    },
  }),

  user: t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      where: t.arg({
        type: UserWhere,
        required: true,
      }),
    },
    resolve: (query, _parent, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }
      return prisma.user.findUnique({
        ...query,
        where: {
          id: args.where?.id ?? undefined,
        },
      });
    },
  }),

  users: t.prismaField({
    type: ['User'],
    args: {
      orderBy: t.arg({ type: [UserOrderBy] }),
      skip: t.arg.int(),
      take: t.arg.int(),
      where: t.arg({ type: UserFilter }),
    },
    resolve: (query, _parent, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }
      return prisma.user.findMany({
        ...query,
        take: args.take ?? undefined, // Use nullish coalescing
        skip: args.skip ?? undefined, // Use nullish coalescing
      });
    },
  }),
}));

