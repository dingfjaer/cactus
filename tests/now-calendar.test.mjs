import test from 'node:test';
import assert from 'node:assert/strict';
import { nowCalendar } from '../src/utils/now-calendar.mjs';

test('year progress resets at Oslo new year, not the browser timezone', () => {
  const last = nowCalendar(new Date('2026-12-31T22:59:59Z'));
  const first = nowCalendar(new Date('2026-12-31T23:00:00Z'));
  assert.equal(last.day,'2026-12-31');
  assert.equal(last.progress,364/365);
  assert.equal(first.year,2027);
  assert.equal(first.progress,0);
});
test('leap years and Oslo DST use calendar days', () => {
  assert.equal(nowCalendar(new Date('2028-03-01T12:00:00Z')).progress,60/366);
  const before=nowCalendar(new Date('2026-03-28T23:30:00Z'));
  const after=nowCalendar(new Date('2026-03-29T22:30:00Z'));
  assert(Math.abs(after.progress-before.progress-1/365)<1e-12);
});
test('Tintin and tooltip agree with the supplied current-date example', () => {
  const current=nowCalendar(new Date('2026-09-28T12:00:00Z'));
  assert.equal(current.age,'1 år 5 mnd 20 d');
  assert.equal(current.dateLabel,'28. september 2026');
  assert(current.progress>.73&&current.progress<.75);
});
