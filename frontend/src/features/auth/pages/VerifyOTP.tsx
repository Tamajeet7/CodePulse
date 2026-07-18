import { useState, type FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import LoadingButton from "../../../shared/components/LoadingButton";
import { verifyOtp } from "../../../services/auth.api";
import { useAuthStore } from "../../../store/authStore";

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!userId) {
    navigate("/login");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOtp(userId as string, code);
      if (response.token && response.user) {
        login(response.token, response.user);
        navigate("/dashboard");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Invalid verification code.");
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
          border-neutral-800
          bg-black
          shadow-[0_35px_120px_rgba(0,0,0,0.45)]
        "
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/[0.2] via-transparent to-neutral-900/[0.4]" />

        <div className="relative px-10 py-12">
          <AuthHeader
            title="Verify Your Email"
            subtitle="We sent a 6-digit code to your email address."
          />

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <AuthInput
              label="Verification Code"
              type="text"
              placeholder="123456"
              icon={<ShieldCheck size={18} />}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <LoadingButton type="submit" loading={loading} className="mt-4">
              Verify Code
            </LoadingButton>
          </form>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
