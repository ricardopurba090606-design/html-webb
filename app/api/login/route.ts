import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const USERNAME = "ricardo090606";
const PASSWORD = "12345";
const SECRET = "rahasia-sementara-minimal-32-karakter-ya";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (username !== USERNAME || password !== PASSWORD) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(SECRET));

    const res = NextResponse.json({ ok: true });
    res.cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}