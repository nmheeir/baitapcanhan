import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSessionUser } from "@/lib/session";
import { RIGHTS } from "@/lib/db/permission";
import { pool } from "@/lib/database";

export async function POST(req: NextRequest) {
  const sessionUser = await getSessionUser(BigInt(RIGHTS.ManageUsers));

  if (!sessionUser) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, full_name, student_id, phone, password, role_id, verification_token) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        body.username,
        body.email,
        body.full_name || null,
        body.student_id || null,
        body.phone || null,
        hashedPassword,
        body.role_id,
        body.verification_token || null,
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
