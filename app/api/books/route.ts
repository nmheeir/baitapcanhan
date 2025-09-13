import { verifyToken } from "@/lib/auth";
import { pool } from "@/lib/database";
import { RIGHTS } from "@/lib/db/permission";
import { requirePermission } from "@/lib/requirePermission";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("📌 [Books API] POST /api/books");

  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie.match(/auth-token=([^;]+)/)?.[1];

  if (!token) {
    console.warn("❌ No token found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    console.warn("❌ Invalid token");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Check quyền
  const hasPermission = await requirePermission(
    user.userId,
    BigInt(RIGHTS.ManageBooks)
  );
  if (!hasPermission) {
    console.warn("❌ User has no permission to add books");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      code,
      name,
      author,
      year,
      publisher,
      category_id,
      description,
      quantity,
      price,
    } = body;

    const result = await pool.query(
      `INSERT INTO books (code, name, author, year, publisher, category_id, description, quantity, price)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        code,
        name,
        author,
        year || null,
        publisher || null,
        category_id || null,
        description || null,
        quantity ?? 0,
        price ?? 0,
      ]
    );

    console.log("✅ Book added:", result.rows[0]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("❌ Error inserting book:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
