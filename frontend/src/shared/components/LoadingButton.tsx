import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface LoadingButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  loading?: boolean;
  children?: ReactNode;
}

export default function LoadingButton({
  children,
  loading = false,
  disabled = false,
  className,
  type = "button",
  ...props
}: LoadingButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      whileHover={
        disabled || loading
          ? undefined
          : {
              scale: 1.02,
              boxShadow: "0 0 35px rgba(168,85,247,0.45)",
            }
      }
      whileTap={
        disabled || loading
          ? undefined
          : {
              scale: 0.98,
            }
      }
      transition={{
        duration: 0.2,
      }}
      className={[
        "group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full",
        "bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500",
        "px-6 font-semibold text-white",
        "transition-all duration-300",
        "hover:shadow-[0_0_35px_rgba(168,85,247,0.45)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div
          className="
            absolute
            inset-y-0
            -left-1/2
            w-1/2
            -skew-x-12
            bg-white/20
            opacity-0
            transition-all
            duration-700
            group-hover:left-full
            group-hover:opacity-100
          "
        />
      </div>

      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
}