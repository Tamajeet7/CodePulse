import { motion } from "framer-motion";

interface SocialLoginProps {
  onGoogle?: () => void;
  disabled?: boolean;
}

export default function SocialLogin({
  onGoogle,
  disabled = false,
}: SocialLoginProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onGoogle}
      whileHover={{
        scale: disabled ? 1 : 1.02,
      }}
      whileTap={{
        scale: disabled ? 1 : 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        group
        relative
        flex
        h-14
        w-full
        items-center
        justify-center
        gap-3
        overflow-hidden
        rounded-full
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-neutral-500/40
        hover:bg-white/[0.06]
        hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <svg
        viewBox="0 0 48 48"
        className="relative h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.206 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.27 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.168 0 9.862-1.977 13.409-5.192l-6.19-5.238C29.145 35.091 26.715 36 24 36c-5.185 0-9.625-3.326-11.283-7.946l-6.522 5.025C9.506 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303a12.03 12.03 0 01-4.084 5.571l.003-.002 6.19 5.238C36.971 39.213 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>

      <span className="relative text-sm font-medium text-white">
        Continue with Google
      </span>
    </motion.button>
  );
}