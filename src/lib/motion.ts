import type { Variants } from "framer-motion";

// 通用缓动
export const easeOut = [0.22, 1, 0.36, 1] as const;

// 区块入场：滚动进入视口时从下淡入上移 + 轻微缩放
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: easeOut },
  },
};

// 子元素错位入场
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

// 视口配置
export const viewportOnce = { once: true, amount: 0.2 } as const;
