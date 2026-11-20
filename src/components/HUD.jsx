"use client";

import { useEffect } from "react";
import { useGame } from "@/store/gameStore";
import { STAGES } from "@/data/stages";
import { mapForScene } from "@/game/maps";
import { MONTH_ONE_TOUR } from "@/data/tours";
import { startMusic, stopMusic } from "@/lib/music";

const TOUR_HINTS = {
  "lead-coffee": "Follow Tom to BOS Coffee",
  "at-coffee": "Order at BOS Coffee",
  "lead-pasalubong": "Follow Tom to Pasalubong",
  "at-pasalubong": "Browse the Pasalubong shop",
  "lead-souvenirs": "Follow Tom to Souvenirs",
  "at-souvenirs": "Browse the Souvenirs shop",
  "lead-prologue": "Follow Tom to the Prologue",
  "at-prologue": "Enter the Prologue with Tom",
  "lead-month-one": "Follow Tom to the Month 1 gate",
  "at-month-one": "Enter Month 1 with Tom",
};

export default function HUD() {
  const scene = useGame((s) => s.scene);
  const recruited = useGame((s) => s.recruited);
  const tourStage = useGame((s) => s.tourStage);
  const prologueStep = useGame((s) => s.prologueStep);
  const prologuePhase = useGame((s) => s.prologuePhase);
  const monthOneInvited = useGame((s) => s.monthOneInvited);
  const monthOneStep = useGame((s) => s.monthOneStep);
  const monthOnePhase = useGame((s) => s.monthOnePhase);
  const sheridenMemoryDone = useGame((s) => s.sheridenMemoryDone);
  const musicOn = useGame((s) => s.musicOn);
  const toggleMusic = useGame((s) => s.toggleMusic);

  const stage = scene === "hub" ? null : STAGES.find((s) => s.id === scene);
  const title = stage ? stage.title : mapForScene(scene).title || "Our Little World";
  const prologueMemories = STAGES.find((s) => s.id === 0)?.memories || [];
  const prologueMemory = prologueMemories[prologueStep];
  const monthOneMemories = STAGES.find((s) => s.id === 1)?.memories || [];
  const monthOneStop = MONTH_ONE_TOUR[monthOneStep];
  const monthOneTitle =
    monthOneStop?.memoryId
      ? monthOneMemories.find((m) => m.id === monthOneStop.memoryId)?.title
      : monthOneStop?.kind === "sheriden-lobby"
        ? "the Sheriden lobby"
        : monthOneStop?.kind === "sheriden-roof"
          ? "the Sheriden roof deck"
          : "memory";
  const subtitle =
    scene === "hub"
      ? tourStage === "meet"
        ? "Find Tom by the gates"
        : tourStage === "done"
          ? monthOneInvited
            ? "Head to the Month 1 gate"
            : recruited
              ? "Tom is walking with you"
              : "Find Tom by the gates"
          : TOUR_HINTS[tourStage] || "Follow Tom"
      : scene === 0 && prologuePhase === "lead"
        ? `Follow Tom to ${prologueMemory?.title || "memory"}`
        : scene === 0 && prologuePhase === "at"
          ? `Remember ${prologueMemory?.title || "memory"}`
          : scene === 0 && prologuePhase === "done"
            ? "Explore the memories, then head home"
            : scene === 1 && monthOnePhase === "lead"
              ? monthOneStep === 5
                ? "Go to Tom's house and ride the motorcycle"
                : monthOneStep === 6
                  ? "Riding with Tom to Sheriden Towers"
                  : `Follow Tom to ${monthOneTitle}`
              : scene === 1 && monthOnePhase === "at"
                ? monthOneStop?.kind
                  ? `Enter ${monthOneTitle}`
                  : `Remember ${monthOneTitle}`
                : scene === 1 && monthOnePhase === "done"
                  ? "Explore the month, then head home"
                  : (scene === "sheriden-lobby" || scene === "sheriden-roof") &&
                      monthOnePhase !== "done"
                    ? scene === "sheriden-lobby"
                      ? sheridenMemoryDone
                        ? "Follow Tom to the city view"
                        : "Remember our lobby memory"
                      : sheridenMemoryDone
                        ? "Follow Tom back to Month 1"
                        : "Remember the roof-deck memory"
                    : "Collect the memories, then head home";

  useEffect(() => {
    if (!musicOn) {
      stopMusic();
      return;
    }

    startMusic();
    const unlock = () => startMusic();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [musicOn]);

  useEffect(() => () => stopMusic(), []);

  const onMusic = toggleMusic;

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
