import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { isLang, LANG_META, wordById } from '../data/content';
import type { Grade } from '../types';
import { useProgress } from '../context/ProgressContext';
import { Dock, Shell } from '../components/Shell';
import { WordCard } from '../components/WordCard';
import { dueWords, reviewSelection } from '../lib/stats';
import { speak, stopSpeech } from '../lib/speech';
import { useTitle } from './useTitle';

export function Review() {
  const { lang: langParam } = useParams();
  const lang = isLang(langParam) ? langParam : null;
  useTitle(lang ? `${LANG_META[lang].label} review` : 'Review');
  const { state, gradeWord, touchTrack } = useProgress();
  const [queue, setQueue] = useState<string[] | null>(null);
  const [index, setIndex] = useState(0);
  const [retried, setRetried] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (lang) touchTrack(lang);
  }, [lang, touchTrack]);

  useEffect(() => () => stopSpeech(), []);

  const due = lang ? dueWords(state, lang) : [];
  const tone = lang === 'de' ? 'bg-de' : 'bg-es';
  const word = queue ? wordById(queue[index] ?? '') : undefined;

  useEffect(() => {
    if (!word || done) return;
    speak(word.text, word.lang, 1);
    return () => stopSpeech();
  }, [word, done]);

  if (!lang) return <Navigate to="/" replace />;

  const start = (ids: string[]) => {
    setQueue(ids);
    setIndex(0);
    setRetried([]);
    setRevealed(false);
    setDone(false);
  };

  const onGrade = (grade: Grade) => {
    if (!word || !queue) return;
    gradeWord(word.id, grade);
    const retry = grade === 'again' && !retried.includes(word.id);
    const nextQueue = retry ? [...queue, word.id] : queue;
    const nextIndex = index + 1;
    if (retry) {
      setRetried((current) => [...current, word.id]);
      setQueue(nextQueue);
    }
    if (nextIndex >= nextQueue.length) {
      setDone(true);
      stopSpeech();
      return;
    }
    setIndex(nextIndex);
    setRevealed(false);
  };

  if (!queue) {
    return (
      <Shell>
        <h1 className="font-display text-4xl font-semibold tracking-tight">{LANG_META[lang].label} review</h1>
        <p className="mt-2 text-muted">
          Again keeps a card due. Good waits a day, then three, then a week. Easy jumps ahead.
        </p>
        <div className="mt-6 rounded-[24px] border border-line bg-white px-4 py-5">
          <p className="text-3xl font-semibold">{due.length}</p>
          <p className="text-sm text-muted">{due.length === 1 ? 'card due' : 'cards due'}</p>
          <button
            type="button"
            disabled={!due.length}
            onClick={() => start(due.map((item) => item.id))}
            className={`mt-4 min-h-12 w-full rounded-2xl font-semibold text-white disabled:opacity-40 ${tone}`}
          >
            Review due cards
          </button>
        </div>
        <button
          type="button"
          onClick={() => start(reviewSelection(state, lang))}
          className="mt-3 min-h-12 w-full rounded-2xl border border-line bg-white font-semibold"
        >
          Practice a mixed set
        </button>
        <Link to={`/path/${lang}`} className="mt-4 inline-block text-sm font-semibold text-muted">
          Back to the path
        </Link>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell>
        <div className="mt-10 rounded-[28px] border border-line bg-white px-5 py-8 text-center">
          <h1 className="font-display text-4xl font-semibold">Review cleared.</h1>
          <p className="mt-2 text-muted">Due cards will return on their own schedule.</p>
          <Link to="/" className={`mt-6 inline-block rounded-2xl px-5 py-3 font-semibold text-white ${tone}`}>
            Home
          </Link>
        </div>
      </Shell>
    );
  }

  if (!word) return <Navigate to="/" replace />;

  return (
    <Shell>
      <div className="mb-4 flex items-center justify-between text-sm text-muted">
        <span>Review · {LANG_META[lang].label}</span>
        <span>
          {index + 1} / {queue.length}
        </span>
      </div>
      <div className="pb-32">
        <WordCard word={word} revealed={revealed} />
      </div>
      <Dock>
        {revealed ? (
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => onGrade('again')} className="min-h-12 rounded-2xl bg-warn-soft text-sm font-semibold text-warn">
              Again
            </button>
            <button type="button" onClick={() => onGrade('good')} className={`min-h-12 rounded-2xl text-sm font-semibold text-white ${tone}`}>
              Good
            </button>
            <button type="button" onClick={() => onGrade('easy')} className="min-h-12 rounded-2xl border border-line bg-white text-sm font-semibold">
              Easy
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setRevealed(true)} className="min-h-12 w-full rounded-2xl bg-ink font-semibold text-white">
            Reveal English
          </button>
        )}
      </Dock>
    </Shell>
  );
}
