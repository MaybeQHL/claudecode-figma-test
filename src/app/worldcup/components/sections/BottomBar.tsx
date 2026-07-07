"use client";

import { motion } from "framer-motion";

export function BottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 glass border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-center justify-between px-6 py-2.5">
        <button className="flex flex-col items-center gap-0.5 text-xs text-white/50 active:text-neon">
          <span className="text-lg">📜</span>
          <span>规则</span>
        </button>

        {/* 中央浮起主按钮 */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative -mt-8 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-gradient-to-br from-neon to-cyan font-black text-black animate-breathe"
        >
          <span className="text-xl">⚽</span>
          <span className="text-[9px]">竞猜</span>
          <span className="pointer-events-none absolute inset-0 animate-ring-spin rounded-full border-2 border-dashed border-gold/40" />
        </motion.button>

        <button className="flex flex-col items-center gap-0.5 text-xs text-white/50 active:text-gold">
          <span className="text-lg">🎁</span>
          <span>奖品</span>
        </button>
      </div>
    </div>
  );
}
