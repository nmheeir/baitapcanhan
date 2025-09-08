import { Pool } from 'pg';
import {v4} from 'uuid';

// Cấu hình kết nối PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'baitapcanhan',
  password: process.env.DB_PASSWORD || '1234',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Interface cho User
export interface User {
  id: string;
  email: string;
  password: string;
  is_verified: boolean;
  verification_token?: string;
  reset_token?: string;
  reset_token_expires?: Date;
  created_at: Date;
  updated_at: Date;
}

// Mock data cho development (thay thế PostgreSQL trong WebContainer)
let mockUsers: User[] = [];

/**
 * Tạo bảng users trong PostgreSQL
 * SQL để chạy trong database thật:
 */
export const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

/**
 * Tìm user theo email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    // Trong production, sử dụng PostgreSQL query:
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

/**
 * Tìm user theo ID
 */
export async function findUserById(id: string): Promise<User | null> {
  try {
    // Trong production:
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

/**
 * Tạo user mới
 */
export async function createUser(userData: {
  email: string;
  password: string;
  verification_token: string;
}): Promise<User> {
  try {
    // Trong production:
    const result = await pool.query(
      'INSERT INTO users (email, password, verification_token) VALUES ($1, $2, $3) RETURNING *',
      [userData.email, userData.password, userData.verification_token]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Cập nhật trạng thái verified của user
 */
export async function verifyUser(verification_token: string): Promise<boolean> {
  try {
    // Trong production:
    const result = await pool.query(
      'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = $1 RETURNING *',
      [verification_token]
    );
    return result.rowCount > 0;
    
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
}

/**
 * Cập nhật reset token cho user
 */
export async function updateResetToken(email: string, reset_token: string, expires: Date): Promise<boolean> {
  try {
    // Trong production:
    const result = await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3 RETURNING *',
      [reset_token, expires, email]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error updating reset token:', error);
    throw error;
  }
}

/**
 * Tìm user theo reset token và kiểm tra expiry
 */
export async function findUserByResetToken(reset_token: string): Promise<User | null> {
  try {
    // Trong production:
    const result = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [reset_token]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by reset token:', error);
    throw error;
  }
}

/**
 * Cập nhật mật khẩu và xóa reset token
 */
export async function updatePassword(userId: string, newPassword: string): Promise<boolean> {
  try {
    // Trong production:
    const result = await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2 RETURNING *',
      [newPassword, userId]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

export { pool };