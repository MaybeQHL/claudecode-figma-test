"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SectionTitle } from "@/app/worldcup/_components/ui/SectionTitle";
import { tasks } from "@/app/worldcup/_lib/data";

export function TaskSection() {
  const [list, setList] = useState(tasks);

  function toggle(id: string) {
    setList((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done, progress: t.done ? 0 : t.total } : t
      )
    );
  }

  return (
    <div className="px-4">
      <SectionTitle title="任务福利" sub="REWARDS" accent="neon" />

      <div className="space-y-2">
        {list.map((t) => (
          <motion.div
            key={t.id}
            layout
            onClick={() => toggle(t.id)}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors active:scale-[0.98] ${t.done
              ? "border-neon/30 bg-neon/5"
              : "border-white/10 bg-white/5"
              }`}
          >
            {/* 完成勾选 */}
            <motion.span
              animate={{ scale: t.done ? 1 : 0.8, opacity: t.done ? 1 : 0.3 }}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm ${t.done ? "border-neon bg-neon text-black" : "border-white/20 text-transparent"
                }`}
            >
              ✓
            </motion.span>

            <div className="flex-1">
              <div
                className={`text-sm font-bold ${t.done ? "text-white/50 line-through" : "text-white"}`}
              >
                {t.title}
              </div>
              <div className="text-[11px] text-white/40">{t.desc}</div>
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-black ${t.done
                ? "bg-neon/20 text-neon"
                : "bg-flame/20 text-flame"
                }`}
            >
              {t.done ? "已完成" : t.reward}
            </span>
          </motion.div>
        ))}
      </div>

      {/* 浮动金币 */}
      <div className="mt-4 text-center">
        <span className="text-xs text-white/40">
          累计获得 <span className="font-black text-gold">430</span> 积分
        </span>
      </div>
    </div>
  );
}