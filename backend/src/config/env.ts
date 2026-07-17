import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",

  DATABASE_URL: process.env.DATABASE_URL || "",

  JWT_SECRET: process.env.JWT_SECRET || "",

  CLIENT_URL:
    process.env.CLIENT_URL ||
    "http://localhost:5173",

  SMTP_HOST:
    process.env.SMTP_HOST ||
    "smtp.gmail.com",

  SMTP_PORT:
    process.env.SMTP_PORT || "587",

  SMTP_USER:
    process.env.SMTP_USER || "",

  SMTP_PASS:
    process.env.SMTP_PASS || "",
} as const;