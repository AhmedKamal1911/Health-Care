import "server-only";
import { cookies } from "next/headers";
import { AuthenticationError } from "./error";
export async function getSessionCookie() {
  const userSessionCookie = (await cookies()).get("session");
  const userSession = userSessionCookie?.value;

  if (!userSession) throw new AuthenticationError("Unauthenticated User");
  return userSession;
}

export async function createLoginSession(jwt: string, expire: string) {
  (await cookies()).set("session", jwt, {
    httpOnly: true,
    expires: new Date(expire),
    path: "/",
    secure: true,
    sameSite: "strict",
  });
}
