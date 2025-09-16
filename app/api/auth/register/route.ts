import {
  generateVerificationToken,
  hashPassword,
} from "@/lib/auth";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "@/lib/database";
import { sendVerificationEmail } from "@/lib/email";
import { isValidEmail, isValidPassword } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint để đăng ký tài khoản mới
 * POST /api/auth/register
 */
export async function POST(request: NextRequest) {
  try {
    const { username, email, phone, password, confirmPassword } =
      await request.json();

    // Xác thực input cơ bản
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Validate username
    if (username.length < 3) {
      return NextResponse.json(
        { error: "Tên đăng nhập phải có ít nhất 3 ký tự" },
        { status: 400 }
      );
    }

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Kiểm tra confirm password
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Mật khẩu xác nhận không khớp" },
        { status: 400 }
      );
    }

    // Kiểm tra email tồn tại chưa
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email này đã được đăng ký" },
        { status: 409 }
      );
    }

    // Kiểm tra username tồn tại chưa
    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json(
        { error: "Tên đăng nhập đã có người sử dụng" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Tạo user
    const newUser = await createUser({
      username,
      email,
      phone,
      password: hashedPassword,
      verification_token: verificationToken,
    });

    // Gửi email xác thực
    const emailSent = await sendVerificationEmail(email, verificationToken);
    if (!emailSent) {
      console.error("❌ Không gửi được email xác thực");
    }

    return NextResponse.json(
      {
        message:
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          phone: newUser.phone,
          is_verified: newUser.is_verified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra trong quá trình đăng ký" },
      { status: 500 }
    );
  }
}
