// app/api/borrow-slips/[id]/details/[detailId]/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { RIGHTS } from "@/lib/db/permission";
import { pool } from "@/lib/database";

// DELETE /api/borrow-slips/:id/details/:detailId
export async function DELETE(
  req: Request,
  { params }: { params: { id: string; detailId: string } }
) {
  const user = await getSessionUser(BigInt(RIGHTS.BorrowBooks));
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, detailId } = params;

  try {
    // kiểm tra phiếu mượn có tồn tại, thuộc user và còn draft không
    const slipRes = await pool.query(
      `SELECT * FROM BorrowSlips WHERE id = $1 AND user_id = $2`,
      [id, user.id]
    );

    if (slipRes.rowCount === 0) {
      return NextResponse.json({ error: "Phiếu mượn không tồn tại" }, { status: 404 });
    }

    const slip = slipRes.rows[0];
    if (slip.status !== "draft") {
      return NextResponse.json(
        { error: "Không thể chỉnh sửa phiếu đã gửi" },
        { status: 400 }
      );
    }

    // kiểm tra sách có trong phiếu không
    const detailRes = await pool.query(
      `SELECT * FROM BorrowDetails WHERE id = $1 AND borrow_slip_id = $2`,
      [detailId, id]
    );

    if (detailRes.rowCount === 0) {
      return NextResponse.json({ error: "Sách này không có trong phiếu" }, { status: 404 });
    }

    // xóa sách khỏi phiếu
    await pool.query(`DELETE FROM BorrowDetails WHERE id = $1`, [detailId]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /borrow-slips/:id/details/:detailId", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
