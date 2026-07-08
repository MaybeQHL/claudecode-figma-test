"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

const colors = ["#ffd700", "#00ff87", "#00d2ff", "#ff6b35", "#ffffff"];

// 顶部持续飘落的彩带（轻度，间歇触发）
export function ConfettiRain() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const fire = () => {
      confetti({
        particleCount: 5,
        angle: 270,
        spread: 70,
        startVelocity: 25,
        gravity: 0.6,
        origin: { x: Math.random(), y: -0.1 },
        colors,
        scalar: 0.8,
        ticks: 300,
      });
      timer = setTimeout(fire, 700 + Math.random() * 800);
    };
    fire();
    return () => clearTimeout(timer);
  }, []);

  return null;
}
