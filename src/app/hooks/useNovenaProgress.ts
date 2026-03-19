import { useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

type NovenaProgress = {
  startDate: string;       // YYYY-MM-DD
  completedDays: number[];
};

export function useNovenaProgress() {
  const { user } = useAuth();

  const getProgress = useCallback(async (novenaId: string): Promise<NovenaProgress | null> => {
    if (!user) return null;
    try {
      const ref = doc(db, 'users', user.uid, 'novenas', novenaId);
      const snap = await getDoc(ref);
      return snap.exists() ? (snap.data() as NovenaProgress) : null;
    } catch {
      return null;
    }
  }, [user]);

  const saveProgress = useCallback(async (novenaId: string, progress: NovenaProgress) => {
    if (!user) return;
    try {
      const ref = doc(db, 'users', user.uid, 'novenas', novenaId);
      await setDoc(ref, progress, { merge: true });
    } catch (err) {
      console.error('Failed to save novena progress:', err);
    }
  }, [user]);

  return { getProgress, saveProgress };
}