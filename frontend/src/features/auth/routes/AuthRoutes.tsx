import { Route, Routes, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OAuthCallback from "../pages/OAuthCallback";
import VerifyOTP from "../pages/VerifyOTP";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to="login" replace />}
      />

      <Route
        path="login"
        element={<Login />}
      />

      <Route
        path="register"
        element={<Register />}
      />

      <Route
        path="forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="auth/:provider/callback"
        element={<OAuthCallback />}
      />

      <Route
        path="verify-otp"
        element={<VerifyOTP />}
      />

      <Route
        path="*"
        element={<Navigate to="login" replace />}
      />
    </Routes>
  );
}