import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LANG_META } from '../data/content';
import type { Goal, Lang } from '../types';
import { useProgress } from '../context/ProgressContext';
import { FeedbackActions } from '../components/FeedbackLink';
import { Shell } from '../components/Shell';
import { speak } from '../lib/speech';
import { useTitle } from './useTitle';

const goals: { id: Goal; label: string }[] = [
  { id: 'travel', label: 'Travel' },
  { id: 'work', label: 'Work' },
  { id: 'fun', label: 'Fun' },
  { id: 'family', label: 'Family' },
];

export function Settings() {
  useTitle('Settings');
  const navigate = useNavigate();
  const { state, updateTracks, updateGoal, updateReminder, reset } = useProgress();
  const [armed, setArmed] = useState(false);

  const toggle = (lang: Lang) => {
    const has = state.tracks.includes(lang);
    if (has && state.tracks.length === 1) return;
    const next = has ? state.tracks.filter((item) => item !== lang) : [...state.tracks, lang];
    updateTracks((['es', 'de'] as Lang[]).filter((item) => next.includes(item)));
  };

  return (
    <Shell>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-muted">Tracks, audio, and a way to tell us what to build next.</p>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-muted">Your tracks</h2>
        <div className="mt-2 grid gap-2">
          {(['es', 'de'] as Lang[]).map((lang) => {
            const on = state.tracks.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(lang)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left ${
                  on ? 'border-es bg-white' : 'border-line bg-white/60'
                }`}
              >
                <span>
                  <span className="block font-semibold">{LANG_META[lang].label}</span>
                  <span className="text-sm text-muted">{LANG_META[lang].native}</span>
                </span>
                <span className="text-sm font-semibold">{on ? 'On' : 'Off'}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted">Keep at least one. The other track stays available from Home.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-muted">Why you’re learning</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {goals.map((goal) => (
            <button
              key={goal.id}
              type="button"
              aria-pressed={state.goal === goal.id}
              onClick={() => updateGoal(goal.id)}
              className={`rounded-full px-3 py-2 text-sm font-semibold ${
                state.goal === goal.id ? 'bg-ink text-white' : 'bg-white text-ink'
              }`}
            >
              {goal.label}
            </button>
          ))}
        </div>
      </section>

      <label className="mt-6 block rounded-[22px] border border-line bg-white px-4 py-3">
        <span className="text-sm font-semibold">Reminder time</span>
        <span className="mt-1 block text-sm text-muted">Saved on this device. Notifications are not sent yet.</span>
        <input
          type="time"
          value={state.reminderTime ?? ''}
          onChange={(event) => updateReminder(event.target.value || null)}
          className="mt-3 w-full rounded-xl border border-line bg-paper px-3 py-2"
        />
      </label>

      <section className="mt-6 rounded-[22px] border border-line bg-white px-4 py-4">
        <h2 className="font-semibold">Pronunciation</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          This prototype uses your device voice: Spanish from Spain (es-ES) and standard German (de-DE). Slow plays at
          0.75×. Recorded audio comes later.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => speak('¿Cómo estás?', 'es', 1)}
            className="min-h-11 rounded-2xl bg-es-soft text-sm font-semibold text-es-deep"
          >
            Test Spanish
          </button>
          <button
            type="button"
            onClick={() => speak("Wie geht's?", 'de', 1)}
            className="min-h-11 rounded-2xl bg-de-soft text-sm font-semibold text-de-deep"
          >
            Test German
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-[22px] border border-line bg-white px-4 py-4">
        <h2 className="font-semibold">Install</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          From the browser menu, choose Install app or Add to Home Screen. After the first visit, lessons open offline.
        </p>
      </section>

      <section className="mt-6" aria-label="Feedback">
        <h2 className="mb-2 text-sm font-medium text-muted">Feedback</h2>
        <FeedbackActions />
        <p className="mt-2 text-xs text-muted">Suggest an idea and Send feedback both open the form in a new tab.</p>
      </section>

      <Link to="/onboarding" className="mt-6 block text-sm font-semibold text-ink">
        Replay introduction
      </Link>

      <div className="mt-6">
        {armed ? (
          <button
            type="button"
            onClick={() => {
              reset();
              navigate('/onboarding');
            }}
            className="min-h-12 w-full rounded-2xl bg-warn-soft font-semibold text-warn"
          >
            Confirm reset
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setArmed(true)}
            className="min-h-12 w-full rounded-2xl border border-line bg-white font-semibold"
          >
            Reset progress
          </button>
        )}
      </div>
    </Shell>
  );
}
