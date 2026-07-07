"use client";

import { motion } from "framer-motion";
import { CountdownFlip } from "@/app/worldcup/components/ui/CountdownFlip";
import { NeonButton } from "@/app/worldcup/components/ui/NeonButton";
import { ParticleField } from "@/app/worldcup/components/ui/ParticleField";
import { eventInfo } from "@/app/worldcup/lib/data";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* 背景层 */}
      <div className="pointer-events-none absolute inset-0 pitch-bg" />
      <ParticleField count={18} />

      {/* 看台灯光光斑 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 left-[10%] h-40 w-60 rounded-full bg-neon/20 blur-[80px]" />
        <div className="absolute -top-6 left-[50%] h-36 w-52 rounded-full bg-cyan/20 blur-[80px]" />
        <div className="absolute top-0 right-[5%] h-32 w-44 rounded-full bg-gold/15 blur-[70px]" />
      </div>

      {/* 漂浮足球 */}
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-6 top-20 text-6xl opacity-40 drop-shadow-[0_0_24px_rgba(255,215,0,0.5)]"
      >
        ⚽
      </motion.div>

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center px-5 pb-10 pt-16 text-center">
        {/* 赛事标签 */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-bold tracking-widest text-gold"
        >
          <span className="h-2 w-2 rounded-full bg-gold animate-pulse-dot" />
          {eventInfo.slogan}
        </motion.div>

        {/* 主标题 */}
        <h1 className="mb-2 text-5xl font-black tracking-tight sm:text-6xl">
          <span className="grad-text-gold">{eventInfo.title}</span>
        </h1>
        <h2 className="mb-6 text-3xl font-black tracking-wide text-glow-neon sm:text-4xl">
          {eventInfo.subtitle}
        </h2>

        {/* 主视觉 */}
        <div className="relative mb-8 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-[120px] leading-none drop-shadow-[0_0_40px_rgba(255,215,0,0.55)] sm:text-[140px]"
          >
            🏆
          </motion.div>
          {/* 光效拖尾 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute h-44 w-44 rounded-full border border-gold/20"
            style={{ boxShadow: "0 0 60px 18px rgba(255,215,0,0.22)" }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute h-32 w-32 rounded-full border border-cyan/20"
            style={{ boxShadow: "0 0 40px 10px rgba(0,210,255,0.18)" }}
          />
        </div>

        {/* 倒计时 */}
        <div className="mb-3 text-xs font-medium tracking-widest text-white/40 uppercase">
          距离决赛日
        </div>
        <CountdownFlip target={eventInfo.targetDate} />

        {/* 主 CTA */}
        <div className="mt-8">
          <NeonButton breathe tone="neon" className="px-10 py-3.5 text-lg">
            🔥 立即竞猜
          </NeonButton>
          <p className="mt-2 text-xs text-white/40">
            总奖池 <span className="text-gold font-bold">{eventInfo.totalPrize}</span>
          </p>
        </div>
      </div>

      {/* 底部渐变过渡 */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#05060a] to-transparent" />
    </section>
  );
}