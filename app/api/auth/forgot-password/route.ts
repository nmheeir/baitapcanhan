import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, updateResetToken } from '@/lib/database';
import { generateResetToken, isValidEmail } from '@/lib/auth';
import { sendResetPasswordEmail } from '@/lib/email';

/**
 * API endpoint để yêu cầu reset mật khẩu
 * POST /api/auth/forgot-password
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Vui lòng nhập email' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      // Không tiết lộ thông tin user có tồn tại hay không (security)
      return NextResponse.json(
        { message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu.' },
        { status: 200 }
      );
    }

    // Check if user is verified
    if (!user.is_verified) {
      return NextResponse.json(
        { error: 'Tài khoản chưa được xác thực. Vui lòng xác thực email trước.' },
        { status: 403 }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken();
    
    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Update user with reset token
    const updated = await updateResetToken(email, resetToken, expiresAt);
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Có lỗi xảy ra. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Send reset email
    const emailSent = await sendResetPasswordEmail(email, resetToken);
    
    if (!emailSent) {
      console.error('Failed to send reset password email');
      return NextResponse.json(
        { error: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email hướng dẫn đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong quá trình xử lý' },
      { status: 500 }
    );
  }
}