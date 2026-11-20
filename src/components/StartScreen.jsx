"use client";

import { useGame } from "@/store/gameStore";
import { unlockSfx } from "@/lib/sfx";
import { startMusic } from "@/lib/music";

export default function StartScreen() {
  const startGame = useGame((s) => s.startGame);

  const handleStart = () => {
    unlockSfx();
    startMusic();
    startGame();
  };

  return (
    <div className="animate-fade fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0c0813]/85 p-4 backdrop-blur-md">
      <div className="animate-pop relative w-full max-w-xl overflow-hidden rounded-3xl border border-pink-200/15 bg-gradient-to-b from-[#251a33]/95 to-[#150f1f]/95 p-8 text-center shadow-[0_40px_120px_rgba(230,110,170,0.25)] sm:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, rgba(214,116,166,0.22), transparent 45%), radial-gradient(circle at 85% 90%, rgba(120,110,220,0.2), transparent 45%)",
          }}
        />

        <div className="relative flex flex-col items-center">
          <svg
            viewBox="0 0 64 64"
            className="h-20 w-20 drop-shadow-[0_14px_30px_rgba(255,120,170,0.4)] sm:h-24 sm:w-24"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="intro-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2b1a3e" />
                <stop offset="1" stopColor="#120d1c" />
              </linearGradient>
              <linearGradient id="intro-heart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffb3d2" />
                <stop offset="1" stopColor="#d94f86" />
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="url(#intro-bg)" />
            <ellipse
              cx="32"
              cy="34"
              rx="25"
              ry="10"
              fill="none"
              stroke="#ffd3e5"
              strokeOpacity="0.35"
              strokeWidth="2"
              transform="rotate(-18 32 34)"
            />
            <path
              d="M32 51s-15.5-9.4-19.2-18.3C10.4 27.2 13.9 20 21 20c4.8 0 8.2 3 11 6.9C34.8 23 38.2 20 43 20c7.1 0 10.6 7.2 8.2 12.7C47.5 41.6 32 51 32 51Z"
              fill="url(#intro-heart)"
            />
            <path
              d="M22 27c1.8-2.7 4.6-3.4 7.2-3"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.55"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="49" cy="15" r="2" fill="#ffffff" opacity="0.8" />
            <circle cx="14" cy="17" r="1.4" fill="#ffffff" opacity="0.55" />
          </svg>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.35em] text-pink-300/80 sm:text-xs">
            Hi babe,
          </p>
          <h1 className="mt-3 text-2xl font-bold uppercase tracking-[0.12em] text-pink-50 sm:text-4xl">
            Welcome to our little world
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-pink-100/70 sm:text-base">
            I saved some of our favourite experiences in here — our firsts, our
            trips, and all the ordinary days that turned out to matter. Take a
            walk around and collect them.
          </p>

          <div className="my-6 h-px w-16 bg-pink-300/40" />

          <p className="font-serif text-2xl italic text-pink-200 sm:text-3xl">
            I love you.
          </p>

          <button
            type="button"
            autoFocus
            onClick={handleStart}
            className="mt-8 rounded-full bg-pink-200 px-10 py-3 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#2a1630] transition hover:bg-pink-100 hover:shadow-[0_0_30px_rgba(255,170,210,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#150f1f] active:scale-95 sm:text-sm"
          >
            Start
          </button>
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-pink-200/35 sm:text-[10px]">
            WASD / arrows to move · E to interact
          </p>
        </div>
      </div>
    </div>
  );
}
