export function stressedSyllable(pronunciation: string): string | null {
  const part = pronunciation.split('-').find((syllable) => [...syllable].some(isUpperChar));
  return part ?? null;
}

function isUpperChar(char: string): boolean {
  return char !== char.toLowerCase() && char === char.toUpperCase();
}

export function shuffled<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  let state = seed || 1;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (state * 16807) % 2147483647;
    const swap = state % (index + 1);
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  if (copy.length > 1 && copy.every((item, index) => item === items[index])) {
    [copy[0], copy[1]] = [copy[1], copy[0]];
  }
  return copy;
}

export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
