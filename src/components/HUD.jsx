"use client";

import { useEffect } from "react";
import { useGame } from "@/store/gameStore";
import { STAGES } from "@/data/stages";
import { mapForScene } from "@/game/maps";
import { startMusic, stopMusic } from "@/lib/music";

export default function HUD() {
  const scene = useGame((s) => s.scene);
  const recruited = useGame((s) => s.recruited);
  const musicOn = useGame((s) => s.musicOn);
  const toggleMusic = useGame((s) => s.toggleMusic);

  const stage = scene === "hub" ? null : STAGES.find((s) => s.id === scene);
  const title = stage ? stage.title : mapForScene(scene).title || "Our Little World";
  const subtitle =
    scene === "hub"
      ? recruited
        ? "Tom is walking with you"
        : "Find Tom by the gates"
      : "Collect the memories, then head home";

  useEffect(() => () => stopMusic(), []);

  const onMusic = () => {
    if (musicOn) stopMusic();
    else startMusic();
    toggleMusic();
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="truncate text-sm font-bold uppercase tracking-[0.2em] text-pink-100 sm:text-base">
          {title}
        </h1>
        <p className="truncate text-[10px] tracking-wide text-pink-200/60 sm:text-xs">
          {subtitle}
        </p>
      </div>
      <button
        type="button"
        onClick={onMusic}
        aria-pressed={musicOn}
        className="flex shrink-0 items-center gap-2 rounded-full border border-pink-200/20 bg-white/5 px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-pink-100 transition hover:border-pink-200/50 hover:bg-white/10 sm:text-xs"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {musicOn ? (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </>
          ) : (
            <path d="M16 9l5 6M21 9l-5 6" />
          )}
        </svg>
        {musicOn ? "Music on" : "Music off"}
      </button>
    </div>
  );
}
