// lib/requirePermission.ts
import { pool } from "./database";

/**
 * Kiểm tra quyền của user dựa vào role trong DB
 * @param userId - ID của user
 * @param requiredRight - quyền cần kiểm tra (bit flag)
 * @returns true nếu user có quyền, false nếu không
 */
export async function requirePermission(
  userId: string,
  requiredRight: bigint
): Promise<boolean> {
  console.log(`[requirePermission] Checking rights for userId=${userId}, requiredRight=${requiredRight}`);

  try {
    const result = await pool.query(
      "SELECT r.rights, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      console.warn(`[requirePermission] ❌ User ${userId} not found or has no role`);
      return false;
    }

    const roleRights: bigint = BigInt(result.rows[0].rights);
    const roleName: string = result.rows[0].role_name;

    const hasPermission = (roleRights & requiredRight) === requiredRight;

    console.log(`[requirePermission] User ${userId} role=${roleName}, rights=${roleRights}, required=${requiredRight}, hasPermission=${hasPermission}`);

    return hasPermission;
  } catch (err) {
    console.error(`[requirePermission] ⚠ Error checking permission for user ${userId}:`, err);
    return false;
  }
}