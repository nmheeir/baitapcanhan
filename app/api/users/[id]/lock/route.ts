import { pool } from "@/lib/database";
import { NextResponse } from "next/server";

// PATCH /api/users/[id]/lock
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    // 🔍 Kiểm tra user có tồn tại
    const checkUser = await pool.query(
      "SELECT id, username, locked_until FROM users WHERE id = $1",
      [userId]
    );

    if (checkUser.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔒 Đặt thời gian khóa (ví dụ: 30 ngày từ hiện tại)
    const lockUntil = new Date();
    lockUntil.setDate(lockUntil.getDate() + 30); // +30 ngày

    const result = await pool.query(
      `UPDATE users
       SET locked_until = $1
       WHERE id = $2
       RETURNING id, username, email, locked_until`,
      [lockUntil, userId]
    );

    return NextResponse.json(
      { message: "User locked successfully", user: result.rows[0] },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Error locking user:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
