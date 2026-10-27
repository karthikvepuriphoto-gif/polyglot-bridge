import type { ReactNode } from 'react';
import { FEEDBACK_FORM_URL } from '../config/feedback';
import { ExternalIcon } from './Icons';

export function FeedbackLink({ children, variant = 'button' }: { children: ReactNode; variant?: 'button' | 'text' }) {
  const className =
    variant === 'text'
      ? 'inline-flex items-center gap-1 font-semibold text-es-deep underline decoration-es/30 underline-offset-4'
      : 'flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-3 text-center text-sm leading-tight font-semibold text-ink transition active:scale-[0.98] hover:border-es';
  return (
    <a href={FEEDBACK_FORM_URL} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ExternalIcon />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function FeedbackActions() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <FeedbackLink>Suggest an idea</FeedbackLink>
      <FeedbackLink>Send feedback</FeedbackLink>
    </div>
  );
}
