import { pool } from "@/lib/database";
import { RIGHTS } from "@/lib/db/permission";
import { getSessionUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionUser = await getSessionUser(BigInt(RIGHTS.ManageUsers));

  if (!sessionUser) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.full_name,
        u.student_id,
        u.phone,
        u.is_verified,
        u.created_at,
        u.locked_until,
        r.name AS role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
