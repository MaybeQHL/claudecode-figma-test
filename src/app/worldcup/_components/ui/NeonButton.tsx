"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Tone = "neon" | "gold" | "flame";

const toneMap: Record<Tone, string> = {
  neon: "from-[#00ff87] to-[#00d2ff] text-black",
  gold: "from-[#ffd700] to-[#ff8a00] text-black",
  flame: "from-[#ff6b35] to-[#ff2d55] text-white",
};

export function NeonButton({
  children,
  tone = "neon",
  breathe = false,
  className = "",
  ...props
}: {
  children: ReactNode;
  tone?: Tone;
  breathe?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03 }}
      className={`relative overflow-hidden rounded-full bg-gradient-to-r ${toneMap[tone]} px-6 py-3 font-black text-sm tracking-wide ${breathe ? "animate-breathe" : ""} ${className}`}
      {...(props as object)}
    >
      <span className="relative z-10 flex items-center justify-center gap-1.5">
        {children}
      </span>
      <span className="pointer-events-none absolute inset-0 shine-mask" />
    </motion.button>
  );
}
