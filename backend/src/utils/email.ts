import nodemailer from "nodemailer";

import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false,
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
    from: `"DevSync" <${env.SMTP_USER}>`,
    to: email,
    subject: "Reset your DevSync Password",
    html: `
      <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;padding:40px;background:#07111F;color:#FFFFFF;">
        <h2 style="margin-bottom:20px;">
          Reset Your Password
        </h2>

        <p>Hi ${name},</p>

        <p>
          We received a request to reset your DevSync account password.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <a
          href="${resetLink}"
          style="
            display:inline-block;
            margin-top:24px;
            background:#2563EB;
            color:#FFFFFF;
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
          © DevSync
        </p>
      </div>
    `,
  });
}