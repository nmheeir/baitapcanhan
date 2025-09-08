import nodemailer from 'nodemailer';

// Cấu hình email transporter
// Trong production, sử dụng service thật như Gmail, SendGrid, etc.
const transporter = nodemailer.createTransport({
  // Cấu hình cho Gmail SMTP
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
  // Hoặc cấu hình SMTP tùy chỉnh:
  // host: process.env.SMTP_HOST,
  // port: parseInt(process.env.SMTP_PORT || '587'),
  // secure: false,
  // auth: {
  //   user: process.env.SMTP_USER,
  //   pass: process.env.SMTP_PASSWORD,
  // },
});

/**
 * Gửi email xác thực tài khoản
 */
export async function sendVerificationEmail(email: string, verificationToken: string): Promise<boolean> {
  try {
    // URL xác thực - trong production thay đổi domain
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/verify?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
      to: email,
      subject: 'Xác thực tài khoản của bạn',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Xác thực tài khoản</h2>
          <p>Chào bạn,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng click vào link bên dưới để xác thực email của bạn:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Xác thực tài khoản
            </a>
          </div>
          <p>Hoặc copy và paste link sau vào trình duyệt:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Link này sẽ hết hạn sau 24 giờ. Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
          </p>
        </div>
      `,
    };

    // // Trong development, chỉ log email thay vì gửi thật
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('📧 Mock Email Sent:');
    //   console.log('To:', email);
    //   console.log('Subject:', mailOptions.subject);
    //   console.log('Verification URL:', verificationUrl);
    //   return true;
    // }

    // Trong production, gửi email thật
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

/**
 * Gửi email reset mật khẩu
 */
export async function sendResetPasswordEmail(email: string, resetToken: string): Promise<boolean> {
  try {
    // URL reset mật khẩu
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
      to: email,
      subject: 'Đặt lại mật khẩu',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Đặt lại mật khẩu</h2>
          <p>Chào bạn,</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Click vào link bên dưới để tạo mật khẩu mới:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p>Hoặc copy và paste link sau vào trình duyệt:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Link này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </p>
        </div>
      `,
    };


    // Trong production, gửi email thật
    await transporter.sendMail(mailOptions);
    console.log('Reset password email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return false;
  }
}

/**
 * Gửi email chứa mật khẩu mới
 */
export async function sendNewPasswordEmail(email: string, newPassword: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@yourapp.com",
      to: email,
      subject: "Mật khẩu mới cho tài khoản của bạn",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Mật khẩu mới đã được tạo</h2>
          <p>Chào bạn,</p>
          <p>Chúng tôi đã tạo một mật khẩu mới cho tài khoản của bạn theo yêu cầu.</p>
          <p style="margin: 20px 0; font-size: 16px; font-weight: bold; text-align: center; padding: 10px; background: #eee; border-radius: 5px;">
            ${newPassword}
          </p>
          <p>Vui lòng đăng nhập bằng mật khẩu này và đổi mật khẩu ngay sau khi đăng nhập để đảm bảo an toàn.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng liên hệ với bộ phận hỗ trợ để được trợ giúp.
          </p>
        </div>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    console.log("New password email sent to:", email);
    return true;
  } catch (error) {
    console.error("Error sending new password email:", error);
    return false;
  }
}