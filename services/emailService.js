const nodemailer = require('nodemailer');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Generate OTP email template
  generateOTPEmail(otp, companyName) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GreenChain - Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: #fff; border: 2px solid #4CAF50; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌱 GreenChain</h1>
            <p>Email Verification Required</p>
          </div>
          <div class="content">
            <h2>Welcome to GreenChain, ${companyName}!</h2>
            <p>Thank you for joining the future of sustainable hydrogen production and trading. To complete your registration, please verify your email address using the verification code below.</p>
            
            <div class="otp-box">
              <p><strong>Your verification code:</strong></p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <p><strong>Important:</strong></p>
            <ul>
              <li>This code is valid for 10 minutes only</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this code, please ignore this email</li>
            </ul>
            
            <p>Once verified, you'll have access to:</p>
            <ul>
              <li>🌿 Green hydrogen credit trading</li>
              <li>📊 Real-time production metrics</li>
              <li>🔒 Secure blockchain transactions</li>
              <li>📈 Compliance reporting tools</li>
            </ul>
            
            <p>If you have any questions, please contact our support team.</p>
            
            <div class="footer">
              <p>© 2024 GreenChain. All rights reserved.</p>
              <p>Building a sustainable future through hydrogen innovation</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate password reset email template
  generatePasswordResetEmail(resetLink, companyName) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GreenChain - Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reset-box { background: #fff; border: 2px solid #ff6b6b; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .button { display: inline-block; background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌱 GreenChain</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hello ${companyName}!</h2>
            <p>We received a request to reset your password for your GreenChain account. If you made this request, please click the button below to set a new password.</p>
            
            <div class="reset-box">
              <a href="${resetLink}" class="button">Reset Password</a>
              <p><small>This link will expire in 1 hour</small></p>
            </div>
            
            <p><strong>Security Notice:</strong></p>
            <ul>
              <li>This link is valid for 1 hour only</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your current password will remain unchanged</li>
              <li>For security, this link can only be used once</li>
            </ul>
            
            <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace;">${resetLink}</p>
            
            <p>If you have any questions or concerns, please contact our support team immediately.</p>
            
            <div class="footer">
              <p>© 2024 GreenChain. All rights reserved.</p>
              <p>Building a sustainable future through hydrogen innovation</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Send OTP email
  async sendOTPEmail(email, otp, companyName) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'GreenChain <noreply@greenchain.com>',
        to: email,
        subject: '🌱 GreenChain - Email Verification Required',
        html: this.generateOTPEmail(otp, companyName)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}:`, result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetLink, companyName) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'GreenChain <noreply@greenchain.com>',
        to: email,
        subject: '🌱 GreenChain - Password Reset Request',
        html: this.generatePasswordResetEmail(resetLink, companyName)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}:`, result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Verify email configuration
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();

