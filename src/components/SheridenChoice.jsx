"use client";

import { useEffect } from "react";
import { useGame } from "@/store/gameStore";

export default function SheridenChoice() {
  const choose = (scene) => {
    useGame.setState({ choosingSheriden: false, ...(scene ? { scene } : {}) });
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "1") choose("sheriden-lobby");
      if (event.key === "2") choose("sheriden-roof");
      if (event.key === "Escape") choose(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#100b1c]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="sheriden-title">
      <div className="w-full max-w-sm rounded-xl border border-pink-200/30 bg-[#1b1329] p-5 text-center shadow-xl">
        <p className="font-mono text-xs uppercase tracking-widest text-pink-300">Sheriden Towers · North Tower</p>
        <h2 id="sheriden-title" className="mt-3 text-lg font-semibold text-pink-50">Where would you like to go?</h2>
        <div className="mt-5 flex flex-col gap-2">
          <button autoFocus type="button" onClick={() => choose("sheriden-lobby")} className="rounded-lg bg-pink-200 px-4 py-3 font-semibold text-[#2a1630] hover:bg-pink-100">1 · Lobby</button>
          <button type="button" onClick={() => choose("sheriden-roof")} className="rounded-lg border border-pink-200/40 px-4 py-3 font-semibold text-pink-100 hover:bg-white/10">2 · Roof deck</button>
          <button type="button" onClick={() => choose(null)} className="px-4 py-2 text-sm text-pink-200/70 hover:text-white">Go back</button>
        </div>
      </div>
    </div>
  );
}
