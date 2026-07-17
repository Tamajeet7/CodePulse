import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";

import AuthLayout from "../layouts/AuthLayout";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";

import LoadingButton from "../../../shared/components/LoadingButton";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      setSuccess(
        "If an account with this email exists, a password reset link has been sent."
      );
    } catch {
      setError("Unable to process your request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{
          opacity: 0,
          y: 24,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          w-full
          max-w-[460px]
          overflow-hidden
          rounded-[36px]
          bg-black
          shadow-[0_35px_120px_rgba(0,0,0,0.45)]
        "
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/[0.2] via-transparent to-neutral-900/[0.4]" />

        <div
          className="
            relative
            flex
            min-h-[400px]
            flex-col
            px-10
            py-12
          "
        >
          <AuthHeader
            title="Forgot Password"
            subtitle="Enter your email address and we'll send you a reset link."
          />

          <form
            onSubmit={handleSubmit}
            className="mt-12 flex flex-1 flex-col justify-center -translate-y-6"
          >
            <div>
              <AuthInput
                label="Email"
                type="email"
                placeholder="name@example.com"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {success && (
                <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  {success}
                </div>
              )}

              {error && (
                <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>

            <div className="translate-y-6">
              <LoadingButton
                type="submit"
                loading={loading}
              >
                Reset Password
              </LoadingButton>

              <div className="mt-8 flex justify-center">
                <Link
                  to="/login"
                  className="
                    translate-y-4
                    text-sm
                    font-medium
                    text-slate-400
                    transition-colors
                    duration-300
                    hover:text-purple-400
                  "
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </AuthLayout>
  );
}