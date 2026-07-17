import type { HTMLAttributes } from "react";

interface CardProps
  extends HTMLAttributes<HTMLDivElement> {}

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-zinc-800 bg-[#0D1117] p-6 shadow-xl transition-all duration-300 hover:border-cyan-400/30 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}