import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = "rahasia-sementara-minimal-32-karakter-ya";

export async function proxy(req: NextRequest) {
  try {
    await jwtVerify(
      req.cookies.get("session")?.value ?? "",
      new TextEncoder().encode(SECRET)
    );
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = { matcher: ["/dashboard/:path*"] };