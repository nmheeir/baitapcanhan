// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

// Middleware chỉ check login, không query DB
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const guestOnlyRoutes = ["/auth/login", "/auth/register"];
  const token = request.cookies.get("auth-token")?.value;
  const user = token ? await verifyToken(token) : null;

  // Guest-only routes
  if (guestOnlyRoutes.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
  }

  // Nếu chưa login mà vào route protected → redirect login
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/profile/:path*",
    "/books/:path*",
    "/books/manage/:path*",
    "/borrow/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
