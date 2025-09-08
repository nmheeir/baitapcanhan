import { pool } from "@/lib/database";

/**
 * Tạo bảng users trong PostgreSQL
 * SQL để chạy trong database thật:
 */
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;


export async function initDb() {
  try {
    await pool.query(createUsersTable);
    console.log('✅ Bảng "users" đã sẵn sàng.');
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo database:', error);
  }
}

initDb();
