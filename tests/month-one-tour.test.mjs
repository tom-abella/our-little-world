import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  new URL("../src/data/tours.js", import.meta.url),
  "utf8",
);
const { MONTH_ONE_TOUR, MONTH_ONE_STEP } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);

test("Month 1 tour keeps the sundo, flowers, Sheriden rooms, and final memory in order", () => {
  assert.deepEqual(
    MONTH_ONE_TOUR.map((stop) => stop.memoryId ?? stop.kind),
    [
      "mem-1-1",
      "mem-1-3",
      "mem-1-4",
      "mem-1-2",
      "mem-1-facetime",
      "mem-1-5",
      "mem-1-flowers",
      "sheriden-lobby",
      "sheriden-roof",
      "mem-1-6",
    ],
  );

  assert.equal(MONTH_ONE_STEP.sundo, 5);
  assert.equal(MONTH_ONE_STEP.flowers, MONTH_ONE_STEP.sundo + 1);
  assert.equal(MONTH_ONE_STEP.lobby, MONTH_ONE_STEP.flowers + 1);
  assert.equal(MONTH_ONE_STEP.roof, MONTH_ONE_STEP.lobby + 1);
  assert.equal(MONTH_ONE_STEP.final, MONTH_ONE_STEP.roof + 1);
});
