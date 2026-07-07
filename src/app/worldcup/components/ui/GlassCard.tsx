import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  flow = false,
}: {
  children: ReactNode;
  className?: string;
  flow?: boolean; // 直播流光边框
}) {
  return (
    <div
      className={`relative rounded-2xl glass ${flow ? "flow-border" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
