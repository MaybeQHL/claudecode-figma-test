"use client";

import type { ReactNode } from "react";

type ModalShellProps = {
  onClose: () => void;
  children: ReactNode;
};

export function ModalShell({ onClose, children }: ModalShellProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/72 p-5 backdrop-blur-sm animate-modal-bg-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-[340px] overflow-y-auto rounded-[22px] border border-neon/20 bg-gradient-to-b from-[#111d2e] to-[#0d1928] p-6 shadow-[0_0_60px_rgba(0,255,135,0.18)] animate-modal-in"
      >
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-3.5 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base text-white active:scale-90"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
