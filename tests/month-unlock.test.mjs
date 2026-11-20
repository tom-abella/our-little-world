import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/data/stages.js', import.meta.url), 'utf8');
const { STAGES, isStageUnlocked } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('Month 1 stays locked until December 2 and opens at local midnight', () => {
  const RealDate = globalThis.Date;
  const month = STAGES.find((stage) => stage.id === 1);
  try {
    for (const [time, expected] of [['2026-12-01T23:59:59', false], ['2026-12-02T00:00:00', true]]) {
      globalThis.Date = class extends RealDate {
        constructor(...args) { super(...(args.length ? args : [time])); }
      };
      assert.equal(isStageUnlocked(month), expected, time);
    }
  } finally {
    globalThis.Date = RealDate;
  }
});
