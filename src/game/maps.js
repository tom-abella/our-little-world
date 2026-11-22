import { STAGES } from "@/data/stages";
import { SHERIDEN_MEMORIES } from "@/data/sheriden";
import { HUB_COFFEE_MEMORY } from "@/data/hub";

export const WORLD_W = 960;
export const WORLD_H = 576;
export const WALL = 24;

const border = (w = WORLD_W, h = WORLD_H) => [
  { x: 0, y: 0, w, h: WALL },
  { x: 0, y: h - WALL, w, h: WALL },
  { x: 0, y: 0, w: WALL, h },
  { x: w - WALL, y: 0, w: WALL, h },
];

const HUB_W = 1280;

export const HUB = {
  type: "airport",
  width: HUB_W,
  spawn: { x: 640, y: 460 },
  npc: { x: 640, y: 300 },
  portals: [
    { stageId: 0, x: 240, y: 112 },
    { stageId: 1, x: 500, y: 112 },
    { stageId: 2, x: 760, y: 112 },
    { stageId: 3, x: 1020, y: 112 },
  ],
  props: [
    { type: "bos-coffee", x: 1110, y: 390, w: 130, h: 80, label: "BOS COFFEE", memory: HUB_COFFEE_MEMORY },
    { type: "desk", x: 285, y: 390, w: 190, h: 80 },
    { type: "seat", x: 798, y: 400, w: 210, h: 46 },
    { type: "seat", x: 798, y: 466, w: 210, h: 46 },
    { type: "shop", x: 276, y: 230, w: 190, h: 110, label: "PASALUBONG", accent: "#c86a5a" },
    { type: "shop", x: 796, y: 230, w: 190, h: 110, label: "SOUVENIRS", accent: "#4f8a7b" },
    { type: "luggage", x: 60, y: 450, w: 78, h: 52 },
    { type: "plant", x: 160, y: 430, w: 46, h: 46 },
  ],
  solids: [
    ...border(HUB_W),
    { x: 0, y: 510, w: HUB_W, h: 42 },
    { x: 1110, y: 390, w: 130, h: 80 },
    { x: 285, y: 390, w: 190, h: 80 },
    { x: 798, y: 400, w: 210, h: 46 },
    { x: 798, y: 466, w: 210, h: 46 },
    { x: 276, y: 230, w: 190, h: 110 },
    { x: 796, y: 230, w: 190, h: 110 },
    { x: 60, y: 450, w: 78, h: 52 },
    { x: 160, y: 430, w: 46, h: 46 },
    { x: 206, y: 40, w: 68, h: 110 },
    { x: 466, y: 40, w: 68, h: 110 },
    { x: 726, y: 40, w: 68, h: 110 },
    { x: 986, y: 40, w: 68, h: 110 },
  ],
};

const cafe = {
  type: "cafe",
  spawn: { x: 480, y: 470 },
  exit: { x: 480, y: 534 },
  props: [
    { type: "counter", x: 110, y: 70, w: 320, h: 88 },
    { type: "display", x: 700, y: 78, w: 150, h: 76 },
    { type: "table", x: 160, y: 250, w: 120, h: 84 },
    { type: "table", x: 620, y: 250, w: 130, h: 84 },
    { type: "table", x: 340, y: 360, w: 120, h: 78 },
    { type: "table", x: 760, y: 400, w: 110, h: 78 },
    { type: "plant", x: 58, y: 474, w: 50, h: 50 },
    { type: "plant", x: 856, y: 474, w: 50, h: 50 },
  ],
  solids: [
    ...border(),
    { x: 110, y: 70, w: 320, h: 88 },
    { x: 700, y: 78, w: 150, h: 76 },
    { x: 160, y: 250, w: 120, h: 84 },
    { x: 620, y: 250, w: 130, h: 84 },
    { x: 340, y: 360, w: 120, h: 78 },
    { x: 760, y: 400, w: 110, h: 78 },
    { x: 58, y: 474, w: 50, h: 50 },
    { x: 856, y: 474, w: 50, h: 50 },
  ],
};

const park = {
  type: "park",
  spawn: { x: 480, y: 470 },
  exit: { x: 480, y: 534 },
  props: [
    { type: "pond", x: 580, y: 220, w: 210, h: 130 },
    { type: "bench", x: 290, y: 300, w: 130, h: 34 },
    { type: "tree", x: 140, y: 170, w: 36, h: 26 },
    { type: "tree", x: 280, y: 110, w: 36, h: 26 },
    { type: "tree", x: 800, y: 110, w: 36, h: 26 },
    { type: "tree", x: 130, y: 430, w: 36, h: 26 },
    { type: "tree", x: 840, y: 460, w: 36, h: 26 },
    { type: "tree", x: 520, y: 110, w: 36, h: 26 },
  ],
  solids: [
    ...border(),
    { x: 580, y: 220, w: 210, h: 130 },
    { x: 290, y: 300, w: 130, h: 34 },
    { x: 124, y: 162, w: 36, h: 26 },
    { x: 264, y: 102, w: 36, h: 26 },
    { x: 784, y: 102, w: 36, h: 26 },
    { x: 114, y: 422, w: 36, h: 26 },
    { x: 824, y: 452, w: 36, h: 26 },
    { x: 504, y: 102, w: 36, h: 26 },
  ],
};

const night = {
  type: "night",
  spawn: { x: 480, y: 470 },
  exit: { x: 480, y: 534 },
  props: [
    { type: "car", x: 350, y: 200, w: 220, h: 120 },
    { type: "streetlight", x: 150, y: 150, w: 14, h: 14 },
    { type: "streetlight", x: 800, y: 150, w: 14, h: 14 },
    { type: "boulder", x: 680, y: 420, w: 90, h: 60 },
  ],
  solids: [
    ...border(),
    { x: 365, y: 215, w: 190, h: 90 },
    { x: 143, y: 143, w: 14, h: 14 },
    { x: 793, y: 143, w: 14, h: 14 },
    { x: 680, y: 420, w: 90, h: 60 },
  ],
};

const greenfield = {
  type: "greenfield",
  spawn: { x: 480, y: 470 },
  exit: { x: 480, y: 534 },
  props: [
    { type: "sidewalk", x: 520, y: 320, w: 180, h: 60 },
    { type: "phone", x: 436, y: 430, w: 28, h: 40 },
    { type: "cafe", x: 60, y: 40, w: 260, h: 130 },
    { type: "cinema", x: 380, y: 40, w: 220, h: 130 },
    { type: "apartment", x: 700, y: 40, w: 200, h: 130 },
    { type: "samgyupsal", x: 60, y: 400, w: 190, h: 105 },
    { type: "megamall", x: 700, y: 380, w: 220, h: 130 },
    { type: "tree", x: 60, y: 300, w: 36, h: 26 },
    { type: "tree", x: 860, y: 300, w: 36, h: 26 },
  ],
  solids: [
    ...border(),
    { x: 60, y: 40, w: 260, h: 130 },
    { x: 380, y: 40, w: 220, h: 130 },
    { x: 700, y: 40, w: 200, h: 130 },
    { x: 60, y: 400, w: 190, h: 105 },
    { x: 700, y: 380, w: 220, h: 130 },
    { x: 44, y: 292, w: 36, h: 26 },
    { x: 844, y: 292, w: 36, h: 26 },
  ],
};

const baguio = {
  type: "greenfield",
  width: 1280,
  spawn: { x: 600, y: 470 },
  exit: { x: 640, y: 534 },
  bike: { x: 330, y: 480, dir: "right" },
  sheridenEntrance: { x: 1165, y: 474 },
  props: [
    { type: "mountain", x: 24, y: 24, w: 1232, h: 150 },
    { type: "sign", x: 140, y: 180, w: 150, h: 66, label: "BAGUIO" },
    { type: "pine", x: 80, y: 330, w: 36, h: 26 },
    { type: "pine", x: 380, y: 250, w: 36, h: 26 },
    { type: "house", x: 90, y: 390, w: 170, h: 115, label: "TOM'S HOUSE", sublabel: "CALOOCAN CITY" },
    { type: "cafe", x: 500, y: 40, w: 210, h: 130 },
    { type: "photobooth", x: 450, y: 340, w: 110, h: 120 },
    { type: "bench", x: 700, y: 330, w: 130, h: 32 },
    { type: "megamall", x: 830, y: 40, w: 230, h: 130, label: "MALL" },
    { type: "studio", x: 1080, y: 40, w: 170, h: 130 },
    { type: "condo", x: 1080, y: 250, w: 170, h: 220 },
    { type: "videocall", x: 900, y: 330, w: 160, h: 130 },
  ],
  solids: [
    ...border(1280),
    { x: 64, y: 322, w: 36, h: 26 },
    { x: 364, y: 242, w: 36, h: 26 },
    { x: 90, y: 390, w: 170, h: 115 },
    { x: 500, y: 40, w: 210, h: 130 },
    { x: 450, y: 340, w: 110, h: 120 },
    { x: 700, y: 330, w: 130, h: 32 },
    { x: 830, y: 40, w: 230, h: 130 },
    { x: 1080, y: 40, w: 170, h: 130 },
    { x: 1080, y: 250, w: 170, h: 220 },
    { x: 900, y: 330, w: 160, h: 130 },
  ],
};

export const STAGE_MAPS = { cafe, park, night, greenfield, baguio };

export const LOBBY_GROUPS = [
  { x: 300, y: 100 },
  { x: 550, y: 200 },
  { x: 360, y: 325 },
  { x: 730, y: 350 },
];

const SHERIDEN_ROOMS = {
  "sheriden-lobby": {
    type: "sheriden-lobby",
    title: "Sheriden Towers: Lobby",
    spawn: { x: 480, y: 440 },
    exit: { x: 480, y: 534 },
    exitLabel: "Back to Month 1",
    returnScene: 1,
    memories: [SHERIDEN_MEMORIES.lobby],
    props: [
      { type: "seesaw", x: 44, y: 223, w: 145, h: 32 },
      { type: "lobby-memory-sofa", x: 490, y: 172, w: 120, h: 26 },
    ],
    solids: [
      ...border(),
      { x: 700, y: 65, w: 200, h: 120 },
      { x: 60, y: 360, w: 200, h: 120 },
      { x: 44, y: 223, w: 145, h: 32 },
      ...LOBBY_GROUPS.flatMap(({ x, y }) => [
        { x: x - 60, y: y - 28, w: 120, h: 26 },
        { x: x - 36, y: y + 12, w: 72, h: 38 },
        { x: x - 76, y: y + 15, w: 26, h: 34 },
        { x: x + 50, y: y + 15, w: 26, h: 34 },
      ]),
    ],
  },
  "sheriden-roof": {
    type: "sheriden-roof",
    title: "Sheriden Towers: Roof Deck",
    spawn: { x: 480, y: 440 },
    exit: { x: 480, y: 534 },
    exitLabel: "Back to Month 1",
    returnScene: 1,
    memories: [SHERIDEN_MEMORIES.roof],
    props: [
      { type: "sari-sari", x: 400, y: 195, w: 160, h: 85 },
      { type: "roof-seating", x: 640, y: 320 },
      { type: "roof-tree", x: 250, y: 145 },
      { type: "roof-tree", x: 780, y: 145 },
      { type: "roof-tree", x: 170, y: 410 },
      { type: "roof-tree", x: 790, y: 410 },
    ],
    solids: [
      ...border(),
      { x: 104, y: 105, w: 752, h: 5 },
      { x: 104, y: 105, w: 5, h: 366 },
      { x: 851, y: 105, w: 5, h: 366 },
      { x: 104, y: 466, w: 326, h: 5 },
      { x: 530, y: 466, w: 326, h: 5 },
      { x: 400, y: 195, w: 160, h: 85 },
      { x: 606, y: 296, w: 68, h: 48 },
      { x: 575, y: 307, w: 24, h: 26 },
      { x: 681, y: 307, w: 24, h: 26 },
      { x: 627, y: 270, w: 26, h: 20 },
      { x: 627, y: 350, w: 26, h: 20 },
      ...[{ x: 250, y: 145 }, { x: 780, y: 145 }, { x: 170, y: 410 }, { x: 790, y: 410 }].map(({ x, y }) => ({ x: x - 14, y: y - 10, w: 28, h: 24 })),
    ],
  },
};

export function mapForScene(scene) {
  if (scene === "hub") return HUB;
  if (SHERIDEN_ROOMS[scene]) return SHERIDEN_ROOMS[scene];
  const stage = getStage(scene);
  return stage ? STAGE_MAPS[stage.theme] : HUB;
}

function getStage(id) {
  return STAGES.find((s) => s.id === id);
}
