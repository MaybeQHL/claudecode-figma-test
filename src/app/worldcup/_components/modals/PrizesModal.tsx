"use client";

import { userPrizes, USER_POINTS } from "@/app/worldcup/lib/data";

type PrizesModalProps = {
  onClose: () => void;
};

const statusColor: Record<string, string> = {
  待揭晓: "text-cyan",
  未获得: "text-white/40",
  已获得: "text-neon",
};

export function PrizesModal({ onClose }: PrizesModalProps) {
  return (
    <div className="pt-2">
      <div className="mb-4 text-center">
        <div className="mb-1 text-3xl">🏆</div>
        <h3 className="text-lg font-black tracking-wide">我的奖品</h3>
        <p className="mt-1 text-xs text-white/40">
          当前积分: <span className="font-bold text-gold">{USER_POINTS.toLocaleString()}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {userPrizes.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5"
          >
            <span className="text-3xl">{p.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-bold">{p.name}</div>
              <div className={`text-xs font-bold ${statusColor[p.status] ?? "text-white/40"}`}>
                {p.status}
              </div>
            </div>
            <span className="text-lg text-white/40">›</span>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="mt-4 w-full rounded-full border border-white/10 bg-white/5 py-3 text-sm font-bold text-white active:scale-95"
      >
        关闭
      </button>
    </div>
  );
}
