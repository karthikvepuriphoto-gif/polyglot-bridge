import { sentences, unitsFor, wordById, words } from '../data/content';
import type { AppState, CardProgress, Lang, Unit } from '../types';
import { dateKey, shiftDays } from './dates';

export function isDue(card: CardProgress | undefined, now = Date.now()): boolean {
  return !!card?.seen && card.dueAt <= now;
}

export function dueWords(state: AppState, lang?: Lang, now = Date.now()) {
  return words.filter((word) => (lang ? word.lang === lang : true) && isDue(state.cards[word.id], now));
}

export function seenCount(state: AppState, lang: Lang): number {
  return words.filter((word) => word.lang === lang && state.cards[word.id]?.seen).length;
}

export function comfortableCount(state: AppState, lang: Lang): number {
  return words.filter((word) => {
    const card = state.cards[word.id];
    return word.lang === lang && !!card?.seen && card.intervalDays >= 1;
  }).length;
}

export function sentencesSaidCount(state: AppState, lang: Lang): number {
  return sentences.filter((sentence) => sentence.lang === lang && state.sentencesSaid.includes(sentence.id)).length;
}

export function streakCount(state: AppState, now = new Date()): number {
  if (!state.streak.lastActiveDate) return 0;
  const today = dateKey(now);
  const yesterday = shiftDays(today, -1);
  if (state.streak.lastActiveDate === today || state.streak.lastActiveDate === yesterday) {
    return state.streak.count;
  }
  return 0;
}

export function nextUnit(state: AppState, lang: Lang): Unit | null {
  return unitsFor(lang).find((unit) => !state.completedUnits.includes(unit.id)) ?? null;
}

export function continueTarget(state: AppState): { lang: Lang; unit: Unit } {
  const preferred: Lang[] = state.tracks.length ? [...state.tracks] : ['es', 'de'];
  const langs: Lang[] = [];
  if (state.lastTrack && preferred.includes(state.lastTrack)) langs.push(state.lastTrack);
  for (const lang of preferred) {
    if (!langs.includes(lang)) langs.push(lang);
  }
  if (state.lastTrack && !langs.includes(state.lastTrack)) langs.unshift(state.lastTrack);

  for (const lang of langs) {
    const upcoming = nextUnit(state, lang);
    if (upcoming) return { lang, unit: upcoming };
  }

  const lang = langs[0] ?? 'es';
  const list = unitsFor(lang);
  return { lang, unit: list[list.length - 1] };
}

export function reviewSelection(state: AppState, lang: Lang, now = Date.now()): string[] {
  const pool = words.filter((word) => word.lang === lang);
  const due = pool.filter((word) => isDue(state.cards[word.id], now));
  const seen = pool.filter((word) => state.cards[word.id]?.seen && !due.includes(word));
  const fresh = pool.filter((word) => word.tipType !== 'falseFriend').slice(0, 5);
  const ids = [...due, ...seen, ...fresh].map((word) => word.id);
  return [...new Set(ids)].slice(0, 6);
}

export function unitProgressLabel(unit: Unit): string {
  if (unit.kind === 'sentences') return `${unit.sentenceIds.length} sentences`;
  if (unit.kind === 'review') return 'Mixed set';
  const traps = unit.wordIds.filter((id) => wordById(id)?.tipType === 'falseFriend').length;
  if (traps === unit.wordIds.length) return `${traps} traps`;
  return `${unit.wordIds.length} words`;
}

export function followingUnit(unit: Unit): Unit | null {
  const list = unitsFor(unit.lang);
  const index = list.findIndex((item) => item.id === unit.id);
  return list[index + 1] ?? null;
}

export function completedCount(state: AppState, lang: Lang): number {
  return unitsFor(lang).filter((unit) => state.completedUnits.includes(unit.id)).length;
}
