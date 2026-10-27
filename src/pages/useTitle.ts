import { useEffect } from 'react';

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title === 'Home' ? 'Polyglot Bridge' : `${title} · Polyglot Bridge`;
  }, [title]);
}
