"use client";

import { useEffect, useState } from "react";

/* ============ 色彩常量 ============ */
const t = {
  green: "#00FF87",
  blue: "#00D2FF",
  orange: "#FF6B35",
  gold: "#FFD700",
  red: "#FF3B30",
  dim: "rgba(255,255,255,.06)",
  dimB: "rgba(255,255,255,.1)",
  textSub: "rgba(255,255,255,.38)",
};

/* ============ 全局动画样式（内联注入） ============ */
const K = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Rajdhani:wght@400;500;600;700&display=swap');

  ::-webkit-scrollbar { display: none; }
  * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }

  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes spin-r  { to { transform: rotate(-360deg); } }

  @keyframes pulse-cta {
    0%,100% { box-shadow: 0 0 0 0 rgba(0,255,135,.6), 0 0 24px rgba(0,255,135,.3); transform: scale(1); }
    50%      { box-shadow: 0 0 0 10px rgba(0,255,135,0), 0 0 48px rgba(0,255,135,.5); transform: scale(1.03); }
  }

  @keyframes confetti {
    0%   { transform: translateY(-40px) rotate(0deg) scale(1); opacity: 1; }
    100% { transform: translateY(110vh) rotate(600deg) scale(.4); opacity: 0; }
  }

  @keyframes float-ball {
    0%   { transform: translateY(110vh) rotate(0deg); opacity: 0; }
    10%  { opacity: .5; }
    90%  { opacity: .5; }
    100% { transform: translateY(-5vh) rotate(540deg); opacity: 0; }
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes scale-in {
    from { opacity: 0; transform: scale(.82); }
    to   { opacity: 1; transform: scale(1); }
  }

  @keyframes flip-num {
    0%,100% { transform: translateY(0);   opacity: 1; }
    45%     { transform: translateY(-50%); opacity: 0; }
    55%     { transform: translateY(50%);  opacity: 0; }
  }

  @keyframes bounce-ball {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-22px) rotate(180deg); }
  }

  @keyframes scan {
    0%   { transform: translateX(-150%) skewX(-20deg); }
    100% { transform: translateX(350%)  skewX(-20deg); }
  }

  @keyframes live-dot {
    0%,100% { opacity: 1; }
    50%     { opacity: .2; }
  }

  @keyframes gold-ray {
    0%,100% { opacity: .4; transform: translateX(-50%) scaleX(1); }
    50%     { opacity: .9; transform: translateX(-50%) scaleX(1.2); }
  }

  @keyframes crown-sway {
    0%,100% { transform: rotate(-6deg) scale(1); }
    50%     { transform: rotate(6deg) scale(1.12); }
  }

  @keyframes firework-p {
    0%   { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--fx), var(--fy)) scale(0); opacity: 0; }
  }

  @keyframes border-spin {
    to { transform: rotate(360deg); }
  }

  @keyframes progress-grow {
    from { width: 0; }
  }

  @keyframes spotlight-pulse {
    0%,100% { opacity: .3; }
    50%     { opacity: .7; }
  }

  @keyframes trophy-glow {
    0%,100% { filter: drop-shadow(0 0 8px rgba(255,215,0,.4)); }
    50%     { filter: drop-shadow(0 0 28px rgba(255,215,0,1)); }
  }

  @keyframes ripple-out {
    to { transform: scale(3.5); opacity: 0; }
  }

  @keyframes modal-bg-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes modal-in {
    from { opacity: 0; transform: translateY(40px) scale(.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes check-pop {
    0%   { transform: scale(0); opacity: 0; }
    60%  { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }

  .tap-scale:active { transform: scale(.93) !important; transition: transform .1s !important; }
  .no-scroll { overflow: hidden; }
`;

/* ============ 静态数据 ============ */
const matches = {
  today: [
    { id: 1, home: "巴西", away: "法国", hf: "🇧🇷", af: "🇫🇷", hs: 2, as: 1, t: "67'", status: "live", ball: 58, shots: [9, 7], corners: [5, 3] },
    { id: 2, home: "阿根廷", away: "英格兰", hf: "🇦🇷", af: "🏴️⃣", hs: 0, as: 0, t: "19:00", status: "upcoming" },
    { id: 3, home: "西班牙", away: "德国", hf: "🇪🇸", af: "🇩🇪", hs: 3, as: 1, t: "已结束", status: "ended" },
  ],
  knockout: [
    { id: 4, home: "葡萄牙", away: "荷兰", hf: "🇵🇹", af: "🇳🇱", hs: 1, as: 2, t: "已结束", status: "ended" },
    { id: 5, home: "摩洛哥", away: "日本", hf: "🇲🇦", af: "🇯🇵", hs: 0, as: 0, t: "21:00", status: "upcoming" },
  ],
  group: [
    { id: 6, home: "美国", away: "加拿大", hf: "🇺🇸", af: "🇨🇦", hs: 1, as: 0, t: "已结束", status: "ended" },
    { id: 7, home: "墨西哥", away: "沙特", hf: "🇲🇽", af: "🇸🇦", hs: 2, as: 2, t: "已结束", status: "ended" },
  ],
} as const;

type Match = (typeof matches.today)[number];

const Q = [
  { name: "维尼修斯 Jr.", flag: "🇧🇷", goals: 5, assists: 3 },
  { name: "姆巴佩", flag: "🇫🇷", goals: 4, assists: 2 },
  { name: "梅西", flag: "🇦🇷", goals: 3, assists: 5 },
  { name: "贝林厄姆", flag: "🏴️⃣", goals: 3, assists: 1 },
  { name: "亚马尔", flag: "🇪🇸", goals: 2, assists: 4 },
];

const T = [
  { name: "巴西", flag: "🇧🇷", pct: 34 },
  { name: "法国", flag: "🇫🇷", pct: 28 },
  { name: "阿根廷", flag: "🇦🇷", pct: 22 },
  { name: "英格兰", flag: "🏴️⃣", pct: 16 },
];

const O = [
  { name: "决赛门票", icon: "🎟️", desc: "2026年决赛现场门票×2", rem: 2, tot: 10 },
  { name: "球星球衣", icon: "👕", desc: "梅西/姆巴佩亲签限量球衣", rem: 8, tot: 20 },
  { name: "积分大礼", icon: "💰", desc: "10,000超级积分礼包", rem: 156, tot: 200 },
];

const f = [
  { rank: 1, name: "飞翔的足球", avatar: "⚽", score: 12580 },
  { rank: 2, name: "绿茵战士", avatar: "🦁", score: 11240 },
  { rank: 3, name: "进球机器", avatar: "🔥", score: 9870 },
  { rank: 4, name: "传控大师", avatar: "⚡", score: 8560 },
  { rank: 5, name: "金靴猎手", avatar: "🥇", score: 7890 },
  { rank: 6, name: "铁门永固", avatar: "🛡️", score: 6430 },
  { rank: 7, name: "自由射手", avatar: "🎯", score: 5210 },
];

/* 彩带粒子（22 条） */
const confetti = Array.from({ length: 22 }, (_, s) => ({
  id: s,
  left: (s * 37 + 7) % 100,
  w: (s * 13 + 4) % 6 + 4,
  h: (s * 7 + 8) % 12 + 8,
  color: [t.green, t.blue, t.orange, t.gold, "#FF69B4"][s % 5],
  dur: (s * 1.1 + 3.5) % 3 + 3.5,
  delay: (s * 0.37) % 5,
}));

/* 漂浮足球（10 个） */
const balls = Array.from({ length: 10 }, (_, s) => ({
  id: s,
  left: (s * 17 + 3) % 95,
  size: (s * 5 + 6) % 10 + 6,
  dur: (s * 1.3 + 7) % 5 + 8,
  delay: (s * 0.9) % 8,
}));

const pad2 = (n: number) => String(n).padStart(2, "0");

/* 章节标题 */
function SectionTitle({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 3, height: 22, background: color, borderRadius: 2, flexShrink: 0 }} />
      <span
        style={{
          fontSize: 18,
          fontWeight: 900,
          fontFamily: "'Oswald', sans-serif",
          letterSpacing: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* 扫光覆盖层 */
function Sheen() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(105deg,transparent 38%,rgba(255,255,255,.15) 50%,transparent 62%)",
        animation: "scan 3s ease-in-out infinite",
        pointerEvents: "none",
        borderRadius: "inherit",
      }}
    />
  );
}

/* 比赛卡片 */
function MatchCard({ match: o, delay: s }: { match: Match; delay: number }) {
  const d = o.status === "live";
  const b = o.status === "ended";

  const inner = (
    <div
      style={{
        background: d ? "rgba(6,16,30,.96)" : "rgba(255,255,255,.03)",
        borderRadius: d ? 16 : 18,
        padding: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Sheen />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {d && (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: t.red,
                animation: "live-dot 1s ease-in-out infinite",
              }}
            />
          )}
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              color: d ? t.red : b ? "rgba(255,255,255,.3)" : t.blue,
            }}
          >
            {d ? "LIVE" : b ? "已结束" : "即将开始"}
          </span>
          <span style={{ fontSize: 11, color: t.textSub, marginLeft: 4 }}>{o.t}</span>
        </div>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,.22)" }}>
          {d ? "淘汰赛 · 四分之一决赛" : "淘汰赛"}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "rgba(255,255,255,.06)",
              border: `2px solid ${d ? "rgba(0,255,135,.4)" : "rgba(255,255,255,.14)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 6px",
              fontSize: 26,
              boxShadow: d ? "0 0 14px rgba(0,255,135,.3)" : "none",
            }}
          >
            {o.hf}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{o.home}</div>
        </div>

        <div style={{ textAlign: "center", minWidth: 84 }}>
          {d || b ? (
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                fontFamily: "'Oswald',sans-serif",
                letterSpacing: 4,
                color: d ? t.green : "#fff",
                textShadow: d ? `0 0 14px ${t.green}` : "none",
              }}
            >
              {o.hs}
              <span style={{ color: "rgba(255,255,255,.28)", fontSize: 20 }}> : </span>
              {o.as}
            </div>
          ) : (
            <div style={{ fontSize: 18, fontWeight: 700, color: t.blue }}>VS</div>
          )}
        </div>

        <div style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "rgba(255,255,255,.06)",
              border: "2px solid rgba(255,255,255,.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 6px",
              fontSize: 26,
            }}
          >
            {o.af}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{o.away}</div>
        </div>
      </div>

      {d && (o as any).ball && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,.05)",
          }}
        >
          {(
            [
              { label: "控球率", h: (o as any).ball, a: 100 - (o as any).ball, unit: "%" },
              { label: "射门", h: (o as any).shots[0], a: (o as any).shots[1], unit: "" },
              { label: "角球", h: (o as any).corners[0], a: (o as any).corners[1], unit: "" },
            ] as const
          ).map((p) => {
            const g = p.h + p.a;
            const u = (p.h / g) * 100;
            return (
              <div key={p.label} style={{ marginBottom: 8 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    color: "rgba(255,255,255,.4)",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#fff" }}>
                    {p.h}
                    {p.unit}
                  </span>
                  <span>{p.label}</span>
                  <span style={{ fontWeight: 700, color: "#fff" }}>
                    {p.a}
                    {p.unit}
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: "rgba(255,255,255,.06)",
                    borderRadius: 2,
                    overflow: "hidden",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: `${u}%`,
                      background: `linear-gradient(90deg,${t.green},${t.blue})`,
                      borderRadius: "2px 0 0 2px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)",
                        animation: "scan 2.5s ease-in-out infinite",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: `${100 - u}%`,
                      background: "rgba(255,107,53,.35)",
                      borderRadius: "0 2px 2px 0",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (d) {
    return (
      <div
        style={{
          position: "relative",
          borderRadius: 18,
          overflow: "hidden",
          padding: 2,
          animation: `fade-up .4s ${s}s both`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -2,
            background: `conic-gradient(from 0deg,${t.green},${t.blue},${t.orange},${t.gold},${t.green})`,
            animation: "border-spin 3s linear infinite",
            borderRadius: 20,
          }}
        />
        <div style={{ position: "relative", zIndex: 1, borderRadius: 16 }}>{inner}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,.03)",
        border: `1px solid ${b ? "rgba(255,255,255,.07)" : "rgba(0,210,255,.2)"}`,
        borderRadius: 18,
        overflow: "hidden",
        animation: `fade-up .4s ${s}s both`,
      }}
    >
      {inner}
    </div>
  );
}

/* ============ 主组件 ============ */
export default function App() {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [prizeIdx, setPrizeIdx] = useState(1);
  const [state, setState] = useState<"idle" | "shooting" | "goal" | "miss">("idle");
  const [goals, setGoals] = useState(0);
  const [shots, setShots] = useState(0);
  const [activeDir, setActiveDir] = useState<string | null>(null);
  const [ballPos, setBallPos] = useState({ x: 50, y: 78 });
  const [showFirework, setShowFirework] = useState(false);
  const [leaderSel, setLeaderSel] = useState<number | null>(null);
  const [signed, setSigned] = useState<number[]>([1]);
  const [taskDone, setTaskDone] = useState({ invite: false, watch: false, share: false });
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [modal, setModal] = useState<"bet" | "rules" | "prizes" | null>(null);
  const [betAmount, setBetAmount] = useState(50);
  const [betTeam, setBetTeam] = useState("巴西");
  const [betSubmitted, setBetSubmitted] = useState(false);

  useEffect(() => {
    const n = new Date("2026-06-11T18:00:00Z").getTime();
    const r = () => {
      const l = n - Date.now();
      if (l > 0) {
        setCd({
          d: Math.floor(l / 86400000),
          h: Math.floor((l % 86400000) / 3600000),
          m: Math.floor((l % 3600000) / 60000),
          s: Math.floor((l % 60000) / 1000),
        });
      }
    };
    r();
    const id = setInterval(r, 1000);
    return () => clearInterval(id);
  }, []);

  const handleShoot = (dir: string) => {
    if (state !== "idle") return;
    setActiveDir(dir);
    setState("shooting");
    setShots((v) => v + 1);
    setBallPos({ x: dir === "left" ? 22 : dir === "right" ? 78 : 50, y: 14 });
    const score =
      ["left", "center", "right"][Math.floor(Math.random() * 3)] !== dir || Math.random() > 0.25;
    setTimeout(() => {
      if (score) {
        setState("goal");
        setGoals((v) => v + 1);
        setShowFirework(true);
        setTimeout(() => setShowFirework(false), 1600);
      } else {
        setState("miss");
      }
      setTimeout(() => {
        setState("idle");
        setActiveDir(null);
        setBallPos({ x: 50, y: 78 });
      }, 1300);
    }, 550);
  };

  const tabs = ["today", "knockout", "group"] as const;
  const tabLabels = ["今日赛事", "淘汰赛", "小组赛"];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: K }} />

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          maxWidth: 375,
          margin: "0 auto",
          position: "relative",
          overflowX: "hidden",
          background: "linear-gradient(180deg, #0A1F1A 0%, #0B1026 100%)",
          fontFamily: "'Rajdhani','Oswald',sans-serif",
          color: "#fff",
        }}
      >
        {/* 球场网格背景 */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 42px,rgba(255,255,255,.018) 42px,rgba(255,255,255,.018) 43px),repeating-linear-gradient(90deg,transparent,transparent 42px,rgba(255,255,255,.012) 42px,rgba(255,255,255,.012) 43px)",
          }}
        />

        {/* 漂浮足球粒子 */}
        {balls.map((n) => (
          <div
            key={n.id}
            style={{
              position: "fixed",
              left: `${n.left}%`,
              bottom: -30,
              width: n.size,
              height: n.size,
              borderRadius: "50%",
              background: "rgba(0,255,135,.12)",
              border: "1px solid rgba(0,255,135,.25)",
              animation: `float-ball ${n.dur}s ${n.delay}s linear infinite`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

        {/* 顶部导航 */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 200,
            background: "rgba(8,14,28,.82)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,255,135,.18)",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            className="tap-scale"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,255,255,.06)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "#fff",
            }}
          >
            ←
          </button>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 900,
                letterSpacing: 2,
                fontFamily: "'Oswald',sans-serif",
                lineHeight: 1.1,
              }}
            >
              <span style={{ color: t.green }}>FOOTBALL </span>
              <span style={{ color: t.gold }}>CUP </span>
              <span style={{ color: "#fff" }}>2026</span>
            </div>
            <div style={{ fontSize: 8, color: t.textSub, letterSpacing: 3 }}>
              FIFA WORLD CUP™ SPECIAL
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ icon: "📤", label: "分享", action: "share" as const }, { icon: "📋", label: "规则", action: "rules" as const }].map((n) => (
              <button
                key={n.label}
                onClick={() => {
                  if (n.action === "rules") setModal("rules");
                }}
                className="tap-scale"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  position: "relative",
                  background: "rgba(255,255,255,.06)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                {n.icon}
                <span
                  style={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: t.red,
                    border: "1.5px solid #0a1f1a",
                  }}
                />
              </button>
            ))}
          </div>
        </header>

        {/* Hero 主视觉 */}
        <section
          style={{
            position: "relative",
            padding: "30px 20px 36px",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* 聚光灯 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 260,
              height: 360,
              background: "radial-gradient(ellipse at top,rgba(0,255,135,.1) 0%,transparent 65%)",
              pointerEvents: "none",
              animation: "spotlight-pulse 3s ease-in-out infinite",
            }}
          />
          {/* 彩带 */}
          {confetti.map((n) => (
            <div
              key={n.id}
              style={{
                position: "absolute",
                left: `${n.left}%`,
                top: 0,
                width: n.w,
                height: n.h,
                background: n.color,
                borderRadius: 2,
                animation: `confetti ${n.dur}s ${n.delay}s linear infinite`,
                opacity: 0.85,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* 标题 */}
          <div style={{ position: "relative", zIndex: 2, marginBottom: 4, animation: "fade-up .7s .1s both" }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                fontFamily: "'Oswald',sans-serif",
                letterSpacing: 1,
                background: "linear-gradient(135deg,#00FF87,#00D2FF,#FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 18px rgba(0,255,135,.5))",
                lineHeight: 1.15,
              }}
            >
              燃情绿茵
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                fontFamily: "'Oswald',sans-serif",
                letterSpacing: 3,
                background: "linear-gradient(135deg,#FFD700,#FF6B35,#FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 14px rgba(255,215,0,.6))",
              }}
            >
              决战 · 2026
            </div>
          </div>

          {/* 主视觉球 + 环 */}
          <div
            style={{
              position: "relative",
              height: 148,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                fontSize: 90,
                opacity: 0.1,
                animation: "trophy-glow 3s ease-in-out infinite",
                pointerEvents: "none",
              }}
            >
              🏆
            </div>
            <div
              style={{
                position: "absolute",
                left: 14,
                fontSize: 56,
                opacity: 0.15,
                filter: "blur(1px) sepia(1) saturate(3) hue-rotate(80deg)",
                pointerEvents: "none",
              }}
            >
              🏃
            </div>
            <div
              style={{
                position: "absolute",
                right: 14,
                fontSize: 48,
                opacity: 0.12,
                filter: "blur(1px) sepia(1) saturate(4) hue-rotate(40deg)",
                pointerEvents: "none",
                transform: "scaleX(-1)",
              }}
            >
              🏃
            </div>
            <div
              style={{
                position: "absolute",
                width: 130,
                height: 130,
                border: "2px solid rgba(0,255,135,.18)",
                borderRadius: "50%",
                animation: "spin 9s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 106,
                height: 106,
                border: "1px solid rgba(0,210,255,.18)",
                borderRadius: "50%",
                animation: "spin-r 6s linear infinite",
              }}
            />
            <div
              style={{
                fontSize: 62,
                animation: "bounce-ball 2.2s ease-in-out infinite",
                filter: "drop-shadow(0 0 22px rgba(0,255,135,.6))",
                zIndex: 3,
              }}
            >
              ⚽
            </div>
          </div>

          {/* 倒计时 */}
          <div style={{ marginBottom: 22, position: "relative", zIndex: 2, animation: "fade-up .7s .25s both" }}>
            <div style={{ fontSize: 10, color: t.textSub, letterSpacing: 4, marginBottom: 12, textTransform: "uppercase" }}>
              距世界杯开幕
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {[
                { v: cd.d, l: "天" },
                { v: cd.h, l: "时" },
                { v: cd.m, l: "分" },
                { v: cd.s, l: "秒" },
              ].map(({ v, l }) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 66,
                      height: 66,
                      background: "rgba(0,0,0,.45)",
                      border: `1px solid ${t.green}55`,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 16px rgba(0,255,135,.18),inset 0 1px 0 rgba(255,255,255,.04)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        right: 0,
                        height: 1,
                        background: "rgba(0,0,0,.35)",
                        zIndex: 2,
                      }}
                    />
                    <span
                      key={v}
                      style={{
                        fontSize: 28,
                        fontWeight: 900,
                        fontFamily: "'Oswald',sans-serif",
                        color: t.green,
                        textShadow: `0 0 12px ${t.green}`,
                        animation: "flip-num .35s ease-out",
                      }}
                    >
                      {pad2(v)}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: t.textSub, marginTop: 5, letterSpacing: 1 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 主 CTA */}
          <div style={{ position: "relative", display: "inline-block", zIndex: 2, animation: "fade-up .7s .4s both" }}>
            <div
              style={{
                position: "absolute",
                inset: -12,
                borderRadius: 50,
                border: `2px solid ${t.green}40`,
                animation: "ripple-out 2s ease-out infinite",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: 50,
                border: `2px solid ${t.green}30`,
                animation: "ripple-out 2s .7s ease-out infinite",
                pointerEvents: "none",
              }}
            />
            <button
              onClick={() => setModal("bet")}
              className="tap-scale"
              style={{
                position: "relative",
                padding: "16px 52px",
                borderRadius: 50,
                background: `linear-gradient(135deg,${t.green},${t.blue})`,
                border: "none",
                fontSize: 18,
                fontWeight: 900,
                fontFamily: "'Oswald',sans-serif",
                color: "#0A1F1A",
                letterSpacing: 2,
                cursor: "pointer",
                animation: "pulse-cta 2.5s ease-in-out infinite",
                overflow: "hidden",
              }}
            >
              <span style={{ position: "relative", zIndex: 2 }}>⚡ 立即竞猜</span>
              <Sheen />
            </button>
          </div>

          <div style={{ fontSize: 11, color: t.textSub, marginTop: 12, position: "relative", zIndex: 2 }}>
            已有 <span style={{ color: t.green, fontWeight: 700 }}>238,490</span> 人参与竞猜
          </div>
        </section>

        {/* 赛事对阵 */}
        <section style={{ padding: "0 16px 32px", position: "relative", zIndex: 1 }}>
          <SectionTitle color={`linear-gradient(${t.green},${t.blue})`} label="赛事对阵" />
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.08)", marginBottom: 16 }}>
            {tabLabels.map((n, r) => (
              <button
                key={n}
                onClick={() => setTab(r)}
                className="tap-scale"
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: "none",
                  border: "none",
                  color: r === tab ? t.green : t.textSub,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  position: "relative",
                  transition: "color .2s",
                }}
              >
                {n}
                {r === tab && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -1,
                      left: "20%",
                      right: "20%",
                      height: 2,
                      background: `linear-gradient(90deg,${t.green},${t.blue})`,
                      borderRadius: 2,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(matches[tabs[tab] as keyof typeof matches] as readonly Match[]).map((n, r) => (
              <MatchCard key={n.id} match={n as Match} delay={r * 0.08} />
            ))}
          </div>
        </section>

        {/* 球星风云 */}
        <section style={{ padding: "0 16px 32px" }}>
          <SectionTitle color={`linear-gradient(${t.gold},${t.orange})`} label="球星风云" />
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(135deg,rgba(255,215,0,.1),rgba(255,107,53,.07))",
              border: `1px solid ${t.gold}44`,
              borderRadius: 18,
              padding: 20,
              marginBottom: 14,
            }}
          >
            <div style={{ position: "absolute", right: -16, bottom: -16, fontSize: 90, opacity: 0.06, pointerEvents: "none" }}>⚽</div>
            <Sheen />
            <div style={{ display: "flex", gap: 16, alignItems: "center", position: "relative", zIndex: 1 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: `linear-gradient(135deg,${t.gold},${t.orange})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  boxShadow: "0 0 22px rgba(255,215,0,.4)",
                }}
              >
                🇧🇷
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: t.textSub, letterSpacing: 3, marginBottom: 2 }}>本场最佳</div>
                <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Oswald',sans-serif" }}>维尼修斯 Jr.</div>
                <div style={{ fontSize: 12, color: t.textSub, marginBottom: 10 }}>巴西国家队 · 左翼锋</div>
                <div style={{ display: "flex", gap: 18 }}>
                  {[
                    { v: "9.4", l: "评分", c: t.gold },
                    { v: "2", l: "进球", c: t.green },
                    { v: "1", l: "助攻", c: t.blue },
                  ].map((n) => (
                    <div key={n.l}>
                      <span
                        style={{
                          fontSize: n.l === "评分" ? 24 : 20,
                          fontWeight: 900,
                          color: n.c,
                          fontFamily: "'Oswald',sans-serif",
                        }}
                      >
                        {n.v}
                      </span>
                      <span style={{ fontSize: 10, color: t.textSub, marginLeft: 3 }}>{n.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: t.textSub, marginBottom: 10, letterSpacing: 1 }}>⚽ 射手榜</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
            {Q.map((n, r) => {
              const a = r === 0 ? t.gold : r === 1 ? "#C0C0C0" : r === 2 ? "#CD7F32" : t.textSub;
              return (
                <div
                  key={n.name}
                  style={{
                    flexShrink: 0,
                    width: 108,
                    position: "relative",
                    overflow: "hidden",
                    background: r === 0 ? "rgba(255,215,0,.07)" : t.dim,
                    border: `1px solid ${r === 0 ? t.gold + "55" : t.dimB}`,
                    borderRadius: 16,
                    padding: 12,
                    textAlign: "center",
                    animation: `scale-in .35s ${r * 0.07}s both`,
                  }}
                >
                  {r === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: `linear-gradient(90deg,transparent,${t.gold},transparent)`,
                      }}
                    />
                  )}
                  <Sheen />
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: a,
                      fontSize: 9,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: r < 3 ? "#000" : "#fff",
                    }}
                  >
                    {r + 1}
                  </div>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>{n.flag}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2, marginBottom: 4 }}>{n.name}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: a, fontFamily: "'Oswald',sans-serif" }}>{n.goals}</div>
                  <div style={{ fontSize: 9, color: t.textSub }}>进球</div>
                  <div style={{ fontSize: 10, color: t.blue, marginTop: 2 }}>{n.assists} 助攻</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 猜冠军赢大奖 */}
        <section style={{ padding: "0 16px 32px" }}>
          <SectionTitle color={`linear-gradient(${t.blue},${t.green})`} label="猜冠军赢大奖" />
          <div style={{ fontSize: 11, color: t.textSub, marginBottom: 16, marginTop: -10 }}>
            选出你心中的2026世界杯冠军队 · 进球越准奖越大
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {T.map((n, r) => {
              const sel = selected === r;
              return (
                <button
                  key={n.name}
                  onClick={() => setSelected(r)}
                  className="tap-scale"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    background: sel ? "rgba(0,255,135,.1)" : t.dim,
                    border: `2px solid ${sel ? t.green : t.dimB}`,
                    borderRadius: 18,
                    padding: "18px 12px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all .25s cubic-bezier(.34,1.56,.64,1)",
                    transform: sel ? "scale(1.05)" : "scale(1)",
                    boxShadow: sel ? "0 0 24px rgba(0,255,135,.3)" : "none",
                  }}
                >
                  {sel && (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "radial-gradient(circle,rgba(0,255,135,.1),transparent 70%)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: t.green,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          color: "#000",
                          fontWeight: 900,
                        }}
                      >
                        ✓
                      </div>
                    </>
                  )}
                  <Sheen />
                  <div style={{ fontSize: 38, marginBottom: 8, position: "relative", zIndex: 1 }}>{n.flag}</div>
                  <div style={{ fontSize: 15, fontWeight: 900, fontFamily: "'Oswald',sans-serif", position: "relative", zIndex: 1 }}>
                    {n.name}
                  </div>
                  <div style={{ fontSize: 11, color: t.textSub, marginTop: 4, position: "relative", zIndex: 1 }}>
                    {n.pct}% 支持率
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {T.map((n, r) => {
              const a = [
                `linear-gradient(90deg,${t.green},${t.blue})`,
                `linear-gradient(90deg,${t.blue},#7B2FFF)`,
                `linear-gradient(90deg,${t.gold},${t.orange})`,
                `linear-gradient(90deg,${t.orange},${t.red})`,
              ];
              return (
                <div key={n.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16, width: 26, textAlign: "center" }}>{n.flag}</span>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      background: "rgba(255,255,255,.06)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${n.pct}%`,
                        background: a[r],
                        borderRadius: 3,
                        animation: "progress-grow 1.4s ease-out",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)",
                          animation: "scan 2.5s ease-in-out infinite",
                        }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.6)", width: 30, textAlign: "right" }}>
                    {n.pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 丰厚奖品 */}
        <section style={{ padding: "0 0 32px" }}>
          <div style={{ padding: "0 16px" }}>
            <SectionTitle color={`linear-gradient(${t.orange},${t.gold})`} label="丰厚奖品" />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "0 12px",
              marginBottom: 14,
            }}
          >
            {O.map((n, r) => {
              const off = r - prizeIdx;
              const active = off === 0;
              return (
                <button
                  key={n.name}
                  onClick={() => setPrizeIdx(r)}
                  className="tap-scale"
                  style={{
                    flexShrink: 0,
                    width: active ? 162 : 96,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    transition: "all .35s cubic-bezier(.34,1.56,.64,1)",
                    opacity: active ? 1 : 0.48,
                    transform: `scale(${active ? 1 : 0.82}) perspective(700px) rotateY(${off * 10}deg)`,
                    zIndex: active ? 3 : 1,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      background: "linear-gradient(135deg,rgba(255,215,0,.09),rgba(255,107,53,.06))",
                      border: `2px solid ${active ? t.gold + "66" : t.dimB}`,
                      borderRadius: 20,
                      padding: active ? 20 : 12,
                      textAlign: "center",
                      boxShadow: active ? "0 0 32px rgba(255,215,0,.22)" : "none",
                    }}
                  >
                    <Sheen />
                    <div style={{ fontSize: active ? 50 : 28, marginBottom: 8 }}>{n.icon}</div>
                    <div style={{ fontSize: active ? 14 : 10, fontWeight: 900, fontFamily: "'Oswald',sans-serif" }}>
                      {n.name}
                    </div>
                    {active && (
                      <>
                        <div style={{ fontSize: 10, color: t.textSub, margin: "6px 0 8px" }}>{n.desc}</div>
                        <div
                          style={{
                            height: 3,
                            background: "rgba(255,255,255,.06)",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${(n.rem / n.tot) * 100}%`,
                              background: `linear-gradient(90deg,${t.gold},${t.orange})`,
                              borderRadius: 2,
                              animation: "progress-grow 1.2s ease-out",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: 9, color: t.textSub, marginTop: 4 }}>
                          剩余 {n.rem}/{n.tot}
                        </div>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
            {O.map((n, r) => (
              <div
                key={r}
                onClick={() => setPrizeIdx(r)}
                style={{
                  width: r === prizeIdx ? 22 : 6,
                  height: 6,
                  borderRadius: 3,
                  cursor: "pointer",
                  background: r === prizeIdx ? t.gold : "rgba(255,255,255,.18)",
                  transition: "all .3s",
                }}
              />
            ))}
          </div>
        </section>

        {/* 点球挑战 */}
        <section style={{ padding: "0 16px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <SectionTitle color={`linear-gradient(${t.red},${t.orange})`} label="点球挑战" />
            <span style={{ fontSize: 11, color: t.textSub, marginLeft: "auto", marginTop: -16 }}>
              {goals} / {shots} 进球
            </span>
          </div>
          <div
            style={{
              position: "relative",
              height: 188,
              background: "linear-gradient(180deg,rgba(10,31,26,.9) 0%,rgba(0,80,40,.38) 100%)",
              border: "1px solid rgba(0,255,135,.18)",
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            {/* 球门弧 */}
            <div
              style={{
                position: "absolute",
                bottom: -30,
                left: "50%",
                transform: "translateX(-50%)",
                width: 180,
                height: 90,
                border: "1px solid rgba(255,255,255,.1)",
                borderTop: "none",
                borderRadius: "0 0 90px 90px",
              }}
            />
            {/* 球门框 */}
            <div
              style={{
                position: "absolute",
                top: 18,
                left: "50%",
                transform: "translateX(-50%)",
                width: 166,
                height: 64,
                border: "3px solid rgba(255,255,255,.85)",
                borderBottom: "none",
                borderRadius: "5px 5px 0 0",
                boxShadow: "0 0 18px rgba(255,255,255,.15)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(0deg,rgba(255,255,255,.08),rgba(255,255,255,.08) 1px,transparent 1px,transparent 13px),repeating-linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,.08) 1px,transparent 1px,transparent 17px)",
                }}
              />
            </div>
            {state === "goal" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at 50% 30%,rgba(0,255,135,.45),transparent 65%)",
                  animation: "fade-up .4s ease-out",
                }}
              />
            )}
            {state === "goal" && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  fontSize: 30,
                  fontWeight: 900,
                  color: t.green,
                  textShadow: `0 0 20px ${t.green}`,
                  fontFamily: "'Oswald',sans-serif",
                  animation: "scale-in .3s ease-out",
                  zIndex: 10,
                }}
              >
                GOAL! 🎉
              </div>
            )}
            {state === "miss" && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  fontSize: 22,
                  fontWeight: 900,
                  color: t.orange,
                  fontFamily: "'Oswald',sans-serif",
                  animation: "scale-in .3s ease-out",
                  zIndex: 10,
                }}
              >
                扑出了！😤
              </div>
            )}
            {/* 足球 */}
            <div
              style={{
                position: "absolute",
                left: `${ballPos.x}%`,
                top: `${ballPos.y}%`,
                transform: "translate(-50%,-50%)",
                fontSize: state === "shooting" ? 22 : 30,
                transition: "all .55s cubic-bezier(.25,.46,.45,.94)",
                filter: `drop-shadow(0 0 ${state === "goal" ? "18px " + t.green : "8px rgba(255,255,255,.3)"})`,
                zIndex: 5,
              }}
            >
              ⚽
            </div>
            {/* 进球烟花 */}
            {showFirework &&
              Array.from({ length: 14 }, (_, r) => {
                const a = (r / 14) * Math.PI * 2;
                const l = (40 + (r * 7) % 35);
                return (
                  <div
                    key={r}
                    style={{
                      position: "absolute",
                      top: "28%",
                      left: "50%",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: [t.green, t.gold, t.blue, t.orange][r % 4],
                      transform: "translate(-50%,-50%)",
                      animation: "firework-p .85s ease-out forwards",
                      ["--fx" as any]: `${Math.cos(a) * l}px`,
                      ["--fy" as any]: `${Math.sin(a) * l}px`,
                    }}
                  />
                );
              })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {(["left", "center", "right"] as const).map((n) => (
              <button
                key={n}
                onClick={() => handleShoot(n)}
                className="tap-scale"
                disabled={state !== "idle"}
                style={{
                  padding: "14px 0",
                  borderRadius: 14,
                  background:
                    activeDir === n && state === "goal"
                      ? `linear-gradient(135deg,${t.green},${t.blue})`
                      : activeDir === n && state === "miss"
                        ? "rgba(255,59,48,.25)"
                        : t.dim,
                  border: `1px solid ${activeDir === n ? "rgba(0,255,135,.4)" : t.dimB}`,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: state !== "idle" ? "not-allowed" : "pointer",
                  opacity: state !== "idle" ? 0.55 : 1,
                  transition: "all .2s",
                }}
              >
                {n === "left" ? "← 左角" : n === "center" ? "↑ 中路" : "右角 →"}
              </button>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: t.textSub }}>
            今日剩余 <span style={{ color: t.gold, fontWeight: 700 }}>5</span> 次机会 · 进球得{" "}
            <span style={{ color: t.green, fontWeight: 700 }}>+50积分</span>
          </div>
        </section>

        {/* 积分排行 */}
        <section style={{ padding: "0 16px 32px" }}>
          <SectionTitle color={`linear-gradient(${t.gold},${t.orange})`} label="积分排行" />
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 6,
              marginBottom: 20,
              height: 178,
            }}
          >
            {/* 第2 */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 22, marginBottom: 3 }}>{f[1].avatar}</div>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{f[1].name}</div>
              <div style={{ fontSize: 11, color: "#C0C0C0", marginBottom: 6 }}>{f[1].score.toLocaleString()}</div>
              <div
                style={{
                  height: 90,
                  background: "linear-gradient(180deg,rgba(192,192,192,.28),rgba(192,192,192,.08))",
                  border: "1px solid rgba(192,192,192,.4)",
                  borderRadius: "8px 8px 0 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#C0C0C0",
                  fontFamily: "'Oswald',sans-serif",
                }}
              >
                2
              </div>
            </div>
            {/* 第1 */}
            <div style={{ textAlign: "center", flex: 1, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: -26,
                  left: "50%",
                  width: 50,
                  height: 70,
                  background: "linear-gradient(180deg,rgba(255,215,0,.7),transparent)",
                  animation: "gold-ray 2s ease-in-out infinite",
                  borderRadius: "50% 50% 0 0",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: "50%",
                  width: 44,
                  height: 44,
                  marginLeft: -22,
                  border: `2px solid ${t.gold}88`,
                  borderRadius: "50%",
                  animation: "spin 4s linear infinite",
                }}
              />
              <div style={{ fontSize: 20, animation: "crown-sway 2.5s ease-in-out infinite", marginBottom: 2 }}>👑</div>
              <div style={{ fontSize: 28, marginBottom: 3 }}>{f[0].avatar}</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: t.gold, marginBottom: 4, lineHeight: 1.2 }}>{f[0].name}</div>
              <div style={{ fontSize: 12, color: t.gold, fontWeight: 700, marginBottom: 6 }}>{f[0].score.toLocaleString()}</div>
              <div
                style={{
                  height: 128,
                  background: "linear-gradient(180deg,rgba(255,215,0,.28),rgba(255,107,53,.12))",
                  border: `1px solid ${t.gold}55`,
                  borderRadius: "8px 8px 0 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  fontWeight: 900,
                  color: t.gold,
                  fontFamily: "'Oswald',sans-serif",
                  boxShadow: "0 0 24px rgba(255,215,0,.25)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Sheen />
                1
              </div>
            </div>
            {/* 第3 */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 20, marginBottom: 3 }}>{f[2].avatar}</div>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{f[2].name}</div>
              <div style={{ fontSize: 11, color: "#CD7F32", marginBottom: 6 }}>{f[2].score.toLocaleString()}</div>
              <div
                style={{
                  height: 66,
                  background: "linear-gradient(180deg,rgba(205,127,50,.28),rgba(205,127,50,.08))",
                  border: "1px solid rgba(205,127,50,.4)",
                  borderRadius: "8px 8px 0 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#CD7F32",
                  fontFamily: "'Oswald',sans-serif",
                }}
              >
                3
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {f.slice(3).map((n) => (
              <button
                key={n.rank}
                onClick={() => setLeaderSel(leaderSel === n.rank ? null : n.rank)}
                className="tap-scale"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 13,
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  background: leaderSel === n.rank ? "rgba(0,255,135,.07)" : "rgba(255,255,255,.03)",
                  border: `1px solid ${leaderSel === n.rank ? "rgba(0,255,135,.28)" : t.dimB}`,
                  transition: "all .2s",
                }}
              >
                <span
                  style={{
                    width: 22,
                    fontSize: 12,
                    fontWeight: 700,
                    color: t.textSub,
                    fontFamily: "'Oswald',sans-serif",
                    textAlign: "center",
                  }}
                >
                  {n.rank}
                </span>
                <span style={{ fontSize: 20 }}>{n.avatar}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>{n.name}</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "rgba(255,255,255,.65)",
                    fontFamily: "'Oswald',sans-serif",
                  }}
                >
                  {n.score.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              className="tap-scale"
              style={{
                padding: "10px 32px",
                borderRadius: 30,
                background: t.dim,
                border: `1px solid ${t.dimB}`,
                fontSize: 13,
                fontWeight: 700,
                color: t.textSub,
                cursor: "pointer",
              }}
            >
              查看完整榜单
            </button>
          </div>
        </section>

        {/* 每日福利 */}
        <section style={{ padding: "0 16px 32px" }}>
          <SectionTitle color={`linear-gradient(${t.green},${t.gold})`} label="每日福利" />
          <div
            style={{
              background: "rgba(255,255,255,.03)",
              border: `1px solid ${t.dimB}`,
              borderRadius: 18,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 16, marginRight: 8 }}>📅</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>连续签到</span>
              <span style={{ fontSize: 11, color: t.textSub, marginLeft: "auto" }}>
                已签 {signed.length}/7 天
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                const isSigned = signed.includes(n);
                const canSign = !isSigned && (n === 1 || signed.includes(n - 1));
                return (
                  <button
                    key={n}
                    onClick={() => canSign && setSigned((l) => [...l, n])}
                    className="tap-scale"
                    style={{
                      flex: 1,
                      aspectRatio: "1",
                      borderRadius: 10,
                      border: "none",
                      cursor: canSign ? "pointer" : "default",
                      background: isSigned ? `linear-gradient(135deg,${t.green},${t.blue})` : t.dim,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: isSigned ? "#000" : t.textSub,
                      gap: 2,
                    }}
                  >
                    {isSigned ? "✓" : n}
                    <span style={{ fontSize: 7, opacity: 0.7 }}>{n === 7 ? "大礼" : "+" + n * 50}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {[
            { key: "invite" as const, icon: "👥", label: "邀请好友", desc: "邀请1位好友参与活动", reward: "+500积分" },
            { key: "watch" as const, icon: "📺", label: "观看直播", desc: "观看15分钟赛事直播", reward: "+200积分" },
            { key: "share" as const, icon: "📤", label: "分享活动", desc: "分享活动到朋友圈", reward: "+100积分" },
          ].map((n) => (
            <button
              key={n.key}
              onClick={() => setTaskDone((r) => ({ ...r, [n.key]: true }))}
              className="tap-scale"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 16,
                marginBottom: 8,
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                background: taskDone[n.key] ? "rgba(0,255,135,.05)" : "rgba(255,255,255,.03)",
                border: `1px solid ${taskDone[n.key] ? "rgba(0,255,135,.2)" : t.dimB}`,
                transition: "all .2s",
              }}
            >
              <span style={{ fontSize: 26 }}>{n.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{n.label}</div>
                <div style={{ fontSize: 11, color: t.textSub, marginTop: 2 }}>{n.desc}</div>
              </div>
              <div
                style={{
                  padding: "7px 16px",
                  borderRadius: 20,
                  flexShrink: 0,
                  background: taskDone[n.key]
                    ? "rgba(0,255,135,.1)"
                    : `linear-gradient(135deg,${t.green},${t.blue})`,
                  fontSize: 12,
                  fontWeight: 700,
                  color: taskDone[n.key] ? t.green : "#0A1F1A",
                }}
              >
                {taskDone[n.key] ? "✓ 已完成" : n.reward}
              </div>
            </button>
          ))}
        </section>

        <div style={{ height: 90 }} />

        {/* 底部固定栏 */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 375,
            background: "rgba(8,14,28,.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderTop: "1px solid rgba(0,255,135,.15)",
            padding: "10px 20px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 300,
          }}
        >
          <button
            onClick={() => setModal("rules")}
            className="tap-scale"
            style={{
              flex: 1,
              padding: "10px 0",
              background: "none",
              border: "none",
              color: t.textSub,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            📋 规则
          </button>
          <button
            onClick={() => setModal("bet")}
            className="tap-scale"
            style={{
              width: 66,
              height: 66,
              borderRadius: "50%",
              flexShrink: 0,
              background: `linear-gradient(135deg,${t.green},${t.blue})`,
              border: "3px solid rgba(0,255,135,.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 900,
              fontFamily: "'Oswald',sans-serif",
              color: "#0A1F1A",
              cursor: "pointer",
              letterSpacing: 0.5,
              textAlign: "center",
              lineHeight: 1.25,
              animation: "pulse-cta 2.5s ease-in-out infinite",
              boxShadow: "0 0 30px rgba(0,255,135,.4)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span style={{ position: "relative", zIndex: 2 }}>
              参与<br />竞猜
            </span>
            <Sheen />
          </button>
          <button
            onClick={() => setModal("prizes")}
            className="tap-scale"
            style={{
              flex: 1,
              padding: "10px 0",
              background: "none",
              border: "none",
              color: t.textSub,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🏆 我的奖品
          </button>
        </div>

        {/* ============ 弹窗层 ============ */}
        {modal && (
          <div
            onClick={() => { setModal(null); setBetSubmitted(false); }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 500,
              background: "rgba(0,0,0,.72)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "modal-bg-in .25s ease-out",
              padding: 20,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 340,
                maxHeight: "85vh",
                overflowY: "auto",
                background: "linear-gradient(180deg, #111d2e 0%, #0d1928 100%)",
                border: "1px solid rgba(0,255,135,.18)",
                borderRadius: 22,
                padding: 24,
                animation: "modal-in .35s cubic-bezier(.34,1.56,.64,1)",
                boxShadow: "0 0 60px rgba(0,255,135,.18)",
                position: "relative",
              }}
            >
              {/* 关闭按钮 */}
              <button
                onClick={() => { setModal(null); setBetSubmitted(false); }}
                className="tap-scale"
                style={{
                  position: "absolute",
                  top: 12,
                  right: 14,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.08)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                ✕
              </button>

              {/* ---- 竞猜弹窗 ---- */}
              {modal === "bet" && (
                <>
                  {!betSubmitted ? (
                    <>
                      <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <div style={{ fontSize: 40, marginBottom: 6 }}>⚽</div>
                        <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Oswald',sans-serif", letterSpacing: 1 }}>
                          参与竞猜
                        </div>
                        <div style={{ fontSize: 11, color: t.textSub, marginTop: 4 }}>
                          猜冠军 · 赢百万积分大奖
                        </div>
                      </div>

                      <div style={{ fontSize: 11, color: t.textSub, marginBottom: 6, letterSpacing: 1 }}>选择冠军队</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
                        {T.map((n) => {
                          const sel = betTeam === n.name;
                          return (
                            <button
                              key={n.name}
                              onClick={() => setBetTeam(n.name)}
                              className="tap-scale"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "12px 14px",
                                borderRadius: 14,
                                border: `2px solid ${sel ? t.green : t.dimB}`,
                                background: sel ? "rgba(0,255,135,.08)" : t.dim,
                                cursor: "pointer",
                                transition: "all .2s",
                                color: "#fff",
                              }}
                            >
                              <span style={{ fontSize: 24 }}>{n.flag}</span>
                              <span style={{ fontSize: 14, fontWeight: 700 }}>{n.name}</span>
                              {sel && (
                                <span style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", background: t.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#000", fontWeight: 900 }}>✓</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ fontSize: 11, color: t.textSub, marginBottom: 6, letterSpacing: 1 }}>投入积分</div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                        {[10, 50, 100, 500].map((v) => (
                          <button
                            key={v}
                            onClick={() => setBetAmount(v)}
                            className="tap-scale"
                            style={{
                              flex: 1,
                              padding: "10px 0",
                              borderRadius: 10,
                              border: `2px solid ${betAmount === v ? t.green : t.dimB}`,
                              background: betAmount === v ? "rgba(0,255,135,.08)" : t.dim,
                              color: betAmount === v ? t.green : "rgba(255,255,255,.65)",
                              fontSize: 14,
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "all .2s",
                            }}
                          >
                            {v}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setBetSubmitted(true)}
                        className="tap-scale"
                        style={{
                          width: "100%",
                          padding: "14px 0",
                          borderRadius: 50,
                          background: `linear-gradient(135deg,${t.green},${t.blue})`,
                          border: "none",
                          fontSize: 16,
                          fontWeight: 900,
                          fontFamily: "'Oswald',sans-serif",
                          color: "#0A1F1A",
                          letterSpacing: 2,
                          cursor: "pointer",
                          animation: "pulse-cta 2.5s ease-in-out infinite",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <span style={{ position: "relative", zIndex: 2 }}>确认投注 {betAmount} 积分</span>
                        <Sheen />
                      </button>

                      <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: t.textSub }}>
                        当前积分余额: <span style={{ color: t.gold, fontWeight: 700 }}>2,480</span>
                      </div>
                    </>
                  ) : (
                    /* 投注成功 */
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <div style={{ fontSize: 64, animation: "check-pop .5s ease-out", marginBottom: 12 }}>🎉</div>
                      <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Oswald',sans-serif", color: t.green, marginBottom: 6 }}>
                        投注成功！
                      </div>
                      <div style={{ fontSize: 13, color: t.textSub, marginBottom: 16 }}>
                        你已押注 <span style={{ color: t.gold, fontWeight: 700 }}>{betTeam}</span> 夺冠
                        <br />
                        投入 <span style={{ color: t.gold, fontWeight: 700 }}>{betAmount} 积分</span>
                        · 若猜中可获得 <span style={{ color: t.green, fontWeight: 700 }}>×{T.find((t) => t.name === betTeam)?.pct ?? 0} 倍</span> 回报
                      </div>
                      <button
                        onClick={() => { setModal(null); setBetSubmitted(false); }}
                        className="tap-scale"
                        style={{
                          padding: "12px 32px",
                          borderRadius: 30,
                          background: t.dim,
                          border: `1px solid ${t.dimB}`,
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        知道了
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* ---- 规则弹窗 ---- */}
              {modal === "rules" && (
                <>
                  <div style={{ textAlign: "center", marginBottom: 18 }}>
                    <div style={{ fontSize: 32, marginBottom: 4 }}>📋</div>
                    <div style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Oswald',sans-serif", letterSpacing: 1 }}>
                      活动规则
                    </div>
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.8, color: "rgba(255,255,255,.7)" }}>
                    {[
                      { t: "活动时间", d: "2026年6月11日 — 2026年7月19日" },
                      { t: "参与资格", d: "所有注册用户均可参与竞猜、点球挑战等互动" },
                      { t: "竞猜规则", d: "选择你预测的冠军球队并投入积分，猜中按支持率倍数返还积分" },
                      { t: "点球挑战", d: "每日5次免费机会，进球得50积分，连续进球有额外奖励" },
                      { t: "积分排行", d: "活动期间累计积分，Top10 获得决赛门票、签名球衣等实物大奖" },
                      { t: "奖励发放", d: "活动结束后7个工作日内，通过站内信通知获奖者并发放奖品" },
                    ].map((r) => (
                      <div key={r.t} style={{ marginBottom: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,.03)", border: `1px solid ${t.dimB}` }}>
                        <div style={{ fontWeight: 700, color: t.green, marginBottom: 2, fontSize: 13 }}>{r.t}</div>
                        <div style={{ color: t.textSub }}>{r.d}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setModal(null)}
                    className="tap-scale"
                    style={{
                      width: "100%",
                      marginTop: 16,
                      padding: "12px 0",
                      borderRadius: 30,
                      background: `linear-gradient(135deg,${t.green},${t.blue})`,
                      border: "none",
                      fontSize: 14,
                      fontWeight: 900,
                      fontFamily: "'Oswald',sans-serif",
                      color: "#0A1F1A",
                      cursor: "pointer",
                      letterSpacing: 1,
                    }}
                  >
                    我知道了
                  </button>
                </>
              )}

              {/* ---- 我的奖品弹窗 ---- */}
              {modal === "prizes" && (
                <>
                  <div style={{ textAlign: "center", marginBottom: 18 }}>
                    <div style={{ fontSize: 32, marginBottom: 4 }}>🏆</div>
                    <div style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Oswald',sans-serif", letterSpacing: 1 }}>
                      我的奖品
                    </div>
                    <div style={{ fontSize: 11, color: t.textSub, marginTop: 4 }}>
                      当前积分: <span style={{ color: t.gold, fontWeight: 700 }}>2,480</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { name: "决赛门票", icon: "🎟️", status: "待揭晓", statusColor: t.blue },
                      { name: "球星球衣", icon: "👕", status: "未获得", statusColor: t.textSub },
                      { name: "积分大礼包", icon: "💰", status: "已获得", statusColor: t.green },
                    ].map((p) => (
                      <div
                        key={p.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "14px 16px",
                          borderRadius: 14,
                          background: "rgba(255,255,255,.03)",
                          border: `1px solid ${t.dimB}`,
                        }}
                      >
                        <span style={{ fontSize: 28 }}>{p.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: p.statusColor, fontWeight: 700 }}>{p.status}</div>
                        </div>
                        <span style={{ fontSize: 18, color: t.textSub }}>›</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setModal(null)}
                    className="tap-scale"
                    style={{
                      width: "100%",
                      marginTop: 16,
                      padding: "12px 0",
                      borderRadius: 30,
                      background: t.dim,
                      border: `1px solid ${t.dimB}`,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    关闭
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
