import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "framer-motion";

import { usePasswordToggle } from "../hooks/usePasswordToggle";

interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label = "Password",
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    const { type, visible, toggle } = usePasswordToggle();

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-2"
      >
        <label className="translate-x-2 mb-1 ml-4 block text-sm font-medium tracking-wide text-slate-300">
          {label}
        </label>

        <div
          className="
            group
            relative
            flex
            h-14
            items-center
            overflow-hidden
            rounded-[20px]
            border
            border-white/10
            bg-white/[0.04]
            transition-all
            duration-300
            hover:border-purple-500/40
            focus-within:border-purple-500/70
            focus-within:bg-white/[0.06]
            focus-within:shadow-[0_0_0_4px_rgba(168,85,247,0.10)]
          "
        >
          <div className="pointer-events-none flex h-full w-14 items-center justify-center text-slate-500 transition-colors duration-300 group-focus-within:text-purple-400">
            <Lock size={18} />
          </div>

          <input
            ref={ref}
            type={type}
            className={`
              h-full
              flex-1
              bg-transparent
              pr-4
              text-[15px]
              text-white
              outline-none
              placeholder:text-slate-500
              ${className}
            `}
            {...props}
          />

          <button
            type="button"
            onClick={toggle}
            className="
              mr-2
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-slate-500
              transition-all
              duration-300
              hover:bg-white/5
              hover:text-purple-400
            "
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/80 to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pl-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;