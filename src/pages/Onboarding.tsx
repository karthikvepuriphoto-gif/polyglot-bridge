import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoWord, LANG_META } from '../data/content';
import type { Goal, Lang } from '../types';
import { useProgress } from '../context/ProgressContext';
import { Mark } from '../components/Icons';
import { WordCard } from '../components/WordCard';
import { useTitle } from './useTitle';

const goals: { id: Goal; label: string; detail: string }[] = [
  { id: 'travel', label: 'Travel', detail: 'Cafés, streets, stations' },
  { id: 'work', label: 'Work', detail: 'A little, used often' },
  { id: 'fun', label: 'Fun', detail: 'Just because' },
  { id: 'family', label: 'Family', detail: 'People you care about' },
];

type Choice = 'es' | 'de' | 'both';

export function Onboarding() {
  useTitle('Welcome');
  const navigate = useNavigate();
  const { state, completeOnboarding } = useProgress();
  const initialChoice: Choice | null =
    state.tracks.length === 2 ? 'both' : state.tracks[0] === 'es' ? 'es' : state.tracks[0] === 'de' ? 'de' : null;

  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<Choice | null>(initialChoice);
  const [goal, setGoal] = useState<Goal | null>(state.goal);
  const [reminder, setReminder] = useState(state.reminderTime ?? '');
  const [revealed, setRevealed] = useState(false);

  const tracks: Lang[] = choice === 'both' ? ['es', 'de'] : choice ? [choice] : [];
  const sample = demoWord(tracks.length ? tracks : ['es']);

  const finish = () => {
    if (!choice || !goal) return;
    completeOnboarding({
      tracks,
      goal,
      reminderTime: reminder || null,
    });
    navigate('/');
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-4 pt-5 pb-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mark />
          <span className="text-[15px] font-semibold">Polyglot Bridge</span>
        </div>
        <p className="text-sm text-muted">
          {step + 1} / 3
        </p>
      </div>
      <div className="mb-6 flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <span key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-es' : 'bg-white'}`} />
        ))}
      </div>

      {step === 0 ? (
        <section className="anim-rise">
          <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight">
            Learn the words you half-know.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Spanish and German for English speakers. Cognates first, false friends early, then a few sentences you can
            actually say.
          </p>
          <div className="mt-6 grid gap-3">
            <ChoiceCard
              selected={choice === 'es'}
              tone="es"
              title="Spanish"
              native="Español"
              detail={LANG_META.es.blurb}
              onClick={() => setChoice('es')}
            />
            <ChoiceCard
              selected={choice === 'de'}
              tone="de"
              title="German"
              native="Deutsch"
              detail={LANG_META.de.blurb}
              onClick={() => setChoice('de')}
            />
            <ChoiceCard
              selected={choice === 'both'}
              tone="both"
              title="Both"
              native="Español + Deutsch"
              detail="Switch tracks any time. Five quiet minutes."
              onClick={() => setChoice('both')}
            />
          </div>
          <button
            type="button"
            disabled={!choice}
            onClick={() => setStep(1)}
            className="mt-6 min-h-12 w-full rounded-2xl bg-es text-base font-semibold text-white transition enabled:active:scale-[0.98] disabled:opacity-40"
          >
            Continue
          </button>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="anim-rise">
          <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight">Why are you learning?</h1>
          <p className="mt-3 text-muted">This stays on your device. It only tunes the greeting.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {goals.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setGoal(item.id)}
                aria-pressed={goal === item.id}
                className={`rounded-2xl border px-3 py-4 text-left transition ${
                  goal === item.id ? 'border-es bg-es-soft' : 'border-line bg-white'
                }`}
              >
                <span className="block font-semibold">{item.label}</span>
                <span className="mt-1 block text-sm text-muted">{item.detail}</span>
              </button>
            ))}
          </div>
          <label className="mt-6 block rounded-2xl border border-line bg-white px-4 py-3">
            <span className="text-sm font-semibold">Optional reminder</span>
            <span className="mt-1 block text-sm text-muted">Saved here only. No notifications yet.</span>
            <input
              type="time"
              value={reminder}
              onChange={(event) => setReminder(event.target.value)}
              className="mt-3 w-full rounded-xl border border-line bg-paper px-3 py-2 text-base"
            />
          </label>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setStep(0)} className="min-h-12 rounded-2xl border border-line bg-white font-semibold">
              Back
            </button>
            <button
              type="button"
              disabled={!goal}
              onClick={() => {
                setRevealed(false);
                setStep(2);
              }}
              className="min-h-12 rounded-2xl bg-es font-semibold text-white disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="anim-rise">
          <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight">A word you already know.</h1>
          <p className="mt-3 mb-5 text-muted">
            Hear it, then reveal the English bridge. Every card is labeled Cognate, Near, Mnemonic, or False friend.
          </p>
          <WordCard word={sample} revealed={revealed} />
          {revealed ? (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              That’s the bridge: a new word hung on an English one you already know.
            </p>
          ) : null}
          <div className="mt-5 grid gap-2">
            {revealed ? null : (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="min-h-12 rounded-2xl bg-ink font-semibold text-white"
              >
                Reveal English
              </button>
            )}
            <button type="button" onClick={finish} className="min-h-12 rounded-2xl bg-es font-semibold text-white">
              Start learning
            </button>
            <button type="button" onClick={() => setStep(1)} className="min-h-12 rounded-2xl font-semibold text-muted">
              Back
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ChoiceCard({
  selected,
  tone,
  title,
  native,
  detail,
  onClick,
}: {
  selected: boolean;
  tone: 'es' | 'de' | 'both';
  title: string;
  native: string;
  detail: string;
  onClick: () => void;
}) {
  const ring = selected ? (tone === 'de' ? 'border-de bg-de-soft' : 'border-es bg-es-soft') : 'border-line bg-white';
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className={`rounded-[24px] border px-4 py-4 text-left ${ring}`}>
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-sm text-muted">{native}</span>
      </span>
      <span className="mt-1 block text-sm text-muted">{detail}</span>
    </button>
  );
}
