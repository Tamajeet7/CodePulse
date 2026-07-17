import { motion } from "framer-motion";

interface AuthDividerProps {
  text?: string;
}

export default function AuthDivider({
  text = "or continue with",
}: AuthDividerProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: 0.25,
      }}
      className="flex items-center gap-4"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-white/5" />

      <span
        className="
          whitespace-nowrap
          text-xs
          uppercase
          tracking-[0.25em]
          text-slate-500
        "
      >
        {text}
      </span>

      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-white/5" />
    </motion.div>
  );
}