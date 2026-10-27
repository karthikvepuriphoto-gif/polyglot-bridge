import type { Lang } from '../types';
import { useProgress } from '../context/ProgressContext';
import { speak } from '../lib/speech';
import { PlayIcon, SlowIcon } from './Icons';

export function AudioBar({ text, lang, compact = false }: { text: string; lang: Lang; compact?: boolean }) {
  const { recordPlay } = useProgress();

  const play = (rate: number) => {
    speak(text, lang, rate);
    recordPlay(lang);
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => play(1)}
        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-ink px-3 text-sm font-semibold text-white transition active:scale-[0.98]"
      >
        <PlayIcon />
        Play
      </button>
      <button
        type="button"
        onClick={() => play(0.75)}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-3 text-sm font-semibold text-ink transition active:scale-[0.98] ${compact ? '' : 'flex-1'}`}
      >
        <SlowIcon />
        Slow
      </button>
    </div>
  );
}
