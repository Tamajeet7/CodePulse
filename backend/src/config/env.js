"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    PORT: process.env.PORT || "5000",
    DATABASE_URL: process.env.DATABASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    CLIENT_URL: process.env.CLIENT_URL ||
        "http://localhost:5173",
    SMTP_HOST: process.env.SMTP_HOST ||
        "smtp.gmail.com",
    SMTP_PORT: process.env.SMTP_PORT || "587",
    SMTP_USER: process.env.SMTP_USER || "",
    SMTP_PASS: process.env.SMTP_PASS || "",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
};
//# sourceMappingURL=env.js.map