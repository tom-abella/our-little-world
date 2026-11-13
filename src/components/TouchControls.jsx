"use client";

import { useSyncExternalStore } from "react";
import { useGame } from "@/store/gameStore";
import { pressInteract, setKey } from "@/game/input";

const BTN =
  "flex touch-none select-none items-center justify-center rounded-lg border border-white/20 bg-[#1b1329]/70 text-base text-pink-100 backdrop-blur transition active:bg-pink-300/40 active:text-white";

function hold(code) {
  return {
    onPointerDown: (e) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      setKey(code, true);
    },
    onPointerUp: () => setKey(code, false),
    onPointerCancel: () => setKey(code, false),
    onLostPointerCapture: () => setKey(code, false),
    onContextMenu: (e) => e.preventDefault(),
  };
}

export default function TouchControls() {
  const touch = useSyncExternalStore(
    () => () => {},
    () =>
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0,
    () => false,
  );
  const paused = useGame((s) => Boolean(s.dialogue || s.modal));

  if (!touch || paused) return null;

  return (
    <>
      <div className="absolute bottom-3 left-3 z-30 grid h-28 w-28 grid-cols-3 grid-rows-3 gap-1 opacity-90">
        <span />
        <button type="button" aria-label="Move up" className={BTN} {...hold("ArrowUp")}>
          ▲
        </button>
        <span />
        <button type="button" aria-label="Move left" className={BTN} {...hold("ArrowLeft")}>
          ◀
        </button>
        <span className="flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-pink-200/30" />
        </span>
        <button type="button" aria-label="Move right" className={BTN} {...hold("ArrowRight")}>
          ▶
        </button>
        <span />
        <button type="button" aria-label="Move down" className={BTN} {...hold("ArrowDown")}>
          ▼
        </button>
        <span />
      </div>

      <button
        type="button"
        aria-label="Interact"
        onPointerDown={(e) => {
          e.preventDefault();
          pressInteract();
        }}
        className="absolute bottom-4 right-4 z-30 flex h-16 w-16 touch-none select-none flex-col items-center justify-center gap-1 rounded-full border-2 border-pink-200/40 bg-[#1b1329]/80 text-pink-100 backdrop-blur transition active:scale-95 active:bg-pink-300/40"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.4 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9Z" />
        </svg>
        <span className="font-mono text-[9px] uppercase tracking-widest">
          Interact
        </span>
      </button>
    </>
  );
}
