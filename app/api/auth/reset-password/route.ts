import { NextRequest, NextResponse } from 'next/server';
import { findUserByResetToken, updatePassword } from '@/lib/database';
import { hashPassword, isValidPassword } from '@/lib/auth';

/**
 * API endpoint để đặt lại mật khẩu
 * POST /api/auth/reset-password
 */
export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmPassword } = await request.json();

    console.log(token);
    

    // Validate input
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Mật khẩu xác nhận không khớp' },
        { status: 400 }
      );
    }

    // Find user by reset token
    const user = await findUserByResetToken(token);
    if (!user) {      
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password and clear reset token
    const updated = await updatePassword(user.id, hashedPassword);
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Có lỗi xảy ra khi cập nhật mật khẩu' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong quá trình đặt lại mật khẩu' },
      { status: 500 }
    );
  }
}