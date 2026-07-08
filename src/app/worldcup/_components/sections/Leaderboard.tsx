"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/app/worldcup/_components/ui/CountUp";
import { SectionTitle } from "@/app/worldcup/_components/ui/SectionTitle";
import { leaderboard } from "@/app/worldcup/lib/data";
import { staggerContainer, staggerItem } from "@/app/worldcup/lib/motion";

export function Leaderboard() {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // 按 1-3-2 排队（中间最高）
  const ordered = [top3[1], top3[0], top3[2]].filter(Boolean) as typeof top3;

  return (
    <div className="px-4">
      <SectionTitle title="战力榜" sub="LEADERBOARD" accent="gold" />

      {/* 领奖台 */}
      <div className="mb-4 flex items-end justify-center gap-3">
        {ordered.map((entry) => {
          const realRank = entry.rank;
          // 领奖台高度
          const h = realRank === 1 ? 120 : realRank === 2 ? 90 : 70;
          const bg =
            realRank === 1
              ? "bg-gradient-to-b from-gold/30 to-gold/5 border-gold/40"
              : realRank === 2
                ? "bg-gradient-to-b from-silver/20 to-silver/5 border-silver/30"
                : "bg-gradient-to-b from-bronze/20 to-bronze/5 border-bronze/30";
          const crown = realRank === 1 ? "👑" : "";
          const medal = realRank === 1 ? "🥇" : realRank === 2 ? "🥈" : "🥉";
          const isTop1 = realRank === 1;

          return (
            <div key={entry.rank} className="flex flex-col items-center">
              <span className="text-lg">{crown}</span>
              <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-xl font-black">
                {medal}
              </div>
              <span className="text-xs font-bold text-white/80">{entry.name}</span>
              <span className="font-mono text-sm font-black text-gold">
                <CountUp to={entry.score} />
              </span>
              <div
                className={`relative mt-1 w-20 rounded-t-xl border-t border-l border-r ${bg}`}
                style={{ height: `${h}px` }}
              >
                {isTop1 && (
                  <>
                    <div
                      className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-16 animate-beam"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(255,215,0,0.5) 0%, transparent 70%)",
                        height: "200px",
                        top: "-80px",
                      }}
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-ring-spin rounded-full border border-gold/30" />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4-10 名列表 */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-2"
      >
        {rest.map((entry) => (
          <motion.div
            key={entry.rank}
            variants={staggerItem}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 active:bg-white/10 transition-colors"
          >
            <span className="w-6 text-center font-mono text-xs font-bold text-white/40">
              {entry.rank}
            </span>
            <span className="text-lg">{entry.flag}</span>
            <span className="flex-1 text-sm font-bold text-white/80">{entry.name}</span>
            <span className="font-mono text-sm font-black text-gold">
              <CountUp to={entry.score} />
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}