// Month 1 tour order. Coordinates are Tom's waiting spots.
export const MONTH_ONE_TOUR = [
  { memoryId: "mem-1-1", tom: { x: 230, y: 300 } },
  { memoryId: "mem-1-3", tom: { x: 400, y: 390 } },
  { memoryId: "mem-1-4", tom: { x: 600, y: 220 } },
  { memoryId: "mem-1-2", tom: { x: 780, y: 300 } },
  { memoryId: "mem-1-facetime", tom: { x: 980, y: 300 } },
  { memoryId: "mem-1-5", tom: { x: 1165, y: 230 } },
  { memoryId: "mem-1-flowers", tom: { x: 1040, y: 490 } },
  { kind: "sheriden-lobby", tom: { x: 1165, y: 480 } },
  { kind: "sheriden-roof", tom: { x: 1165, y: 480 } },
  { memoryId: "mem-1-6", tom: { x: 650, y: 380 } },
];

// Derived step numbers so adding/moving a stop cannot silently break the
// lobby -> city view -> final memory progression.
export const MONTH_ONE_STEP = {
  sundo: MONTH_ONE_TOUR.findIndex((stop) => stop.memoryId === "mem-1-5"),
  flowers: MONTH_ONE_TOUR.findIndex(
    (stop) => stop.memoryId === "mem-1-flowers",
  ),
  lobby: MONTH_ONE_TOUR.findIndex((stop) => stop.kind === "sheriden-lobby"),
  roof: MONTH_ONE_TOUR.findIndex((stop) => stop.kind === "sheriden-roof"),
  final: MONTH_ONE_TOUR.length - 1,
};
