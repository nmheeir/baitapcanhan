import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { RIGHTS } from "@/lib/db/permission";
import { pool } from "@/lib/database";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = await getSessionUser(BigInt(RIGHTS.ManageUsers));

  if (!sessionUser) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = await pool.query(
      `UPDATE users SET username=$1, email=$2, full_name=$3, student_id=$4, phone=$5, role_id=$6, is_verified=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [
        body.username,
        body.email,
        body.full_name || null,
        body.student_id || null,
        body.phone || null,
        body.role_id,
        body.is_verified,
        params.id,
      ]
    );

    if (result.rowCount === 0) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = await getSessionUser(BigInt(RIGHTS.ManageUsers));

  if (!sessionUser) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [params.id]);
    if (result.rowCount === 0) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const sessionUser = await getSessionUser(BigInt(RIGHTS.ManageUsers));
  if (!sessionUser) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [params.id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

