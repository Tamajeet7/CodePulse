import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthDivider from "../components/AuthDivider";
import AuthFooter from "../components/AuthFooter";
import SocialLogin from "../components/SocialLogin";

import LoadingButton from "../../../shared/components/LoadingButton";

import { login } from "../../../services/auth.api";
import { useAuthStore } from "../../../store/authStore";

export default function Login() {
  const navigate = useNavigate();

  const authenticate = useAuthStore(
    (state) => state.login
  );

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      authenticate(response.token, response.user);

      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Invalid email or password."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="
          relative
          w-full
          max-w-[460px]
          overflow-hidden
          rounded-[36px]
          border
          border-white/10
          bg-white/[0.05]
          backdrop-blur-3xl
          shadow-[0_35px_120px_rgba(0,0,0,0.45)]
        "
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-neutral-500/[0.05]" />

        <div className="relative px-10 py-10">
          <AuthHeader
            title="Welcome Back"
            subtitle="Continue coding with your team."
          />

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <AuthInput
              label="Email"
              type="email"
              placeholder="name@example.com"
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="mt-2 flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground transition hover:text-foreground"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <LoadingButton type="submit" loading={loading}>
              Sign In
            </LoadingButton>
          </form>

          <div className="mt-6">
            <AuthDivider />
          </div>

          <div className="mt-5">
            <SocialLogin />
          </div>

          <div className="mt-6 flex justify-center">
            <AuthFooter
              text="Don't have an account?"
              linkLabel="Create Account"
              to="/register"
            />
          </div>
        </div>
      </motion.div>
    </AuthLayout>
  );
}