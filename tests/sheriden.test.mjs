import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const asModule = (source) => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const stages = asModule(await readFile(new URL("../src/data/stages.js", import.meta.url), "utf8"));
const memories = asModule(await readFile(new URL("../src/data/sheriden.js", import.meta.url), "utf8"));
const source = (await readFile(new URL("../src/game/maps.js", import.meta.url), "utf8"))
  .replace('"@/data/stages"', JSON.stringify(stages))
  .replace('"@/data/sheriden"', JSON.stringify(memories));
const { mapForScene } = await import(asModule(source));
const { STAGES } = await import(stages);
const targets = asModule(await readFile(new URL("../src/game/memoryTargets.js", import.meta.url), "utf8"));
const { memoryTarget, targetDistance } = await import(targets);

// Match the player's collision box and check that a target's interaction radius is reachable.
function canReach(map, target, radius) {
  const step = 10;
  const queue = [{ x: Math.round(map.spawn.x / step) * step, y: Math.round(map.spawn.y / step) * step }];
  const seen = new Set();
  for (let i = 0; i < queue.length; i++) {
    const { x, y } = queue[i];
    const key = `${x},${y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (x < 0 || x > (map.width || 960) || y < 0 || y > 576) continue;
    if (map.solids.some((s) => x + 11 > s.x && x - 11 < s.x + s.w && y + 6 > s.y && y - 14 < s.y + s.h)) continue;
    if (targetDistance(target, x, y) < radius) return true;
    queue.push({ x: x + step, y }, { x: x - step, y }, { x, y: y + step }, { x, y: y - step });
  }
  return false;
}

test("Sheriden entrance and both rooms have reachable memories and exits", () => {
  const monthOne = mapForScene(1);
  assert.ok(canReach(monthOne, monthOne.sheridenEntrance, 65));
  for (const name of ["sheriden-lobby", "sheriden-roof"]) {
    const room = mapForScene(name);
    assert.equal(room.returnScene, 1);
    assert.equal(room.memories.length, 1);
    const target = memoryTarget(room.memories[0], room);
    assert.ok(canReach(room, target, target.radius), `${name} memory is reachable`);
    if (name === "sheriden-lobby") assert.equal(target.landmark?.type, "lobby-memory-sofa");
    assert.ok(canReach(room, room.exit, 58), `${name} exit is reachable`);
    assert.match(room.memories[0].imageUrl, /^\/images\/sheriden-.+\.jpg$/);
  }
});

test("requested landmarks open reachable memories without changing ordinary orbs", () => {
  for (const [stageId, expected] of [
    [0, { "mem-0-2": "cafe" }],
    [1, { "mem-1-1": "sign", "mem-1-3": "photobooth", "mem-1-4": "cafe", "mem-1-facetime": "videocall" }],
  ]) {
    const stage = STAGES.find((item) => item.id === stageId);
    const map = mapForScene(stageId);
    for (const [id, type] of Object.entries(expected)) {
      const memory = stage.memories.find((item) => item.id === id);
      assert.ok(memory, `${id} exists`);
      const target = memoryTarget(memory, map);
      assert.equal(target.landmark?.type, type);
      assert.ok(canReach(map, target, target.radius), `${id} is reachable at its landmark`);
      assert.equal(targetDistance(target, target.x, target.y), 0);
    }
    for (const memory of stage.memories.filter((item) => !item.landmark)) {
      assert.equal(memoryTarget(memory, map).landmark, undefined);
    }
  }
});

test("lobby seesaw renders a circular handle at each end", async () => {
  const renderSource = (await readFile(new URL("../src/game/sheridenRender.js", import.meta.url), "utf8"))
    .replace('"./maps"', JSON.stringify(asModule(source)));
  const { drawSheridenWorld } = await import(asModule(renderSource));
  const circles = [];
  const ctx = new Proxy({}, {
    get(object, property) {
      if (property in object) return object[property];
      if (property === "arc") return (x, y, radius) => circles.push({ x, y, radius });
      return () => {};
    },
  });
  const lobby = mapForScene("sheriden-lobby");
  const seesaw = lobby.props.find((prop) => prop.type === "seesaw");
  drawSheridenWorld(ctx, lobby);
  for (const x of [seesaw.x + 25, seesaw.x + seesaw.w - 25]) {
    assert.ok(circles.some((circle) => circle.x === x && circle.y === seesaw.y + 10 && circle.radius === 9));
  }
});

test("new furniture stays positioned and solid without blocking either room", () => {
  const lobby = mapForScene("sheriden-lobby");
  const seesaw = lobby.props.find((prop) => prop.type === "seesaw");
  assert.ok(seesaw);
  assert.ok(Math.abs(seesaw.x + seesaw.w / 2 - 116) < 5, "seesaw is centered on the marked spot horizontally");
  assert.ok(Math.abs(seesaw.y + seesaw.h / 2 - 239) < 5, "seesaw is centered on the marked spot vertically");
  assert.ok(lobby.solids.some((solid) => solid.x === seesaw.x && solid.y === seesaw.y));

  const roof = mapForScene("sheriden-roof");
  const store = roof.props.find((prop) => prop.type === "sari-sari");
  const seating = roof.props.find((prop) => prop.type === "roof-seating");
  const trees = roof.props.filter((prop) => prop.type === "roof-tree");
  assert.ok(store && seating);
  assert.ok(Math.abs(store.x + store.w / 2 - 480) < 10, "store is in the middle");
  assert.ok(Math.hypot(seating.x - (store.x + store.w / 2), seating.y - (store.y + store.h / 2)) < 250);
  assert.equal(trees.length, 4);
  assert.ok(trees.every(({ x, y }) => (x < 300 || x > 700) && (y < 180 || y > 380)), "trees are near the edges");
  assert.ok(roof.solids.some((solid) => solid.x === store.x && solid.y === store.y));
  for (const { x, y } of trees) {
    assert.ok(roof.solids.some((solid) => x > solid.x && x < solid.x + solid.w && y > solid.y && y < solid.y + solid.h));
  }
  const lobbyMemory = memoryTarget(lobby.memories[0], lobby);
  assert.ok(canReach(lobby, lobbyMemory, lobbyMemory.radius));
  assert.ok(canReach(roof, roof.memories[0], 64));
  assert.ok(canReach(roof, roof.exit, 58));
});
