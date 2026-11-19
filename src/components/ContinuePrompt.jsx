"use client";

import { useState } from "react";
import { useGame } from "@/store/gameStore";

export default function ContinuePrompt() {
  const go = useGame((s) => s.goToMonthOne);
  const dismiss = useGame((s) => s.dismissMonthOnePrompt);
  const [showBanner, setShowBanner] = useState(true);

  if (showBanner) {
    return (
      <div
        className="animate-fade fixed inset-0 z-50 flex items-center justify-center bg-[#0b0712]/80 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prologue-banner-title"
      >
        <div className="animate-pop w-full max-w-md overflow-hidden rounded-2xl border border-pink-200/30 bg-gradient-to-br from-[#302039] via-[#21172d] to-[#191329] p-7 text-center shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-10">
          <p aria-hidden="true" className="text-3xl text-pink-200">✦ ♡ ✦</p>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-pink-300">
            The prologue · complete
          </p>
          <h2 id="prologue-banner-title" className="mt-4 font-serif text-3xl italic leading-tight text-pink-50 sm:text-4xl">
            Every love story has a beginning.
          </h2>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-pink-100/75">
            Ours started with little moments that became everything. Thank you for making every one of them so special, babe.
          </p>
          <p className="mt-5 font-serif text-lg italic text-pink-200">And this is only the beginning. ♡</p>
          <button
            autoFocus
            type="button"
            onClick={() => setShowBanner(false)}
            className="mt-7 rounded-lg bg-pink-200 px-7 py-3 text-sm font-semibold text-[#2a1630] transition hover:bg-pink-100"
          >
            Continue our story
          </button>
        </div>
      </div>
    );
  }

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
