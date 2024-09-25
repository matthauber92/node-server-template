import { PrismaClient, User } from "@prisma/client";
import { serialize, parse } from "cookie";

const COOKIE_NAME = process.env.COOKIE_NAME || "auth_token";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "secretkey";

interface AuthenticateRequestResult {
  user: User | null;
  cookiePayload: { userId: string } | null;
}

// Utility to parse cookies from the request
export function getCookiePayload(request: Request): { userId: string } | null {
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = parse(cookieHeader);
    const cookieToken = cookies[COOKIE_NAME];
    if (cookieToken && COOKIE_SECRET) {
      try {
        const payload = JSON.parse(
          Buffer.from(cookieToken, "base64").toString("utf-8"),
        );
        if (payload && payload.userId) {
          return { userId: payload.userId };
        }
      } catch (error) {
        console.error("Invalid cookie token", error);
        return null;
      }
    }
  }
  return null;
}

// Middleware for authentication using cookies
export async function authenticateRequest(
  prisma: PrismaClient,
  request: Request,
): Promise<AuthenticateRequestResult> {
  const cookiePayload = getCookiePayload(request);
  const user = await (async () => {
    if (cookiePayload) {
      try {
        return await prisma.user.findUniqueOrThrow({
          where: { id: cookiePayload.userId },
        });
      } catch (error) {
        console.error("User not found", error);
        return null;
      }
    }
    return null;
  })();

  return { user, cookiePayload };
}

// Function to clear the authentication cookie (e.g., on logout)
export function clearAuthCookie(response: Response): void {
  response.headers.set(
    "Set-Cookie",
    serialize(COOKIE_NAME, "", {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    }),
  );
}
