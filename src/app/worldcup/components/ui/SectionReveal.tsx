"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { sectionReveal, viewportOnce } from "@/app/worldcup/lib/motion";

export function SectionReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </motion.section>
  );
}
