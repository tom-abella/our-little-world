"use client";

import GameCanvas from "@/game/GameCanvas";
import HUD from "@/components/HUD";
import DialogueBox from "@/components/DialogueBox";
import MemoryModal from "@/components/MemoryModal";
import StartScreen from "@/components/StartScreen";
import ContinuePrompt from "@/components/ContinuePrompt";
import MonthOneClosing from "@/components/MonthOneClosing";
import StoryModePrompt from "@/components/StoryModePrompt";
import SheridenChoice from "@/components/SheridenChoice";
import TouchControls from "@/components/TouchControls";
import { useGame } from "@/store/gameStore";

export default function Home() {
  const started = useGame((s) => s.started);
  const dialogue = useGame((s) => s.dialogue);
  const modal = useGame((s) => s.modal);
  const choosingSheriden = useGame((s) => s.choosingSheriden);
  const monthOnePrompt = useGame((s) => s.monthOnePrompt);
  const monthOneClosing = useGame((s) => s.monthOneClosing);
  const storyModePrompt = useGame((s) => s.storyModePrompt);

  return (
    <main className="no-select relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#120d1c] px-3 py-4 sm:px-6 sm:py-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, rgba(214,116,166,0.18), transparent 40%), radial-gradient(circle at 82% 78%, rgba(120,110,220,0.16), transparent 45%), radial-gradient(circle at 50% 50%, rgba(255,190,220,0.05), transparent 60%)",
        }}
      />

      <div className="relative w-full max-w-5xl">
        <HUD />

        <div className="no-select relative mt-3 overflow-hidden rounded-2xl border-4 border-[#3a2b4a] bg-[#1a1424] shadow-[0_25px_70px_-20px_rgba(240,120,180,0.4)]">
          <GameCanvas />
          {dialogue && <DialogueBox dialogue={dialogue} />}
          {choosingSheriden && <SheridenChoice />}
          <TouchControls />
        </div>

        <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-pink-200/35 sm:text-[10px]">
          WASD / arrows to move · E to interact · find every memory
        </p>
      </div>

      {modal && <MemoryModal memory={modal} />}
      {monthOnePrompt && <ContinuePrompt />}
      {monthOneClosing && <MonthOneClosing />}
      {storyModePrompt && <StoryModePrompt />}
      {!started && <StartScreen />}
    </main>
  );
}
