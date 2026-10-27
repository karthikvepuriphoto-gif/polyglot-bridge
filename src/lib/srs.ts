import type { CardProgress, Grade } from '../types';

const LADDER = [0, 1, 3, 7, 21];
const DAY = 24 * 60 * 60 * 1000;

export function applyGrade(prev: CardProgress | undefined, grade: Grade, now = Date.now()): CardProgress {
  const current: CardProgress = prev ?? {
    intervalDays: 0,
    dueAt: now,
    reps: 0,
    lapses: 0,
    seen: false,
  };

  if (grade === 'again') {
    return {
      intervalDays: 0,
      dueAt: now,
      reps: current.reps,
      lapses: current.lapses + 1,
      lastGrade: 'again',
      seen: true,
    };
  }

  const index = LADDER.indexOf(current.intervalDays);
  const base = index === -1 ? 0 : index;
  const step = grade === 'easy' ? 2 : 1;
  const nextIndex = Math.min(LADDER.length - 1, Math.max(1, base + step));
  const intervalDays = LADDER[nextIndex];

  return {
    intervalDays,
    dueAt: now + intervalDays * DAY,
    reps: current.reps + 1,
    lapses: current.lapses,
    lastGrade: grade,
    seen: true,
  };
}
