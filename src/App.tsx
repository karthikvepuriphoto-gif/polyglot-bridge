import { useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useProgress } from './context/ProgressContext';
import { warmVoices } from './lib/speech';
import { Home } from './pages/Home';
import { Lesson } from './pages/Lesson';
import { Onboarding } from './pages/Onboarding';
import { Path } from './pages/Path';
import { Progress } from './pages/Progress';
import { Review } from './pages/Review';
import { Sentences } from './pages/Sentences';
import { Settings } from './pages/Settings';

function Gate({ children }: { children: ReactNode }) {
  const { state } = useProgress();
  if (!state.onboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

export function App() {
  useEffect(() => {
    warmVoices();
    const synth = window.speechSynthesis;
    if (!synth) return;
    const onVoices = () => warmVoices();
    synth.addEventListener('voiceschanged', onVoices);
    return () => synth.removeEventListener('voiceschanged', onVoices);
  }, []);

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/"
        element={
          <Gate>
            <Home />
          </Gate>
        }
      />
      <Route
        path="/path/:lang"
        element={
          <Gate>
            <Path />
          </Gate>
        }
      />
      <Route
        path="/lesson/:unitId"
        element={
          <Gate>
            <Lesson />
          </Gate>
        }
      />
      <Route
        path="/practice/:unitId"
        element={
          <Gate>
            <Sentences />
          </Gate>
        }
      />
      <Route
        path="/review/:lang"
        element={
          <Gate>
            <Review />
          </Gate>
        }
      />
      <Route
        path="/progress"
        element={
          <Gate>
            <Progress />
          </Gate>
        }
      />
      <Route
        path="/settings"
        element={
          <Gate>
            <Settings />
          </Gate>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
