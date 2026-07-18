"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, "Name must be at least 3 characters"),
    email: zod_1.z
        .email("Invalid email address")
        .toLowerCase(),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .email("Invalid email address")
        .toLowerCase(),
    password: zod_1.z
        .string()
        .min(6),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
//# sourceMappingURL=auth.validation.js.map