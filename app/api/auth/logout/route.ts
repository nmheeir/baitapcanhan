import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint để đăng xuất
 * POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    // Tạo response
    const response = NextResponse.json(
      { message: 'Đăng xuất thành công' },
      { status: 200 }
    );

    // Xóa auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong quá trình đăng xuất' },
      { status: 500 }
    );
  }
}