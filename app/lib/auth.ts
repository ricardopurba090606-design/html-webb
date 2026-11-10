import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "session";

function secret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET ||
      "dev-secret-ganti-di-production-minimal-32-karakter"
  );
}

export async function createSession(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret());
}

export async function readSession(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.username as string;
  } catch {
    return null;
  }
}