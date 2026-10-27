import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { GearIcon, Mark } from './Icons';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[440px] px-4 pb-10 pt-4">
      <header className="mb-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-ink">
          <Mark />
          <span className="text-[15px] font-semibold tracking-tight">Polyglot Bridge</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/progress" className="rounded-full px-3 py-2 text-sm font-medium text-muted hover:text-ink">
            Progress
          </Link>
          <Link
            to="/settings"
            aria-label="Settings"
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-white"
          >
            <GearIcon />
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}

export function Dock({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20">
      <div className="pointer-events-auto mx-auto max-w-[440px] bg-gradient-to-t from-mist from-55% to-transparent px-4 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );
}
