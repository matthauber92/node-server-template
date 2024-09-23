import {PrismaClient, User} from '@prisma/client'
import { sign, verify } from 'jsonwebtoken'
import * as jwt from 'jsonwebtoken'

const SIGNING_KEY = process.env.JWT_SECRET
const ISSUER = process.env.JWT_ISSUER
const AUDIENCE = process.env.JWT_AUDIENCE
const ACCESS_TOKEN_EXPIRES_IN =
  parseInt(`${process.env.JWT_ACCESS_TOKEN_EXPIRES_IN}`) || 0

export interface JwtPayload extends jwt.JwtPayload {
  userId: string | undefined
}

function getJwtPayload(request: Request): JwtPayload | null {
  const header = request.headers.get('authorization')
  if (header !== null) {
    const token = header.split(' ')[1]

    if (SIGNING_KEY) {
      return verify(token, SIGNING_KEY) as JwtPayload
    }
  }

  return null
}

interface AuthenticateRequestResult {
  user: User | null
  jwtPayload: JwtPayload | null
}

export async function authenticateRequest(
  prisma: PrismaClient,
  request: Request,
): Promise<AuthenticateRequestResult> {
  const jwtPayload = getJwtPayload(request)

  // TODO: try catch? console.error and throw Error vs let it bubble up
  const user = await (async () => {
    if (jwtPayload) {
      return await prisma.user.findUniqueOrThrow({
        where: { id: jwtPayload.userId }
      })
    } else {
      return null
    }
  })()

  return { jwtPayload, user }
}

interface SignJwtInput {
  userId: string
}

// TODO: test function
export function signJwt({ userId }: SignJwtInput): string {
  if (!SIGNING_KEY) {
    throw new Error('Invalid server configuration')
  }

  // TODO: namespacing this way might not the best idea
  return sign({ userId }, SIGNING_KEY, {
    issuer: ISSUER,
    subject: userId,
    audience: AUDIENCE,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  })
}
