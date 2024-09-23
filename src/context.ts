import {YogaInitialContext} from 'graphql-yoga';
import {authenticateRequest} from './utils/authentication';
import {prisma} from './db';

export type GraphQLContext = YogaInitialContext & {
  user: {
    id: string;
  } | null;
  res: Response;
};

export async function createContext(
  initialContext: YogaInitialContext & { res: Response }, // Pass res in
): Promise<GraphQLContext> {
  const {user} = await authenticateRequest(prisma, initialContext.request);

  return {
    ...initialContext,
    user,
  };
}
