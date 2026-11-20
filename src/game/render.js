import { STAGES, isStageUnlocked } from "@/data/stages";
import { WORLD_W, WORLD_H, WALL } from "./maps";
import { drawSheridenWorld } from "./sheridenRender";

export const MICAH_LOOK = {
  hair: "#7d4fc4",
  shirt: "#4f7de0",
  pants: "#3f3660",
  skin: "#f6d0b3",
  accent: "#d9e6ff",
  cap: "#17171f",
  longHair: true,
  jacket: "#1b1b22",
};

export const TOM_LOOK = {
  hair: "#3b2a1f",
  shirt: "#232329",
  pants: "#2b2b33",
  skin: "#f2c9a7",
  accent: "#c9ccd6",
};

const borderRects = (w = WORLD_W, h = WORLD_H) => [
  { x: 0, y: 0, w, h: WALL },
  { x: 0, y: h - WALL, w, h: WALL },
  { x: 0, y: 0, w: WALL, h },
  { x: w - WALL, y: 0, w: WALL, h },
];

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawWorldBorder(ctx, type, w = WORLD_W) {
  for (const r of borderRects(w)) {
    if (type === "cafe") {
      ctx.fillStyle = "#4a3022";
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = "#6b4630";
      if (r.h > r.w) {
        for (let y = 6; y < r.y + r.h + WORLD_H; y += 46) {
          ctx.fillRect(r.x + 4, y, r.w - 8, 2);
        }
      } else {
        for (let x = 6; x < r.x + r.w + WORLD_W; x += 46) {
          ctx.fillRect(x, r.y + 4, 2, r.h - 8);
        }
      }
    } else if (type === "airport") {
      ctx.fillStyle = "#cdc4b4";
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = "#e7e0d4";
      if (r.w > r.h) ctx.fillRect(r.x, r.y, r.w, 5);
      else ctx.fillRect(r.x, r.y, 5, r.h);
      ctx.fillStyle = "rgba(110,100,84,0.18)";
      if (r.w > r.h) {
        for (let x = r.x + 40; x < r.x + r.w; x += 80) {
          ctx.fillRect(x, r.y + 6, 2, r.h - 12);
        }
      } else {
        for (let y = r.y + 40; y < r.y + r.h; y += 80) {
          ctx.fillRect(r.x + 6, y, r.w - 12, 2);
        }
      }
    } else {
      const base = type === "night" ? "#1d2a33" : "#3f6b3a";
      const blob = type === "night" ? "#273b46" : "#54854b";
      ctx.fillStyle = base;
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = blob;
      const step = 18;
      for (let x = r.x + 9; x < r.x + r.w; x += step) {
        for (let y = r.y + 9; y < r.y + r.h; y += step) {
          const n = Math.sin(x * 0.7 + y * 1.3);
          if (n > -0.2) ctx.fillRect(x, y, 8, 8);
        }
      }
    }
  }
}

function drawGrass(ctx, base, dark, light) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  for (let x = 28; x < WORLD_W; x += 62) {
    for (let y = 28; y < WORLD_H; y += 54) {
      const n = Math.sin(x * 0.31 + y * 0.47);
      ctx.fillStyle = n > 0 ? dark : light;
      ctx.fillRect(x + (n > 0 ? 0 : 6), y, 5, 9);
      if (n > 0.55) ctx.fillRect(x + 10, y + 4, 4, 6);
    }
  }
}

function label(ctx, text, x, y, color, size = 13, align = "center") {
  ctx.font = `bold ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillText(text, x + 1, y + 1);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawTree(ctx, p) {
  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 16, 32, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6d4a31";
  ctx.fillRect(cx - 5, cy + 2, 10, 18);
  const blobs = [
    [0, -14, 28],
    [-20, -4, 20],
    [20, -4, 20],
    [0, 4, 22],
  ];
  for (const [dx, dy, r] of blobs) {
    ctx.fillStyle = "#3f7038";
    ctx.beginPath();
    ctx.arc(cx + dx, cy + dy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#548c46";
  ctx.beginPath();
  ctx.arc(cx - 6, cy - 18, 13, 0, Math.PI * 2);
  ctx.fill();
}

function drawBench(ctx, p) {
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(p.x + p.w / 2, p.y + p.h + 2, p.w / 2, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7c5334";
  ctx.fillRect(p.x, p.y + 6, p.w, p.h - 12);
  ctx.fillStyle = "#a57347";
  ctx.fillRect(p.x, p.y, p.w, 10);
  ctx.fillStyle = "#5c3c26";
  for (let x = p.x + 10; x < p.x + p.w - 8; x += 20) {
    ctx.fillRect(x, p.y + 10, 3, p.h - 14);
  }
}

function drawCafeProps(ctx, p) {
  if (p.type === "counter") {
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(p.x + 5, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#8a5637";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#b37a4e";
    ctx.fillRect(p.x, p.y, p.w, 14);
    ctx.fillStyle = "#6b3f27";
    for (let x = p.x + 16; x < p.x + p.w; x += 52) {
      ctx.fillRect(x, p.y + 20, 2, p.h - 24);
    }
    ctx.fillStyle = "#2f2a26";
    [0.25, 0.55, 0.8].forEach((f) => {
      const mx = p.x + p.w * f;
      ctx.fillRect(mx - 8, p.y - 10, 16, 12);
      ctx.fillStyle = "#e9edf2";
      ctx.fillRect(mx - 6, p.y - 24, 12, 14);
      ctx.fillStyle = "#2f2a26";
    });
  } else if (p.type === "display") {
    ctx.fillStyle = "#6b4630";
    ctx.fillRect(p.x, p.y + p.h - 12, p.w, 12);
    ctx.fillStyle = "rgba(180,220,235,0.65)";
    ctx.fillRect(p.x + 4, p.y, p.w - 8, p.h - 12);
    ctx.strokeStyle = "#8a6a4d";
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x + 4, p.y, p.w - 8, p.h - 12);
    ctx.fillStyle = "#d9a066";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(p.x + 20 + i * 32, p.y + p.h / 2, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (p.type === "table") {
    const cx = p.x + p.w / 2;
    const cy = p.y + p.h / 2;
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 12, p.w / 2, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7c4f31";
    ctx.beginPath();
    ctx.arc(cx, cy, p.w / 2 - 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c08a5a";
    ctx.beginPath();
    ctx.arc(cx, cy - 2, p.w / 2 - 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f4e5d0";
    ctx.beginPath();
    ctx.arc(cx - 12, cy - 6, 5, 0, Math.PI * 2);
    ctx.arc(cx + 14, cy + 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8a5a35";
    ctx.fillRect(cx - 2, cy - 18, 4, 8);
  } else if (p.type === "plant") {
    ctx.fillStyle = "#a8663f";
    ctx.beginPath();
    ctx.moveTo(p.x + 8, p.y + p.h);
    ctx.lineTo(p.x + p.w - 8, p.y + p.h);
    ctx.lineTo(p.x + p.w - 13, p.y + p.h - 20);
    ctx.lineTo(p.x + 13, p.y + p.h - 20);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#3f7a3d";
    for (const [dx, dy, r] of [
      [0, -30, 14],
      [-12, -20, 11],
      [12, -20, 11],
    ]) {
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2 + dx, p.y + p.h - 26 + dy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawParkProps(ctx, p) {
  if (p.type === "pond") {
    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2 + 3, p.y + p.h / 2 + 5, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4f95a8";
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#79bdd0";
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2, p.y + p.h / 2, p.w / 2 - 12, p.h / 2 - 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.ellipse(p.x + p.w / 2, p.y + p.h / 2, 24 + i * 18, 5 + i * 4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (p.type === "bench") {
    drawBench(ctx, p);
  } else if (p.type === "tree") {
    drawTree(ctx, p);
  }
}

function drawNightProps(ctx, p) {
  if (p.type === "car") {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    roundRect(ctx, p.x + 6, p.y + 8, p.w, p.h, 26);
    ctx.fill();
    ctx.fillStyle = "#a9474a";
    roundRect(ctx, p.x, p.y, p.w, p.h, 28);
    ctx.fill();
    ctx.fillStyle = "#7d3236";
    roundRect(ctx, p.x + 22, p.y + 14, p.w - 44, 28, 12);
    ctx.fill();
    ctx.fillStyle = "#bfe3ef";
    roundRect(ctx, p.x + 26, p.y + 18, p.w - 52, 18, 9);
    ctx.fill();
    roundRect(ctx, p.x + 26, p.y + p.h - 38, p.w - 52, 18, 9);
    ctx.fill();
    ctx.fillStyle = "#8a383c";
    roundRect(ctx, p.x + 14, p.y + p.h / 2 - 18, p.w - 28, 28, 12);
    ctx.fill();
    ctx.fillStyle = "#ffe6a3";
    ctx.fillRect(p.x + 2, p.y + 26, 7, 16);
    ctx.fillRect(p.x + 2, p.y + p.h - 42, 7, 16);
    ctx.fillStyle = "#575c6b";
    ctx.fillRect(p.x + 26, p.y - 5, 30, 10);
    ctx.fillRect(p.x + p.w - 58, p.y - 5, 30, 10);
    ctx.fillRect(p.x + 26, p.y + p.h - 5, 30, 10);
    ctx.fillRect(p.x + p.w - 58, p.y + p.h - 5, 30, 10);
  } else if (p.type === "streetlight") {
    const cx = p.x + p.w / 2;
    const cy = p.y + p.h / 2;
    const glow = ctx.createRadialGradient(cx, cy - 60, 4, cx, cy - 60, 90);
    glow.addColorStop(0, "rgba(255,220,150,0.5)");
    glow.addColorStop(1, "rgba(255,220,150,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(cx - 90, cy - 150, 180, 180);
    ctx.fillStyle = "#3a4152";
    ctx.fillRect(cx - 3, cy - 64, 6, 66);
    ctx.fillRect(cx - 16, cy - 68, 32, 7);
    ctx.fillStyle = "#ffe4a0";
    ctx.beginPath();
    ctx.arc(cx, cy - 60, 8, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === "boulder") {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2, p.y + p.h - 4, p.w / 2, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4c5262";
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#646b7e";
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2 - 8, p.y + p.h / 2 - 8, p.w / 3, p.h / 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function portalColors(unlocked) {
  return unlocked
    ? { stone: "#5b4266", inner: "#f6a8c8", glow: "rgba(246,168,200,0.35)" }
    : { stone: "#3a3c4a", inner: "#5a6070", glow: "rgba(120,130,150,0.16)" };
}

function drawArch(ctx, cx, baseY, w, h, colors) {
  const glow = ctx.createRadialGradient(cx, baseY - h / 2, 4, cx, baseY - h / 2, h);
  glow.addColorStop(0, colors.glow);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(cx - h, baseY - h * 1.5, h * 2, h * 2);

  const left = cx - w / 2;
  const right = cx + w / 2;
  ctx.fillStyle = colors.stone;
  ctx.beginPath();
  ctx.moveTo(left - 10, baseY);
  ctx.lineTo(left - 10, baseY - h + w / 2);
  ctx.arc(cx, baseY - h + w / 2, w / 2 + 10, Math.PI, 0);
  ctx.lineTo(right + 10, baseY);
  ctx.lineTo(right - 10, baseY);
  ctx.lineTo(right - 10, baseY - h + w / 2);
  ctx.arc(cx, baseY - h + w / 2, w / 2 - 10, 0, Math.PI, true);
  ctx.lineTo(left + 10, baseY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = colors.inner;
  ctx.beginPath();
  ctx.moveTo(left + 8, baseY - 2);
  ctx.lineTo(left + 8, baseY - h + w / 2);
  ctx.arc(cx, baseY - h + w / 2, w / 2 - 8, Math.PI, 0);
  ctx.lineTo(right - 8, baseY - 2);
  ctx.closePath();
  ctx.fill();
}

function drawLock(ctx, x, y) {
  ctx.strokeStyle = "#d9dbe6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y - 5, 6, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = "#d9dbe6";
  roundRect(ctx, x - 9, y - 5, 18, 15, 3);
  ctx.fill();
  ctx.fillStyle = "#3a3c4a";
  ctx.fillRect(x - 1.5, y, 3, 6);
}

function drawPortals(ctx, map) {
  for (const p of map.portals) {
    const stage = STAGES.find((s) => s.id === p.stageId);
    if (!stage) continue;
    const unlocked = isStageUnlocked(stage);
    const colors = portalColors(unlocked);
    drawArch(ctx, p.x, p.y + 38, 68, 104, colors);
    label(ctx, stage.gateLabel || `Month ${stage.id}`, p.x, p.y + 56, "#f4e7ef", 13);
    label(
      ctx,
      unlocked ? "open" : "locked",
      p.x,
      p.y + 73,
      unlocked ? "#ffd0e2" : "#9aa0b0",
      10,
    );
    if (!unlocked) drawLock(ctx, p.x, p.y + 6);
  }
}

function drawExit(ctx, map) {
  if (!map.exit) return;
  drawArch(ctx, map.exit.x, map.exit.y + 6, 76, 66, {
    stone: "#46535b",
    inner: "#8fd4c4",
    glow: "rgba(143,212,196,0.3)",
  });
  label(ctx, map.exitLabel || "Back to Hub", map.exit.x, map.exit.y + 22, "#e7fff9", 11);
}

function drawAirportWindows(ctx, w = WORLD_W) {
  const top = 510;
  const h = 42;
  const sky = ctx.createLinearGradient(0, top, 0, top + h);
  sky.addColorStop(0, "#a9d2e4");
  sky.addColorStop(0.7, "#cfe7f0");
  sky.addColorStop(1, "#e4f2f6");
  ctx.fillStyle = sky;
  ctx.fillRect(0, top, w, h);

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  for (const [x, y, rx, ry] of [
    [w * 0.14, 13, 28, 6],
    [w * 0.19, 9, 16, 5],
    [w * 0.44, 22, 32, 6],
    [w * 0.49, 28, 18, 5],
    [w * 0.72, 15, 24, 5],
  ]) {
    ctx.beginPath();
    ctx.ellipse(x, top + y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#7f858a";
  ctx.fillRect(0, top + h - 11, w, 11);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  for (let x = 10; x < w; x += 46) {
    ctx.fillRect(x, top + h - 6, 22, 2);
  }

  const px = w - 300;
  const py = top + 17;
  ctx.fillStyle = "rgba(40,50,60,0.18)";
  ctx.beginPath();
  ctx.ellipse(px + 4, py + 16, 58, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f2f4f5";
  ctx.beginPath();
  ctx.ellipse(px, py, 54, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(px - 8, py);
  ctx.lineTo(px - 44, py - 17);
  ctx.lineTo(px - 22, py);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(px - 8, py);
  ctx.lineTo(px - 44, py + 15);
  ctx.lineTo(px - 20, py);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#dfe5e8";
  ctx.fillRect(px + 40, py - 13, 8, 13);
  ctx.fillStyle = "#c3cdd2";
  ctx.fillRect(px - 46, py - 3, 10, 6);

  ctx.fillStyle = "#efe9de";
  for (let x = 0; x < w; x += 96) ctx.fillRect(x, top, 7, h);
  ctx.fillStyle = "#b6ab9a";
  ctx.fillRect(0, top, w, 4);
}

function drawAirportProps(ctx, p) {
  if (p.type === "desk") {
    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.fillRect(p.x + 5, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#7b8578";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#a9b3a4";
    ctx.fillRect(p.x, p.y, p.w, 12);
    ctx.fillStyle = "#66705f";
    for (let x = p.x + 24; x < p.x + p.w - 12; x += 56) {
      ctx.fillRect(x, p.y + 18, 2, p.h - 24);
    }
    for (let i = 0; i < 3; i++) {
      const mx = p.x + 40 + i * 62;
      ctx.fillStyle = "#2b2f36";
      ctx.fillRect(mx - 11, p.y - 24, 22, 8);
      ctx.fillStyle = "#26333a";
      ctx.fillRect(mx - 15, p.y - 44, 30, 22);
      ctx.fillStyle = "#7fd6a8";
      ctx.fillRect(mx - 12, p.y - 41, 24, 15);
      ctx.fillStyle = "rgba(20,50,35,0.45)";
      ctx.fillRect(mx - 9, p.y - 38, 12, 2);
      ctx.fillRect(mx - 9, p.y - 34, 17, 2);
      ctx.fillRect(mx - 9, p.y - 30, 9, 2);
    }
    label(ctx, "CHECK-IN", p.x + p.w / 2, p.y - 12, "#5b5346", 12);
  } else if (p.type === "seat") {
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(p.x + 4, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#6b7377";
    ctx.fillRect(p.x, p.y + 4, p.w, p.h - 4);
    ctx.fillStyle = "#8b9497";
    ctx.fillRect(p.x, p.y, p.w, 10);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i % 2 ? "#4f7d95" : "#5a8aa3";
      roundRect(ctx, p.x + 9 + i * 51, p.y + 14, 42, p.h - 18, 5);
      ctx.fill();
    }
    ctx.fillStyle = "#3f4649";
    for (let i = 0; i <= 4; i++) {
      ctx.fillRect(p.x + 4 + i * 51, p.y + 12, 3, p.h - 20);
    }
    ctx.fillStyle = "#4a5154";
    ctx.fillRect(p.x + 8, p.y + p.h, 4, 5);
    ctx.fillRect(p.x + p.w - 12, p.y + p.h, 4, 5);
  } else if (p.type === "luggage") {
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2, p.y + p.h, p.w / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#7a6a5a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x + 22, p.y + 22, 8, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = "#c2738c";
    roundRect(ctx, p.x + 6, p.y + 22, 34, 30, 4);
    ctx.fill();
    ctx.strokeStyle = "#7a6a5a";
    ctx.beginPath();
    ctx.arc(p.x + 55, p.y + 12, 8, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = "#c9a24a";
    roundRect(ctx, p.x + 38, p.y + 12, 32, 40, 4);
    ctx.fill();
    ctx.fillStyle = "rgba(80,60,30,0.28)";
    ctx.fillRect(p.x + 38, p.y + 24, 32, 4);
    ctx.fillRect(p.x + 38, p.y + 38, 32, 4);
  } else if (p.type === "bos-coffee") {
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(p.x + 4, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#efe2cd";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#6b4a36";
    ctx.fillRect(p.x, p.y, p.w, 14);
    for (let i = 0; i < Math.ceil(p.w / 22); i++) {
      ctx.fillStyle = i % 2 ? "#f4e3c8" : "#b4574c";
      ctx.fillRect(p.x + i * 22, p.y + 14, Math.min(22, p.x + p.w - (p.x + i * 22)), 10);
    }
    ctx.fillStyle = "#2c3440";
    roundRect(ctx, p.x + 8, p.y + 28, p.w - 16, 22, 4);
    ctx.fill();
    label(ctx, "BOS COFFEE", p.x + p.w / 2, p.y + 39, "#ffe9d2", 10);
    ctx.fillStyle = "#b98e63";
    ctx.fillRect(p.x + 8, p.y + p.h - 20, p.w - 16, 14);
    ctx.fillStyle = "#3a3f48";
    roundRect(ctx, p.x + 16, p.y + 55, 26, 16, 3);
    ctx.fill();
    ctx.fillStyle = "#7fd6a8";
    ctx.fillRect(p.x + 21, p.y + 59, 10, 5);
    ctx.fillStyle = "#f8f4ec";
    ctx.fillRect(p.x + 52, p.y + 57, 11, 13);
    ctx.fillRect(p.x + 68, p.y + 57, 11, 13);
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x + 58, p.y + 53);
    ctx.quadraticCurveTo(p.x + 54, p.y + 48, p.x + 58, p.y + 43);
    ctx.moveTo(p.x + 74, p.y + 53);
    ctx.quadraticCurveTo(p.x + 70, p.y + 48, p.x + 74, p.y + 43);
    ctx.stroke();
  } else if (p.type === "shop") {
    const accent = p.accent || "#c86a5a";
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(p.x + 5, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#efe7d6";
    roundRect(ctx, p.x, p.y + 12, p.w, p.h - 12, 6);
    ctx.fill();

    ctx.fillStyle = "#d9cdb8";
    ctx.fillRect(p.x + 12, p.y + 46, p.w - 24, p.h - 72);
    for (let i = 0; i < 5; i++) {
      const jx = p.x + 24 + i * 38;
      ctx.fillStyle = ["#e0a85f", "#c97b6b", "#8fb7a2"][i % 3];
      roundRect(ctx, jx, p.y + 54, 22, 20, 4);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillRect(jx + 4, p.y + 58, 14, 4);
      ctx.fillStyle = "#b98e63";
      ctx.fillRect(jx + 2, p.y + 74, 18, 10);
    }

    ctx.fillStyle = "#b98e63";
    ctx.fillRect(p.x + 8, p.y + p.h - 26, p.w - 16, 20);
    ctx.fillStyle = "#d9b48c";
    ctx.fillRect(p.x + 8, p.y + p.h - 30, p.w - 16, 8);

    for (let i = 0; i < Math.ceil(p.w / 28); i++) {
      ctx.fillStyle = i % 2 ? "#f7f1e6" : accent;
      ctx.fillRect(p.x + i * 28, p.y + 12, Math.min(28, p.x + p.w - (p.x + i * 28)), 18);
    }
    ctx.fillStyle = accent;
    for (let i = 0; i < Math.ceil(p.w / 28); i++) {
      ctx.beginPath();
      ctx.arc(p.x + i * 28 + 14, p.y + 30, 6, 0, Math.PI);
      ctx.fill();
    }

    ctx.fillStyle = "#2c3440";
    roundRect(ctx, p.x + 12, p.y - 28, p.w - 24, 24, 4);
    ctx.fill();
    label(ctx, p.label, p.x + p.w / 2, p.y - 16, "#ffe9d2", 11);
  } else if (p.type === "plant") {
    drawCafeProps(ctx, p);
  }
}

function drawGreenfieldProps(ctx, p) {
  if (p.type === "sidewalk") {
    ctx.fillStyle = "#9cc47c";
    roundRect(ctx, p.x, p.y, p.w, p.h, 10);
    ctx.fill();
    ctx.strokeStyle = "#7fa966";
    ctx.lineWidth = 2;
    roundRect(ctx, p.x + 1, p.y + 1, p.w - 2, p.h - 2, 9);
    ctx.stroke();

    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(p.x + 12, p.y + p.h - 14);
    ctx.quadraticCurveTo(p.x + p.w * 0.32, p.y + 8, p.x + p.w * 0.56, p.y + p.h - 16);
    ctx.quadraticCurveTo(p.x + p.w * 0.76, p.y + p.h - 2, p.x + p.w - 12, p.y + 14);
    ctx.strokeStyle = "#c8b48d";
    ctx.lineWidth = 18;
    ctx.stroke();
    ctx.strokeStyle = "#e8d6b2";
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.lineCap = "butt";

    for (const [fx, fy, color] of [
      [p.x + 28, p.y + 16, "#f2b7cb"],
      [p.x + 44, p.y + 10, "#f6d488"],
      [p.x + p.w - 34, p.y + p.h - 12, "#f2b7cb"],
      [p.x + p.w - 52, p.y + p.h - 7, "#f6d488"],
    ]) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const [bx, by, r] of [
      [p.x + 18, p.y + p.h - 18, 9],
      [p.x + p.w - 18, p.y + 18, 9],
    ]) {
      ctx.fillStyle = "#5d8f55";
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#74a966";
      ctx.beginPath();
      ctx.arc(bx - 2, by - 3, r / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#6d5744";
    ctx.fillRect(p.x + p.w - 44, p.y + 7, 3, 18);
    ctx.fillStyle = "#ffe1a0";
    ctx.beginPath();
    ctx.arc(p.x + p.w - 42.5, p.y + 6, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === "cafe") {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(p.x + 6, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#c4936c";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#8c5a40";
    ctx.fillRect(p.x, p.y, p.w, 16);
    for (let i = 0; i < 3; i++) {
      const wx = p.x + 24 + i * 74;
      ctx.fillStyle = "#ffe1a3";
      ctx.fillRect(wx, p.y + 32, 52, 46);
      ctx.strokeStyle = "#7a4c35";
      ctx.lineWidth = 3;
      ctx.strokeRect(wx, p.y + 32, 52, 46);
      ctx.strokeStyle = "rgba(122,76,53,0.5)";
      ctx.beginPath();
      ctx.moveTo(wx, p.y + 55);
      ctx.lineTo(wx + 52, p.y + 55);
      ctx.stroke();
    }
    ctx.fillStyle = "#3a2b28";
    roundRect(ctx, p.x + 18, p.y + p.h - 38, p.w - 36, 26, 5);
    ctx.fill();
    label(ctx, "CAFÉ", p.x + p.w / 2, p.y + p.h - 25, "#ffe9c9", 13);
    for (let i = 0; i < Math.ceil(p.w / 28); i++) {
      ctx.fillStyle = i % 2 ? "#f4e3c8" : "#b4574c";
      ctx.fillRect(p.x + i * 28, p.y + p.h - 10, 28, 10);
    }
  } else if (p.type === "cinema") {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(p.x + 6, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#6c4a63";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#4d3548";
    ctx.fillRect(p.x, p.y, p.w, 16);
    for (let i = 0; i < 2; i++) {
      ctx.fillStyle = "#ffdf9e";
      ctx.fillRect(p.x + 18 + i * 36, p.y + 34, 24, 32);
      ctx.fillRect(p.x + p.w - 42 - i * 36, p.y + 34, 24, 32);
    }
    ctx.fillStyle = "#f4e8cf";
    roundRect(ctx, p.x + 12, p.y + p.h - 56, p.w - 24, 40, 5);
    ctx.fill();
    for (let i = 0; i < 10; i++) {
      const bx = p.x + 20 + i * ((p.w - 40) / 9);
      ctx.fillStyle = i % 2 ? "#ffcf6e" : "#fff1c9";
      ctx.beginPath();
      ctx.arc(bx, p.y + p.h - 52, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    label(ctx, "CINEMA", p.x + p.w / 2, p.y + p.h - 35, "#6b3f58", 16);
  } else if (p.type === "apartment") {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(p.x + 6, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#8d8299";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#6a6078";
    ctx.fillRect(p.x, p.y, p.w, 16);
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.fillStyle = (row + col) % 3 === 0 ? "#ffe1a3" : "#fff0c9";
        ctx.fillRect(p.x + 22 + col * 56, p.y + 30 + row * 34, 32, 22);
        ctx.strokeStyle = "#5e5668";
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x + 22 + col * 56, p.y + 30 + row * 34, 32, 22);
      }
    }
    ctx.fillStyle = "#332d3d";
    roundRect(ctx, p.x + 34, p.y + p.h - 30, p.w - 68, 22, 4);
    ctx.fill();
    label(ctx, "AIRBNB", p.x + p.w / 2, p.y + p.h - 19, "#f3e9ff", 12);
  } else if (p.type === "samgyupsal") {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(p.x + 6, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#7a4a3a";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#543127";
    ctx.fillRect(p.x, p.y, p.w, 18);
    ctx.fillStyle = "#8a5a45";
    ctx.fillRect(p.x + 12, p.y + 26, p.w - 24, 46);
    for (let i = 0; i < 3; i++) {
      const wx = p.x + 22 + i * 54;
      ctx.fillStyle = "#ffd9a0";
      ctx.fillRect(wx, p.y + 34, 40, 30);
      ctx.strokeStyle = "#4a2a21";
      ctx.lineWidth = 2;
      ctx.strokeRect(wx, p.y + 34, 40, 30);
      ctx.fillStyle = "#4a2a21";
      ctx.beginPath();
      ctx.arc(wx + 20, p.y + 49, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff9b5e";
      ctx.beginPath();
      ctx.arc(wx + 20, p.y + 49, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#3a2b28";
    roundRect(ctx, p.x + 14, p.y + p.h - 30, p.w - 28, 24, 4);
    ctx.fill();
    label(ctx, "SAMGYUPSAL", p.x + p.w / 2, p.y + p.h - 18, "#ffe9c9", 12);
    ctx.fillStyle = "#4a4a52";
    ctx.fillRect(p.x + p.w - 36, p.y - 18, 10, 20);
  } else if (p.type === "megamall") {
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(p.x + 6, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#627485";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#43525f";
    ctx.fillRect(p.x, p.y, p.w, 16);
    ctx.fillStyle = "#a9d3e0";
    ctx.fillRect(p.x + 14, p.y + 28, p.w - 28, 66);
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const gx = p.x + 14 + i * ((p.w - 28) / 4);
      ctx.beginPath();
      ctx.moveTo(gx, p.y + 28);
      ctx.lineTo(gx, p.y + 94);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(p.x + 18, p.y + 32, 30, 58);
    ctx.fillStyle = "#2c3742";
    roundRect(ctx, p.x + 46, p.y + 100, p.w - 92, 24, 4);
    ctx.fill();
    label(ctx, p.label || "MEGAMALL", p.x + p.w / 2, p.y + 112, "#eaf7ff", 13);
    ctx.fillStyle = "#ffdf9e";
    ctx.fillRect(p.x + p.w / 2 - 16, p.y + 70, 32, 26);
    ctx.fillStyle = "#394653";
    ctx.fillRect(p.x + p.w / 2 - 2, p.y + 70, 4, 26);
  } else if (p.type === "mountain") {
    const sky = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
    sky.addColorStop(0, "#a9c9c7");
    sky.addColorStop(1, "#d7e0cf");
    ctx.fillStyle = sky;
    ctx.fillRect(p.x, p.y, p.w, p.h);

    ctx.fillStyle = "#7f9c8d";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y + p.h);
    ctx.lineTo(p.x, p.y + p.h * 0.78);
    ctx.lineTo(p.x + p.w * 0.1, p.y + p.h * 0.34);
    ctx.lineTo(p.x + p.w * 0.2, p.y + p.h * 0.62);
    ctx.lineTo(p.x + p.w * 0.32, p.y + p.h * 0.24);
    ctx.lineTo(p.x + p.w * 0.46, p.y + p.h * 0.66);
    ctx.lineTo(p.x + p.w * 0.6, p.y + p.h * 0.3);
    ctx.lineTo(p.x + p.w * 0.74, p.y + p.h * 0.62);
    ctx.lineTo(p.x + p.w * 0.88, p.y + p.h * 0.26);
    ctx.lineTo(p.x + p.w, p.y + p.h * 0.7);
    ctx.lineTo(p.x + p.w, p.y + p.h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#5f7f6b";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y + p.h);
    ctx.lineTo(p.x, p.y + p.h * 0.9);
    ctx.lineTo(p.x + p.w * 0.16, p.y + p.h * 0.58);
    ctx.lineTo(p.x + p.w * 0.3, p.y + p.h * 0.84);
    ctx.lineTo(p.x + p.w * 0.44, p.y + p.h * 0.52);
    ctx.lineTo(p.x + p.w * 0.6, p.y + p.h * 0.86);
    ctx.lineTo(p.x + p.w * 0.78, p.y + p.h * 0.56);
    ctx.lineTo(p.x + p.w, p.y + p.h * 0.88);
    ctx.lineTo(p.x + p.w, p.y + p.h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(p.x, p.y + p.h * 0.58, p.w, 9);
    const fade = ctx.createLinearGradient(0, p.y + p.h - 46, 0, p.y + p.h);
    fade.addColorStop(0, "rgba(216,200,172,0)");
    fade.addColorStop(1, "rgba(216,200,172,1)");
    ctx.fillStyle = fade;
    ctx.fillRect(p.x, p.y + p.h - 46, p.w, 46);
  } else if (p.type === "sign") {
    ctx.fillStyle = "#5a4632";
    ctx.fillRect(p.x + 20, p.y + p.h - 30, 6, 30);
    ctx.fillRect(p.x + p.w - 26, p.y + p.h - 30, 6, 30);
    ctx.fillStyle = "#2f6b4f";
    roundRect(ctx, p.x, p.y, p.w, p.h - 26, 6);
    ctx.fill();
    ctx.strokeStyle = "#eaf4e6";
    ctx.lineWidth = 3;
    roundRect(ctx, p.x + 4, p.y + 4, p.w - 8, p.h - 34, 5);
    ctx.stroke();
    label(ctx, p.label, p.x + p.w / 2, p.y + (p.h - 26) / 2, "#f2fbf0", 15);
  } else if (p.type === "pine") {
    const cx = p.x + p.w / 2;
    const cy = p.y + p.h / 2;
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 18, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5a4030";
    ctx.fillRect(cx - 3, cy + 6, 6, 13);
    for (let i = 0; i < 3; i++) {
      const top = cy - 22 + i * 12;
      const half = 11 + i * 6;
      ctx.fillStyle = i % 2 ? "#2f5a3d" : "#376a48";
      ctx.beginPath();
      ctx.moveTo(cx, top);
      ctx.lineTo(cx - half, top + 24);
      ctx.lineTo(cx + half, top + 24);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = "#4b7d57";
    ctx.beginPath();
    ctx.arc(cx - 4, cy - 12, 5, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === "photobooth") {
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(p.x + 5, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#5a4a78";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#403356";
    ctx.fillRect(p.x, p.y, p.w, 14);
    ctx.fillStyle = "#241d30";
    ctx.fillRect(p.x + 14, p.y + 34, p.w - 28, p.h - 48);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 ? "#a84358" : "#c4556b";
      ctx.fillRect(p.x + 10, p.y + 34 + i * 14, 9, 14);
      ctx.fillRect(p.x + p.w - 19, p.y + 34 + i * 14, 9, 14);
    }
    ctx.fillStyle = "#ffe9b0";
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2, p.y + 52, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2c3440";
    roundRect(ctx, p.x + 8, p.y - 26, p.w - 16, 24, 4);
    ctx.fill();
    label(ctx, "PHOTOBOOTH", p.x + p.w / 2, p.y - 14, "#ffe9d2", 10);
  } else if (p.type === "studio") {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(p.x + 6, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#4b4f66";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#34384a";
    ctx.fillRect(p.x, p.y, p.w, 16);
    ctx.fillStyle = "#9fc7d4";
    ctx.fillRect(p.x + 12, p.y + 26, p.w - 24, 56);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const gx = p.x + 12 + i * ((p.w - 24) / 3);
      ctx.beginPath();
      ctx.moveTo(gx, p.y + 26);
      ctx.lineTo(gx, p.y + 82);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,231,178,0.5)";
    ctx.fillRect(p.x + 22, p.y + 40, 24, 34);
    ctx.fillRect(p.x + p.w - 46, p.y + 40, 24, 34);
    ctx.fillStyle = "#232a36";
    roundRect(ctx, p.x + 10, p.y + p.h - 42, p.w - 20, 28, 4);
    ctx.fill();
    label(ctx, "Studio iKwaMe", p.x + p.w / 2, p.y + p.h - 28, "#dff6ff", 11);
    ctx.fillStyle = "#3d4354";
    ctx.fillRect(p.x + p.w / 2 - 12, p.y + p.h - 14, 24, 14);
  } else if (p.type === "condo") {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(p.x + 6, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#a8a2b8";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = "#7c7690";
    ctx.fillRect(p.x, p.y, p.w, 16);
    ctx.fillStyle = "#2f2c3e";
    roundRect(ctx, p.x + 12, p.y + 24, p.w - 24, 42, 5);
    ctx.fill();
    label(ctx, "SHERIDEN TOWERS", p.x + p.w / 2, p.y + 38, "#f0eaff", 10);
    label(ctx, "NORTH TOWER", p.x + p.w / 2, p.y + 54, "#cfc6e6", 9);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.fillStyle = (row + col) % 3 === 0 ? "#ffdf9e" : "#fff0c9";
        ctx.fillRect(p.x + 18 + col * 48, p.y + 82 + row * 40, 30, 24);
        ctx.strokeStyle = "#6a627c";
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x + 18 + col * 48, p.y + 82 + row * 40, 30, 24);
      }
    }
    ctx.fillStyle = "#6a627c";
    for (let row = 0; row < 4; row++) {
      ctx.fillRect(p.x + 10, p.y + 108 + row * 40, p.w - 20, 3);
    }
    ctx.fillStyle = "#ffdf9e";
    ctx.fillRect(p.x + p.w / 2 - 18, p.y + p.h - 42, 36, 42);
    ctx.fillStyle = "#5b5470";
    ctx.fillRect(p.x + p.w / 2 - 2, p.y + p.h - 42, 4, 42);
  } else if (p.type === "house") {
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(p.x + 5, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#e8d5b5";
    ctx.fillRect(p.x, p.y + 34, p.w, p.h - 34);
    ctx.fillStyle = "#a9504a";
    ctx.beginPath();
    ctx.moveTo(p.x - 8, p.y + 40);
    ctx.lineTo(p.x + p.w / 2, p.y);
    ctx.lineTo(p.x + p.w + 8, p.y + 40);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#8a3d39";
    ctx.fillRect(p.x - 8, p.y + 34, p.w + 16, 9);
    ctx.fillStyle = "#8a5a45";
    ctx.fillRect(p.x + p.w - 36, p.y - 10, 16, 28);

    for (let i = 0; i < 2; i++) {
      const wx = p.x + 18 + i * (p.w - 70);
      ctx.fillStyle = "#ffe1a3";
      ctx.fillRect(wx, p.y + 56, 34, 30);
      ctx.strokeStyle = "#7a6046";
      ctx.lineWidth = 3;
      ctx.strokeRect(wx, p.y + 56, 34, 30);
    }

    ctx.fillStyle = "#7a4c35";
    ctx.fillRect(p.x + p.w / 2 - 17, p.y + p.h - 44, 34, 44);
    ctx.fillStyle = "#e8c36f";
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2 + 9, p.y + p.h - 22, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2c3440";
    roundRect(ctx, p.x + 16, p.y - 52, p.w - 32, 40, 5);
    ctx.fill();
    label(ctx, p.label, p.x + p.w / 2, p.y - 40, "#ffe9d2", 10);
    label(ctx, p.sublabel, p.x + p.w / 2, p.y - 26, "#c9d9e8", 8);
  } else if (p.type === "videocall") {
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(p.x + 6, p.y + 8, p.w, p.h);
    ctx.fillStyle = "#3b4048";
    ctx.fillRect(p.x + p.w / 2 - 6, p.y + p.h - 18, 12, 18);
    ctx.fillStyle = "#23262e";
    roundRect(ctx, p.x, p.y, p.w, p.h - 16, 14);
    ctx.fill();
    ctx.fillStyle = "#bcd9e0";
    roundRect(ctx, p.x + 8, p.y + 8, p.w - 16, p.h - 40, 8);
    ctx.fill();

    ctx.fillStyle = "#f2c9a7";
    ctx.beginPath();
    ctx.arc(p.x + 48, p.y + 50, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7d4fc4";
    ctx.beginPath();
    ctx.arc(p.x + 48, p.y + 42, 16, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(p.x + 32, p.y + 42, 7, 18);
    ctx.fillRect(p.x + 57, p.y + 42, 7, 18);
    ctx.fillStyle = "#4f7de0";
    roundRect(ctx, p.x + 28, p.y + 66, 40, 20, 4);
    ctx.fill();

    ctx.fillStyle = "#f2c9a7";
    ctx.beginPath();
    ctx.arc(p.x + p.w - 48, p.y + 50, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3b2a1f";
    ctx.beginPath();
    ctx.arc(p.x + p.w - 48, p.y + 43, 16, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#232329";
    roundRect(ctx, p.x + p.w - 68, p.y + 66, 40, 20, 4);
    ctx.fill();

    ctx.fillStyle = "#d4568c";
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2 - 4, p.y + 48, 5, 0, Math.PI * 2);
    ctx.arc(p.x + p.w / 2 + 4, p.y + 48, 5, 0, Math.PI * 2);
    ctx.moveTo(p.x + p.w / 2 - 9, p.y + 50);
    ctx.lineTo(p.x + p.w / 2, p.y + 60);
    ctx.lineTo(p.x + p.w / 2 + 9, p.y + 50);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#2c3440";
    roundRect(ctx, p.x + 14, p.y + p.h - 54, p.w - 28, 22, 4);
    ctx.fill();
    label(ctx, "FACETIME", p.x + p.w / 2, p.y + p.h - 43, "#e7f7ff", 11);
  } else if (p.type === "bench") {
    drawBench(ctx, p);
  } else if (p.type === "tree") {
    drawTree(ctx, p);
  }
}

export function drawWorld(ctx, scene, map) {
  const w = map.width || WORLD_W;

  if (map.type === "sheriden-lobby" || map.type === "sheriden-roof") {
    drawSheridenWorld(ctx, map);
    drawExit(ctx, map);
    return;
  }

  if (map.type === "airport") {
    ctx.fillStyle = "#e3ddd0";
    ctx.fillRect(0, 0, w, WORLD_H);
    ctx.strokeStyle = "rgba(122,110,92,0.16)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, WORLD_H);
      ctx.stroke();
    }
    for (let y = 0; y <= WORLD_H; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(122,110,92,0.14)";
    for (let i = 0; i < 120; i++) {
      ctx.fillRect((i * 173) % w, (i * 97) % WORLD_H, 2, 2);
    }
    const cx = w / 2;
    ctx.fillStyle = "#8d4f63";
    ctx.fillRect(cx - 50, 0, 100, WORLD_H);
    ctx.fillStyle = "#a56276";
    ctx.fillRect(cx - 42, 0, 84, WORLD_H);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    for (let y = 0; y < WORLD_H; y += 44) ctx.fillRect(cx - 50, y, 100, 3);
    drawAirportWindows(ctx, w);
  } else if (map.type === "cafe") {
    ctx.fillStyle = "#b98b5e";
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    for (let y = 0; y < WORLD_H; y += 30) {
      ctx.fillStyle = y % 60 === 0 ? "#b1835a" : "#bd9063";
      ctx.fillRect(0, y, WORLD_W, 28);
      ctx.fillStyle = "rgba(90,60,35,0.25)";
      ctx.fillRect(0, y + 28, WORLD_W, 2);
    }
    ctx.fillStyle = "#c96f7a";
    roundRect(ctx, 396, 262, 168, 122, 14);
    ctx.fill();
    ctx.strokeStyle = "#e8c3a8";
    ctx.lineWidth = 5;
    roundRect(ctx, 404, 270, 152, 106, 10);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,230,180,0.22)";
    for (let i = 0; i < 3; i++) {
      const lx = 220 + i * 260;
      const glow = ctx.createRadialGradient(lx, 60, 2, lx, 60, 70);
      glow.addColorStop(0, "rgba(255,214,140,0.4)");
      glow.addColorStop(1, "rgba(255,214,140,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(lx - 70, 0, 140, 140);
      ctx.fillStyle = "#3a2b21";
      ctx.fillRect(lx - 1, 0, 2, 38);
      ctx.fillStyle = "#ffe0a0";
      ctx.beginPath();
      ctx.arc(lx, 44, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (map.type === "park") {
    drawGrass(ctx, "#86b06a", "#76a05b", "#96c17a");
    ctx.fillStyle = "#d8c8a4";
    ctx.beginPath();
    ctx.moveTo(420, WORLD_H);
    ctx.lineTo(540, WORLD_H);
    ctx.lineTo(540, 380);
    ctx.quadraticCurveTo(540, 300, 480, 300);
    ctx.quadraticCurveTo(420, 300, 420, 380);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 26; i++) {
      const x = 60 + ((i * 137) % 840);
      const y = 60 + ((i * 89) % 440);
      const n = Math.sin(i * 3.7);
      ctx.fillStyle = n > 0 ? "rgba(255,240,180,0.8)" : "rgba(255,190,215,0.8)";
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#d8c8a4";
    roundRect(ctx, 300, 260, 130, 60, 20);
    ctx.fill();
  } else if (map.type === "greenfield") {
    ctx.fillStyle = "#d8c8ac";
    ctx.fillRect(0, 0, w, WORLD_H);
    ctx.strokeStyle = "rgba(122,98,72,0.16)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, WORLD_H);
      ctx.stroke();
    }
    for (let y = 0; y <= WORLD_H; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.stroke();
    }
    const plazaX = w / 2;
    ctx.fillStyle = "#cbb694";
    ctx.beginPath();
    ctx.arc(plazaX, 330, 118, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,246,225,0.7)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(plazaX, 330, 108, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#b39a76";
    ctx.beginPath();
    ctx.arc(plazaX, 330, 15, 0, Math.PI * 2);
    ctx.fill();

    const lx1 = w * 0.15;
    const lx2 = w * 0.85;
    ctx.strokeStyle = "rgba(95,72,55,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx1, 250);
    ctx.quadraticCurveTo(plazaX, 288, lx2, 250);
    ctx.stroke();
    for (let i = 1; i < 18; i++) {
      const t = i / 18;
      const lx =
        (1 - t) * (1 - t) * lx1 + 2 * (1 - t) * t * plazaX + t * t * lx2;
      const ly =
        (1 - t) * (1 - t) * 250 + 2 * (1 - t) * t * 288 + t * t * 250 + 5;
      ctx.fillStyle = "rgba(255,210,130,0.18)";
      ctx.beginPath();
      ctx.arc(lx, ly, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffd98c";
      ctx.beginPath();
      ctx.arc(lx, ly, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#6d5744";
    ctx.fillRect(lx1 - 4, 250, 4, 44);
    ctx.fillRect(lx2, 250, 4, 44);
  } else if (map.type === "night") {
    ctx.fillStyle = "#23303a";
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let x = 30; x < WORLD_W; x += 74) {
      for (let y = 30; y < WORLD_H; y += 66) {
        if (Math.sin(x * 0.5 - y * 0.8) > 0.6) ctx.fillRect(x, y, 3, 3);
      }
    }
    ctx.fillStyle = "#2b2f42";
    ctx.fillRect(0, 220, WORLD_W, 170);
    ctx.fillStyle = "#41465e";
    for (let x = 20; x < WORLD_W; x += 90) {
      ctx.fillRect(x, 303, 46, 4);
    }
    ctx.fillStyle = "#3b4a54";
    roundRect(ctx, 430, 390, 100, 186, 10);
    ctx.fill();
    ctx.fillStyle = "#cbb894";
    ctx.fillRect(478, 220, 4, 170);
  }

  drawWorldBorder(ctx, map.type, w);

  for (const p of map.props) {
    if (map.type === "airport") {
      drawAirportProps(ctx, p);
    } else if (map.type === "cafe") {
      drawCafeProps(ctx, p);
    } else if (map.type === "park") {
      drawParkProps(ctx, p);
    } else if (map.type === "night") {
      drawNightProps(ctx, p);
    } else if (map.type === "greenfield") {
      drawGreenfieldProps(ctx, p);
    }
  }

  if (map.portals) drawPortals(ctx, map);
  if (map.exit) drawExit(ctx, map);
}

export function drawBike(ctx, x, y, dir, now) {
  const angle =
    { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }[dir] || 0;
  const bob = Math.sin(now / 180) * 0.6;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(angle);

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 4, 25, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1c1f25";
  ctx.fillRect(-22, -5, 10, 10);
  ctx.fillRect(13, -5, 10, 10);
  ctx.fillStyle = "#3a3f48";
  ctx.fillRect(-20, -2, 6, 4);
  ctx.fillRect(15, -2, 6, 4);

  ctx.fillStyle = "#f4f5f7";
  roundRect(ctx, -15, -7, 30, 14, 6);
  ctx.fill();
  ctx.fillStyle = "#dfe2e8";
  roundRect(ctx, -5, -5, 18, 10, 4);
  ctx.fill();
  ctx.fillStyle = "#25272d";
  roundRect(ctx, -13, -4, 10, 8, 3);
  ctx.fill();

  ctx.fillStyle = "#f4f5f7";
  ctx.beginPath();
  ctx.moveTo(8, -6);
  ctx.lineTo(20, -3);
  ctx.lineTo(20, 3);
  ctx.lineTo(8, 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(160,200,220,0.75)";
  ctx.fillRect(7, -6, 4, 12);
  ctx.strokeStyle = "#2b2f36";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(12, -9);
  ctx.lineTo(12, 9);
  ctx.stroke();

  ctx.restore();
}

export function drawFlowerMemory(ctx, memory) {
  ctx.save();
  ctx.translate(memory.x, memory.y);
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 15, 20, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#557f60";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-5, 10); ctx.lineTo(-13, -16);
  ctx.moveTo(5, 10); ctx.lineTo(12, -16);
  ctx.stroke();
  ctx.fillStyle = "#a479c9";
  ctx.beginPath();
  ctx.moveTo(-23, -29); ctx.lineTo(-19, -13); ctx.quadraticCurveTo(-13, -7, -7, -13);
  ctx.lineTo(-3, -29); ctx.lineTo(-10, -24); ctx.lineTo(-13, -32); ctx.lineTo(-16, -24); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#6a9ed7";
  ctx.beginPath(); ctx.arc(12, -21, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#f3c879";
  ctx.beginPath(); ctx.arc(12, -21, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#f5e7d5";
  ctx.beginPath(); ctx.moveTo(-20, -2); ctx.lineTo(20, -2); ctx.lineTo(7, 16); ctx.lineTo(-7, 16); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#d294a5";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-6, 7); ctx.lineTo(6, 7); ctx.stroke();
  ctx.restore();
}

export function drawOrb(ctx, memory, now) {
  const t = now / 1000;
  const bob = Math.sin(t * 2 + memory.x * 0.05) * 4;
  const x = memory.x;
  const y = memory.y + bob;

  const glow = ctx.createRadialGradient(x, y, 2, x, y, 38);
  glow.addColorStop(0, "rgba(255,200,225,0.55)");
  glow.addColorStop(0.6, "rgba(255,170,210,0.18)");
  glow.addColorStop(1, "rgba(255,170,210,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(x, memory.y + 20, 9, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  const core = ctx.createRadialGradient(x - 3, y - 4, 1, x, y, 12);
  core.addColorStop(0, "#fff6fb");
  core.addColorStop(0.45, "#ffc7e0");
  core.addColorStop(1, "#e0709f");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 2;
  const spin = t * 1.5;
  for (let i = 0; i < 4; i++) {
    const a = spin + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * 16, y + Math.sin(a) * 16);
    ctx.lineTo(x + Math.cos(a) * 21, y + Math.sin(a) * 21);
    ctx.stroke();
  }
}

export function drawCharacter(ctx, x, y, dir, look, now, moving) {
  const t = now / 1000;
  const step = moving ? Math.sin(t * 12) * 2 : 0;
  const bob = moving ? Math.abs(Math.sin(t * 12)) * 1.5 : Math.sin(t * 2) * 0.6;
  const longHair = look.longHair;

  ctx.save();
  ctx.translate(x, y - bob);

  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.beginPath();
  ctx.ellipse(0, 2, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = look.pants;
  ctx.fillRect(-7, -10 + step * 0.4, 5, 11);
  ctx.fillRect(2, -10 - step * 0.4, 5, 11);
  ctx.fillStyle = "#2a2430";
  ctx.fillRect(-8, -1 + step * 0.4, 6, 4);
  ctx.fillRect(2, -1 - step * 0.4, 6, 4);

  ctx.fillStyle = look.shirt;
  roundRect(ctx, -10, -27, 20, 19, 5);
  ctx.fill();
  ctx.fillStyle = look.accent;
  roundRect(ctx, -4, -27, 8, 4, 2);
  ctx.fill();

  ctx.fillStyle = look.skin;
  ctx.fillRect(-13, -25, 4, 11);
  ctx.fillRect(9, -25, 4, 11);

  if (look.jacket) {
    ctx.fillStyle = look.jacket;
    roundRect(ctx, -11, -28, 22, 20, 5);
    ctx.fill();
    ctx.fillStyle = look.shirt;
    ctx.fillRect(-3, -27, 6, 19);
    ctx.fillStyle = look.accent;
    ctx.fillRect(-1, -27, 2, 19);
    ctx.fillStyle = look.jacket;
    ctx.fillRect(-14, -26, 5, 12);
    ctx.fillRect(9, -26, 5, 12);
  }

  ctx.fillStyle = look.hair;
  ctx.beginPath();
  ctx.arc(0, -37, 11.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = look.skin;
  ctx.beginPath();
  ctx.arc(0, -35, 9.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = look.hair;
  ctx.beginPath();
  ctx.arc(0, -41, 10, Math.PI * 0.95, Math.PI * 2.05);
  ctx.fill();
  if (longHair) {
    ctx.fillRect(-11, -38, 5, 16);
    ctx.fillRect(6, -38, 5, 16);
  }

  if (look.cap) {
    ctx.fillStyle = look.cap;
    ctx.beginPath();
    ctx.arc(0, -42, 10, Math.PI, Math.PI * 2);
    ctx.fill();
    if (dir === "left") ctx.fillRect(-16, -44, 12, 3);
    else if (dir === "right") ctx.fillRect(4, -44, 12, 3);
    else ctx.fillRect(-9, -44, 18, 3);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.arc(0, -48, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  if (dir !== "up") {
    const off = dir === "left" ? -3 : dir === "right" ? 3 : 0;
    ctx.fillStyle = "#2c2533";
    ctx.beginPath();
    ctx.arc(-3.2 + off, -35, 1.5, 0, Math.PI * 2);
    ctx.arc(3.2 + off, -35, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,140,170,0.5)";
    ctx.beginPath();
    ctx.arc(-5 + off, -31.5, 2, 0, Math.PI * 2);
    ctx.arc(5 + off, -31.5, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawPrompt(ctx, x, y, text, isTouch, now) {
  const t = now / 1000;
  const bob = Math.sin(t * 3) * 2;
  const labelText = isTouch ? text : `E · ${text}`;
  ctx.font = "bold 12px ui-monospace, SFMono-Regular, Menlo, monospace";
  const w = ctx.measureText(labelText).width + 20;
  const h = 24;
  const px = x - w / 2;
  const py = y - h + bob;

  ctx.fillStyle = "rgba(24,18,32,0.86)";
  roundRect(ctx, px, py, w, h, 7);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,190,215,0.55)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, px, py, w, h, 7);
  ctx.stroke();
  ctx.fillStyle = "#ffd7e6";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(labelText, x, py + h / 2 + 0.5);

  ctx.beginPath();
  ctx.moveTo(x - 5, py + h);
  ctx.lineTo(x + 5, py + h);
  ctx.lineTo(x, py + h + 6);
  ctx.closePath();
  ctx.fillStyle = "rgba(24,18,32,0.86)";
  ctx.fill();
}

export function drawBubble(ctx, x, y, now) {
  const bob = Math.sin(now / 300) * 3;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  roundRect(ctx, x - 12, y - 80 + bob, 24, 22, 6);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 4, y - 59 + bob);
  ctx.lineTo(x + 4, y - 59 + bob);
  ctx.lineTo(x, y - 52 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d4568c";
  ctx.font = "bold 16px ui-monospace, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("!", x, y - 68 + bob);
}
