import { motion } from "framer-motion";

import Logo from "./Logo";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.55,
      }}
      className="flex flex-col items-center"
    >
      <Logo />

      <div className="mt-4 flex flex-col items-center">
        <h1 className="text-center text-[2rem] font-bold tracking-tight text-white">
          {title}
        </h1>

        <p className="mt-4 max-w-sm text-center text-[15px] leading-7 text-slate-400">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}