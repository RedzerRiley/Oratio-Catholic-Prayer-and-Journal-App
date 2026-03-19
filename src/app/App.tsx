import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import IntroScreen from './components/IntroScreen';
import WhatsNewPopup from './components/WhatsNewPopup';
import { latestVersion } from './data/changelog';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// ─── Inner app — has access to AuthContext ────────────────────
function AppInner() {
  const { user, loading } = useAuth();
  const [showIntro, setShowIntro] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // Not logged in — reset so next login shows intro
      setChecked(true);
      setShowIntro(false);
      setShowWhatsNew(false);
      return;
    }

    const checkFirstTime = async () => {
      try {
        const ref = doc(db, 'users', user.uid, 'app', 'meta');
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          // Brand new user — show intro first, then What's New
          await setDoc(ref, { seenVersion: latestVersion.version, seenIntro: true });
          setShowIntro(true);
        } else {
          const data = snap.data();
          const seenVersion = data?.seenVersion ?? '0.0.0';

          // Returning user who hasn't seen this version yet
          if (seenVersion !== latestVersion.version) {
            await setDoc(ref, { seenVersion: latestVersion.version }, { merge: true });
            setShowWhatsNew(true);
          }
        }
      } catch (err) {
        console.error('Meta check failed:', err);
      } finally {
        setChecked(true);
      }
    };

    checkFirstTime();
  }, [user, loading]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // After intro, show What's New for new users too
    setShowWhatsNew(true);
  };

  const handleWhatsNewClose = () => {
    setShowWhatsNew(false);
  };

  return (
    <>
      <RouterProvider router={router} />

      {/* Intro splash — shown to brand new users */}
      {checked && showIntro && (
        <IntroScreen
          onComplete={handleIntroComplete}
          userName={user?.displayName?.split(' ')[0]}
        />
      )}

      {/* What's New — shown after intro (new users) or on version update (returning users) */}
      {checked && !showIntro && showWhatsNew && (
        <WhatsNewPopup onClose={handleWhatsNewClose} />
      )}
    </>
  );
}

// ─── Root app with providers ──────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}