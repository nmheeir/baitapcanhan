import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { SignJWT, jwtVerify } from "jose";

// JWT Secret - trong production nên lưu trong environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

// jose yêu cầu secret phải là Uint8Array
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Hash mật khẩu sử dụng bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * So sánh mật khẩu với hash
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Tạo JWT token
 */
export async function generateToken(payload: {
  userId: string;
  roleId: string;
  username: string;
  email: string;
}): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // hoặc process.env.JWT_EXPIRES_IN
    .sign(secret);
}

/**
 * Verify JWT token
 */
export async function verifyToken(
  token: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; email: string };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Tạo verification token ngẫu nhiên
 */
export function generateVerificationToken(): string {
  return uuidv4();
}

/**
 * Tạo reset token ngẫu nhiên
 */
export function generateResetToken(): string {
  return uuidv4();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Yêu cầu: ít nhất 8 ký tự, có chữ hoa, chữ thường, số
 */
export function isValidPassword(
  password: string
): { isValid: boolean; message?: string } {
  if (password.length < 8) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 8 ký tự" };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 1 chữ hoa" };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 1 chữ thường" };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, message: "Mật khẩu phải có ít nhất 1 số" };
  }

  return { isValid: true };
}

/**
 * Extract token từ Authorization header
 */
export function extractTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
