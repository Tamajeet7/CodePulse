import { motion } from "framer-motion";

const blobs = [
  {
    size: 420,
    className:
      "-left-44 -top-40 bg-purple-600/20 blur-[120px]",
    duration: 18,
  },
  {
    size: 360,
    className:
      "right-[-120px] top-1/3 bg-pink-500/20 blur-[120px]",
    duration: 22,
  },
  {
    size: 460,
    className:
      "bottom-[-180px] left-1/3 bg-fuchsia-600/20 blur-[140px]",
    duration: 20,
  },
];

const particles = Array.from({ length: 50 });

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#030005]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3B0764_0%,transparent_42%),radial-gradient(circle_at_bottom,#170229_0%,transparent_45%)]" />

      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${blob.className}`}
          style={{
            width: blob.size,
            height: blob.size,
          }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            repeat: Infinity,
            ease: "easeInOut",
            duration: blob.duration,
          }}
        />
      ))}

      <div className="absolute inset-0">
        {particles.map((_, index) => (
          <motion.div
            key={index}
            className="absolute h-[2px] w-[2px] rounded-full bg-purple-200/40"
            style={{
              left: `${(index * 13) % 100}%`,
              top: `${(index * 29) % 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              y: [-8, 8, -8],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + (index % 4),
              delay: index * 0.15,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 backdrop-blur-[80px]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px]" />
    </div>
  );
}