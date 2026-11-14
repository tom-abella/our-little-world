import { create } from "zustand";

export const useGame = create((set, get) => ({
  started: false,
  storyModePrompt: false,
  storyMode: true,
  scene: "hub",
  recruited: false,
  tourStage: "meet",
  prologueStep: 0,
  prologuePhase: "idle",
  monthOnePrompt: false,
  pendingContinuePrompt: false,
  monthOneInvited: false,
  monthOneStep: 0,
  monthOnePhase: "idle",
  musicOn: false,
  dialogue: null,
  modal: null,
  choosingSheriden: false,

  startGame: () => set({ started: true, storyModePrompt: true }),
  startStoryMode: () => set({ storyModePrompt: false, storyMode: true }),
  startFreeMode: () =>
    set({
      storyModePrompt: false,
      storyMode: false,
      recruited: true,
      tourStage: "done",
      prologueStep: 0,
      prologuePhase: "done",
      monthOneStep: 0,
      monthOnePhase: "done",
      monthOneInvited: false,
    }),

  setScene: (scene) => set({ scene }),
  setTourStage: (tourStage) => set({ tourStage }),
  startPrologueTour: () => set({ prologueStep: 0, prologuePhase: "lead" }),
  setPrologueProgress: (prologueStep, prologuePhase) =>
    set({ prologueStep, prologuePhase }),
  queueContinuePrompt: () => set({ pendingContinuePrompt: true }),
  dismissMonthOnePrompt: () => set({ monthOnePrompt: false }),
  goToMonthOne: () =>
    set({
      monthOnePrompt: false,
      pendingContinuePrompt: false,
      monthOneInvited: true,
      scene: "hub",
      dialogue: {
        speaker: "Tom",
        lines: [
          { speaker: "Tom", text: "That was our beginning, babe." },
          { speaker: "Micah", text: "I remember all of it." },
          {
            speaker: "Tom",
            text: "Now let's go to Month 1. I want to remember our first month with you.",
          },
        ],
        index: 0,
        after: null,
        afterMemory: null,
      },
    }),
  startMonthOneTour: () => set({ monthOneStep: 0, monthOnePhase: "lead" }),
  setMonthOneProgress: (monthOneStep, monthOnePhase) =>
    set({ monthOneStep, monthOnePhase }),
  setChoosingSheriden: (choosingSheriden) => set({ choosingSheriden }),

  toggleMusic: () => set((s) => ({ musicOn: !s.musicOn })),

  startDialogue: ({ speaker, lines, after = null, afterMemory = null }) =>
    set({ dialogue: { speaker, lines, index: 0, after, afterMemory } }),

  advanceDialogue: () => {
    const d = get().dialogue;
    if (!d) return;
    if (d.index < d.lines.length - 1) {
      set({ dialogue: { ...d, index: d.index + 1 } });
      return;
    }
    set({ dialogue: null });
    if (d.after === "recruit") set({ recruited: true });
    if (d.after === "startTour")
      set({ recruited: true, tourStage: "lead-coffee" });
    if (d.after === "enterPrologue")
      set({
        recruited: true,
        tourStage: "done",
        scene: 0,
        prologueStep: 0,
        prologuePhase: "lead",
      });
    if (d.after === "enterSheridenLobby") set({ scene: "sheriden-lobby" });
    if (d.after === "enterSheridenRoof") set({ scene: "sheriden-roof" });
    if (d.afterMemory) set({ modal: d.afterMemory });
  },

  openMemory: (memory) => set({ modal: memory }),
  closeModal: () =>
    set((state) => ({
      modal: null,
      monthOnePrompt: state.monthOnePrompt || state.pendingContinuePrompt,
      pendingContinuePrompt: false,
    })),
}));
