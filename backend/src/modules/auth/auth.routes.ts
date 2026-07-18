import { Router } from "express";

import { AuthController } from "./auth.controller";

const router = Router();

router.post(
  "/register",
  AuthController.register
);

router.post(
  "/login",
  AuthController.login
);

router.post(
  "/forgot-password",
  AuthController.forgotPassword
);

router.post(
  "/verify-otp",
  AuthController.verifyOtp
);

router.post(
  "/github",
  AuthController.github
);

router.post(
  "/google",
  AuthController.google
);

// Debug route - shows what the token decodes to
router.get("/me", (req: any, res: any) => {
  try {
    const jwt = require("jsonwebtoken");
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.json({ error: "No Authorization header" });
    const token = authHeader.split(" ")[1];
    if (!token) return res.json({ error: "No token after Bearer" });
    const decoded = jwt.decode(token);
    res.json({ success: true, decoded, rawToken: token.substring(0, 50) + "..." });
  } catch (e: any) {
    res.json({ error: e.message });
  }
});

export default router;