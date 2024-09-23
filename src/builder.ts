import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { DateTimeResolver, JSONResolver } from 'graphql-scalars';
import { prisma } from './db';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import ComplexityPlugin from '@pothos/plugin-complexity';
import ValidationPlugin from '@pothos/plugin-validation';
import { GraphQLContext } from './context';
import { JwtPayload } from './utils/authentication';
import { GraphQLError } from 'graphql';
import { pathToArray } from 'graphql/jsutils/Path';
import {User} from "@prisma/client";

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
    JSON: {
      Input: unknown;
      Output: unknown;
    };
  };
  Context: GraphQLContext;
  AuthScopes: {
    authenticated: boolean
    loggedIn: boolean
  };
  AuthContexts: {
    loggedIn: GraphQLContext & { user: User };
    authenticated: GraphQLContext & { jwtPayload: JwtPayload };
  };
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin, ValidationPlugin, ComplexityPlugin],
  scopeAuth: {
    authScopes: async (context) => ({
      authenticated: !!context.jwtPayload,
      loggedIn: (desiredState: boolean) => {
        return !!context.user === desiredState;
      },
    }),
  },
  prisma: {
    client: prisma,
  },
  complexity: {
    defaultComplexity: 1,
    defaultListMultiplier: 10,
    limit: () => ({
      complexity: 500,
      depth: 10,
      breadth: 50,
    }),
  },
  validationOptions: {
    validationError: (zodError, _args, _context, info) => {
      const [{ message, path }] = zodError.issues;
      return new GraphQLError(message, {
        path: [...pathToArray(info.path), ...path],
        extensions: {
          code: 'VALIDATION_ERROR',
        },
      });
    },
  },
});

builder.queryType({});
builder.mutationType({});

builder.addScalarType('DateTime', DateTimeResolver, {});
builder.addScalarType('JSON', JSONResolver, {});
