"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../config/db");
const crypto_1 = __importDefault(require("crypto"));
const jwt_1 = require("../../utils/jwt");
const email_1 = require("../../utils/email");
const env_1 = require("../../config/env");
class AuthService {
    static async register(data) {
        const users = await db_1.prisma.user.findMany();
        const existingUser = await db_1.prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });
        const token = (0, jwt_1.generateToken)(user.id);
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
    static async login(data) {
        const user = await db_1.prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const validPassword = await bcrypt_1.default.compare(data.password, user.password);
        if (!validPassword) {
            throw new Error("Invalid credentials");
        }
        const token = (0, jwt_1.generateToken)(user.id);
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
    static async forgotPassword(email) {
        const user = await db_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return {
                success: true,
                message: "If an account with that email exists, a reset link has been sent.",
            };
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        const expiry = new Date(Date.now() + 15 * 60 * 1000);
        await db_1.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: expiry,
            },
        });
        const resetLink = `${env_1.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        await (0, email_1.sendPasswordResetEmail)(user.name, user.email, resetLink);
        return {
            success: true,
            message: "If an account with that email exists, a reset link has been sent.",
        };
    }
    static async resetPassword(token, password) {
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = await db_1.prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new Error("Reset link is invalid or has expired.");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await db_1.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpiry: null,
            },
        });
        return {
            success: true,
            message: "Password reset successfully.",
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map