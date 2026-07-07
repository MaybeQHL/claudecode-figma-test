"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CountUp } from "@/app/worldcup/components/ui/CountUp";
import { SectionTitle } from "@/app/worldcup/components/ui/SectionTitle";
import { predictTeams } from "@/app/worldcup/lib/data";

export function PredictSection() {
  const [selected, setSelected] = useState<string>("bra");

  return (
    <div className="px-4">
      <SectionTitle title="猜冠军赢大奖" sub="PREDICT" accent="cyan" />

      {/* 我的预测浮标 */}
      <div className="mb-3 flex items-center justify-between rounded-xl border border-cyan/20 bg-cyan/5 px-3 py-2 text-xs">
        <span className="text-white/60">我的预测</span>
        <span className="font-bold text-cyan">
          {predictTeams.find((t) => t.team.id === selected)?.team.flag}
          {predictTeams.find((t) => t.team.id === selected)?.team.name}
        </span>
      </div>

      <div className="space-y-3">
        {predictTeams.map((pt, i) => {
          const active = selected === pt.team.id;
          return (
            <motion.button
              key={pt.team.id}
              onClick={() => setSelected(pt.team.id)}
              whileTap={{ scale: 0.97 }}
              className={`relative w-full overflow-hidden rounded-2xl border p-3 text-left transition-colors ${
                active
                  ? "border-gold bg-gold/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{pt.team.flag}</span>
                  <span className="font-bold text-white">{pt.team.name}</span>
                </div>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                    active ? "border-gold bg-gold text-black" : "border-white/20 text-transparent"
                  }`}
                >
                  ✓
                </span>
              </div>

              {/* 支持率进度条 */}
              <div className="mt-2 flex items-center gap-2">
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pt.support}%` }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan to-neon"
                  />
                  <span className="pointer-events-none absolute inset-0 shine-mask opacity-60" />
                </div>
                <span className="w-10 text-right font-mono text-xs font-bold text-cyan">
                  <CountUp to={pt.support} />%
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 text-center text-xs text-white/40">
        预测正确可瓜分 <span className="font-bold text-gold">¥500,000</span> 奖池
      </div>
    </div>
  );
}
