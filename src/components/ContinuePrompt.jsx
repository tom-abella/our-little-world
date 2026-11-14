"use client";

import { useGame } from "@/store/gameStore";

export default function ContinuePrompt() {
  const go = useGame((s) => s.goToMonthOne);
  const dismiss = useGame((s) => s.dismissMonthOnePrompt);

  return (
    <div
      className="animate-fade fixed inset-0 z-50 flex items-center justify-center bg-[#0b0712]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="continue-title"
    >
      <div className="animate-pop w-full max-w-sm rounded-xl border border-pink-200/30 bg-[#1b1329] p-6 text-center shadow-xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-pink-300">
          One more memory?
        </p>
        <h2 id="continue-title" className="mt-3 text-lg font-semibold text-pink-50">
          Continue to Month 1?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-pink-100/70">
          Tom wants to remember your first month together next.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            autoFocus
            type="button"
            onClick={go}
            className="rounded-lg bg-pink-200 px-4 py-3 font-semibold text-[#2a1630] transition hover:bg-pink-100"
          >
            Yes, let&apos;s go
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg border border-pink-200/40 px-4 py-3 font-semibold text-pink-100 transition hover:bg-white/10"
          >
            No, stay here
          </button>
        </div>
      </div>
    </div>
  );
}
