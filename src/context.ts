import { YogaInitialContext } from 'graphql-yoga'
import { JwtPayload, authenticateRequest } from './utils/authentication'
import { prisma } from './db'

export type GraphQLContext = YogaInitialContext & {
  user: {
    id: string; // or number, depending on your schema
    email: string;
  } | null
  jwtPayload: JwtPayload | null
}

export async function createContext(
  initialContext: YogaInitialContext,
): Promise<GraphQLContext> {
  const { user, jwtPayload } = await authenticateRequest(
    prisma,
    initialContext.request,
  )
  return {
    ...initialContext,
    user,
    jwtPayload,
  }
}
