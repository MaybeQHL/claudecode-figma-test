"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/app/worldcup/_components/ui/GlassCard";
import { CountUp } from "@/app/worldcup/_components/ui/CountUp";
import { SectionTitle } from "@/app/worldcup/_components/ui/SectionTitle";
import { bestPlayer, topScorers } from "@/app/worldcup/lib/data";
import { staggerContainer, staggerItem } from "@/app/worldcup/lib/motion";

export function PlayerBoard() {
  return (
    <div className="px-4">
      <SectionTitle title="球星榜" sub="TOP PLAYERS" accent="gold" />

      {/* 本场最佳大卡 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="metal-border relative overflow-hidden p-5">
          <div className="pointer-events-none absolute inset-0 shine-mask opacity-50" />
          <div className="relative flex items-center gap-4">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/30 to-flame/20">
              <span className="text-5xl">🧤</span>
              <span className="absolute -right-2 -top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-black text-black">
                MOTM
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{bestPlayer.name}</span>
                <span>{bestPlayer.team.flag}</span>
              </div>
              <div className="mt-1 text-xs text-white/40">{bestPlayer.team.name} · 前锋</div>
              <div className="mt-3 flex gap-4">
                <Stat label="进球" value={bestPlayer.goals} />
                <Stat label="助攻" value={bestPlayer.assists} />
                <Stat label="评分" value={bestPlayer.rating} decimals={1} gold />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 射手榜横滑 */}
      <div className="mt-4 text-sm font-bold text-white/60">射手榜</div>
      <div className="no-scrollbar mt-2 flex gap-3 overflow-x-auto pb-2">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex gap-3"
        >
          {topScorers.map((p) => (
            <motion.div key={p.id} variants={staggerItem}>
              <ScorerCard rank={p.rank} name={p.name} flag={p.team.flag} goals={p.goals} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  decimals = 0,
  gold = false,
}: {
  label: string;
  value: number;
  decimals?: number;
  gold?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className={`font-mono text-2xl font-black ${gold ? "text-gold text-glow-gold" : "text-neon"}`}>
        <CountUp to={value} decimals={decimals} />
      </span>
      <span className="text-[10px] text-white/40">{label}</span>
    </div>
  );
}

function ScorerCard({
  rank,
  name,
  flag,
  goals,
}: {
  rank: number;
  name: string;
  flag: string;
  goals: number;
}) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";
  return (
    <div className="w-24 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-3 text-center active:scale-95 transition-transform">
      <div className="mb-1 text-xs font-black text-gold">{rank > 3 ? `#${rank}` : medal}</div>
      <div className="text-3xl">{flag}</div>
      <div className="mt-1 truncate text-xs font-bold text-white/80">{name}</div>
      <div className="mt-1 font-mono text-xl font-black text-glow-neon">
        <CountUp to={goals} />
      </div>
      <div className="text-[10px] text-white/40">球</div>
    </div>
  );
}
