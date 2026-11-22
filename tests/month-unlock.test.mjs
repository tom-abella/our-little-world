import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/data/stages.js', import.meta.url), 'utf8');
const { STAGES, isStageUnlocked } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('Month 1 is open early for now, and the December 2 unlock still works', () => {
  const month = STAGES.find((stage) => stage.id === 1);
  assert.equal(month.unlockedOverride, true, 'Month 1 is intentionally opened early');

  // Remove the preview override so the scheduled monthsary behaviour is still tested.
  const scheduled = { ...month, unlockedOverride: false };
  const RealDate = globalThis.Date;
  try {
    for (const [time, expected] of [['2026-12-01T23:59:59', false], ['2026-12-02T00:00:00', true]]) {
      globalThis.Date = class extends RealDate {
        constructor(...args) { super(...(args.length ? args : [time])); }
      };
      assert.equal(isStageUnlocked(scheduled), expected, time);
    }
  } finally {
    globalThis.Date = RealDate;
  }
});
