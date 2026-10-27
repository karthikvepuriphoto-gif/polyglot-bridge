import { Component, StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/outfit/latin-400.css';
import '@fontsource/outfit/latin-500.css';
import '@fontsource/outfit/latin-600.css';
import '@fontsource/outfit/latin-700.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/fraunces/latin-700.css';
import './index.css';
import { App } from './App';
import { ProgressProvider } from './context/ProgressContext';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

class Boundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };

  static getDerivedStateFromError(): { error: boolean } {
    return { error: true };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-[440px] px-4 py-10">
          <h1 className="font-display text-3xl font-semibold">This page hit a snag.</h1>
          <button
            type="button"
            className="mt-4 rounded-2xl bg-es px-4 py-3 font-semibold text-white"
            onClick={() => {
              localStorage.removeItem('polyglot-bridge.v1');
              location.assign(import.meta.env.BASE_URL);
            }}
          >
            Reset and reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Boundary>
      <ProgressProvider>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </ProgressProvider>
    </Boundary>
  </StrictMode>,
);
