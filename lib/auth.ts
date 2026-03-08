import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

import { env } from "@/lib/env";

const SESSION_COOKIE_NAME = "finance_todo_session";
const SESSION_SUBJECT = "finance-dashboard";
const encoder = new TextEncoder();

function getSecret() {
  return encoder.encode(env.SESSION_SECRET);
}

export function getPasswordValue() {
  return env.APP_PASSWORD;
}

export async function createSession() {
  const token = await new SignJWT({ role: "owner" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(SESSION_SUBJECT)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function verifySessionToken(token?: string) {
  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
      subject: SESSION_SUBJECT,
    });
    return true;
  } catch {
    return false;
  }
}

export { SESSION_COOKIE_NAME };
