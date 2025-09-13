import { pool } from "@/lib/database";
import { RIGHTS } from "@/lib/db/permission";
import { getSessionUser } from "@/lib/session";
import { NextResponse } from "next/server";

// app/api/borrow-slips/[id]/items/route.ts
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser(BigInt(RIGHTS.BorrowBooks));
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { book_id, quantity } = await req.json();
    const qty = Math.max(1, Number(quantity) || 1);

    // check slip owner + draft
    const slip = await pool.query(
      `SELECT * FROM BorrowSlips WHERE id=$1 AND user_id=$2 AND status='draft'`,
      [params.id, user.id]
    );
    if (slip.rowCount === 0) {
      return NextResponse.json({ error: "Slip not found or not editable" }, { status: 404 });
    }

    // kiểm tra xem đã có sách này trong slip chưa
    const existing = await pool.query(
      `SELECT * FROM BorrowDetails WHERE borrow_slip_id=$1 AND book_id=$2`,
      [params.id, book_id]
    );

    let result;
    if (existing.rowCount > 0) {
      // update số lượng
      result = await pool.query(
        `UPDATE BorrowDetails SET quantity = quantity + $1 WHERE id=$2 RETURNING *`,
        [qty, existing.rows[0].id]
      );
    } else {
      // insert mới
      result = await pool.query(
        `INSERT INTO BorrowDetails (borrow_slip_id, book_id, quantity)
         VALUES ($1, $2, $3) RETURNING *`,
        [params.id, book_id, qty]
      );
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("POST BorrowDetails", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
