"use client";

import { useState } from "react";
import { SectionTitle } from "@/app/worldcup/_components/ui/SectionTitle";
import { signInRewards, tasks } from "@/app/worldcup/lib/data";

export function TaskSection() {
  const [signed, setSigned] = useState<number[]>([1]);
  const [taskDone, setTaskDone] = useState<Record<string, boolean>>({});

  function signDay(day: number) {
    const isSigned = signed.includes(day);
    const canSign = !isSigned && (day === 1 || signed.includes(day - 1));
    if (canSign) setSigned((prev) => [...prev, day]);
  }

  return (
    <div className="px-4">
      <SectionTitle title="每日福利" sub="REWARDS" accent="neon" />

      {/* 连续签到 */}
      <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center">
          <span className="mr-2 text-base">📅</span>
          <span className="text-sm font-bold">连续签到</span>
          <span className="ml-auto text-xs text-white/40">
            已签 {signed.length}/7 天
          </span>
        </div>
        <div className="flex gap-1.5">
          {signInRewards.map(({ day, reward }) => {
            const isSigned = signed.includes(day);
            const canSign = !isSigned && (day === 1 || signed.includes(day - 1));
            return (
              <button
                key={day}
                onClick={() => signDay(day)}
                disabled={!canSign}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-2 text-[10px] font-bold transition-colors active:scale-95 ${
                  isSigned
                    ? "bg-gradient-to-br from-neon to-cyan text-black"
                    : "bg-white/5 text-white/40"
                } ${canSign ? "cursor-pointer" : "cursor-default"}`}
                style={{ aspectRatio: "1" }}
              >
                {isSigned ? "✓" : day}
                <span className="text-[7px] opacity-70">{reward}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 任务列表 */}
      <div className="space-y-2">
        {tasks.map((t) => {
          const done = taskDone[t.id] ?? false;
          return (
            <button
              key={t.id}
              onClick={() => setTaskDone((prev) => ({ ...prev, [t.id]: !done }))}
              className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors active:scale-[0.98] ${
                done ? "border-neon/20 bg-neon/5" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <span className="text-2xl">
                {t.id === "invite" ? "👥" : t.id === "watch" ? "📺" : "📤"}
              </span>
              <div className="flex-1">
                <div className="text-sm font-bold">{t.title}</div>
                <div className="mt-0.5 text-[11px] text-white/40">{t.desc}</div>
              </div>
              <span
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold ${
                  done
                    ? "bg-neon/10 text-neon"
                    : "bg-gradient-to-r from-neon to-cyan text-[#0A1F1A]"
                }`}
              >
                {done ? "✓ 已完成" : t.reward}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
