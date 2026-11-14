"use client";

import { useGame } from "@/store/gameStore";

export default function StoryModePrompt() {
  const startStory = useGame((s) => s.startStoryMode);
  const startFree = useGame((s) => s.startFreeMode);

  return (
    <div
      className="animate-fade fixed inset-0 z-50 flex items-center justify-center bg-[#0b0712]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-mode-title"
    >
      <div className="animate-pop w-full max-w-sm rounded-xl border border-pink-200/30 bg-[#1b1329] p-6 text-center shadow-xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-pink-300">
          Before we begin
        </p>
        <h2 id="story-mode-title" className="mt-3 text-lg font-semibold text-pink-50">
          Go with Story Mode?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-pink-100/70">
          Let Tom guide you through your memories, one stop at a time.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            autoFocus
            type="button"
            onClick={startStory}
            className="rounded-lg bg-pink-200 px-4 py-3 font-semibold text-[#2a1630] transition hover:bg-pink-100"
          >
            Yes, follow Tom
          </button>
          <button
            type="button"
            onClick={startFree}
            className="rounded-lg border border-pink-200/40 px-4 py-3 font-semibold text-pink-100 transition hover:bg-white/10"
          >
            No, free roam
          </button>
        </div>
      </div>
    </div>
  );
}
