import { create } from "zustand";

export const useGame = create((set, get) => ({
  started: false,
  scene: "hub",
  recruited: false,
  musicOn: false,
  dialogue: null,
  modal: null,

  startGame: () => set({ started: true }),

  setScene: (scene) => set({ scene }),

  toggleMusic: () => set((s) => ({ musicOn: !s.musicOn })),

  startDialogue: ({ speaker, lines, after = null }) =>
    set({ dialogue: { speaker, lines, index: 0, after } }),

  advanceDialogue: () => {
    const d = get().dialogue;
    if (!d) return;
    if (d.index < d.lines.length - 1) {
      set({ dialogue: { ...d, index: d.index + 1 } });
      return;
    }
    set({ dialogue: null });
    if (d.after === "recruit") set({ recruited: true });
  },

  openMemory: (memory) => set({ modal: memory }),
  closeModal: () => set({ modal: null }),
}));
