// app/api/borrow-slips/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { RIGHTS } from "@/lib/db/permission";
import { pool } from "@/lib/database";

// app/api/borrow-slips/route.ts
export async function GET() {
  const user = await getSessionUser(BigInt(RIGHTS.BorrowBooks));
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const result = await pool.query(
      `SELECT bs.*,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', bd.id,
                    'book_id', bd.book_id,
                    'book_title', b.name,
                    'quantity', bd.quantity
                  )
                ) FILTER (WHERE bd.id IS NOT NULL),
                '[]'
              ) AS details
       FROM BorrowSlips bs
       LEFT JOIN BorrowDetails bd ON bd.borrow_slip_id = bs.id
       LEFT JOIN Books b ON b.id = bd.book_id
       WHERE bs.user_id = $1
       GROUP BY bs.id
       ORDER BY bs.created_date DESC`,
      [user.id]
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("GET /borrow-slips", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST() {
  const user = await getSessionUser(BigInt(RIGHTS.BorrowBooks));
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const res = await pool.query(
      `INSERT INTO BorrowSlips (user_id) VALUES ($1) RETURNING *`,
      [user.id]
    );
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err) {
    console.error("POST /borrow-slips", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

