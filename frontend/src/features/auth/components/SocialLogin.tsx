import { motion } from "framer-motion";

interface SocialLoginProps {
  onGoogle?: () => void;
  onGithub?: () => void;
  disabled?: boolean;
}

export default function SocialLogin({
  onGoogle,
  onGithub,
  disabled = false,
}: SocialLoginProps) {
  return (
    <div className="flex flex-col gap-3">
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

      <motion.button
        type="button"
        disabled={disabled}
        onClick={onGithub}
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
          viewBox="0 0 24 24"
          className="relative h-5 w-5 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>

        <span className="relative text-sm font-medium text-white">
          Continue with GitHub
        </span>
      </motion.button>
    </div>
  );
}