import type { ReactNode } from "react";
import { motion } from "framer-motion";

import AnimatedBackground from "../components/AnimatedBackground";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030005] text-white">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="flex w-full justify-center"
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}