"use client";

import { useState } from "react";
import { NeonButton } from "@/app/worldcup/_components/ui/NeonButton";
import { predictTeams } from "@/app/worldcup/lib/data";

const BET_AMOUNTS = [10, 50, 100, 500] as const;
const USER_BALANCE = 2480;

type BetModalProps = {
  onClose: () => void;
};

export function BetModal({ onClose }: BetModalProps) {
  const [betTeamId, setBetTeamId] = useState(predictTeams[0].team.id);
  const [betAmount, setBetAmount] = useState<number>(50);
  const [submitted, setSubmitted] = useState(false);

  const selected = predictTeams.find((p) => p.team.id === betTeamId)!;

  if (submitted) {
    return (
      <div className="pt-2 text-center">
        <div className="mb-3 text-6xl animate-check-pop">🎉</div>
        <h3 className="mb-1.5 text-xl font-black text-neon">投注成功！</h3>
        <p className="mb-4 text-sm text-white/50">
          你已押注{" "}
          <span className="font-bold text-gold">
            {selected.team.flag}
            {selected.team.name}
          </span>{" "}
          夺冠
          <br />
          投入 <span className="font-bold text-gold">{betAmount} 积分</span>
          · 若猜中可获得{" "}
          <span className="font-bold text-neon">×{selected.support} 倍</span> 回报
        </p>
        <button
          onClick={onClose}
          className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold text-white active:scale-95"
        >
          知道了
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="mb-5 text-center">
        <div className="mb-1.5 text-4xl">⚽</div>
        <h3 className="text-xl font-black tracking-wide">参与竞猜</h3>
        <p className="mt-1 text-xs text-white/40">猜冠军 · 赢百万积分大奖</p>
      </div>

      <p className="mb-1.5 text-xs tracking-wide text-white/40">选择冠军队</p>
      <div className="mb-4 grid grid-cols-2 gap-2">
        {predictTeams.map((p) => {
          const sel = betTeamId === p.team.id;
          return (
            <button
              key={p.team.id}
              onClick={() => setBetTeamId(p.team.id)}
              className={`flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-colors active:scale-95 ${
                sel ? "border-neon bg-neon/10" : "border-white/10 bg-white/5"
              }`}
            >
              <span className="text-2xl">{p.team.flag}</span>
              <span className="text-sm font-bold">{p.team.name}</span>
              {sel && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-neon text-[10px] font-black text-black">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mb-1.5 text-xs tracking-wide text-white/40">投入积分</p>
      <div className="mb-5 flex gap-2">
        {BET_AMOUNTS.map((v) => (
          <button
            key={v}
            onClick={() => setBetAmount(v)}
            className={`flex-1 rounded-lg border-2 py-2.5 text-sm font-bold transition-colors active:scale-95 ${
              betAmount === v
                ? "border-neon bg-neon/10 text-neon"
                : "border-white/10 bg-white/5 text-white/65"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <NeonButton breathe className="w-full py-3.5 text-base" onClick={() => setSubmitted(true)}>
        确认投注 {betAmount} 积分
      </NeonButton>

      <p className="mt-2.5 text-center text-[10px] text-white/40">
        当前积分余额: <span className="font-bold text-gold">{USER_BALANCE.toLocaleString()}</span>
      </p>
    </div>
  );
}
