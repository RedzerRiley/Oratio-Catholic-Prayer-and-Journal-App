import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  mood?: string;
  createdAt: string; // ISO string for display
  updatedAt: string;
};

export function useJournal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener — updates whenever Firestore changes
  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const colRef = collection(db, 'users', user.uid, 'journal');
    const q = query(colRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: JournalEntry[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title ?? '',
          content: data.content ?? '',
          mood: data.mood ?? '',
          createdAt: data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : new Date().toISOString(),
          updatedAt: data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : new Date().toISOString(),
        };
      });
      setEntries(fetched);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addEntry = useCallback(async (title: string, content: string, mood?: string) => {
    if (!user) return;
    const colRef = collection(db, 'users', user.uid, 'journal');
    await addDoc(colRef, {
      title,
      content,
      mood: mood ?? '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }, [user]);

  const updateEntry = useCallback(async (id: string, title: string, content: string, mood?: string) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'journal', id);
    await updateDoc(ref, {
      title,
      content,
      mood: mood ?? '',
      updatedAt: serverTimestamp(),
    });
  }, [user]);

  const deleteEntry = useCallback(async (id: string) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'journal', id);
    await deleteDoc(ref);
  }, [user]);

  return { entries, loading, addEntry, updateEntry, deleteEntry };
}