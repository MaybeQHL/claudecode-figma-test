"use client";

export function TopBar() {
  return (
    <div className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="mx-auto flex h-12 max-w-md items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">‹</span>
          <span className="font-black tracking-wider grad-text-neon">
            ⚽ FOOTBALL CUP 2026
          </span>
        </div>
        <div className="flex items-center gap-4 text-base">
          <button aria-label="分享" className="active:scale-90 transition-transform">
            <span>🔗</span>
          </button>
          <button aria-label="规则" className="relative active:scale-90 transition-transform">
            <span>📜</span>
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-flame" />
          </button>
        </div>
      </div>
    </div>
  );
}
