"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/store/gameStore";
import { STAGES, isStageUnlocked, formatUnlockDate } from "@/data/stages";
import { WORLD_W, WORLD_H, mapForScene } from "./maps";
import { memoryTarget, targetDistance } from "./memoryTargets";
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
};

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
    if (!st.recruited) {
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
      if (shop.type !== "shop") continue;
      list.push({
        kind: "shop",
        name: shop.label,
        x: shop.x + shop.w / 2,
        y: shop.y + shop.h + 26,
        promptY: shop.y + 30,
        label: "Browse",
        radius: 66,
      });
    }
    return list;
  }

  const stage = STAGES.find((s) => s.id === scene);
  const list =
    (map.memories || stage?.memories)?.map((memory) => memoryTarget(memory, map)) ?? [];

  if (map.sheridenEntrance) {
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

  if (map.exit) {
    list.push({
      kind: "exit",
      x: map.exit.x,
      y: map.exit.y,
      promptY: map.exit.y - 78,
      label: map.exitLabel || "Back to Hub",
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
      lines: [
        "Hi babe, you actually made it.",
        "I'm Tom, your boyfriend. I'll be your guide around here.",
        "We are here at the airport, where it all started.",
        "Each gate is a month we've shared. The ones still locked? We just haven't lived them yet.",
        "Stay close baby. Let's go remember everything.",
      ],
      after: "recruit",
    });
  } else if (target.kind === "portal") {
    const stage = STAGES.find((s) => s.id === target.stageId);
    if (isStageUnlocked(stage)) {
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
    st.startDialogue({
      speaker: target.name,
      lines: SHOP_LINES[target.name] || ["Come in, come in. Everything must go."],
    });
  } else if (target.kind === "sheriden") {
    g.sheridenReturn = { x: g.x, y: g.y, dir: g.dir, bike: g.bike && { ...g.bike } };
    st.setChoosingSheriden(true);
  } else if (target.kind === "bike") {
    g.riding = !g.riding;
    if (!g.riding) {
      const side = g.dir === "left" ? 22 : g.dir === "right" ? -22 : 12;
      g.bike = { x: g.x + side, y: g.y + 10, dir: g.dir };
    }
  } else if (target.kind === "memory") {
    st.openMemory(target.memory);
  } else if (target.kind === "exit") {
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
      if (ACTION_CODES.has(e.code)) {
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

      if (consumeInteract() && st.started && !st.choosingSheriden) {
        if (st.modal) st.closeModal();
        else if (st.dialogue) st.advanceDialogue();
        else if (g.near) interactWith(g.near, st, g);
      }

      st = useGame.getState();
      const paused = !st.started || Boolean(st.dialogue || st.modal || st.choosingSheriden);
      const sceneNow = sceneRef.current;
      const map = mapForScene(sceneNow);

      if (!paused) {
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

        g.near = findNear(map, sceneNow, st, g);

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
      if (map.sheridenEntrance && g.near?.kind !== "sheriden") {
        drawBubble(ctx, map.sheridenEntrance.x, map.sheridenEntrance.y, now);
      }
      const stage = sceneNow === "hub" ? null : STAGES.find((s) => s.id === sceneNow);
      for (const memory of map.memories || stage?.memories || []) {
        const target = memoryTarget(memory, map);
        if (target.landmark) {
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

      if (st.recruited && !g.riding) {
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
