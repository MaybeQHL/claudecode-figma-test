"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "@/app/worldcup/_components/ui/GlassCard";
import { SectionTitle } from "@/app/worldcup/_components/ui/SectionTitle";
import { matches, type Match } from "@/app/worldcup/lib/data";
import { staggerContainer, staggerItem, easeOut, viewportOnce } from "@/app/worldcup/lib/motion";

const tabs = [
  { key: "live", label: "今日赛事" },
  { key: "all", label: "淘汰赛" },
  { key: "group", label: "小组赛" },
] as const;

function StatusTag({ m }: { m: Match }) {
  if (m.status === "live")
    return (
      <span className="flex items-center gap-1 rounded-full bg-flame/20 px-2 py-0.5 text-[10px] font-bold text-flame">
        <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse-dot" />
        直播 {m.minute}&apos;
      </span>
    );
  if (m.status === "upcoming")
    return (
      <span className="rounded-full bg-cyan/20 px-2 py-0.5 text-[10px] font-bold text-cyan">
        未开始
      </span>
    );
  return (
    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/50">
      已结束
    </span>
  );
}

function MatchCard({ m }: { m: Match }) {
  const isLive = m.status === "live";
  return (
    <motion.div
      variants={staggerItem}
      className={`relative ${isLive ? "scale-[1.02] z-10" : ""}`}
    >
      <GlassCard flow={isLive} className="p-4">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="text-white/40">{m.stage}</span>
          <StatusTag m={m} />
        </div>

        <div className="flex items-center justify-between">
          {/* 主队 */}
          <div className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
              style={{ boxShadow: `0 0 16px ${m.home.color}55`, border: `1.5px solid ${m.home.color}` }}
            >
              {m.home.flag}
            </span>
            <span className="text-xs font-bold text-white/80">{m.home.name}</span>
          </div>

          {/* 比分 */}
          <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-2 font-mono text-4xl font-black text-glow-gold">
              <span>{m.homeScore}</span>
              <span className="text-white/30 text-2xl">:</span>
              <span>{m.awayScore}</span>
            </div>
            <span className="mt-1 text-[10px] text-white/40">{m.kickoff}</span>
          </div>

          {/* 客队 */}
          <div className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
              style={{ boxShadow: `0 0 16px ${m.away.color}55`, border: `1.5px solid ${m.away.color}` }}
            >
              {m.away.flag}
            </span>
            <span className="text-xs font-bold text-white/80">{m.away.name}</span>
          </div>
        </div>

        {/* 直播实时数据条 */}
        {m.stats && (
          <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
            <StatRow label="控球率" home={m.stats.possession[0]} away={m.stats.possession[1]} />
            <StatRow label="射门" home={m.stats.shots[0]} away={m.stats.shots[1]} raw />
            <StatRow label="角球" home={m.stats.corners[0]} away={m.stats.corners[1]} raw />
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

function StatRow({
  label,
  home,
  away,
  raw = false,
}: {
  label: string;
  home: number;
  away: number;
  raw?: boolean;
}) {
  const total = raw ? home + away || 1 : 100;
  const hp = (home / total) * 100;
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-7 text-right font-bold text-neon">{home}{raw ? "" : "%"}</span>
      <div className="relative flex-1">
        <div className="flex h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-neon/70 to-cyan" style={{ width: `${hp}%` }} />
          <div className="h-full flex-1 bg-gradient-to-l from-flame/70 to-flame" />
        </div>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-white/50">
          {label}
        </span>
      </div>
      <span className="w-7 font-bold text-flame">{away}{raw ? "" : "%"}</span>
    </div>
  );
}

export function MatchSection() {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("live");
  const list = matches.filter((m) =>
    active === "live"
      ? m.status !== "finished"
      : active === "all"
        ? m.stage.includes("决")
        : true
  );

  return (
    <div className="px-4">
      <SectionTitle title="赛事对阵" sub="LIVE MATCHES" accent="neon" />

      {/* Tab */}
      <div className="relative mb-4 flex gap-6 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`relative pb-2 text-sm font-bold transition-colors ${
              active === t.key ? "text-white" : "text-white/40"
            }`}
          >
            {t.label}
            {active === t.key && (
              <motion.span
                layoutId="match-tab"
                transition={{ duration: 0.3, ease: easeOut }}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-neon to-cyan"
              />
            )}
          </button>
        ))}
      </div>

      {/* 列表（错位排版） */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          viewport={viewportOnce}
          className="flex flex-col gap-4"
        >
          {list.map((m, i) => (
            <div key={m.id} className={i % 2 === 1 ? "pl-4" : ""}>
              <MatchCard m={m} />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}