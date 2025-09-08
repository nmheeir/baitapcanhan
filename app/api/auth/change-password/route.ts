import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { comparePassword, isValidPassword, verifyToken } from "@/lib/auth";
import { pool } from "@/lib/database";

/**
 * API đổi mật khẩu
 */
export async function POST(req: NextRequest) {
  try {
    // Lấy token từ header Authorization
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    // Xác thực token
    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword, confirmPassword } = await req.json();    

    // Kiểm tra input
    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Mật khẩu mới và xác nhận không khớp" },
        { status: 400 }
      );
    }

    if (!isValidPassword(newPassword)) {
      return NextResponse.json(
        { error: "Mật khẩu mới không đạt yêu cầu bảo mật" },
        { status: 400 }
      );
    }

    // Lấy mật khẩu hiện tại trong DB
    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [payload.userId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    const hashedPassword = result.rows[0].password;

    // So sánh mật khẩu cũ nhập vào
    const isMatch = await comparePassword(oldPassword, hashedPassword);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Mật khẩu cũ không đúng" },
        { status: 400 }
      );
    }

    // Đảm bảo mật khẩu mới khác mật khẩu cũ
    const isSameAsOld = await comparePassword(newPassword, hashedPassword);
    if (isSameAsOld) {
      return NextResponse.json(
        { error: "Mật khẩu mới phải khác mật khẩu hiện tại" },
        { status: 400 }
      );
    }

    // Hash mật khẩu mới
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật DB
    await pool.query(
      "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2",
      [newHashedPassword, payload.userId]
    );

    return NextResponse.json(
      { message: "Đổi mật khẩu thành công" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "Có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
