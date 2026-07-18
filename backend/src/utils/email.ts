import nodemailer from "nodemailer";

import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: Number(env.SMTP_PORT) === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  name: string,
  email: string,
  resetLink: string
) {
  await transporter.sendMail({
    from: `"CodePulse" <${env.SMTP_USER}>`,
    to: email,
    subject: "Reset your CodePulse Password",
    html: `
      <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;padding:40px;background:#07111F;color:#FFFFFF;">
        <h2 style="margin-bottom:20px;">
          Reset Your Password
        </h2>

        <p>Hi ${name},</p>

        <p>
          We received a request to reset your CodePulse account password.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <a
          href="${resetLink}"
          style="
            display:inline-block;
            margin-top:24px;
            background:#ffffff;
            color:#000000;
            text-decoration:none;
            padding:14px 28px;
            border-radius:10px;
            font-weight:600;
          "
        >
          Reset Password
        </a>

        <p style="margin-top:28px;">
          This link expires in 15 minutes.
        </p>

        <p>
          If you didn't request this, you can safely ignore this email.
        </p>

        <hr style="margin:32px 0;border:none;border-top:1px solid #23324D;" />

        <p style="font-size:12px;color:#94A3B8;">
          © CodePulse
        </p>
      </div>
    `,
  });
}

export async function sendOTPEmail(email: string, code: string) {
  const mailOptions = {
    from: env.SMTP_USER,
    to: email,
    subject: "CodePulse - Your Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email</h2>
        <p>Your one-time verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #4F46E5; background: #F3F4F6; padding: 10px 20px; border-radius: 8px; display: inline-block;">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this code, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}