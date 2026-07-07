"use client";

import { motion } from "framer-motion";

type Tone = "neon" | "gold" | "flame" | "cyan";

const grad: Record<Tone, string> = {
  neon: "linear-gradient(90deg, #00ff87, #00d2ff)",
  gold: "linear-gradient(90deg, #ffd700, #ff8a00)",
  flame: "linear-gradient(90deg, #ff6b35, #ff2d55)",
  cyan: "linear-gradient(90deg, #00d2ff, #7c4dff)",
};

export function ProgressBar({
  value,
  tone = "neon",
  className = "",
}: {
  value: number; // 0-100
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative h-full rounded-full"
        style={{ background: grad[tone] }}
      >
        <span className="pointer-events-none absolute inset-0 shine-mask opacity-70" />
      </motion.div>
    </div>
  );
}
