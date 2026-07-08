"use client";

import { motion, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";
import { SectionTitle } from "@/app/worldcup/_components/ui/SectionTitle";
import { prizes } from "@/app/worldcup/lib/data";

export function PrizeCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [active, setActive] = useState(0);

  function onDragEnd() {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const i = Math.round(x.get() / -w);
    const idx = Math.max(0, Math.min(prizes.length - 1, i));
    setActive(idx);
    x.set(-idx * w);
  }

  return (
    <div className="overflow-hidden">
      <div className="px-4">
        <SectionTitle title="奖品展示" sub="PRIZES" accent="gold" />
      </div>

      <div className="relative" style={{ perspective: 800 }}>
        <motion.div
          ref={containerRef}
          drag="x"
          dragConstraints={{ left: -(prizes.length - 1) * 300, right: 0 }}
          onDragEnd={onDragEnd}
          animate={{ x: -active * 300 }}
          style={{ x }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="no-scrollbar flex cursor-grab gap-4 px-4 active:cursor-grabbing"
        >
          {prizes.map((p, i) => {
            const isCenter = i === active;
            const scale = isCenter ? 1 : 0.85;
            const opacity = isCenter ? 1 : 0.5;
            return (
              <motion.div
                key={p.id}
                animate={{ scale, opacity }}
                transition={{ type: "spring", stiffness: 220, damping: 25 }}
                className="relative w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 metal-border shine-mask"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-3xl">{p.emoji}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      p.tier === "grand"
                        ? "bg-gold text-black"
                        : p.tier === "mid"
                          ? "bg-cyan text-black"
                          : "bg-white/10 text-white/60"
                    }`}
                  >
                    {p.tier === "grand" ? "限定" : p.tier === "mid" ? "高端" : "普通"}
                  </span>
                </div>
                <h4 className="text-lg font-black text-white">{p.name}</h4>
                <div className="mt-1 text-sm font-black text-gold text-glow-gold">{p.value}</div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-neon to-cyan"
                      style={{ width: `${(p.remaining / p.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/40">
                    剩 {p.remaining}/{p.total}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* 导航点 */}
      <div className="mt-3 flex justify-center gap-1.5">
        {prizes.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-5 bg-gold" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}