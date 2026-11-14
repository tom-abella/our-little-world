import { LOBBY_GROUPS } from "./maps";

function rounded(ctx, x, y, w, h, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
}

function drawPool(ctx, x, y) {
  rounded(ctx, x - 8, y - 8, 216, 136, 12, "#d4c9b8");
  rounded(ctx, x, y, 200, 120, 8, "#58a9c0");
  rounded(ctx, x + 8, y + 8, 184, 104, 6, "#83cddd");
  ctx.strokeStyle = "rgba(255,255,255,.55)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(x + 100, y + 60, 22 + i * 22, 8 + i * 8, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "#f3f3e9";
  ctx.strokeRect(x + 170, y + 20, 12, 28);
}

function drawSeating(ctx, x, y, second) {
  rounded(ctx, x - 88, y - 42, 176, 112, 14, second ? "#d8b6ba" : "#d9d0c1");
  rounded(ctx, x - 60, y - 28, 120, 26, 7, "#755c6b");
  rounded(ctx, x - 53, y - 24, 106, 15, 5, "#b9a2ae");
  rounded(ctx, x - 36, y + 12, 72, 38, 5, "#775842");
  rounded(ctx, x - 32, y + 15, 64, 30, 4, "#c49d7b");
  rounded(ctx, x - 76, y + 15, 26, 34, 5, "#ad97a3");
  rounded(ctx, x + 50, y + 15, 26, 34, 5, "#ad97a3");
  ctx.fillStyle = "#f8e7d7";
  ctx.beginPath();
  ctx.arc(x - 10, y + 28, 5, 0, Math.PI * 2);
  ctx.arc(x + 12, y + 32, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawSeesaw(ctx, { x, y, w, h }) {
  rounded(ctx, x, y, w, h, 15, "#e3d8c8");
  ctx.fillStyle = "#81727b";
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + 12);
  ctx.lineTo(x + w / 2 - 13, y + h - 4);
  ctx.lineTo(x + w / 2 + 13, y + h - 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#b46575";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 20);
  ctx.lineTo(x + w - 14, y + 11);
  ctx.stroke();
  ctx.strokeStyle = "#615462";
  ctx.lineWidth = 3;
  for (const handleX of [x + 25, x + w - 25]) {
    ctx.beginPath();
    ctx.arc(handleX, y + 10, 9, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
}

function drawLobby(ctx, props) {
  ctx.fillStyle = "#e7dfd2";
  ctx.fillRect(0, 0, 960, 576);
  ctx.strokeStyle = "rgba(128,112,99,.18)";
  ctx.lineWidth = 1;
  for (let x = 24; x < 960; x += 64) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 576); ctx.stroke();
  }
  for (let y = 24; y < 576; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(960, y); ctx.stroke();
  }
  ctx.fillStyle = "#bba99e";
  ctx.fillRect(0, 0, 960, 24); ctx.fillRect(0, 552, 960, 24);
  ctx.fillRect(0, 0, 24, 576); ctx.fillRect(936, 0, 24, 576);
  drawPool(ctx, 700, 65);
  drawPool(ctx, 60, 360);
  LOBBY_GROUPS.forEach(({ x, y }, i) => drawSeating(ctx, x, y, i === 1));
  for (const prop of props) {
    if (prop.type === "seesaw") drawSeesaw(ctx, prop);
  }
  ctx.fillStyle = "#725969";
  ctx.font = "bold 13px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText("SHERIDEN NORTH TOWER · LOBBY", 480, 52);
}

function drawRoofStore(ctx, { x, y, w, h }) {
  rounded(ctx, x + 5, y + 7, w, h, 5, "rgba(0,0,0,.25)");
  rounded(ctx, x, y, w, h, 5, "#e8d5b9");
  rounded(ctx, x + 8, y + 32, w - 16, h - 44, 4, "#aa805e");
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? "#f7ead3" : "#c86a5a";
    ctx.fillRect(x + i * (w / 6), y + 12, w / 6 + 1, 16);
  }
  for (let i = 0; i < 4; i++) {
    rounded(ctx, x + 20 + i * 32, y + 40, 20, 22, 3, ["#efb86b", "#8bb9a4", "#dc8d80", "#e8c774"][i]);
  }
  rounded(ctx, x + 8, y + h - 17, w - 16, 10, 2, "#805b45");
  rounded(ctx, x + 17, y - 19, w - 34, 24, 4, "#2c3440");
  ctx.fillStyle = "#ffe9d2";
  ctx.font = "bold 11px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText("SARI-SARI STORE", x + w / 2, y - 3);
}

function drawRoofChairs(ctx, { x, y }) {
  rounded(ctx, x - 34, y - 24, 68, 48, 8, "#c49d7b");
  rounded(ctx, x - 30, y - 20, 60, 40, 6, "#e4c8aa");
  rounded(ctx, x - 65, y - 13, 24, 26, 5, "#b9a2ae");
  rounded(ctx, x + 41, y - 13, 24, 26, 5, "#b9a2ae");
  rounded(ctx, x - 13, y - 50, 26, 20, 5, "#b9a2ae");
  rounded(ctx, x - 13, y + 30, 26, 20, 5, "#b9a2ae");
  ctx.fillStyle = "#fff0dc";
  ctx.beginPath();
  ctx.arc(x - 10, y, 4, 0, Math.PI * 2);
  ctx.arc(x + 10, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawRoofTree(ctx, { x, y }) {
  ctx.fillStyle = "rgba(0,0,0,.25)";
  ctx.beginPath();
  ctx.ellipse(x, y + 12, 24, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  rounded(ctx, x - 14, y - 6, 28, 20, 4, "#ab7958");
  ctx.fillStyle = "#466d4b";
  for (const [dx, dy, r] of [[0, -16, 22], [-16, -7, 16], [16, -7, 16]]) {
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#648f65";
  ctx.beginPath();
  ctx.arc(x - 6, y - 20, 9, 0, Math.PI * 2);
  ctx.fill();
}

function drawRoof(ctx, props) {
  const sky = ctx.createLinearGradient(0, 0, 0, 576);
  sky.addColorStop(0, "#151c3a");
  sky.addColorStop(1, "#29334b");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 960, 576);

  // City lights surround the terrace to suggest the full 360-degree view.
  for (let i = 0; i < 24; i++) {
    const x = i * 42;
    const h = 30 + ((i * 47) % 75);
    ctx.fillStyle = i % 2 ? "#252d48" : "#303951";
    ctx.fillRect(x, 100 - h, 35, h);
    ctx.fillRect(x, 476, 35, h);
    ctx.fillStyle = "#ffd693";
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        if ((i + row + col) % 3 !== 0) {
          ctx.fillRect(x + 7 + col * 13, 78 - row * 16, 4, 6);
          ctx.fillRect(x + 7 + col * 13, 486 + row * 16, 4, 6);
        }
      }
    }
  }
  for (let i = 0; i < 6; i++) {
    const y = 110 + i * 62;
    ctx.fillStyle = i % 2 ? "#303951" : "#252d48";
    ctx.fillRect(12, y, 58, 50);
    ctx.fillRect(890, y, 58, 50);
    ctx.fillStyle = "#ffd693";
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        if ((i + row + col) % 3 !== 0) {
          ctx.fillRect(20 + col * 16, y + 8 + row * 20, 5, 7);
          ctx.fillRect(898 + col * 16, y + 8 + row * 20, 5, 7);
        }
      }
    }
  }
  ctx.fillStyle = "#343b50";
  ctx.fillRect(0, 85, 960, 20); ctx.fillRect(0, 471, 960, 20);
  ctx.fillRect(82, 0, 22, 576); ctx.fillRect(856, 0, 22, 576);
  for (let i = 0; i < 15; i++) {
    ctx.fillStyle = i % 2 ? "#fff0b0" : "#ff777b";
    ctx.fillRect(15 + i * 65, 91, 10, 3);
    ctx.fillRect(35 + i * 65, 480, 10, 3);
    ctx.fillRect(88, 15 + i * 38, 3, 8);
    ctx.fillRect(867, 30 + i * 38, 3, 8);
  }
  ctx.fillStyle = "#595262";
  ctx.fillRect(104, 105, 752, 366);
  ctx.strokeStyle = "rgba(238,219,191,.15)";
  ctx.lineWidth = 1;
  for (let x = 104; x < 856; x += 64) {
    ctx.beginPath(); ctx.moveTo(x, 105); ctx.lineTo(x, 471); ctx.stroke();
  }
  for (let y = 105; y < 471; y += 64) {
    ctx.beginPath(); ctx.moveTo(104, y); ctx.lineTo(856, y); ctx.stroke();
  }
  ctx.strokeStyle = "#c8bdc2";
  ctx.lineWidth = 5;
  ctx.strokeRect(106, 107, 748, 362);
  for (let i = 0; i < 18; i++) {
    const x = 120 + i * 42;
    ctx.fillStyle = "rgba(255,208,130,.22)";
    ctx.beginPath(); ctx.arc(x, 115, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffe1a0";
    ctx.beginPath(); ctx.arc(x, 115, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, 461, 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = "#ffdfad";
  ctx.font = "bold 13px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText("360° CITY VIEW", 480, 145);

  for (const prop of props) {
    if (prop.type === "sari-sari") drawRoofStore(ctx, prop);
    else if (prop.type === "roof-seating") drawRoofChairs(ctx, prop);
    else if (prop.type === "roof-tree") drawRoofTree(ctx, prop);
  }
}

export function drawSheridenWorld(ctx, map) {
  if (map.type === "sheriden-lobby") drawLobby(ctx, map.props);
  else drawRoof(ctx, map.props);
}
