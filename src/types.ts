export type Lang = 'es' | 'de';

export type TipType = 'cognate' | 'near' | 'mnemonic' | 'falseFriend';

export type Goal = 'travel' | 'work' | 'fun' | 'family';

export type Grade = 'again' | 'good' | 'easy';

export interface Word {
  id: string;
  lang: Lang;
  text: string;
  pronunciation: string;
  english: string;
  tipType: TipType;
  tip: string;
  example: string;
  exampleEn: string;
  looksLike?: string;
  pronounceHint?: string;
}

export interface Sentence {
  id: string;
  lang: Lang;
  text: string;
  english: string;
  focus: string;
  tokens: string[];
}

export type UnitKind = 'words' | 'sentences' | 'review';

export interface Unit {
  id: string;
  lang: Lang;
  title: string;
  kind: UnitKind;
  summary: string;
  wordIds: string[];
  sentenceIds: string[];
}

export interface CardProgress {
  intervalDays: number;
  dueAt: number;
  reps: number;
  lapses: number;
  seen: boolean;
  lastGrade?: Grade;
}

export interface Streak {
  count: number;
  lastActiveDate: string | null;
}

export interface AppState {
  version: 1;
  onboarded: boolean;
  tracks: Lang[];
  goal: Goal | null;
  reminderTime: string | null;
  lastTrack: Lang | null;
  streak: Streak;
  completedUnits: string[];
  cards: Record<string, CardProgress>;
  sentencesSaid: string[];
  plays: Record<Lang, number>;
}
