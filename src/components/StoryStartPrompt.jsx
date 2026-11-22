"use client";

import { useGame } from "@/store/gameStore";

export default function StoryStartPrompt() {
  const startOver = useGame((s) => s.startStoryFromBeginning);
  const startMonthOne = useGame((s) => s.startStoryAtMonthOne);

  return (
    <div
      className="animate-fade fixed inset-0 z-50 flex items-center justify-center bg-[#0b0712]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-start-title"
    >
      <div className="animate-pop w-full max-w-sm rounded-xl border border-pink-200/30 bg-[#1b1329] p-6 text-center shadow-xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-pink-300">
          Story Mode
        </p>
        <h2
          id="story-start-title"
          className="mt-3 text-lg font-semibold text-pink-50"
        >
          Where would you like to start?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-pink-100/70">
          Month 1 is open now. Start over from the very beginning, or head to
          the Month 1 gate with Tom.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            autoFocus
            type="button"
            onClick={startOver}
            className="rounded-lg bg-pink-200 px-4 py-3 font-semibold text-[#2a1630] transition hover:bg-pink-100"
          >
            Start over
          </button>
          <button
            type="button"
            onClick={startMonthOne}
            className="rounded-lg border border-pink-200/40 px-4 py-3 font-semibold text-pink-100 transition hover:bg-white/10"
          >
            Proceed to Month 1
          </button>
        </div>
      </div>
    </div>
  );
}
