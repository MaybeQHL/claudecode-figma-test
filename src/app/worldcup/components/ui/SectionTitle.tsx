export function SectionTitle({
  title,
  sub,
  accent = "neon",
}: {
  title: string;
  sub?: string;
  accent?: "neon" | "gold" | "flame" | "cyan";
}) {
  const colorMap = {
    neon: "text-neon/60",
    gold: "text-gold/60",
    flame: "text-flame/60",
    cyan: "text-cyan/60",
  };
  return (
    <div className="mb-4 flex items-end justify-between">
      <h3 className="flex items-baseline gap-2 text-xl font-black text-white">
        <span className={`inline-block h-4 w-1 rounded-full bg-current ${colorMap[accent]}`} />
        {title}
        {sub && (
          <span className={`text-[10px] font-medium tracking-widest ${colorMap[accent]}`}>
            {sub}
          </span>
        )}
      </h3>
      <span className="text-xs text-white/30">全部 ›</span>
    </div>
  );
}
