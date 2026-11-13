"use client";

import { useGame } from "@/store/gameStore";

export default function DialogueBox({ dialogue }) {
  const advanceDialogue = useGame((s) => s.advanceDialogue);
  const last = dialogue.index === dialogue.lines.length - 1;

  return (
    <div className="absolute inset-x-2 bottom-2 z-40 sm:inset-x-4 sm:bottom-4">
      <button
        type="button"
        onClick={advanceDialogue}
        className="animate-pop block w-full rounded-xl border border-pink-200/30 bg-[#1b1329]/95 p-4 text-left shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur sm:p-5"
      >
        <span className="mb-1 flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pink-300 sm:text-xs">
            {dialogue.speaker}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-pink-200/40 sm:text-[10px]">
            {last ? "E / tap to close" : "E / tap to continue"}
          </span>
        </span>
        <span className="block min-h-12 text-sm leading-relaxed text-pink-50 sm:min-h-14 sm:text-base">
          {dialogue.lines[dialogue.index]}
        </span>
        <span className="mt-2 flex justify-end">
          <span className="animate-pulse text-pink-300">▼</span>
        </span>
      </button>
    </div>
  );
}
