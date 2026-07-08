// 背景漂浮粒子（足球 + 光点）。位置基于 index 伪随机，避免 hydration 不一致。
function hash(n: number) {
  const s = Math.sin(n * 99.13) * 43758.5453;
  return s - Math.floor(s);
}

export function ParticleField({ count = 16 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => {
    const left = hash(i + 1) * 100;
    const size = 6 + hash(i + 2) * 16;
    const delay = hash(i + 3) * 7;
    const duration = 6 + hash(i + 4) * 6;
    const opacity = 0.25 + hash(i + 5) * 0.5;
    const isBall = hash(i + 6) > 0.7;
    return { i, left, size, delay, duration, opacity, isBall };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.i}
          className="absolute bottom-[-10%] animate-float"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        >
          {p.isBall ? (
            <span className="drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]">⚽</span>
          ) : (
            <span
              className="block rounded-full bg-neon"
              style={{
                width: p.size / 2,
                height: p.size / 2,
                boxShadow: "0 0 8px 2px rgba(0,255,135,0.7)",
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
