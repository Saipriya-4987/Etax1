import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM_EMAIL = process.env.EMAIL_FROM || 'eTaxMentor <noreply@etaxmentor.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Email templates
interface EmailTemplate {
  subject: string
  html: string
  text: string
}

function getVerifyEmailTemplate(name: string, verificationUrl: string): EmailTemplate {
  return {
    subject: 'Verify Your Email - eTaxMentor',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">eTaxMentor</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Your Trusted Tax Filing Partner</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1E3A8A; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${name}!</h2>
              <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for registering with eTaxMentor. To complete your registration and start using our services, please verify your email address.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 30px 0;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                Or copy and paste this link into your browser:
              </p>
              <p style="color: #3B82F6; font-size: 14px; word-break: break-all; margin: 0 0 25px 0;">
                ${verificationUrl}
              </p>
              <p style="color: #9CA3AF; font-size: 13px; margin: 0;">
                This link will expire in 24 hours. If you didn't create an account with eTaxMentor, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #F3F4F6; text-align: center;">
              <p style="color: #6B7280; font-size: 13px; margin: 0 0 10px 0;">
                © ${new Date().getFullYear()} eTaxMentor. All rights reserved.
              </p>
              <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
Welcome to eTaxMentor, ${name}!

Thank you for registering. Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account with eTaxMentor, please ignore this email.

© ${new Date().getFullYear()} eTaxMentor. All rights reserved.
    `,
  }
}

function getPasswordResetTemplate(name: string, resetUrl: string): EmailTemplate {
  return {
    subject: 'Reset Your Password - eTaxMentor',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">eTaxMentor</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Your Trusted Tax Filing Partner</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1E3A8A; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
              <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${name}, we received a request to reset your password. Click the button below to create a new password.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 30px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                Or copy and paste this link into your browser:
              </p>
              <p style="color: #3B82F6; font-size: 14px; word-break: break-all; margin: 0 0 25px 0;">
                ${resetUrl}
              </p>
              <div style="padding: 15px; background-color: #FEF3C7; border-radius: 8px; margin-bottom: 20px;">
                <p style="color: #92400E; font-size: 14px; margin: 0;">
                  ⚠️ This link will expire in 1 hour for security reasons.
                </p>
              </div>
              <p style="color: #9CA3AF; font-size: 13px; margin: 0;">
                If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #F3F4F6; text-align: center;">
              <p style="color: #6B7280; font-size: 13px; margin: 0 0 10px 0;">
                © ${new Date().getFullYear()} eTaxMentor. All rights reserved.
              </p>
              <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
Password Reset Request

Hi ${name}, we received a request to reset your password.

Click the link below to create a new password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email or contact our support team.

© ${new Date().getFullYear()} eTaxMentor. All rights reserved.
    `,
  }
}

function getTwoFactorOTPTemplate(name: string, otp: string): EmailTemplate {
  return {
    subject: 'Your Verification Code - eTaxMentor',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">eTaxMentor</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Two-Factor Authentication</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #1E3A8A; margin: 0 0 20px 0; font-size: 24px;">Your Verification Code</h2>
              <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Hi ${name}, use the following code to complete your login:
              </p>
              <div style="background-color: #F3F4F6; padding: 25px 40px; border-radius: 12px; display: inline-block; margin-bottom: 30px;">
                <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1E3A8A;">${otp}</span>
              </div>
              <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                This code will expire in <strong>10 minutes</strong>.
              </p>
              <div style="padding: 15px; background-color: #FEE2E2; border-radius: 8px;">
                <p style="color: #991B1B; font-size: 14px; margin: 0;">
                  🔒 Never share this code with anyone. eTaxMentor will never ask for your verification code.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #F3F4F6; text-align: center;">
              <p style="color: #6B7280; font-size: 13px; margin: 0 0 10px 0;">
                © ${new Date().getFullYear()} eTaxMentor. All rights reserved.
              </p>
              <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                If you didn't attempt to login, please secure your account immediately.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
Your Verification Code

Hi ${name}, use the following code to complete your login:

${otp}

This code will expire in 10 minutes.

Never share this code with anyone. eTaxMentor will never ask for your verification code.

If you didn't attempt to login, please secure your account immediately.

© ${new Date().getFullYear()} eTaxMentor. All rights reserved.
    `,
  }
}

// Email sending functions
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<boolean> {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`
  
  // In development without SMTP, log the URL
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
    console.log('\n========================================')
    console.log('📧 VERIFICATION EMAIL (Dev Mode)')
    console.log('========================================')
    console.log(`To: ${email}`)
    console.log(`Name: ${name}`)
    console.log(`\n🔗 Verification URL:\n${verificationUrl}`)
    console.log('========================================\n')
    return true
  }

  try {
    const template = getVerifyEmailTemplate(name, verificationUrl)

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    console.log(`Verification email sent to ${email}`)
    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<boolean> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`
  
  // In development without SMTP, log the URL
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
    console.log('\n========================================')
    console.log('📧 PASSWORD RESET EMAIL (Dev Mode)')
    console.log('========================================')
    console.log(`To: ${email}`)
    console.log(`Name: ${name}`)
    console.log(`\n🔗 Reset URL:\n${resetUrl}`)
    console.log('========================================\n')
    return true
  }

  try {
    const template = getPasswordResetTemplate(name, resetUrl)

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    console.log(`Password reset email sent to ${email}`)
    return true
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return false
  }
}

export async function sendTwoFactorOTPEmail(
  email: string,
  name: string,
  otp: string
): Promise<boolean> {
  // In development without SMTP, log the OTP
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
    console.log('\n========================================')
    console.log('📧 TWO-FACTOR OTP EMAIL (Dev Mode)')
    console.log('========================================')
    console.log(`To: ${email}`)
    console.log(`Name: ${name}`)
    console.log(`\n🔢 OTP Code: ${otp}`)
    console.log('========================================\n')
    return true
  }

  try {
    const template = getTwoFactorOTPTemplate(name, otp)

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    console.log(`2FA OTP email sent to ${email}`)
    return true
  } catch (error) {
    console.error('Error sending 2FA OTP email:', error)
    return false
  }
}

// Utility function to generate OTP
export function generateOTP(length: number = 6): string {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  return otp
}

// Utility function to generate secure token
export function generateSecureToken(): string {
  return crypto.randomUUID() + '-' + Date.now().toString(36)
}

// Verify email configuration (useful for testing)
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify()
    console.log('Email configuration is valid')
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}
