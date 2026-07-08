"use client";

import { useState } from "react";
import { BottomBar } from "@/app/worldcup/_components/sections/BottomBar";
import { Hero } from "@/app/worldcup/_components/sections/Hero";
import { Leaderboard } from "@/app/worldcup/_components/sections/Leaderboard";
import { MatchSection } from "@/app/worldcup/_components/sections/MatchSection";
import { PenaltyGame } from "@/app/worldcup/_components/sections/PenaltyGame";
import { PlayerBoard } from "@/app/worldcup/_components/sections/PlayerBoard";
import { PredictSection } from "@/app/worldcup/_components/sections/PredictSection";
import { PrizeCarousel } from "@/app/worldcup/_components/sections/PrizeCarousel";
import { TaskSection } from "@/app/worldcup/_components/sections/TaskSection";
import { TopBar } from "@/app/worldcup/_components/sections/TopBar";
import { BetModal } from "@/app/worldcup/_components/modals/BetModal";
import { ModalShell } from "@/app/worldcup/_components/modals/ModalShell";
import { PrizesModal } from "@/app/worldcup/_components/modals/PrizesModal";
import { RulesModal } from "@/app/worldcup/_components/modals/RulesModal";

import type { ModalType } from "@/app/worldcup/lib/types";

export function WorldCupClient() {
  const [modal, setModal] = useState<ModalType | null>(null);

  const openModal = (type: ModalType) => setModal(type);
  const closeModal = () => setModal(null);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[375px] overflow-x-hidden bg-gradient-to-b from-[#0A1F1A] to-[#0B1026] pb-24 text-white">
      <TopBar onOpenModal={openModal} />
      <Hero onOpenModal={openModal} />
      <div className="flex flex-col gap-8 py-4">
        <MatchSection />
        <PlayerBoard />
        <PredictSection />
        <PrizeCarousel />
        <PenaltyGame />
        <Leaderboard />
        <TaskSection />
      </div>
      <BottomBar onOpenModal={openModal} />

      {modal && (
        <ModalShell onClose={closeModal}>
          {modal === "bet" && <BetModal onClose={closeModal} />}
          {modal === "rules" && <RulesModal onClose={closeModal} />}
          {modal === "prizes" && <PrizesModal onClose={closeModal} />}
        </ModalShell>
      )}
    </div>
  );
}
