import { useState, useEffect, useRef } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import IntroScreen from './components/IntroScreen';
import WhatsNewPopup from './components/WhatsNewPopup';
import { latestVersion } from './data/changelog';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SESSION_KEY = 'oratio_session_checked';

function AppInner() {
  const { user, loading } = useAuth();
  const [showIntro, setShowIntro] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (loading || !user || hasChecked.current) return;

    // Already shown this session — skip on hot reload / navigation
    const sessionDone = sessionStorage.getItem(SESSION_KEY);
    if (sessionDone === user.uid) {
      hasChecked.current = true;
      return;
    }

    hasChecked.current = true;

    const checkMeta = async () => {
      try {
        const ref = doc(db, 'users', user.uid, 'app', 'meta');
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          // Brand new user — show intro immediately, then What's New
          setShowIntro(true);
          // Save in background — don't await so intro appears instantly
          setDoc(ref, { seenVersion: latestVersion.version, seenIntro: true });
        } else {
          const seenVersion = snap.data()?.seenVersion ?? '0.0.0';
          if (seenVersion !== latestVersion.version) {
            // Returning user on a new version — update stored version
            setDoc(ref, { seenVersion: latestVersion.version }, { merge: true });
          }
          // Always show What's New on every login (once per session)
          setShowWhatsNew(true);
        }
      } catch (err) {
        console.error('Meta check failed:', err);
      }
    };

    checkMeta();
  }, [user, loading]);

  // Reset on logout
  useEffect(() => {
    if (!loading && !user) {
      hasChecked.current = false;
      setShowIntro(false);
      setShowWhatsNew(false);
    }
  }, [user, loading]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowWhatsNew(true);
  };

  const handleWhatsNewClose = () => {
    setShowWhatsNew(false);
    if (user) sessionStorage.setItem(SESSION_KEY, user.uid);
  };

  return (
    <>
      <RouterProvider router={router} />

      {showIntro && (
        <IntroScreen
          onComplete={handleIntroComplete}
          userName={user?.displayName?.split(' ')[0]}
        />
      )}

      {!showIntro && showWhatsNew && (
        <WhatsNewPopup onClose={handleWhatsNewClose} />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}