import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { isLang, LANG_META, unitHref, unitsFor } from '../data/content';
import { useProgress } from '../context/ProgressContext';
import { CheckIcon, LockIcon } from '../components/Icons';
import { Shell } from '../components/Shell';
import { unitProgressLabel } from '../lib/stats';
import { useTitle } from './useTitle';

export function Path() {
  const { lang: langParam } = useParams();
  const { state, touchTrack } = useProgress();
  const lang = isLang(langParam) ? langParam : null;
  useTitle(lang ? LANG_META[lang].label : 'Path');

  useEffect(() => {
    if (lang) touchTrack(lang);
  }, [lang, touchTrack]);

  if (!lang) return <Navigate to="/" replace />;

  const list = unitsFor(lang);
  const tone = lang === 'es' ? 'bg-es' : 'bg-de';
  const soft = lang === 'es' ? 'bg-es-soft text-es-deep' : 'bg-de-soft text-de-deep';

  return (
    <Shell>
      <div className="mb-4 flex rounded-full bg-white p-1">
        {(['es', 'de'] as const).map((item) => (
          <Link
            key={item}
            to={`/path/${item}`}
            className={`flex-1 rounded-full py-2 text-center text-sm font-semibold ${
              item === lang ? `${tone} text-white` : 'text-muted'
            }`}
          >
            {LANG_META[item].label}
          </Link>
        ))}
      </div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">{LANG_META[lang].native}</h1>
      <p className="mt-2 text-muted">Seven short units. False friends come right after the first cognates.</p>
      <ol className="mt-6 grid gap-3">
        {list.map((unit, index) => {
          const locked = index > 0 && !state.completedUnits.includes(list[index - 1].id);
          const done = state.completedUnits.includes(unit.id);
          const body = (
            <div className="flex gap-3">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                  done ? soft : locked ? 'bg-paper text-muted' : `${tone} text-white`
                }`}
              >
                {done ? <CheckIcon /> : locked ? <LockIcon /> : index + 1}
              </span>
              <span>
                <span className="block font-semibold">{unit.title}</span>
                <span className="mt-0.5 block text-sm text-muted">{unit.summary}</span>
                <span className="mt-1 block text-xs font-medium text-muted">{unitProgressLabel(unit)}</span>
              </span>
            </div>
          );
          if (locked) {
            return (
              <li key={unit.id} className="rounded-[22px] border border-line bg-white/70 px-4 py-4 opacity-70">
                {body}
              </li>
            );
          }
          return (
            <li key={unit.id}>
              <Link to={unitHref(unit)} className="block rounded-[22px] border border-line bg-white px-4 py-4">
                {body}
              </Link>
            </li>
          );
        })}
      </ol>
    </Shell>
  );
}
