import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { verifyToken } from "@/lib/auth";
import { RIGHTS } from "@/lib/db/permission";
import { requirePermission } from "@/lib/requirePermission";

export async function GET(req: Request) {
  console.log("📌 [Books API] GET request received");

  const cookie = req.headers.get("cookie") ?? "";
  console.log("🔍 Cookie header:", cookie);

  const token = cookie.match(/auth-token=([^;]+)/)?.[1];
  if (!token) {
    console.warn("❌ No auth-token found in cookies");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("✅ Found auth-token:", token.slice(0, 10) + "..."); // chỉ log 1 phần token

  const user = await verifyToken(token);
  if (!user) {
    console.warn("❌ Token verification failed");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("👤 User verified:", user);

  // ✅ Check quyền
  console.log(`🔑 Checking permission: ManageBooks (${RIGHTS.ManageBooks})`);
  const hasPermission = await requirePermission(user.userId, BigInt(RIGHTS.ManageBooks));

  if (!hasPermission) {
    console.warn(`🚫 User ${user.userId} does not have ManageBooks permission`);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  console.log(`✅ User ${user.userId} has permission to ManageBooks`);

  // Có quyền → query sách
  console.log("📚 Fetching books from database...");
  const books = await pool.query("SELECT * FROM books");
  console.log(`📦 Retrieved ${books.rowCount} books`);

  return NextResponse.json(books.rows);
}