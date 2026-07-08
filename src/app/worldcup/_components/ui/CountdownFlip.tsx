"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-14 w-11 overflow-hidden rounded-lg border border-white/15 bg-gradient-to-b from-white/20 to-white/5 sm:h-16 sm:w-14">
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/50" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={v}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ transformOrigin: "center" }}
            className="flex h-full w-full items-center justify-center font-mono text-2xl font-black text-white text-glow-neon sm:text-3xl"
          >
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1 text-[10px] tracking-widest text-white/50">{label}</span>
    </div>
  );
}

export function CountdownFlip({ target }: { target: string }) {
  const targetTs = new Date(target).getTime();
  const [time, setTime] = useState(() => getTimeLeft(targetTs));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetTs)), 1000);
    return () => clearInterval(id);
  }, [targetTs]);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5">
      <Unit value={time.days} label="天" />
      <span className="-mt-4 text-xl font-black text-neon">:</span>
      <Unit value={time.hours} label="时" />
      <span className="-mt-4 text-xl font-black text-neon">:</span>
      <Unit value={time.mins} label="分" />
      <span className="-mt-4 text-xl font-black text-neon">:</span>
      <Unit value={time.secs} label="秒" />
    </div>
  );
}
