import type { InputHTMLAttributes } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">

      {label && (
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}

      <input
        className={`w-full rounded-2xl border border-zinc-700 bg-[#05070B] px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-cyan-400 ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}

    </div>
  );
}