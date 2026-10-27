export function Mark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#0f766e" />
      <path d="M5 22.5h22" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="7" y="15.2" width="3.3" height="7.3" rx="0.6" fill="white" />
      <rect x="21.7" y="15.2" width="3.3" height="7.3" rx="0.6" fill="white" />
      <path d="M10.3 22.5c0-4.4 2.6-7.4 5.7-7.4s5.7 3 5.7 7.4" stroke="white" strokeWidth="1.7" fill="none" />
      <circle cx="23.4" cy="8.6" r="2" fill="#c7d2fe" />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path
        strokeLinecap="round"
        d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.6 1.6M16.3 16.3l1.6 1.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

export function SlowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" d="M12 8v4.5l3 2" />
    </svg>
  );
}

export function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" d="M10 6H6.8A1.8 1.8 0 0 0 5 7.8v9.4A1.8 1.8 0 0 0 6.8 19h9.4a1.8 1.8 0 0 0 1.8-1.8V14" />
      <path strokeLinecap="round" d="M13 5h6v6M19 5l-8 8" />
    </svg>
  );
}

export function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5 10 17l9-10" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6" y="10" width="12" height="9" rx="2" />
      <path strokeLinecap="round" d="M8.5 10V8a3.5 3.5 0 0 1 7 0v2" />
    </svg>
  );
}
