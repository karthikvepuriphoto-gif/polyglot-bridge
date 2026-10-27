import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { LANG_META, sentenceById, unitById, unitHref } from '../data/content';
import { useProgress } from '../context/ProgressContext';
import { FeedbackLink } from '../components/FeedbackLink';
import { AudioBar } from '../components/AudioBar';
import { CheckIcon } from '../components/Icons';
import { Shell } from '../components/Shell';
import { followingUnit } from '../lib/stats';
import { stopSpeech } from '../lib/speech';
import { shuffled } from '../lib/text';
import { useTitle } from './useTitle';

export function Sentences() {
  const { unitId } = useParams();
  const unit = unitById(unitId ?? '');
  if (!unit || unit.kind !== 'sentences') return <Navigate to="/" replace />;
  return <SentenceSession key={unit.id} unitId={unit.id} />;
}

function SentenceSession({ unitId }: { unitId: string }) {
  const unit = unitById(unitId)!;
  const { markSentence, completeUnit, touchTrack } = useProgress();
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  useTitle(unit.title);

  useEffect(() => {
    touchTrack(unit.lang);
  }, [touchTrack, unit.lang]);

  useEffect(() => () => stopSpeech(), []);

  const sentence = sentenceById(unit.sentenceIds[index] ?? '');
  const tone = unit.lang === 'es' ? 'bg-es' : 'bg-de';

  const finishCard = () => {
    if (!sentence) return;
    markSentence(sentence.id);
    stopSpeech();
    if (index + 1 >= unit.sentenceIds.length) {
      setDone(true);
      completeUnit(unit.id);
      return;
    }
    setIndex((current) => current + 1);
  };

  if (done) {
    const next = followingUnit(unit);
    return (
      <Shell>
        <div className="anim-rise mt-8 rounded-[28px] border border-line bg-white px-5 py-8 text-center">
          <p className={`mx-auto grid h-14 w-14 place-items-center rounded-full text-white ${tone}`}>
            <CheckIcon className="h-7 w-7" />
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">You can say these.</h1>
          <p className="mt-2 text-muted">{unit.title} is ready for the street.</p>
          <div className="mt-6 grid gap-2">
            {next ? (
              <Link to={unitHref(next)} className={`rounded-2xl px-4 py-3 font-semibold text-white ${tone}`}>
                Next · {next.title}
              </Link>
            ) : null}
            <Link to="/" className="rounded-2xl border border-line px-4 py-3 font-semibold">
              Home
            </Link>
          </div>
          <p className="mt-5 text-sm">
            <FeedbackLink variant="text">Help shape the next unit?</FeedbackLink>
          </p>
        </div>
      </Shell>
    );
  }

  if (!sentence) return <Navigate to={`/path/${unit.lang}`} replace />;

  return (
    <Shell>
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm text-muted">
          <span>
            {LANG_META[unit.lang].label} · {unit.title}
          </span>
          <span>
            {index + 1} / {unit.sentenceIds.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white">
          <div className={`h-full ${tone}`} style={{ width: `${((index + 0.15) / unit.sentenceIds.length) * 100}%` }} />
        </div>
      </div>
      <SentenceCard key={sentence.id} text={sentence.text} english={sentence.english} focus={sentence.focus} lang={sentence.lang} tokens={sentence.tokens} onSaid={finishCard} tone={tone} />
    </Shell>
  );
}

function SentenceCard({
  text,
  english,
  focus,
  lang,
  tokens,
  onSaid,
  tone,
}: {
  text: string;
  english: string;
  focus: string;
  lang: 'es' | 'de';
  tokens: string[];
  onSaid: () => void;
  tone: string;
}) {
  const seed = [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const [bank, setBank] = useState(() => shuffled(tokens, seed));
  const [built, setBuilt] = useState<string[]>([]);
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);
  const pill = lang === 'es' ? 'bg-es-soft text-es-deep' : 'bg-de-soft text-de-deep';

  const take = (token: string, from: number) => {
    setBank((current) => current.filter((_, index) => index !== from));
    setBuilt((current) => [...current, token]);
    setWrong(false);
  };

  const undo = (tokenIndex: number) => {
    const token = built[tokenIndex];
    setBuilt((current) => current.filter((_, index) => index !== tokenIndex));
    setBank((current) => [...current, token]);
    setSolved(false);
  };

  const check = () => {
    if (built.join(' ') === tokens.join(' ')) {
      setSolved(true);
      setWrong(false);
      return;
    }
    setWrong(true);
  };

  return (
    <article className="anim-rise overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_12px_40px_rgba(18,32,41,0.06)]">
      <div className={`h-1.5 ${tone}`} />
      <div className="px-5 py-5">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${pill}`}>{focus}</span>
        <h1 className="mt-4 font-display text-[2rem] leading-tight font-semibold tracking-tight">{text}</h1>
        <p className="mt-2 text-base text-muted">{english}</p>
        <p className="mt-4 text-xs font-medium tracking-wide text-muted">Listen and repeat</p>
        <div className="mt-2">
          <AudioBar text={text} lang={lang} />
        </div>
        <button type="button" onClick={onSaid} className={`mt-3 min-h-12 w-full rounded-2xl font-semibold text-white ${tone}`}>
          I said it
        </button>

        <div className={`mt-5 border-t border-line pt-4 ${wrong ? 'anim-shake' : ''}`}>
          <p className="text-sm font-semibold">Build the sentence</p>
          <p className="mt-1 text-sm text-muted">Tap the words into order, then check.</p>
          <div className="mt-3 flex min-h-14 flex-wrap gap-2 rounded-2xl bg-paper px-3 py-3">
            {built.length === 0 ? <span className="text-sm text-muted">Your sentence lands here.</span> : null}
            {built.map((token, tokenIndex) => (
              <button
                key={`${token}-${tokenIndex}`}
                type="button"
                onClick={() => undo(tokenIndex)}
                className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-[0_1px_0_rgba(18,32,41,0.06)]"
              >
                {token}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {bank.map((token, tokenIndex) => (
              <button
                key={`${token}-bank-${tokenIndex}`}
                type="button"
                onClick={() => take(token, tokenIndex)}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-sm font-semibold"
              >
                {token}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={check}
              disabled={!built.length}
              className="min-h-10 rounded-full border border-line px-4 text-sm font-semibold disabled:opacity-40"
            >
              Check order
            </button>
            {solved ? <span className="text-sm font-semibold text-good">Order’s right. Say it once more.</span> : null}
            {wrong ? <span className="text-sm font-semibold text-warn">Not yet — try again.</span> : null}
          </div>
        </div>
      </div>
    </article>
  );
}
