import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface AuthFooterProps {
  text: string;
  linkLabel: string;
  to: string;
}

export default function AuthFooter({
  text,
  linkLabel,
  to,
}: AuthFooterProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.3,
      }}
      className="text-center"
    >
      <p className="text-sm text-slate-400">
        {text}{" "}
        <Link
          to={to}
          className="
            font-semibold
            text-white
            transition-all
            duration-300
            hover:text-neutral-300
            hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]
          "
        >
          {linkLabel}
        </Link>
      </p>
    </motion.div>
  );
}