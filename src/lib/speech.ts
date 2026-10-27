import type { Lang } from '../types';
import { LANG_META } from '../data/content';

export function speakable(text: string): string {
  return text.replace(/\s*___/g, '').replace(/\s+/g, ' ').trim();
}

let ticket = 0;

export function speak(text: string, lang: Lang, rate = 1): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(speakable(text));
  utter.lang = LANG_META[lang].speech;
  utter.rate = rate;
  const voices = synth.getVoices();
  const voice =
    voices.find((item) => item.lang === utter.lang) ??
    voices.find((item) => item.lang.toLowerCase().startsWith(lang));
  if (voice) utter.voice = voice;
  const mine = ++ticket;
  synth.cancel();
  window.setTimeout(() => {
    if (mine !== ticket) return;
    synth.speak(utter);
  }, 40);
}

export function stopSpeech(): void {
  ticket += 1;
  window.speechSynthesis?.cancel();
}

export function warmVoices(): void {
  window.speechSynthesis?.getVoices();
}
