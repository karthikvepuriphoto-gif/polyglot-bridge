import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Goal, Grade, Lang } from '../types';
import type { AppState } from '../types';
import { unitById } from '../data/content';
import { dateKey, shiftDays } from '../lib/dates';
import { applyGrade } from '../lib/srs';
import { clearState, defaultState, loadState, saveState } from '../lib/storage';

interface ProgressApi {
  state: AppState;
  completeOnboarding: (input: { tracks: Lang[]; goal: Goal; reminderTime: string | null }) => void;
  updateTracks: (tracks: Lang[]) => void;
  updateGoal: (goal: Goal) => void;
  updateReminder: (reminderTime: string | null) => void;
  gradeWord: (id: string, grade: Grade) => void;
  markSentence: (id: string) => void;
  completeUnit: (unitId: string) => void;
  recordPlay: (lang: Lang) => void;
  touchTrack: (lang: Lang) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

function bumpStreak(state: AppState, now = new Date()): AppState['streak'] {
  const today = dateKey(now);
  if (state.streak.lastActiveDate === today) return state.streak;
  const yesterday = shiftDays(today, -1);
  const count = state.streak.lastActiveDate === yesterday ? state.streak.count + 1 : 1;
  return { count, lastActiveDate: today };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  const api = useMemo<ProgressApi>(() => {
    const update = (fn: (current: AppState) => AppState) => {
      setState((current) => {
        const next = fn(current);
        if (next === current) return current;
        saveState(next);
        return next;
      });
    };

    return {
      state,
      completeOnboarding: ({ tracks, goal, reminderTime }) => {
        update((current) => ({
          ...current,
          onboarded: true,
          tracks,
          goal,
          reminderTime,
          lastTrack: tracks[0] ?? current.lastTrack,
        }));
      },
      updateTracks: (tracks) => {
        update((current) => ({
          ...current,
          tracks,
          lastTrack: current.lastTrack && tracks.includes(current.lastTrack) ? current.lastTrack : tracks[0] ?? null,
        }));
      },
      updateGoal: (goal) => update((current) => ({ ...current, goal })),
      updateReminder: (reminderTime) => update((current) => ({ ...current, reminderTime })),
      gradeWord: (id, grade) => {
        update((current) => ({
          ...current,
          cards: { ...current.cards, [id]: applyGrade(current.cards[id], grade) },
        }));
      },
      markSentence: (id) => {
        update((current) =>
          current.sentencesSaid.includes(id)
            ? current
            : { ...current, sentencesSaid: [...current.sentencesSaid, id] },
        );
      },
      completeUnit: (unitId) => {
        update((current) => {
          const already = current.completedUnits.includes(unitId);
          const streak = bumpStreak(current);
          if (already && streak === current.streak) return current;
          const unit = unitById(unitId);
          return {
            ...current,
            completedUnits: already ? current.completedUnits : [...current.completedUnits, unitId],
            lastTrack: unit?.lang ?? current.lastTrack,
            streak,
          };
        });
      },
      recordPlay: (lang) => {
        update((current) => ({
          ...current,
          plays: { ...current.plays, [lang]: current.plays[lang] + 1 },
        }));
      },
      touchTrack: (lang) => {
        update((current) => (current.lastTrack === lang ? current : { ...current, lastTrack: lang }));
      },
      reset: () => {
        clearState();
        const fresh = defaultState();
        setState(fresh);
        saveState(fresh);
      },
    };
  }, [state]);

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useProgress must be used inside ProgressProvider');
  return value;
}
