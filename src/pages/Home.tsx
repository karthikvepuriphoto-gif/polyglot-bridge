import { Link } from 'react-router-dom';
import { LANG_META, unitHref, unitsFor } from '../data/content';
import type { Goal, Lang } from '../types';
import { useProgress } from '../context/ProgressContext';
import { FeedbackActions } from '../components/FeedbackLink';
import { Shell } from '../components/Shell';
import { completedCount, continueTarget, dueWords, seenCount, streakCount } from '../lib/stats';
import { greeting } from '../lib/text';
import { useTitle } from './useTitle';

const goalLine: Record<Goal, string> = {
  travel: 'A few minutes before the trip.',
  work: 'A few minutes between tasks.',
  fun: 'A few minutes, just because.',
  family: 'A few minutes for the people you love.',
};

const bar: Record<Lang, string> = { es: 'bg-es', de: 'bg-de' };
const soft: Record<Lang, string> = { es: 'bg-es-soft text-es-deep', de: 'bg-de-soft text-de-deep' };
const button: Record<Lang, string> = { es: 'bg-es', de: 'bg-de' };

export function Home() {
  useTitle('Home');
  const { state } = useProgress();
  const streak = streakCount(state);
  const due = dueWords(state);
  const target = continueTarget(state);
  const reviewLang = due[0]?.lang ?? target.lang;
  const line = state.goal ? goalLine[state.goal] : 'A few minutes is enough.';

  return (
    <Shell>
      <p className="text-sm text-muted">{greeting()}</p>
      <h1 className="mt-1 font-display text-[2rem] leading-tight font-semibold tracking-tight">
        Bridge the words you already know.
      </h1>
      <p className="mt-2 text-muted">{line}</p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-[22px] border border-line bg-white px-4 py-3">
          <p className="text-sm text-muted">Streak</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{streak}</p>
          <p className="text-sm text-muted">{streak === 1 ? 'day' : 'days'}</p>
        </div>
        <Link to={`/review/${reviewLang}`} className="rounded-[22px] border border-line bg-white px-4 py-3">
          <p className="text-sm text-muted">Due</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{due.length}</p>
          <p className="text-sm text-muted">to review</p>
        </Link>
      </div>

      <Link
        to={unitHref(target.unit)}
        className={`mt-3 flex min-h-16 flex-col justify-center rounded-[22px] px-4 py-3 text-white ${button[target.lang]}`}
      >
        <span className="text-xs font-medium text-white/80">Continue</span>
        <span className="text-lg font-semibold">
          {LANG_META[target.lang].label} · {target.unit.title}
        </span>
      </Link>

      <div className="mt-5 grid gap-3">
        {(['es', 'de'] as Lang[]).map((lang) => {
          const total = unitsFor(lang).length;
          const done = completedCount(state, lang);
          const planned = state.tracks.includes(lang);
          return (
            <Link
              key={lang}
              to={`/path/${lang}`}
              className="block overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_10px_30px_rgba(18,32,41,0.04)]"
            >
              <div className={`h-1.5 ${bar[lang]}`} />
              <div className="px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{LANG_META[lang].label}</h2>
                    <p className="text-sm text-muted">{LANG_META[lang].native}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${soft[lang]}`}>
                    {planned ? 'In your plan' : 'Explore'}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted">{LANG_META[lang].blurb}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper">
                  <div className={`h-full ${bar[lang]}`} style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
                </div>
                <p className="mt-2 text-sm text-muted">
                  {done} of {total} units · {seenCount(state, lang)} words met
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="mt-6" aria-label="Feedback">
        <h2 className="mb-2 text-sm font-medium text-muted">Feedback</h2>
        <FeedbackActions />
        <p className="mt-2 text-xs text-muted">Opens the form in a new tab.</p>
      </section>
    </Shell>
  );
}
