"use client";

import { NeonButton } from "@/app/worldcup/_components/ui/NeonButton";
import { activityRules } from "@/app/worldcup/lib/data";

type RulesModalProps = {
  onClose: () => void;
};

export function RulesModal({ onClose }: RulesModalProps) {
  return (
    <div className="pt-2">
      <div className="mb-4 text-center">
        <div className="mb-1 text-3xl">📋</div>
        <h3 className="text-lg font-black tracking-wide">活动规则</h3>
      </div>

      <div className="space-y-3 text-xs leading-relaxed text-white/70">
        {activityRules.map((rule) => (
          <div
            key={rule.title}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="mb-0.5 text-sm font-bold text-neon">{rule.title}</div>
            <div className="text-white/40">{rule.desc}</div>
          </div>
        ))}
      </div>

      <NeonButton className="mt-4 w-full py-3" onClick={onClose}>
        我知道了
      </NeonButton>
    </div>
  );
}
