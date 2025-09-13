import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";         // hàm bạn đã có
import { requirePermission } from "./requirePermission";
import { pool } from "./database";

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  role_name: string;
  rights: bigint;
}

/**
 * Lấy thông tin user từ cookie auth-token
 */
export async function getSessionUser(requiredRight?: bigint): Promise<SessionUser | null> {
  try {
    // 📌 Lấy cookie auth-token
    const cookieStore = cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    // 📌 Giải mã token
    const payload = await verifyToken(token);
    if (!payload || !payload.userId) return null;

    const userId = payload.userId;

    // 📌 Nếu có yêu cầu quyền cụ thể thì check
    if (requiredRight) {
      const hasPermission = await requirePermission(userId, requiredRight);
      if (!hasPermission) return null;
    }

    // 📌 Lấy thông tin user từ DB
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, r.name AS role_name, r.rights
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rowCount === 0) return null;

    return result.rows[0] as SessionUser;
  } catch (error) {
    console.error("❌ getSessionUser error:", error);
    return null;
  }
}
