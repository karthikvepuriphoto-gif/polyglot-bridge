import type { AppState } from '../types';

const KEY = 'polyglot-bridge.v1';
const DB_NAME = 'polyglot-bridge';
const STORE = 'progress';

export function defaultState(): AppState {
  return {
    version: 1,
    onboarded: false,
    tracks: [],
    goal: null,
    reminderTime: null,
    lastTrack: null,
    streak: { count: 0, lastActiveDate: null },
    completedUnits: [],
    cards: {},
    sentencesSaid: [],
    plays: { es: 0, de: 0 },
  };
}

function isState(value: unknown): value is AppState {
  if (!value || typeof value !== 'object') return false;
  const state = value as AppState;
  return (
    state.version === 1 &&
    Array.isArray(state.tracks) &&
    Array.isArray(state.completedUnits) &&
    Array.isArray(state.sentencesSaid) &&
    !!state.cards &&
    !!state.streak &&
    !!state.plays
  );
}

export function loadState(): AppState {
  if (typeof localStorage === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed: unknown = JSON.parse(raw);
    if (!isState(parsed)) return defaultState();
    return {
      ...defaultState(),
      ...parsed,
      plays: { es: parsed.plays.es ?? 0, de: parsed.plays.de ?? 0 },
      streak: {
        count: parsed.streak.count ?? 0,
        lastActiveDate: parsed.streak.lastActiveDate ?? null,
      },
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
  mirrorProgress(state);
}

/** IndexedDB mirror. localStorage stays the source of truth. */
export function mirrorProgress(state: AppState): void {
  try {
    if (typeof indexedDB === 'undefined') return;
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE, 'readwrite');
      const snapshot = JSON.parse(JSON.stringify(state)) as AppState;
      tx.objectStore(STORE).put(snapshot, 'snapshot');
      tx.oncomplete = () => db.close();
      tx.onerror = () => db.close();
    };
  } catch {
    // Progress remains in localStorage.
  }
}

export function clearState(): void {
  localStorage.removeItem(KEY);
}
