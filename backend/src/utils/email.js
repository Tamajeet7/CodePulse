"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.SMTP_HOST,
    port: Number(env_1.env.SMTP_PORT),
    secure: false,
    auth: {
        user: env_1.env.SMTP_USER,
        pass: env_1.env.SMTP_PASS,
    },
});
async function sendPasswordResetEmail(name, email, resetLink) {
    await transporter.sendMail({
        from: `"CodePulse" <${env_1.env.SMTP_USER}>`,
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
//# sourceMappingURL=email.js.map