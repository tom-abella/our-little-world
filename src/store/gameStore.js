import { create } from "zustand";
import { STAGES, isStageUnlocked, formatUnlockDate } from "@/data/stages";

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
  monthOneClosing: false,
  pendingMonthOneClosing: false,
  musicOn: true,
  dialogue: null,
  modal: null,
  choosingSheriden: false,
  sheridenMemoryDone: false,

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
  goToMonthOne: () => {
    const monthOne = STAGES.find((stage) => stage.id === 1);
    if (!monthOne || !isStageUnlocked(monthOne)) {
      // Month 1 is locked: stop the guided tour and let Micah roam.
      // storyMode stays true so the guided month starts when the gate opens.
      set({
        monthOnePrompt: false,
        pendingContinuePrompt: false,
        monthOneInvited: false,
        scene: "hub",
        tourStage: "done",
        dialogue: {
          speaker: "Tom",
          lines: [
            {
              speaker: "Tom",
              text: `Month 1 isn't open yet, babe. It opens on ${monthOne ? formatUnlockDate(monthOne.unlockDate) : "a later date"}.`,
            },
            {
              speaker: "Micah",
              text: "Okay. Let's just roam around for now.",
            },
          ],
          index: 0,
          after: null,
          afterMemory: null,
        },
      });
      return;
    }

    set({
      monthOnePrompt: false,
      pendingContinuePrompt: false,
      monthOneInvited: true,
      scene: "hub",
      tourStage: "lead-month-one",
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
    });
  },
  startMonthOneTour: () => set({ monthOneStep: 0, monthOnePhase: "lead" }),
  setMonthOneProgress: (monthOneStep, monthOnePhase) =>
    set({ monthOneStep, monthOnePhase }),
  queueMonthOneClosing: () => set({ pendingMonthOneClosing: true }),
  dismissMonthOneClosing: () => set({ monthOneClosing: false }),
  setChoosingSheriden: (choosingSheriden) => set({ choosingSheriden }),
  markSheridenMemoryDone: () => set({ sheridenMemoryDone: true }),
  resetSheridenMemoryDone: () => set({ sheridenMemoryDone: false }),

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
      monthOneClosing: state.monthOneClosing || state.pendingMonthOneClosing,
      pendingMonthOneClosing: false,
    })),
}));
