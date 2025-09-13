import { pool } from "@/lib/database";
import { RIGHTS } from "@/lib/db/permission";
import { getSessionUser } from "@/lib/session";
import { NextResponse } from "next/server";

// app/api/borrow-slips/[id]/submit/route.ts
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser(BigInt(RIGHTS.BorrowBooks));
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const slipRes = await client.query(
      `SELECT * FROM BorrowSlips WHERE id=$1 AND user_id=$2 FOR UPDATE`,
      [params.id, user.id]
    );
    if (slipRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (slipRes.rows[0].status !== "draft") {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Already submitted" }, { status: 400 });
    }

    const itemsRes = await client.query(
      `SELECT * FROM BorrowDetails WHERE borrow_slip_id=$1 FOR UPDATE`,
      [params.id]
    );
    if (itemsRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Slip empty" }, { status: 400 });
    }

    // kiểm tra tồn kho + trừ số lượng
    for (const item of itemsRes.rows) {
      const bookRes = await client.query(
        `SELECT quantity FROM Books WHERE id=$1 FOR UPDATE`,
        [item.book_id]
      );
      if (bookRes.rowCount === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: `Book ${item.book_id} not found` }, { status: 404 });
      }
      const available = bookRes.rows[0].quantity;
      if (available < item.quantity) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: `Not enough stock for book ${item.book_id}` }, { status: 400 });
      }

      await client.query(
        `UPDATE Books SET quantity = quantity - $1 WHERE id=$2`,
        [item.quantity, item.book_id]
      );
    }

    await client.query(
      `UPDATE BorrowSlips
       SET status='submitted', submitted_date=NOW()
       WHERE id=$1`,
      [params.id]
    );

    await client.query("COMMIT");
    return NextResponse.json({ message: "Submitted" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Submit slip error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    client.release();
  }
}
