import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AuthButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function AuthButton({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}: AuthButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`
        mt-2
        flex
        h-12
        w-full
        items-center
        justify-center
        rounded-full
        bg-gradient-to-r
        from-purple-600
        to-fuchsia-500
        text-lg
        font-semibold
        text-white
        shadow-lg
        shadow-purple-500/20
        transition-all
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}