
import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, findUserByUsername } from '@/lib/database';
import { comparePassword, generateToken, isValidEmail } from '@/lib/auth';

export const runtime = "nodejs";

/**
 * API endpoint để đăng nhập bằng username
 * POST /api/auth/login
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Vui lòng điền tên đăng nhập và mật khẩu" },
        { status: 400 }
      );
    }

    // Validate username
    if (username.length < 3) {
      return NextResponse.json(
        { error: "Tên đăng nhập không hợp lệ" },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await findUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: "Tên đăng nhập hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Tên đăng nhập hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.is_verified) {
      return NextResponse.json(
        {
          error:
            "Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực.",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    // Create response with user data
    const response = NextResponse.json(
      {
        message: "Đăng nhập thành công",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          is_verified: user.is_verified,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie với token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra trong quá trình đăng nhập" },
      { status: 500 }
    );
  }
}
