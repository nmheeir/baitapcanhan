import { NextRequest, NextResponse } from 'next/server';
import { verifyUser } from '@/lib/database';

/**
 * API endpoint để xác thực email
 * GET /api/auth/verify?token=verification_token
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token xác thực không hợp lệ' },
        { status: 400 }
      );
    }

    // Verify user với token
    const isVerified = await verifyUser(token);

    if (!isVerified) {
      return NextResponse.json(
        { error: 'Token xác thực không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong quá trình xác thực' },
      { status: 500 }
    );
  }
}