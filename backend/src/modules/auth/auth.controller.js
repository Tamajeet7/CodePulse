"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
class AuthController {
    static async register(req, res) {
        try {
            const data = auth_validation_1.registerSchema.parse(req.body);
            const result = await auth_service_1.AuthService.register(data);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async login(req, res) {
        try {
            const data = auth_validation_1.loginSchema.parse(req.body);
            const result = await auth_service_1.AuthService.login(data);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { email } = auth_validation_1.forgotPasswordSchema.parse(req.body);
            const result = await auth_service_1.AuthService.forgotPassword(email);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map