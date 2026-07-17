import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from "./auth.validation";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);

      const result = await AuthService.register(data);

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);

      const result = await AuthService.login(data);

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  static async forgotPassword(
    req: Request,
    res: Response
  ) {
    try {
      const { email } = forgotPasswordSchema.parse(
        req.body
      );

      const result =
        await AuthService.forgotPassword(email);

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}