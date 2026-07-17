import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";
import AuthHeader from "../components/AuthHeader";
import AuthInput from "../components/AuthInput";
import PasswordInput from "../components/PasswordInput";
import AuthFooter from "../components/AuthFooter";

import LoadingButton from "../../../shared/components/LoadingButton";

import { register } from "../../../services/auth.api";
import { useAuthStore } from "../../../store/authStore";

export default function Register() {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        name,
        email,
        password,
      });

      login(response.token, response.user);

      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Registration failed."
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
          min-h-[600px]
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

        <div className="relative px-10 py-12">
          <AuthHeader
            title="Create Account"
            subtitle="Join CodePulse"
          />

          <form 
            onSubmit={handleSubmit}
            className="mt-14 flex flex-col"
          >
            <div className="space-y-8">
              <AuthInput
                label="Full Name"
                placeholder="John Doe"
                icon={<User size={18} />}
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

              <AuthInput
                label="Email"
                type="email"
                placeholder="name@example.com"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />
                          </div>

            {error && (
              <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="translate-y-4 mt-10">
              <LoadingButton className="translate-y-4"
                type="submit"
                loading={loading}
              >
                Create Account
              </LoadingButton>
            </div>

            <div className="translate-y-11 mt-8 flex justify-center">
              <AuthFooter
                text="Already have an account?"
                linkLabel="Login"
                to="/login"
              />
            </div>
          </form>
        </div>
      </motion.div>
    </AuthLayout>
  );
}