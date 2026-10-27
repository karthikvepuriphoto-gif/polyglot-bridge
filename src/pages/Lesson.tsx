import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { LANG_META, unitById, unitHref, wordById } from '../data/content';
import type { Grade } from '../types';
import { useProgress } from '../context/ProgressContext';
import { FeedbackLink } from '../components/FeedbackLink';
import { CheckIcon } from '../components/Icons';
import { Dock, Shell } from '../components/Shell';
import { WordCard } from '../components/WordCard';
import { followingUnit, reviewSelection } from '../lib/stats';
import { speak, stopSpeech } from '../lib/speech';
import { useTitle } from './useTitle';

export function Lesson() {
  const { unitId } = useParams();
  const unit = unitById(unitId ?? '');
  if (!unit || unit.kind === 'sentences') return <Navigate to="/" replace />;
  return <LessonSession key={unit.id} unitId={unit.id} />;
}

function LessonSession({ unitId }: { unitId: string }) {
  const unit = unitById(unitId)!;
  const { state, gradeWord, completeUnit, touchTrack } = useProgress();
  const [order, setOrder] = useState(() =>
    unit.kind === 'review' ? reviewSelection(state, unit.lang) : unit.wordIds,
  );
  const [index, setIndex] = useState(0);
  const [retried, setRetried] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  useTitle(unit.title);

  useEffect(() => {
    touchTrack(unit.lang);
  }, [touchTrack, unit.lang]);

  useEffect(() => () => stopSpeech(), []);

  const word = wordById(order[index] ?? '');

  useEffect(() => {
    if (!word || done) return;
    speak(word.text, word.lang, 1);
    return () => stopSpeech();
  }, [word, done]);

  const tone = unit.lang === 'es' ? 'bg-es' : 'bg-de';
  const progress = done ? 1 : order.length ? index / order.length : 0;

  const onGrade = (grade: Grade) => {
    if (!word) return;
    gradeWord(word.id, grade);
    const retry = grade === 'again' && !retried.includes(word.id);
    const nextOrder = retry ? [...order, word.id] : order;
    const nextIndex = index + 1;
    if (retry) {
      setRetried((current) => [...current, word.id]);
      setOrder(nextOrder);
    }
    if (nextIndex >= nextOrder.length) {
      setDone(true);
      completeUnit(unit.id);
      stopSpeech();
      return;
    }
    setIndex(nextIndex);
    setRevealed(false);
  };

  if (!order.length) {
    return (
      <Shell>
        <p className="text-muted">This unit has no cards yet.</p>
        <Link to={`/path/${unit.lang}`} className="mt-4 inline-block font-semibold text-es-deep">
          Back to the path
        </Link>
      </Shell>
    );
  }

  if (done) {
    const next = followingUnit(unit);
    return (
      <Shell>
        <div className="anim-rise mt-8 rounded-[28px] border border-line bg-white px-5 py-8 text-center">
          <p className={`mx-auto grid h-14 w-14 place-items-center rounded-full text-white ${tone}`}>
            <CheckIcon className="h-7 w-7" />
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">{unit.title} is yours.</h1>
          <p className="mt-2 text-muted">
            {LANG_META[unit.lang].label} · come back tomorrow and the streak keeps going.
          </p>
          <div className="mt-6 grid gap-2">
            {next ? (
              <Link to={unitHref(next)} className={`min-h-12 rounded-2xl px-4 py-3 font-semibold text-white ${tone}`}>
                Next · {next.title}
              </Link>
            ) : null}
            <Link to="/" className="min-h-12 rounded-2xl border border-line px-4 py-3 font-semibold">
              Home
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted">
            <FeedbackLink variant="text">Help shape the next unit?</FeedbackLink>
          </p>
        </div>
      </Shell>
    );
  }

  if (!word) return <Navigate to={`/path/${unit.lang}`} replace />;

  return (
    <Shell>
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm text-muted">
          <span>
            {LANG_META[unit.lang].label} · {unit.title}
          </span>
          <span>
            {Math.min(index + 1, order.length)} / {order.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white">
          <div className={`h-full ${tone}`} style={{ width: `${Math.max(progress, 0.06) * 100}%` }} />
        </div>
      </div>
      <div className="pb-32">
        <WordCard word={word} revealed={revealed} />
      </div>
      <Dock>
        {revealed ? (
          <div className="grid grid-cols-3 gap-2">
            <GradeButton label="Again" hint="Still new" onClick={() => onGrade('again')} tone="warn" />
            <GradeButton label="Good" hint="It stuck" onClick={() => onGrade('good')} tone={unit.lang} />
            <GradeButton label="Easy" hint="Knew it" onClick={() => onGrade('easy')} tone="ghost" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="min-h-12 w-full rounded-2xl bg-ink text-base font-semibold text-white"
          >
            {word.tipType === 'falseFriend' ? 'Show what it means' : 'Reveal English'}
          </button>
        )}
      </Dock>
    </Shell>
  );
}

function GradeButton({
  label,
  hint,
  onClick,
  tone,
}: {
  label: string;
  hint: string;
  onClick: () => void;
  tone: 'es' | 'de' | 'warn' | 'ghost';
}) {
  const styles = {
    es: 'bg-es text-white',
    de: 'bg-de text-white',
    warn: 'bg-warn-soft text-warn',
    ghost: 'bg-white text-ink border border-line',
  }[tone];
  return (
    <button type="button" onClick={onClick} className={`min-h-14 rounded-2xl px-2 text-center ${styles}`}>
      <span className="block text-sm font-semibold">{label}</span>
      <span className={`block text-[11px] ${tone === 'es' || tone === 'de' ? 'text-white/80' : 'text-muted'}`}>{hint}</span>
    </button>
  );
}
