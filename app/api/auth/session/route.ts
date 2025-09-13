import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session"; // chỗ bạn để getSessionUser

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Chỉ trả những field cần thiết cho UI
    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role_name: user.role_name,
      rights: user.rights, // nếu bạn cần check quyền ở FE
    });
  } catch (err) {
    console.error("❌ Error in GET /api/auth/session:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
