import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { verifyToken } from "@/lib/auth";
import { RIGHTS } from "@/lib/db/permission";
import { requirePermission } from "@/lib/requirePermission";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log("📌 [Books API] GET book detail:", params.id);

  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie.match(/auth-token=([^;]+)/)?.[1];
  if (!token) {
    console.log("Not token");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pool.query("SELECT * FROM books WHERE id = $1", [
    params.id,
  ]);

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}
interface Params {
  params: { id: string };
}

export async function DELETE(req: Request, { params }: Params) {
  console.log("📌 [Books API] DELETE request received for id:", params.id);

  // Lấy token từ cookie
  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie.match(/auth-token=([^;]+)/)?.[1];

  if (!token) {
    console.warn("❌ No auth-token found in cookies");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    console.warn("❌ Invalid token");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Check quyền ManageBooks
  const hasPermission = await requirePermission(
    user.userId,
    BigInt(RIGHTS.ManageBooks)
  );
  if (!hasPermission) {
    console.warn("❌ User lacks ManageBooks permission");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await pool.query("DELETE FROM books WHERE id = $1", [
      params.id,
    ]);

    if (result.rowCount === 0) {
      console.warn("⚠️ Book not found:", params.id);
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    console.log(`✅ Book ${params.id} deleted`);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("❌ Error deleting book:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ Cập nhật book
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log("📌 [Books API] PUT /api/books/:id", params.id);

  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie.match(/auth-token=([^;]+)/)?.[1];
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await verifyToken(token);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 🔐 Check quyền ManageBooks
  const hasPermission = await requirePermission(
    user.userId,
    BigInt(RIGHTS.ManageBooks)
  );
  if (!hasPermission) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await req.json();
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
    } = data;

    const result = await pool.query(
      `UPDATE books 
       SET code = $1, name = $2, author = $3, year = $4, publisher = $5,
           category_id = $6, description = $7, quantity = $8, price = $9
       WHERE id = $10
       RETURNING *`,
      [
        code,
        name,
        author,
        year || null,
        publisher || null,
        category_id || null,
        description || null,
        quantity,
        price,
        params.id,
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("✅ Book updated:", result.rows[0].id);
    return NextResponse.json(result.rows[0]);
  } catch (e) {
    console.error("❌ Error updating book:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
