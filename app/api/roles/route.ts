import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { RIGHTS } from "@/lib/db/permission";
import { pool } from "@/lib/database";

export async function GET(req: NextRequest) {
  const sessionUser = await getSessionUser(BigInt(RIGHTS.ManageUsers));
  if (!sessionUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await pool.query("SELECT id, name, rights FROM roles ORDER BY name ASC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching roles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
