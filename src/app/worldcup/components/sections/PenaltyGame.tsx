"use client";

import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { CountUp } from "@/app/worldcup/components/ui/CountUp";
import { SectionTitle } from "@/app/worldcup/components/ui/SectionTitle";

const directions = [
  { label: "左上", angle: 315, x: -0.5, y: -0.5 },
  { label: "正上", angle: 270, x: 0, y: -0.7 },
  { label: "右上", angle: 225, x: 0.5, y: -0.5 },
  { label: "左下", angle: 45, x: -0.5, y: 0.3 },
  { label: "中下", angle: 270, x: 0, y: 0.5 },
  { label: "右下", angle: 135, x: 0.5, y: 0.3 },
];

export function PenaltyGame() {
  const [score, setScore] = useState(0);
  const [last, setLast] = useState<"goal" | "miss" | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);

  const shoot = useCallback(
    (i: number) => {
      setPressed(i);
      const goal = Math.random() > 0.35;
      setTimeout(() => {
        setPressed(null);
        if (goal) {
          setLast("goal");
          setScore((s) => s + 1);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { x: 0.5, y: 0.5 },
            colors: ["#ffd700", "#00ff87", "#00d2ff", "#ff6b35"],
          });
          setTimeout(() => {
            confetti({
              particleCount: 40,
              spread: 50,
              origin: { x: 0.5, y: 0.5 },
              colors: ["#ffd700", "#00ff87"],
            });
          }, 120);
        } else {
          setLast("miss");
        }
        setTimeout(() => setLast(null), 1200);
      }, 200);
    },
    [score]
  );

  return (
    <div className="px-4">
      <SectionTitle title="点球大战" sub="PENALTY SHOOT-OUT" accent="flame" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0a1f1a] to-[#0b1026] p-4 text-center">
        {/* 球门背景 */}
        <div className="mx-auto mb-2 flex h-20 w-60 items-center justify-center rounded-t-xl border-2 border-white/20 bg-gradient-to-b from-white/5 to-transparent">
          <span className="text-3xl opacity-30">🧤</span>
        </div>

        {/* 草坪 */}
        <div className="mx-auto -mt-2 mb-4 h-8 w-60 rounded-b bg-gradient-to-b from-neon/20 to-neon/5" />

        {/* 积分 */}
        <div className="mb-4 text-center">
          <div className="text-xs text-white/40 uppercase tracking-widest">进球数</div>
          <div className="font-mono text-5xl font-black text-glow-neon">
            <CountUp to={score} duration={0.6} />
          </div>
        </div>

        {/* 射门方向按钮 */}
        <div className="grid grid-cols-3 gap-2">
          {directions.map((d, i) => (
            <button
              key={i}
              disabled={pressed !== null}
              onClick={() => shoot(i)}
              className={`rounded-xl border py-2.5 text-xs font-bold transition-all active:scale-90 ${
                pressed === i
                  ? "border-neon bg-neon/20 text-neon scale-90"
                  : "border-white/10 bg-white/5 text-white/60"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* 结果提示 */}
        <AnimatePresence>
          {last && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              className={`mt-4 rounded-xl px-4 py-2 text-center text-lg font-black ${
                last === "goal"
                  ? "bg-neon/20 text-neon text-glow-neon"
                  : "bg-flame/20 text-flame"
              }`}
            >
              {last === "goal" ? "⚽ 进球！" : "😤 被扑出！"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}