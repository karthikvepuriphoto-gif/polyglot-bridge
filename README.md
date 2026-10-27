# Polyglot Bridge

A mobile-first progressive web app that teaches **Spanish** and **German** to English speakers through cognates, near-cognate patterns, false friends, and short sentences you can say out loud.

Everyday secular language only: travel, home, and work. No accounts. Progress stays on the device (`localStorage`, with an IndexedDB mirror).

## Scripts

```bash
npm install
npm run dev
```

Open [http://localhost:5173/polyglot-bridge/](http://localhost:5173/polyglot-bridge/). The Vite base path is `/polyglot-bridge/`.

```bash
npm run build
npm run preview
```

## What’s in the prototype

- Onboarding: Spanish, German, or both, plus a demo cognate card (`familia`, or `Information` if you pick German only).
- Home with both tracks, a continue action, a streak, and feedback.
- 15 cognate cards and 5 false-friend cards per language.
- 10 starter sentences per language with listen / slow (0.75×) / “I said it”, plus tap-to-order.
- Path units and Again / Good / Easy review (1, 3, 7, 21 days).
- Prototype audio uses the device voice: `es-ES` and `de-DE`.

## Feedback

**Suggest an idea** and **Send feedback** open [the Jotform](https://form.jotform.com/262994206353058) in a new tab (`target="_blank"` `rel="noopener noreferrer"`). The form is not embedded.

## GitHub Pages

`.github/workflows/pages.yml` builds the app and deploys `dist/` to GitHub Pages on pushes to `main`. A copy of `index.html` is written to `404.html` so client-side routes survive a refresh.
