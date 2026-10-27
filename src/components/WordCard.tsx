import type { Word } from '../types';
import { LANG_META } from '../data/content';
import { useProgress } from '../context/ProgressContext';
import { speak } from '../lib/speech';
import { stressedSyllable } from '../lib/text';
import { AudioBar } from './AudioBar';
import { PlayIcon } from './Icons';
import { TipBadge } from './TipBadge';

const langBar = {
  es: 'bg-es',
  de: 'bg-de',
};

const langPill = {
  es: 'bg-es-soft text-es-deep',
  de: 'bg-de-soft text-de-deep',
};

export function WordCard({ word, revealed }: { word: Word; revealed: boolean }) {
  const { recordPlay } = useProgress();
  const trap = word.tipType === 'falseFriend';
  const stress = stressedSyllable(word.pronunciation);
  const long = word.text.length > 11;

  return (
    <article className="anim-rise overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_12px_40px_rgba(18,32,41,0.06)]">
      <div className={`h-1.5 ${trap ? 'bg-warn' : langBar[word.lang]}`} />
      <div className="px-5 pt-5 pb-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          {trap ? (
            <span className="text-xs font-semibold tracking-wide text-warn">Trap card</span>
          ) : (
            <span className="text-xs font-medium text-muted">What does this mean?</span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${langPill[word.lang]}`}>
            {LANG_META[word.lang].short}
          </span>
        </div>

        <h1 className={`font-display font-semibold tracking-tight text-ink ${long ? 'text-[2.35rem] leading-none' : 'text-5xl'}`}>
          {word.text}
        </h1>
        <p className="mt-3 text-lg" aria-label="Pronunciation">
          {word.pronunciation.split('-').map((syllable, index, all) => {
            const hot = [...syllable].some((char) => char !== char.toLowerCase() && char === char.toUpperCase());
            return (
              <span key={`${syllable}-${index}`} className={hot ? 'font-semibold text-ink' : 'text-muted'}>
                {syllable}
                {index < all.length - 1 ? <span className="px-1 text-line">·</span> : null}
              </span>
            );
          })}
        </p>
        {stress ? <p className="mt-1 text-sm text-muted">Stress · {stress}</p> : null}
        {word.pronounceHint ? <p className="mt-1 text-sm text-muted">{word.pronounceHint}</p> : null}

        <div className="mt-4">
          <AudioBar text={word.text} lang={word.lang} />
        </div>

        {trap && word.looksLike ? (
          <p className="mt-4 rounded-2xl bg-warn-soft px-4 py-3 text-sm text-warn">
            Looks like <span className="font-semibold">“{word.looksLike}”</span>
          </p>
        ) : null}

        {revealed ? (
          <div className="anim-rise mt-4 border-t border-line pt-4">
            <p className="text-xs font-medium text-muted">{trap ? 'Actually means' : 'English'}</p>
            {trap && word.looksLike ? (
              <p className="mt-1 text-sm text-muted line-through">{word.looksLike}</p>
            ) : null}
            <p className="font-display text-4xl font-semibold tracking-tight text-ink">{word.english}</p>
            <div className="mt-3">
              <TipBadge type={word.tipType} />
              <p className="mt-2 text-[15px] leading-relaxed text-ink">{word.tip}</p>
            </div>
            <div className="mt-4 rounded-2xl bg-paper px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-muted">In a sentence</p>
                <button
                  type="button"
                  onClick={() => {
                    speak(word.example, word.lang, 1);
                    recordPlay(word.lang);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-ink"
                >
                  <PlayIcon />
                  Play sentence
                </button>
              </div>
              <p className="mt-1 text-base font-medium text-ink">{word.example}</p>
              <p className="text-sm text-muted">{word.exampleEn}</p>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
