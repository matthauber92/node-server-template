import { JwtPayload } from '../utils/authentication'
import {User} from "@prisma/client";

interface IsAuthenticatedInput {
  jwtPayload: JwtPayload | undefined
}

export function isAuthenticated({ jwtPayload }: IsAuthenticatedInput): boolean {
  return !!jwtPayload?.sub
}

interface IsUserRegisteredInput {
  target: User
}

export function isUserRegistered({ target }: IsUserRegisteredInput): boolean {
  return !!target?.username
}

