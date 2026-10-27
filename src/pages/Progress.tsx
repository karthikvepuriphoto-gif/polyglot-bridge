import { LANG_META, sentences, unitsFor, words } from '../data/content';
import type { Lang } from '../types';
import { useProgress } from '../context/ProgressContext';
import { Shell } from '../components/Shell';
import { comfortableCount, completedCount, seenCount, sentencesSaidCount, streakCount } from '../lib/stats';
import { useTitle } from './useTitle';

export function Progress() {
  useTitle('Progress');
  const { state } = useProgress();
  const streak = streakCount(state);

  return (
    <Shell>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Progress</h1>
      <p className="mt-2 text-muted">Stored on this device. Nothing is sent to an account.</p>
      <p className="mt-4 rounded-[22px] border border-line bg-white px-4 py-4 text-lg font-semibold">
        {streak} day streak
      </p>
      <div className="mt-4 grid gap-3">
        {(['es', 'de'] as Lang[]).map((lang) => {
          const totalWords = words.filter((word) => word.lang === lang).length;
          const totalSentences = sentences.filter((sentence) => sentence.lang === lang).length;
          return (
            <section key={lang} className="rounded-[24px] border border-line bg-white px-4 py-4">
              <h2 className="text-xl font-semibold">{LANG_META[lang].label}</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Stat label="Words met" value={`${seenCount(state, lang)} / ${totalWords}`} />
                <Stat label="Comfortable" value={String(comfortableCount(state, lang))} />
                <Stat label="Sentences said" value={`${sentencesSaidCount(state, lang)} / ${totalSentences}`} />
                <Stat label="Times listened" value={String(state.plays[lang])} />
                <Stat label="Units done" value={`${completedCount(state, lang)} / ${unitsFor(lang).length}`} />
              </dl>
            </section>
          );
        })}
      </div>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold text-ink">{value}</dd>
    </div>
  );
}
