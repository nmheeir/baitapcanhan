import { createUsersTable, pool } from "@/lib/database";

export async function initDb() {
  try {
    await pool.query(createUsersTable);
    console.log('✅ Bảng "users" đã sẵn sàng.');
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo database:', error);
  }
}
