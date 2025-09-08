import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, updateUserPassword } from '@/lib/database';
import { hashPassword } from '@/lib/auth';
import { sendNewPasswordEmail } from '@/lib/email';

/**
 * Hàm sinh mật khẩu ngẫu nhiên theo yêu cầu:
 * - ít nhất 8 ký tự
 * - có ít nhất 1 chữ hoa, 1 chữ thường, 1 số
 */
function generateStrongPassword(length = 10): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const all = upper + lower + digits;

  // Bắt buộc có 1 ký tự mỗi loại
  let password =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    digits[Math.floor(Math.random() * digits.length)];

  // Thêm các ký tự còn lại
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle để tránh predictable pattern
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

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

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      // Không tiết lộ thông tin user có tồn tại hay không (security)
      return NextResponse.json(
        { message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email chứa mật khẩu mới.' },
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

    // Generate new strong password
    const newPassword = generateStrongPassword();

    // Hash mật khẩu mới
    const hashedPassword = await hashPassword(newPassword);

    // Update DB với mật khẩu mới
    const updated = await updateUserPassword(email, hashedPassword);
    if (!updated) {
      return NextResponse.json(
        { error: 'Có lỗi xảy ra khi cập nhật mật khẩu.' },
        { status: 500 }
      );
    }

    // Send new password via email
    const emailSent = await sendNewPasswordEmail(email, newPassword);
    if (!emailSent) {
      console.error('Failed to send new password email');
      return NextResponse.json(
        { error: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Mật khẩu mới đã được tạo và gửi qua email. Vui lòng kiểm tra hộp thư.' },
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
