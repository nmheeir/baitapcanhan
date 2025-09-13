import { pool } from "@/lib/database";

// Bảng Roles
const createRolesTable = `
  CREATE TABLE IF NOT EXISTS Roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    rights BIGINT NOT NULL DEFAULT 0
  );
`;

// Bảng Rights
const createRightsTable = `
  CREATE TABLE IF NOT EXISTS Rights (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      flag BIGINT NOT NULL
  );
`;

// Bảng Users
const createUsersTable = `
CREATE TABLE IF NOT EXISTS Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,       -- Lưu password đã hash
    full_name VARCHAR(100),
    student_id VARCHAR(20),
    phone VARCHAR(20),
    role_id UUID NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    failed_attempts INT DEFAULT 0,        -- số lần đăng nhập sai
    locked_until TIMESTAMP NULL,          -- thời điểm bị khóa tài khoản
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE
);
`;


// Bảng Categories
const createCategoryTable = `
  CREATE TABLE IF NOT EXISTS Categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT
  );
`;

// Bảng Books
const createBookTable = `
  CREATE TABLE IF NOT EXISTS Books (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code VARCHAR(20) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      year INT,
      publisher VARCHAR(255),
      category_id UUID,
      description TEXT,
      quantity INT NOT NULL DEFAULT 0,
      price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
  );
`;

// Bảng BorrowSlips
const createBorrowSlipsTable = `
  CREATE TABLE IF NOT EXISTS BorrowSlips (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      submitted_date TIMESTAMP,
      status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted')),
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
  );
`;

// Bảng BorrowDetails
const createBorrowDetailsTable = `
  CREATE TABLE IF NOT EXISTS BorrowDetails (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      borrow_slip_id UUID NOT NULL,
      book_id UUID NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      FOREIGN KEY (borrow_slip_id) REFERENCES BorrowSlips(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE
  );
`;

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(createRolesTable);
    await client.query(createRightsTable);
    await client.query(createUsersTable);
    await client.query(createCategoryTable);
    await client.query(createBookTable);
    await client.query(createBorrowSlipsTable);
    await client.query(createBorrowDetailsTable);

    await client.query('COMMIT');
    console.log("✅ Database schema đã được khởi tạo thành công!");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Lỗi khi khởi tạo database:", error);
  } finally {
    client.release();
  }
}

initDb();
