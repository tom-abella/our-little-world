"use client";

import Image from "next/image";
import { useState } from "react";
import { useGame } from "@/store/gameStore";

export default function MemoryModal({ memory }) {
  const closeModal = useGame((s) => s.closeModal);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="animate-fade fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0b0712]/80 p-4 backdrop-blur-sm"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-label={memory.title}
    >
      <div
        className="animate-pop relative w-full max-w-sm bg-[#fdf7ec] p-3 pb-5 shadow-[0_30px_80px_rgba(0,0,0,0.65)] sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close memory"
          className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#fdf7ec] bg-[#2a1d38] text-lg leading-none text-pink-100 transition hover:bg-[#3d2a52]"
        >
          ×
        </button>

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#f6b7cd] via-[#c98bb0] to-[#7d5a8f]">
          {!failed ? (
            <Image
              src={memory.imageUrl}
              alt={memory.title}
              fill
              sizes="(max-width: 640px) 90vw, 420px"
              className="object-cover"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
              <svg
                viewBox="0 0 24 24"
                className="h-12 w-12 text-white/80"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.4 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9Z" />
              </svg>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/90">
                Your photo goes here
              </p>
              <p className="break-all font-mono text-[9px] text-white/60">
                {memory.imageUrl}
              </p>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </div>

        <div className="px-1 pt-4">
          <h2 className="font-serif text-2xl italic text-[#372a3d]">
            {memory.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5d4d63]">
            {memory.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
