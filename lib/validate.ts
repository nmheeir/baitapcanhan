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