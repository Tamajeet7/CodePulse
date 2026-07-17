import type { ButtonHTMLAttributes } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-cyan-400 text-black hover:bg-cyan-300",

    secondary:
      "border border-zinc-700 bg-[#0D1117] text-white hover:border-cyan-400 hover:text-cyan-400",

    danger:
      "bg-red-500 text-white hover:bg-red-600",

    ghost:
      "text-zinc-400 hover:bg-zinc-800 hover:text-white",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}