import { pool } from "../database";

export const RIGHTS = {
  ViewBooks: 1,       // 0001
  BorrowBooks: 2,     // 0010
  ManageBooks: 4,     // 0100
  ManageUsers: 8      // 1000
};


/**
 * Kiểm tra một quyền có nằm trong rights mask không
 */
export function hasRight(roleRights: bigint, rightFlag: bigint): boolean {
  return (roleRights & rightFlag) === rightFlag;
}

/**
 * Lấy role từ DB
 */
export async function getRoleById(roleId: string) {
  const result = await pool.query("SELECT * FROM roles WHERE id = $1", [roleId]);
  return result.rows[0] || null;
}

/**
 * Lấy quyền từ DB
 */
export async function getRightByName(name: string) {
  const result = await pool.query("SELECT * FROM rights WHERE name = $1", [name]);
  return result.rows[0] || null;
}

/**
 * Kiểm tra role có quyền cụ thể chưa (theo tên quyền)
 */
export async function roleHasRight(roleId: string, rightName: string): Promise<boolean> {
  const role = await getRoleById(roleId);
  if (!role) return false;

  const right = await getRightByName(rightName);
  if (!right) return false;

  return hasRight(BigInt(role.rights), BigInt(right.flag));
}

/**
 * Lấy toàn bộ quyền (dạng string[]) từ một role
 */
export async function getRightsOfRole(roleId: string): Promise<string[]> {
  const role = await getRoleById(roleId);
  if (!role) return [];

  const result = await pool.query("SELECT name, flag FROM rights");
  const rights = result.rows;

  return rights
    .filter((r: any) => hasRight(BigInt(role.rights), BigInt(r.flag)))
    .map((r: any) => r.name);
}

/**
 * Thêm quyền vào role
 */
export async function addRightToRole(roleId: string, rightName: string) {
  const role = await getRoleById(roleId);
  const right = await getRightByName(rightName);

  if (!role || !right) throw new Error("Role hoặc quyền không tồn tại");

  const newRights = BigInt(role.rights) | BigInt(right.flag);
  await pool.query("UPDATE roles SET rights = $1 WHERE id = $2", [newRights, roleId]);

  return newRights;
}

/**
 * Gỡ quyền khỏi role
 */
export async function removeRightFromRole(roleId: string, rightName: string) {
  const role = await getRoleById(roleId);
  const right = await getRightByName(rightName);

  if (!role || !right) throw new Error("Role hoặc quyền không tồn tại");

  const newRights = BigInt(role.rights) & ~BigInt(right.flag);
  await pool.query("UPDATE roles SET rights = $1 WHERE id = $2", [newRights, roleId]);

  return newRights;
}
