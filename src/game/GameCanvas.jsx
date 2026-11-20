"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/store/gameStore";
import { STAGES, isStageUnlocked, formatUnlockDate } from "@/data/stages";
import { WORLD_W, WORLD_H, mapForScene } from "./maps";
import { memoryTarget, targetDistance } from "./memoryTargets";
import { MONTH_ONE_TOUR } from "@/data/tours";
import {
  consumeInteract,
  clearKeys,
  moveVector,
  pressInteract,
  setKey,
} from "./input";
import {
  drawWorld,
  drawOrb,
  drawFlowerMemory,
  drawCharacter,
  drawPrompt,
  drawBubble,
  drawBike,
  MICAH_LOOK,
  TOM_LOOK,
} from "./render";

const SPEED = 195;
const BODY_HW = 11;
const BODY_TOP = 14;
const BODY_BOTTOM = 6;
const MOVE_CODES = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
]);
const ACTION_CODES = new Set(["KeyE", "Space", "Enter"]);

const SHOP_LINES = {
  PASALUBONG: [
    "Bili na po kayo ng pasalubong!",
    "Meron kaming yema, espasol, muffins, pastillas, at marami pang iba.",
    "Wala po kaming yema na square, puro triangle lang. Sorry.",
  ],
  SOUVENIRS: [
    "Keychains, magnets, tiny jeepneys.",
    "Everything here says you went somewhere. Thats right!.",
  ],
  "BOS COFFEE": [
    "Good morning! What can I get for you?",
    "Two coffees for the flight? Coming right up.",
    "Here you go. Take care, you two.",
  ],
};

const TOUR_LINES = {
  "BOS COFFEE": [
    { speaker: "BOS COFFEE", text: "Good morning! What can I get for you?" },
    { speaker: "BOS COFFEE", text: "Sorry sir, wala po kaming iced coffee, puro hot lang po." },
    { speaker: "Tom", text: "Okay lang sayo hot babe?" },
    { speaker: "Micah", text: "It's okay, cafe latte hot nalang din sakin babe." },
    { speaker: "Tom", text: "Two hot cafe latte po XL." },
    { speaker: "BOS COFFEE", text: "Name nalang po." },
    { speaker: "Micah", text: "MJ :)" },
    { speaker: "BOS COFFEE", text: "Tawagin nalang po kayo pag okay na. Thank you." },
    { speaker: "BOS COFFEE", text: "Two hot cafe latte po for MJ :)" },
    { speaker: "Tom", text: "Perfect." },
    { speaker: "Tom", text: "Next stop pasalubong." },
    { speaker: "Tom", text: "Bili lang ako babe ng mga pasalubong ko kila tita." },
    { speaker: "Micah", text: "Let's go babe. Sama lang me sayo." },
  ],
  PASALUBONG: [
    { speaker: "PASALUBONG", text: "Bili na po kayo ng pasalubong!" },
    { speaker: "Tom", text: "Meron po ba kayong yema na square?" },
    { speaker: "PASALUBONG", text: "Wala po kaming yema na square, puro triangle lang. Sorry." },
    { speaker: "Tom", text: "Macapuno, pastillas, espasol nalang po." },
    { speaker: "PASALUBONG", text: "Ito na po lahat sir. Thank you!" },
    { speaker: "Micah", text: "Paano yan babe wala yung square? Check nalang natin sa iba." },
    { speaker: "Tom", text: "Okay babe, Next stop: souvenirs." },
  ],
  SOUVENIRS: [
    { speaker: "SOUVENIRS", text: "Keychains, magnets, tiny jeepneys." },
    { speaker: "SOUVENIRS", text: "Bili na po kayo mam/sir." },
    { speaker: "Tom", text: "Browse lang po." },
    { speaker: "Micah", text: "I already have the best souvenir babe, It's you! Hehe" },
    { speaker: "Tom", text: "Love you babe hehe." },
    { speaker: "Micah", text: "Love you too babe." },
    { speaker: "Tom", text: "Let's go babe to prologue." },
    { speaker: "Tom", text: "Kung saan natin makikita yung mga some experience during our courting stage hehe." },
  ],
};

const INTRO_LINES = [
  { speaker: "Tom", text: "Hi babe. You actually made it." },
  { speaker: "Micah", text: "You said you'd be my guide?" },
  { speaker: "Tom", text: "That's the plan. Follow me—I'll show you around first." },
  { speaker: "Micah", text: "Okay. Lead the way, guide." },
];

const FINAL_LINES = [
  { speaker: "Tom", text: "We're here babe, to our courting stage A.K.A as the Prologue." },
  { speaker: "Micah", text: "Where it all started." },
  { speaker: "Tom", text: "Ready? Let's go in together." },
];

const TOM_SPEED = 125;
const TOM_PATHS = {
  "lead-coffee": [{ x: 640, y: 370 }, { x: 1080, y: 370 }],
  "lead-pasalubong": [{ x: 371, y: 370 }],
  "lead-souvenirs": [{ x: 891, y: 370 }],
  "lead-prologue": [{ x: 240, y: 370 }, { x: 240, y: 180 }],
  "lead-month-one": [{ x: 500, y: 300 }, { x: 500, y: 205 }],
};
const NEXT_TOUR_STAGE = {
  "lead-coffee": "at-coffee",
  "lead-pasalubong": "at-pasalubong",
  "lead-souvenirs": "at-souvenirs",
  "lead-prologue": "at-prologue",
  "lead-month-one": "at-month-one",
};

// Where Tom walks to once you enter a Sheriden room, so Micah can follow him
// to that room's memory instead of wandering the lobby alone.
const SHERIDEN_GUIDES = {
  "sheriden-lobby": {
    start: { x: 480, y: 380 },
    path: [{ x: 470, y: 320 }, { x: 445, y: 235 }, { x: 445, y: 205 }],
  },
  "sheriden-roof": {
    start: { x: 480, y: 380 },
    path: [{ x: 400, y: 360 }, { x: 280, y: 260 }, { x: 175, y: 185 }],
  },
};

// After a room's memory is seen, Tom walks back to the exit so Micah can follow.
const SHERIDEN_EXIT_PATHS = {
  "sheriden-lobby": [
    { x: 455, y: 265 },
    { x: 480, y: 320 },
    { x: 480, y: 480 },
  ],
  "sheriden-roof": [
    { x: 280, y: 260 },
    { x: 400, y: 360 },
    { x: 480, y: 450 },
    { x: 480, y: 480 },
  ],
};

const PROLOGUE_MEMORIES = STAGES.find((stage) => stage.id === 0)?.memories ?? [];
const PROLOGUE_ENTRY = { x: 480, y: 430 };
const PROLOGUE_PATHS = [
  [{ x: 480, y: 360 }],
  [{ x: 190, y: 360 }, { x: 190, y: 220 }],
  [{ x: 490, y: 220 }],
  [{ x: 490, y: 450 }, { x: 300, y: 450 }],
  [{ x: 610, y: 410 }],
  [{ x: 610, y: 300 }, { x: 800, y: 220 }],
  [{ x: 660, y: 300 }, { x: 660, y: 460 }],
];
const PROLOGUE_TOUR_LINES = {
  "mem-0-1": [
    { speaker: "Tom", text: "Walking in greenfield." },
    { speaker: "Tom", text: "One of my memorable moments with you babe." },
    { speaker: "Micah", text: "Me too haha." },
    { speaker: "Tom", text: "From time na gusto mo na ako tumigil at patigilin na napunta sa dun pala mag sisimula ang lahat." },
    { speaker: "Micah", text: "I know, at sa paglalakad natin din kita mas lalong nakilala." },
    { speaker: "Tom", text: "Me too babe." },
  ],
  "mem-0-2": [
    { speaker: "Tom", text: "Our coffee dates, kabisado mo na agad yung usual kong order sa Starbucks" },
    { speaker: "Micah", text: "Syempre ako pa." },
    { speaker: "Tom", text: "Pati yung customization eh aa." },
    { speaker: "Micah", text: "Love you babe." },
    { speaker: "Tom", text: "I love you more my babe." },
  ],
  "mem-0-3": [
    { speaker: "Tom", text: "Our cinema dates." },
    { speaker: "Micah", text: "Mostly horror kasi i dont watch marvel movies haha." },
    { speaker: "Tom", text: "I know, atleast meron tayong genre na both gustong panoorin." },
    { speaker: "Tom", text: "Kahit ano pa yan basta kasama ikaw hehe." },
  ],
  "mem-0-4": [
    { speaker: "Tom", text: "Samgyupsal at Soban your favourite place." },
    { speaker: "Micah", text: "Inasar pa natin si Dad." },
    { speaker: "Tom", text: "Gulat na gulat sya e hahaha." },
  ],
  "mem-0-6": [
    { speaker: "Tom", text: "This time na meet mo na si Mark" },
    { speaker: "Micah", text: "Your best friend." },
    { speaker: "Tom", text: "Happy ako na naging comfortable kayo sa isa't-isa" },
    { speaker: "Micah", text: "Happy rin ako na na meet ko si Mark hehe." },
  ],
  "mem-0-7": [
    { speaker: "Tom", text: "Movie nights at the Airbnb." },
    { speaker: "Micah", text: "Movies or documentaries na mostly ako lang nanonood." },
    { speaker: "Tom", text: "Nanonood kaya ako and my favourite is watching you." },
    { speaker: "Micah", text: "Ang landi mo talaga babe." },
    { speaker: "Tom", text: "Syempre sayo lang." },
    { speaker: "Micah", text: "Aba dapat lang!" },
  ],
  "mem-0-8": [
    { speaker: "Tom", text: "Holding Hands after away?" },
    { speaker: "Tom", text: "Actually hindi ito yung first time we hold hands but ito yung pinakamatagal haha" },
    { speaker: "Tom", text: "But ito yung time na akala ko mawawala na kita." },
    { speaker: "Tom", text: "Kaya pinaramdam ko nalang sayo na ayaw kita pakawalan hehe." },
    { speaker: "Micah", text: "I love you babe." },
    { speaker: "Tom", text: "I love you more my babe." },
  ],
};

const MONTH_ONE_MEMORIES = STAGES.find((stage) => stage.id === 1)?.memories ?? [];
const MONTH_ONE_ENTRY = { x: 600, y: 430 };
const HOUSE_RIDE_START = { x: 370, y: 490 };
const HOUSE_RIDE_PATH = [
  { x: 650, y: 500 },
  { x: 880, y: 500 },
  { x: 880, y: 240 },
  { x: 1165, y: 240 },
];
const SUNDO_RIDE_START = { x: 1165, y: 240 };
const SUNDO_RIDE_PATH = [
  { x: 880, y: 240 },
  { x: 880, y: 500 },
  { x: 1165, y: 500 },
];
const AUTO_RIDE_SPEED = 240;
const MONTH_ONE_PATHS = [
  [{ x: 600, y: 300 }, { x: 230, y: 300 }],
  [{ x: 400, y: 300 }, { x: 400, y: 390 }],
  [{ x: 400, y: 300 }, { x: 600, y: 220 }],
  [{ x: 780, y: 300 }],
  [{ x: 980, y: 300 }],
  [{ x: 880, y: 300 }, { x: 880, y: 480 }, { x: 650, y: 500 }, { x: 450, y: 500 }, { x: 370, y: 490 }],
  [{ x: 880, y: 230 }, { x: 880, y: 485 }, { x: 1165, y: 480 }],
  [],
  [{ x: 650, y: 480 }, { x: 650, y: 380 }],
];
const MONTH_ONE_TOUR_LINES = {
  "mem-1-1": [
    { speaker: "Tom", text: "Our first trip. You were so excited about the cold." },
    { speaker: "Micah", text: "I made you walk everywhere." },
    { speaker: "Tom", text: "I'd do it again, babe." },
  ],
  "mem-1-3": [
    { speaker: "Tom", text: "Our first photobooth strip. You still have it?" },
    { speaker: "Micah", text: "Of course. You look ridiculous." },
    { speaker: "Tom", text: "Worth it." },
  ],
  "mem-1-4": [
    { speaker: "Tom", text: "Our first coffee date as a couple." },
    { speaker: "Micah", text: "Your coffee went cold." },
    { speaker: "Tom", text: "Because I was busy falling for you." },
  ],
  "mem-1-2": [
    { speaker: "Tom", text: "Our first date as a couple." },
    { speaker: "Micah", text: "I was so nervous." },
    { speaker: "Tom", text: "You hid it well. I didn't." },
  ],
  "mem-1-facetime": [
    { speaker: "Tom", text: "And our FaceTime calls." },
    { speaker: "Micah", text: "Even when we were far apart." },
    { speaker: "Tom", text: "You always made the distance smaller." },
  ],
  "mem-1-5": [
    { speaker: "Tom", text: "The first time I picked you up from work." },
    { speaker: "Micah", text: "You were waiting outside Studio iKwaMe." },
    { speaker: "Tom", text: "I'd wait for you every day." },
  ],
  "mem-1-6": [
    { speaker: "Tom", text: "Almost two weeks together. No rush." },
    { speaker: "Micah", text: "It felt like home." },
    { speaker: "Tom", text: "That's what I want to remember." },
  ],
};
const SHERIDEN_ROOM_LINES = {
  "sheriden-lobby": [
    { speaker: "Tom", text: "Our lobby memory. This little corner." },
    { speaker: "Micah", text: "We talked here for hours." },
    { speaker: "Tom", text: "I'd stay longer if I could." },
  ],
  "sheriden-roof": [
    { speaker: "Tom", text: "The roof deck. The city looked so small from up here." },
    { speaker: "Micah", text: "You held my hand the whole time." },
    { speaker: "Tom", text: "I'd hold it again." },
  ],
};
const SHERIDEN_ENTRY_LINES = {
  "sheriden-lobby": [
    { speaker: "Tom", text: "Let's start with the lobby, babe." },
    { speaker: "Micah", text: "Okay. Lead the way." },
  ],
  "sheriden-roof": [
    { speaker: "Tom", text: "Now the roof deck. I want to show you our view again." },
    { speaker: "Micah", text: "I'd love that." },
  ],
};

function shopReady(shop, tourStage) {
  if (tourStage === "done") return true;
  if (shop.type === "bos-coffee") return tourStage === "at-coffee";
  if (shop.label === "PASALUBONG") return tourStage === "at-pasalubong";
  if (shop.label === "SOUVENIRS") return tourStage === "at-souvenirs";
  return false;
}

function blocked(x, y, solids) {
  return solids.some(
    (s) =>
      x + BODY_HW > s.x &&
      x - BODY_HW < s.x + s.w &&
      y + BODY_BOTTOM > s.y &&
      y - BODY_TOP < s.y + s.h,
  );
}

function fillTrailBehind(g) {
  const vec = {
    up: [0, 1],
    down: [0, -1],
    left: [1, 0],
    right: [-1, 0],
  }[g.dir] || [0, 1];
  g.trail = [];
  for (let i = 0; i < 20; i++) {
    g.trail.push({ x: g.x + vec[0] * i * 3, y: g.y + vec[1] * i * 3, dir: g.dir });
  }
}

function getTargets(map, scene, st, g) {
  if (scene === "hub") {
    const list = [];
    if (st.tourStage === "meet") {
      list.push({
        kind: "npc",
        x: map.npc.x,
        y: map.npc.y,
        promptY: map.npc.y - 70,
        label: "Talk to Tom",
        radius: 80,
      });
    }
    for (const portal of map.portals) {
      const stage = STAGES.find((s) => s.id === portal.stageId);
      if (!stage) continue;
      const portalAvailable =
        st.tourStage === "done" ||
        (portal.stageId === 0 && st.tourStage === "at-prologue") ||
        (portal.stageId === 1 && st.tourStage === "at-month-one");
      if (!portalAvailable) continue;
      const unlocked = isStageUnlocked(stage);
      const gateName = stage.gateLabel || `Month ${stage.id}`;
      list.push({
        kind: "portal",
        stageId: portal.stageId,
        x: portal.x,
        y: portal.y + 38,
        promptY: portal.y - 58,
        label: unlocked ? `Enter ${gateName}` : "Locked",
        radius: 86,
      });
    }
    for (const shop of map.props) {
      if (shop.type !== "shop" && shop.type !== "bos-coffee") continue;
      if (!shopReady(shop, st.tourStage)) continue;
      const coffee = shop.type === "bos-coffee";
      list.push({
        kind: "shop",
        name: shop.label,
        ...(coffee
          ? {
            landmark: shop,
            x: shop.x + shop.w / 2,
            y: shop.y + shop.h / 2,
            promptY: shop.y - 8,
            memory: shop.memory,
          }
          : {
            x: shop.x + shop.w / 2,
            y: shop.y + shop.h + 26,
            promptY: shop.y + 30,
          }),
        label: "Browse",
        radius: coffee ? 55 : 66,
      });
    }
    return list;
  }

  const stage = STAGES.find((s) => s.id === scene);
  const prologueTour =
    scene === 0 &&
    (st.prologuePhase === "lead" || st.prologuePhase === "at");
  const monthOneTour =
    scene === 1 &&
    (st.monthOnePhase === "lead" || st.monthOnePhase === "at");
  const monthOneStop = monthOneTour
    ? MONTH_ONE_TOUR[st.monthOneStep]
    : null;
  const memories = prologueTour
    ? st.prologuePhase === "at" && PROLOGUE_MEMORIES[st.prologueStep]
      ? [PROLOGUE_MEMORIES[st.prologueStep]]
      : []
    : monthOneTour
      ? st.monthOnePhase === "at" && monthOneStop?.memoryId
        ? [
          MONTH_ONE_MEMORIES.find(
            (memory) => memory.id === monthOneStop.memoryId,
          ),
        ].filter(Boolean)
        : []
      : map.memories || stage?.memories || [];
  const list = memories.map((memory) => memoryTarget(memory, map));

  const sheridenReady =
    !monthOneTour ||
    (st.monthOnePhase === "at" &&
      (monthOneStop?.kind === "sheriden-lobby" ||
        monthOneStop?.kind === "sheriden-roof"));
  if (map.sheridenEntrance && sheridenReady) {
    list.push({
      kind: "sheriden",
      x: map.sheridenEntrance.x,
      y: map.sheridenEntrance.y,
      promptY: map.sheridenEntrance.y - 55,
      label: "Enter Sheriden",
      radius: 65,
    });
  }

  if (map.bike) {
    const parked = g.bike || map.bike;
    list.push({
      kind: "bike",
      x: g.riding ? g.x : parked.x,
      y: g.riding ? g.y : parked.y,
      promptY: g.riding ? g.y - 76 : parked.y - 34,
      label: g.riding ? "Dismount" : "Ride",
      radius: 60,
    });
  }

  if (map.exit && !prologueTour && !monthOneTour) {
    const goToCityView =
      scene === "sheriden-lobby" && st.monthOnePhase !== "done";
    list.push({
      kind: "exit",
      x: map.exit.x,
      y: map.exit.y,
      promptY: map.exit.y - 78,
      label: goToCityView
        ? "Go to City View"
        : map.exitLabel || "Back to Hub",
      destination: map.returnScene ?? "hub",
      radius: 58,
    });
  }
  return list;
}

function findNear(map, scene, st, g) {
  let best = null;
  let bestDist = Infinity;
  for (const t of getTargets(map, scene, st, g)) {
    const dist = targetDistance(t, g.x, g.y);
    if (dist < t.radius && dist < bestDist) {
      best = t;
      bestDist = dist;
    }
  }
  return best;
}

function interactWith(target, st, g) {
  if (target.kind === "npc") {
    st.startDialogue({
      speaker: "Tom",
      lines: INTRO_LINES,
      after: "startTour",
    });
  } else if (target.kind === "portal") {
    const stage = STAGES.find((s) => s.id === target.stageId);
    if (stage.id === 0 && st.tourStage === "at-prologue") {
      st.startDialogue({
        speaker: "Tom",
        lines: FINAL_LINES,
        after: "enterPrologue",
      });
    } else if (isStageUnlocked(stage)) {
      if (stage.id === 1) st.setTourStage("done");
      st.setScene(stage.id);
    } else {
      st.startDialogue({
        speaker: "A locked gate",
        lines: [
          `${stage.title.split(":")[0]} isn't open yet.`,
          `This gate opens on ${formatUnlockDate(stage.unlockDate)}.`,
          "Come back then — I'll be waiting right here.",
        ],
      });
    }
  } else if (target.kind === "shop") {
    let lines =
      SHOP_LINES[target.name] || ["Come in, come in. Everything must go."];
    if (target.name === "BOS COFFEE" && st.tourStage === "at-coffee") {
      lines = TOUR_LINES["BOS COFFEE"];
      st.setTourStage("lead-pasalubong");
    } else if (
      target.name === "PASALUBONG" &&
      st.tourStage === "at-pasalubong"
    ) {
      lines = TOUR_LINES.PASALUBONG;
      st.setTourStage("lead-souvenirs");
    } else if (
      target.name === "SOUVENIRS" &&
      st.tourStage === "at-souvenirs"
    ) {
      lines = TOUR_LINES.SOUVENIRS;
      st.setTourStage("lead-prologue");
    }
    st.startDialogue({
      speaker: target.name,
      lines,
      afterMemory: target.memory || null,
    });
  } else if (target.kind === "sheriden") {
    g.sheridenReturn = {
      x: g.x,
      y: g.y,
      dir: g.dir,
      bike: g.bike && { ...g.bike },
      tom: g.tom && { ...g.tom },
    };
    const stop = MONTH_ONE_TOUR[st.monthOneStep];
    if (
      st.scene === 1 &&
      st.monthOnePhase === "at" &&
      (stop?.kind === "sheriden-lobby" || stop?.kind === "sheriden-roof")
    ) {
      st.startDialogue({
        speaker: "Tom",
        lines: SHERIDEN_ENTRY_LINES[stop.kind] || [],
        after:
          stop.kind === "sheriden-lobby"
            ? "enterSheridenLobby"
            : "enterSheridenRoof",
      });
    } else {
      st.setChoosingSheriden(true);
    }
  } else if (target.kind === "bike") {
    g.riding = !g.riding;
    if (!g.riding) {
      const side = g.dir === "left" ? 22 : g.dir === "right" ? -22 : 12;
      g.bike = { x: g.x + side, y: g.y + 10, dir: g.dir };
    }
  } else if (target.kind === "memory") {
    if (st.scene === 0 && st.prologuePhase === "at") {
      const last = st.prologueStep >= PROLOGUE_MEMORIES.length - 1;
      if (last) st.queueContinuePrompt();
      st.setPrologueProgress(
        last ? st.prologueStep : st.prologueStep + 1,
        last ? "done" : "lead",
      );
      st.startDialogue({
        speaker: "Tom",
        lines: PROLOGUE_TOUR_LINES[target.memory.id] || [
          { speaker: "Tom", text: "Look at this one, babe." },
        ],
        afterMemory: target.memory,
      });
    } else if (
      (st.scene === "sheriden-lobby" || st.scene === "sheriden-roof") &&
      st.monthOnePhase !== "done"
    ) {
      if (!st.sheridenMemoryDone) {
        st.markSheridenMemoryDone();
        g.sheridenPath = (SHERIDEN_EXIT_PATHS[st.scene] || []).map(
          (point) => ({ ...point }),
        );
        g.sheridenPathIndex = 0;
      }
      st.startDialogue({
        speaker: "Tom",
        lines: SHERIDEN_ROOM_LINES[st.scene] || [],
        afterMemory: target.memory,
      });
    } else if (st.scene === 1 && st.monthOnePhase === "at") {
      const stop = MONTH_ONE_TOUR[st.monthOneStep];
      if (stop?.memoryId === target.memory.id) {
        const last = st.monthOneStep >= MONTH_ONE_TOUR.length - 1;
        if (last) st.queueMonthOneClosing();
        st.setMonthOneProgress(
          last ? st.monthOneStep : st.monthOneStep + 1,
          last ? "done" : "lead",
        );
        st.startDialogue({
          speaker: "Tom",
          lines: MONTH_ONE_TOUR_LINES[target.memory.id] || [
            { speaker: "Tom", text: "I remember this, babe." },
          ],
          afterMemory: target.memory,
        });
      } else {
        st.openMemory(target.memory);
      }
    } else {
      st.openMemory(target.memory);
    }
  } else if (target.kind === "exit") {
    if (st.scene === "sheriden-lobby" && st.monthOnePhase !== "done") {
      st.setMonthOneProgress(7, "at");
      st.setScene("sheriden-roof");
      return;
    }
    if (st.scene === "sheriden-roof" && st.monthOnePhase !== "done") {
      st.setMonthOneProgress(8, "lead");
    }
    st.setScene(target.destination);
  }
}

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const scene = useGame((s) => s.scene);
  const sceneRef = useRef(scene);
  const isTouchRef = useRef(false);
  const gameRef = useRef({
    x: 640,
    y: 460,
    dir: "up",
    moving: false,
    near: null,
    trail: [],
    camX: 0,
    riding: false,
    bike: null,
    sheridenReturn: null,
    tom: null,
    tomPath: null,
    tomStep: 0,
    tourStage: "meet",
    prologueStep: -1,
    prologuePhase: "idle",
    prologuePath: null,
    prologuePathIndex: 0,
    monthOneStep: -1,
    monthOnePhase: "idle",
    monthOnePath: null,
    monthOnePathIndex: 0,
    autoRide: null,
    sundoRideReady: false,
    sheridenPath: null,
    sheridenPathIndex: 0,
  });

  useEffect(() => {
    sceneRef.current = scene;
    const g = gameRef.current;
    const map = mapForScene(scene);
    const returning = scene === 1 && g.sheridenReturn;
    g.x = returning ? returning.x : map.spawn.x;
    g.y = returning ? returning.y : map.spawn.y;
    g.dir = returning ? returning.dir : "up";
    g.moving = false;
    g.near = null;
    g.trail = [];
    g.riding = false;
    g.bike = returning ? returning.bike : map.bike ? { ...map.bike } : null;
    const returnTom = returning?.tom;
    g.tom = returnTom
      ? { ...returnTom }
      : map.npc
        ? { x: map.npc.x, y: map.npc.y, dir: "down", moving: false }
        : null;
    g.tourStage = useGame.getState().tourStage;
    if (
      scene === "hub" &&
      g.tourStage === "at-prologue" &&
      useGame.getState().prologuePhase === "done"
    ) {
      const monthOne = STAGES.find((stage) => stage.id === 1);
      if (monthOne && isStageUnlocked(monthOne)) {
        useGame.getState().setTourStage("lead-month-one");
        g.tourStage = "lead-month-one";
      } else {
        useGame.getState().setTourStage("done");
        g.tourStage = "done";
      }
    }
    g.tomPath = TOM_PATHS[g.tourStage]
      ? TOM_PATHS[g.tourStage].map((point) => ({ ...point }))
      : null;
    g.tomStep = 0;
    g.prologueStep = -1;
    g.prologuePhase = "idle";
    g.prologuePath = null;
    g.prologuePathIndex = 0;
    if (scene === 0) {
      let prologue = useGame.getState();
      if (prologue.prologuePhase === "idle" && prologue.storyMode) {
        prologue.startPrologueTour();
        prologue = useGame.getState();
      }
      if (prologue.prologuePhase === "lead") {
        g.tom = { ...PROLOGUE_ENTRY, dir: "up", moving: false };
      } else if (prologue.prologuePhase === "at") {
        const stop =
          PROLOGUE_PATHS[prologue.prologueStep]?.at(-1) || PROLOGUE_ENTRY;
        g.tom = { x: stop.x, y: stop.y, dir: "down", moving: false };
      } else {
        g.tom = null;
      }
    }
    g.monthOneStep = -1;
    g.monthOnePhase = "idle";
    g.monthOnePath = null;
    g.monthOnePathIndex = 0;
    g.autoRide = null;
    g.sundoRideReady = false;
    if (scene === 1) {
      useGame.setState({ monthOneInvited: false });
      let monthOne = useGame.getState();
      if (monthOne.monthOnePhase === "idle" && monthOne.storyMode) {
        monthOne.startMonthOneTour();
        monthOne = useGame.getState();
      }
      if (
        !returnTom &&
        (monthOne.monthOnePhase === "lead" ||
          monthOne.monthOnePhase === "at")
      ) {
        const stop = MONTH_ONE_TOUR[monthOne.monthOneStep];
        if (monthOne.monthOneStep === 0 || !stop?.tom) {
          g.tom = { ...MONTH_ONE_ENTRY, dir: "down", moving: false };
        } else {
          g.tom = { ...stop.tom, dir: "down", moving: false };
        }
      } else if (monthOne.monthOnePhase === "done" && !returnTom) {
        g.tom = null;
      }
    }
    g.sheridenPath = null;
    g.sheridenPathIndex = 0;
    const sheridenGuide = SHERIDEN_GUIDES[scene];
    if (sheridenGuide) {
      useGame.getState().resetSheridenMemoryDone();
      g.tom = {
        x: sheridenGuide.start.x,
        y: sheridenGuide.start.y,
        dir: "down",
        moving: false,
      };
      g.sheridenPath = sheridenGuide.path.map((point) => ({ ...point }));
    }
    if (scene !== "sheriden-lobby" && scene !== "sheriden-roof") g.sheridenReturn = null;
    const maxCam = (map.width || WORLD_W) - WORLD_W;
    g.camX = Math.max(0, Math.min(maxCam, g.x - WORLD_W / 2));
    if (useGame.getState().recruited) fillTrailBehind(g);
    clearKeys();
  }, [scene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = WORLD_W * dpr;
    canvas.height = WORLD_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    isTouchRef.current = window.matchMedia("(pointer: coarse)").matches;

    const onKeyDown = (e) => {
      if (MOVE_CODES.has(e.code)) {
        e.preventDefault();
        setKey(e.code, true);
      }
      if (e.code === "KeyE") {
        e.preventDefault();
        if (!e.repeat) pressInteract();
      } else if (ACTION_CODES.has(e.code)) {
        const onButton =
          e.target instanceof HTMLElement && e.target.closest("button");
        if (!onButton) {
          e.preventDefault();
          if (!e.repeat) pressInteract();
        }
      }
    };
    const onKeyUp = (e) => {
      if (MOVE_CODES.has(e.code)) setKey(e.code, false);
    };
    const onBlur = () => clearKeys();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    let rafId;
    let last = performance.now();

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const g = gameRef.current;
      let st = useGame.getState();

      if (
        consumeInteract() &&
        st.started &&
        !st.choosingSheriden &&
        !st.storyModePrompt &&
        !st.monthOneClosing &&
        !g.autoRide &&
        !st.monthOnePrompt
      ) {
        if (st.modal) st.closeModal();
        else if (st.dialogue) st.advanceDialogue();
        else if (g.near) interactWith(g.near, st, g);
      }

      st = useGame.getState();
      const paused =
        !st.started ||
        Boolean(
          st.dialogue ||
          st.modal ||
          st.choosingSheriden ||
          st.storyModePrompt ||
          st.monthOneClosing ||
          st.monthOnePrompt,
        );
      const sceneNow = sceneRef.current;
      const map = mapForScene(sceneNow);

      if (!paused) {
        if (g.autoRide) {
          clearKeys();
          g.moving = false;
          const ride = g.autoRide;
          const target = ride.path[ride.index];
          if (!target) {
            const rideStep = ride.step;
            g.autoRide = null;
            g.riding = false;
            if (rideStep === 5) {
              g.bike = { x: g.x - 70, y: g.y - 12, dir: "right" };
            } else {
              g.bike = { x: g.x + 46, y: g.y + 12, dir: "left" };
            }
            g.tom = { x: g.x - 24, y: g.y + 4, dir: "left", moving: false };
            useGame.getState().setMonthOneProgress(rideStep, "at");
          } else {
            const rdx = target.x - g.x;
            const rdy = target.y - g.y;
            const dist = Math.hypot(rdx, rdy);
            const step = AUTO_RIDE_SPEED * dt;
            if (dist <= step) {
              g.x = target.x;
              g.y = target.y;
              ride.index += 1;
            } else {
              g.x += (rdx / dist) * step;
              g.y += (rdy / dist) * step;
              g.dir =
                Math.abs(rdx) > Math.abs(rdy)
                  ? rdx > 0
                    ? "right"
                    : "left"
                  : rdy > 0
                    ? "down"
                    : "up";
            }
          }
        } else {
          const { dx, dy } = moveVector();
          g.moving = dx !== 0 || dy !== 0;
          if (g.moving) {
            if (Math.abs(dx) > Math.abs(dy)) g.dir = dx > 0 ? "right" : "left";
            else if (dy !== 0) g.dir = dy > 0 ? "down" : "up";

            const step = SPEED * (g.riding ? 1.65 : 1) * dt;
            const solids =
              !st.recruited && map.npc
                ? map.solids.concat({
                  x: map.npc.x - 12,
                  y: map.npc.y - 20,
                  w: 24,
                  h: 40,
                })
                : map.solids;
            const nx = g.x + dx * step;
            if (!blocked(nx, g.y, solids)) g.x = nx;
            const ny = g.y + dy * step;
            if (!blocked(g.x, ny, solids)) g.y = ny;
          }

          if (st.recruited) {
            if (g.trail.length === 0) fillTrailBehind(g);
            g.trail.unshift({ x: g.x, y: g.y, dir: g.dir });
            if (g.trail.length > 21) g.trail.length = 21;
          }
        }

        if (sceneNow === "hub") {
          if (st.tourStage !== g.tourStage) {
            g.tourStage = st.tourStage;
            g.tomStep = 0;
            g.tomPath = TOM_PATHS[st.tourStage]
              ? TOM_PATHS[st.tourStage].map((point) => ({ ...point }))
              : null;
          }
          if (g.tom && g.tomPath && g.tomStep < g.tomPath.length) {
            const target = g.tomPath[g.tomStep];
            const dx = target.x - g.tom.x;
            const dy = target.y - g.tom.y;
            const dist = Math.hypot(dx, dy);
            const step = TOM_SPEED * dt;
            if (dist <= step) {
              g.tom.x = target.x;
              g.tom.y = target.y;
              g.tomStep += 1;
              g.tom.moving = false;
              if (g.tomStep >= g.tomPath.length) {
                g.tomPath = null;
                const next = NEXT_TOUR_STAGE[st.tourStage];
                if (next) useGame.getState().setTourStage(next);
              }
            } else {
              g.tom.x += (dx / dist) * step;
              g.tom.y += (dy / dist) * step;
              g.tom.dir =
                Math.abs(dx) > Math.abs(dy)
                  ? dx > 0
                    ? "right"
                    : "left"
                  : dy > 0
                    ? "down"
                    : "up";
              g.tom.moving = true;
            }
          }
        }

        if (sceneNow === 0) {
          if (
            st.prologuePhase !== g.prologuePhase ||
            st.prologueStep !== g.prologueStep
          ) {
            g.prologuePhase = st.prologuePhase;
            g.prologueStep = st.prologueStep;
            g.prologuePath = null;
            g.prologuePathIndex = 0;
            if (st.prologuePhase === "lead") {
              g.prologuePath = (PROLOGUE_PATHS[st.prologueStep] || []).map(
                (point) => ({ ...point }),
              );
            }
          }
          if (
            g.tom &&
            st.prologuePhase === "lead" &&
            g.prologuePath &&
            g.prologuePathIndex < g.prologuePath.length
          ) {
            const target = g.prologuePath[g.prologuePathIndex];
            const dx = target.x - g.tom.x;
            const dy = target.y - g.tom.y;
            const dist = Math.hypot(dx, dy);
            const step = TOM_SPEED * dt;
            if (dist <= step) {
              g.tom.x = target.x;
              g.tom.y = target.y;
              g.prologuePathIndex += 1;
              g.tom.moving = false;
              if (g.prologuePathIndex >= g.prologuePath.length) {
                g.prologuePath = null;
                useGame
                  .getState()
                  .setPrologueProgress(st.prologueStep, "at");
              }
            } else {
              g.tom.x += (dx / dist) * step;
              g.tom.y += (dy / dist) * step;
              g.tom.dir =
                Math.abs(dx) > Math.abs(dy)
                  ? dx > 0
                    ? "right"
                    : "left"
                  : dy > 0
                    ? "down"
                    : "up";
              g.tom.moving = true;
            }
          }
        }

        if (sceneNow === 1) {
          if (
            st.monthOnePhase !== g.monthOnePhase ||
            st.monthOneStep !== g.monthOneStep
          ) {
            g.monthOnePhase = st.monthOnePhase;
            g.monthOneStep = st.monthOneStep;
            g.monthOnePath = null;
            g.monthOnePathIndex = 0;
            g.autoRide = null;
            g.sundoRideReady = false;
            if (st.monthOnePhase === "lead") {
              if (st.storyMode && st.monthOneStep === 6) {
                // First sundo -> Sheriden Towers: a short automatic ride.
                g.autoRide = {
                  path: SUNDO_RIDE_PATH.map((point) => ({ ...point })),
                  index: 0,
                  step: 6,
                };
                g.riding = true;
                g.moving = false;
                g.x = SUNDO_RIDE_START.x;
                g.y = SUNDO_RIDE_START.y;
                g.dir = "left";
                g.trail = [];
              } else {
                if (st.storyMode && st.monthOneStep === 5) {
                  // Before the first sundo, go to Tom's house for his motorcycle.
                  g.riding = false;
                  g.bike = map.bike ? { ...map.bike } : g.bike;
                }
                g.monthOnePath = (MONTH_ONE_PATHS[st.monthOneStep] || []).map(
                  (point) => ({ ...point }),
                );
                if (g.monthOnePath.length === 0) {
                  useGame
                    .getState()
                    .setMonthOneProgress(st.monthOneStep, "at");
                }
              }
            }
          }
          if (
            g.tom &&
            st.monthOnePhase === "lead" &&
            g.monthOnePath &&
            g.monthOnePathIndex < g.monthOnePath.length
          ) {
            const target = g.monthOnePath[g.monthOnePathIndex];
            const dx = target.x - g.tom.x;
            const dy = target.y - g.tom.y;
            const dist = Math.hypot(dx, dy);
            const step = TOM_SPEED * dt;
            if (dist <= step) {
              g.tom.x = target.x;
              g.tom.y = target.y;
              g.monthOnePathIndex += 1;
              g.tom.moving = false;
              if (g.monthOnePathIndex >= g.monthOnePath.length) {
                g.monthOnePath = null;
                if (st.storyMode && st.monthOneStep === 5) {
                  g.sundoRideReady = true;
                } else {
                  useGame
                    .getState()
                    .setMonthOneProgress(st.monthOneStep, "at");
                }
              }
            } else {
              g.tom.x += (dx / dist) * step;
              g.tom.y += (dy / dist) * step;
              g.tom.dir =
                Math.abs(dx) > Math.abs(dy)
                  ? dx > 0
                    ? "right"
                    : "left"
                  : dy > 0
                    ? "down"
                    : "up";
              g.tom.moving = true;
            }
          }
        }

        if (
          g.sundoRideReady &&
          g.tom &&
          !g.autoRide &&
          Math.hypot(g.x - g.tom.x, g.y - g.tom.y) < 120
        ) {
          g.sundoRideReady = false;
          g.autoRide = {
            path: HOUSE_RIDE_PATH.map((point) => ({ ...point })),
            index: 0,
            step: 5,
          };
          g.riding = true;
          g.moving = false;
          g.x = HOUSE_RIDE_START.x;
          g.y = HOUSE_RIDE_START.y;
          g.dir = "right";
          g.trail = [];
        }

        if (SHERIDEN_GUIDES[sceneNow] && g.tom) {
          if (
            g.sheridenPath &&
            g.sheridenPathIndex < g.sheridenPath.length
          ) {
            const target = g.sheridenPath[g.sheridenPathIndex];
            const dx = target.x - g.tom.x;
            const dy = target.y - g.tom.y;
            const dist = Math.hypot(dx, dy);
            const step = TOM_SPEED * dt;
            if (dist <= step) {
              g.tom.x = target.x;
              g.tom.y = target.y;
              g.sheridenPathIndex += 1;
              g.tom.moving = false;
              if (g.sheridenPathIndex >= g.sheridenPath.length) {
                g.sheridenPath = null;
              }
            } else {
              g.tom.x += (dx / dist) * step;
              g.tom.y += (dy / dist) * step;
              g.tom.dir =
                Math.abs(dx) > Math.abs(dy)
                  ? dx > 0
                    ? "right"
                    : "left"
                  : dy > 0
                    ? "down"
                    : "up";
              g.tom.moving = true;
            }
          }
        }

        g.near = g.autoRide ? null : findNear(map, sceneNow, st, g);

        const maxCam = (map.width || WORLD_W) - WORLD_W;
        const targetCam = Math.max(0, Math.min(maxCam, g.x - WORLD_W / 2));
        g.camX += (targetCam - g.camX) * Math.min(1, dt * 8);
      } else {
        g.moving = false;
        clearKeys();
      }

      ctx.clearRect(0, 0, WORLD_W, WORLD_H);
      ctx.save();
      ctx.translate(-Math.round(g.camX), 0);

      drawWorld(ctx, sceneNow, map);
      const monthOneTourActive =
        sceneNow === 1 &&
        (st.monthOnePhase === "lead" || st.monthOnePhase === "at");
      const monthOneStop = monthOneTourActive
        ? MONTH_ONE_TOUR[st.monthOneStep]
        : null;
      const sheridenReady =
        !monthOneTourActive ||
        (st.monthOnePhase === "at" &&
          (monthOneStop?.kind === "sheriden-lobby" ||
            monthOneStop?.kind === "sheriden-roof"));
      if (
        map.sheridenEntrance &&
        sheridenReady &&
        g.near?.kind !== "sheriden"
      ) {
        drawBubble(ctx, map.sheridenEntrance.x, map.sheridenEntrance.y, now);
      }
      const stage = sceneNow === "hub" ? null : STAGES.find((s) => s.id === sceneNow);
      const prologueTourActive =
        sceneNow === 0 &&
        (st.prologuePhase === "lead" || st.prologuePhase === "at");
      for (const shop of map.props) {
        if (shop.type !== "shop" && shop.type !== "bos-coffee") continue;
        if (!shopReady(shop, st.tourStage)) continue;
        if (g.near?.kind === "shop" && g.near.name === shop.label) continue;
        drawBubble(ctx, shop.x + shop.w - 14, shop.y + 80, now);
      }
      if (sceneNow === "hub" && st.tourStage === "at-prologue") {
        const prologue = map.portals.find((portal) => portal.stageId === 0);
        if (prologue && g.near?.kind !== "portal") {
          drawBubble(ctx, prologue.x, prologue.y, now);
        }
      }

      const flowerMemory = sceneNow === 1 && MONTH_ONE_MEMORIES.find((memory) => memory.id === "mem-1-flowers");
      if (flowerMemory) drawFlowerMemory(ctx, flowerMemory);

      const visibleMemories = prologueTourActive
        ? st.prologuePhase === "at" && PROLOGUE_MEMORIES[st.prologueStep]
          ? [PROLOGUE_MEMORIES[st.prologueStep]]
          : []
        : monthOneTourActive
          ? st.monthOnePhase === "at" && monthOneStop?.memoryId
            ? [
              MONTH_ONE_MEMORIES.find(
                (memory) => memory.id === monthOneStop.memoryId,
              ),
            ].filter(Boolean)
            : []
          : map.memories || stage?.memories || [];
      for (const memory of visibleMemories) {
        const target = memoryTarget(memory, map);
        if (memory.id === "mem-1-flowers") {
          if (g.near?.memory?.id !== memory.id) drawBubble(ctx, memory.x, memory.y - 30, now);
        } else if (target.landmark) {
          if (g.near?.memory?.id !== memory.id) {
            drawBubble(ctx, target.landmark.x + target.landmark.w - 14, target.landmark.y + 80, now);
          }
        } else {
          drawOrb(ctx, memory, now);
        }
      }

      if (map.bike) {
        if (g.riding) drawBike(ctx, g.x, g.y, g.dir, now);
        else if (g.bike) drawBike(ctx, g.bike.x, g.bike.y, g.bike.dir, now);
      }

      if (sceneNow === "hub" && !st.recruited) {
        drawCharacter(ctx, map.npc.x, map.npc.y, "down", TOM_LOOK, now, false);
        if (g.near?.kind !== "npc") drawBubble(ctx, map.npc.x, map.npc.y, now);
      }

      const showingLeader =
        (sceneNow === "hub" &&
          st.tourStage !== "meet" &&
          st.tourStage !== "done") ||
        prologueTourActive ||
        monthOneTourActive ||
        sceneNow === "sheriden-lobby" ||
        sceneNow === "sheriden-roof";

      if (showingLeader && g.tom && !g.riding) {
        drawCharacter(
          ctx,
          g.tom.x,
          g.tom.y,
          g.tom.dir,
          TOM_LOOK,
          now,
          g.tom.moving,
        );
      }

      if (st.recruited && !g.riding && !showingLeader) {
        const c = g.trail[Math.min(18, g.trail.length - 1)] || {
          x: g.x,
          y: g.y + 18,
          dir: g.dir,
        };
        let cx = c.x;
        let cy = c.y;
        if (Math.hypot(cx - g.x, cy - g.y) < 6) {
          const back = {
            up: [16, 20],
            down: [-16, -20],
            left: [20, 12],
            right: [-20, 12],
          }[g.dir];
          cx += back[0];
          cy += back[1];
        }
        drawCharacter(ctx, cx, cy, c.dir, TOM_LOOK, now, g.moving);
      }

      if (g.riding) {
        const fx = g.dir === "right" ? 1 : g.dir === "left" ? -1 : 0;
        const fy = g.dir === "down" ? 1 : g.dir === "up" ? -1 : 0;
        drawCharacter(
          ctx,
          g.x + fx * 13,
          g.y + fy * 13 - 9,
          g.dir,
          TOM_LOOK,
          now,
          g.moving,
        );
        drawCharacter(
          ctx,
          g.x - fx * 11,
          g.y - fy * 11 - 9,
          g.dir,
          MICAH_LOOK,
          now,
          g.moving,
        );
      } else {
        drawCharacter(ctx, g.x, g.y, g.dir, MICAH_LOOK, now, g.moving);
      }

      const sundoRideReady =
        sceneNow === 1 &&
        st.monthOnePhase === "lead" &&
        st.monthOneStep === 5 &&
        !g.riding;
      if (g.autoRide) {
        drawBubble(ctx, g.x, g.y, now);
      } else if (sundoRideReady) {
        const parked = g.bike || map.bike;
        if (parked) drawBubble(ctx, parked.x, parked.y, now);
      }

      if (!paused && g.near) {
        drawPrompt(
          ctx,
          g.near.x,
          g.near.promptY,
          g.near.label,
          isTouchRef.current,
          now,
        );
      }

      ctx.restore();

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      clearKeys();
    };
  }, []);

  return (
    <div className="relative aspect-[5/3] w-full overflow-hidden bg-[#1a1424]">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        aria-label="Our Little World game world"
        role="img"
      />
    </div>
  );
}
