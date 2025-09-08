import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/database';
import { hashPassword, isValidEmail, isValidPassword, generateVerificationToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

/**
 * API endpoint để đăng ký tài khoản mới
 * POST /api/auth/register
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, confirmPassword } = await request.json();

    // Validate input
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
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

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email này đã được đăng ký' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Create user
    const newUser = await createUser({
      email,
      password: hashedPassword,
      verification_token: verificationToken,
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken);
    
    if (!emailSent) {
      console.error('Failed to send verification email');
      // Không return error ở đây vì user đã được tạo thành công
    }

    return NextResponse.json(
      {
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
        user: {
          id: newUser.id,
          email: newUser.email,
          is_verified: newUser.is_verified,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra trong quá trình đăng ký' },
      { status: 500 }
    );
  }
}