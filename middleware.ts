import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

/**
 * Middleware để bảo vệ các routes cần authentication
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Các routes cần bảo vệ (yêu cầu đăng nhập)
  const protectedRoutes = ['/dashboard', '/profile'];
  
  // Các routes chỉ dành cho guest (chưa đăng nhập)
  const guestOnlyRoutes = ['/auth/login', '/auth/register'];

  // Lấy token từ cookie
  const token = request.cookies.get('auth-token')?.value;
  
  // Verify token
  const user = token ? verifyToken(token) : null;

  // Nếu truy cập protected route mà chưa đăng nhập
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Nếu đã đăng nhập mà truy cập guest-only routes
  if (guestOnlyRoutes.some(route => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Cấu hình matcher để áp dụng middleware cho các routes cụ thể
export const config = {
  matcher: [
    // Bảo vệ dashboard và profile
    '/dashboard/:path*',
    '/profile/:path*',
    // Guest-only routes
    '/auth/login',
    '/auth/register',
  ],
};