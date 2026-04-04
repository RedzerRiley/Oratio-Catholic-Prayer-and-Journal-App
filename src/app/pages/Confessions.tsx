import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { BookHeart, Plus, Check, Trash2, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
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

interface ConfessionEntry {
  id: string;
  sin: string;
  category: string;
  date: string;
  confessed: boolean;
}

const sinCategories = [
  'Pride', 'Greed', 'Lust', 'Envy', 'Gluttony', 'Wrath', 'Sloth', 'Other',
];

const examinationOfConscience = [
  {
    commandment: 'First Commandment',
    questions: [
      'Have I doubted or denied my faith?',
      'Have I practiced superstition or consulted fortune-tellers?',
      'Have I put other things before God (money, success, etc.)?',
    ],
  },
  {
    commandment: 'Second Commandment',
    questions: [
      "Have I used God's name in vain or sworn falsely?",
      'Have I cursed or blasphemed?',
    ],
  },
  {
    commandment: 'Third Commandment',
    questions: [
      'Have I missed Mass on Sunday or Holy Days without serious reason?',
      'Have I been inattentive or irreverent at Mass?',
    ],
  },
  {
    commandment: 'Fourth Commandment',
    questions: [
      'Have I disobeyed or disrespected my parents?',
      'Have I neglected my family duties?',
    ],
  },
  {
    commandment: 'Fifth Commandment',
    questions: [
      'Have I physically harmed anyone?',
      'Have I been angry, hateful, or resentful?',
      'Have I held grudges or refused to forgive?',
    ],
  },
  {
    commandment: 'Sixth & Ninth Commandments',
    questions: [
      'Have I committed impure acts?',
      'Have I entertained impure thoughts or desires?',
      'Have I viewed inappropriate content?',
    ],
  },
  {
    commandment: 'Seventh & Tenth Commandments',
    questions: [
      "Have I stolen or damaged others' property?",
      'Have I been envious or greedy?',
      'Have I cheated or been dishonest in business?',
    ],
  },
  {
    commandment: 'Eighth Commandment',
    questions: [
      'Have I lied or gossiped?',
      "Have I damaged someone's reputation?",
      'Have I been deceitful?',
    ],
  },
];

export default function Confessions() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ConfessionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showExaminationDialog, setShowExaminationDialog] = useState(false);
  const [newSin, setNewSin] = useState('');
  const [newCategory, setNewCategory] = useState('Other');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confessed'>('all');
  const [showGuideDialog, setShowGuideDialog] = useState(false);

  // Real-time Firestore listener
  useEffect(() => {
    if (!user) return;
    const colRef = collection(db, 'users', user.uid, 'confessions');
    const q = query(colRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: ConfessionEntry[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          sin: data.sin ?? '',
          category: data.category ?? 'Other',
          confessed: data.confessed ?? false,
          date: data.date instanceof Timestamp
            ? data.date.toDate().toISOString()
            : new Date().toISOString(),
        };
      });
      setEntries(fetched);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addEntry = async () => {
    if (!newSin.trim() || !user) return;
    const colRef = collection(db, 'users', user.uid, 'confessions');
    await addDoc(colRef, {
      sin: newSin.trim(),
      category: newCategory,
      confessed: false,
      date: serverTimestamp(),
    });
    setNewSin('');
    setNewCategory('Other');
    setShowAddDialog(false);
  };

  const toggleConfessed = async (id: string, current: boolean) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'confessions', id);
    await updateDoc(ref, { confessed: !current });
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'confessions', id);
    await deleteDoc(ref);
  };

  const clearConfessed = async () => {
    if (!user) return;
    const confessedEntries = entries.filter(e => e.confessed);
    await Promise.all(confessedEntries.map(e => deleteEntry(e.id)));
  };

  const filteredEntries = entries.filter(entry => {
    if (filter === 'pending') return !entry.confessed;
    if (filter === 'confessed') return entry.confessed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookHeart className="w-8 h-8" />
            <h1 className="text-3xl font-serif">Confession Journal</h1>
          </div>
          <p className="text-purple-100 text-sm">Prepare your heart for reconciliation</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-6">
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowAddDialog(true)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl py-4 shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Entry
          </button>
          <button
            onClick={() => setShowExaminationDialog(true)}
            className="flex-1 bg-white text-purple-600 rounded-2xl py-4 shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 font-semibold"
          >
            <AlertCircle className="w-5 h-5" />
            Examination
          </button>
          <button
            onClick={() => setShowGuideDialog(true)}
            className="flex-1 bg-white text-purple-600 rounded-2xl py-4 shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 font-semibold"
          >
            <FileText className="w-5 h-5" />
            Guide
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'pending', 'confessed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Entries List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="space-y-3 mb-6">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`bg-white rounded-2xl p-4 shadow-md transition-all ${entry.confessed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleConfessed(entry.id, entry.confessed)}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      entry.confessed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    {entry.confessed && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-gray-800 mb-2 ${entry.confessed ? 'line-through' : ''}`}>
                      {entry.sin}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {entry.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <BookHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No entries yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first entry to begin</p>
          </div>
        )}

        {/* Clear Confessed Button */}
        {entries.some(e => e.confessed) && (
          <button
            onClick={clearConfessed}
            className="w-full py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear Confessed Entries
          </button>
        )}

        {/* Privacy Notice */}
        <div className="bg-blue-50 rounded-2xl p-4 mt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">Privacy Note</p>
              <p className="text-xs text-blue-800 leading-relaxed">
                Your entries are securely stored in your personal account and are only visible to you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Entry Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Journal Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {sinCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">What to confess</label>
              <textarea
                value={newSin}
                onChange={(e) => setNewSin(e.target.value)}
                placeholder="Describe what you need to confess..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={addEntry}
              disabled={!newSin.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Examination of Conscience Dialog */}
      <Dialog open={showExaminationDialog} onOpenChange={setShowExaminationDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Examination of Conscience</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <p className="text-sm text-gray-600">
              Reflect on these questions based on the Ten Commandments to prepare for confession.
            </p>
            {examinationOfConscience.map((section, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-2">{section.commandment}</h4>
                <ul className="space-y-2">
                  {section.questions.map((question, qIndex) => (
                    <li key={qIndex} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-purple-500 flex-shrink-0">•</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <DialogFooter className="mt-6">
            <Button
              onClick={() => setShowExaminationDialog(false)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confession Guide Dialog */}
      <Dialog open={showGuideDialog} onOpenChange={setShowGuideDialog}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-purple-800">A Guide to Confession</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-6">

            {/* Steps */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-widest text-purple-700">How to go to Confession</h3>
              <div className="space-y-4">
               {[
  "You always have the option to go to confession anonymously, that is, behind a screen or face to face, if you so desire.",
  "After the priest greets you in the name of Christ, make the sign of the cross. He may choose to recite a reading from Scripture, after which you say: \"Bless me Father for I have sinned. It has been (state how long) since my last confession. These are my sins.\"",
  "Tell your sins simply and honestly to the priest. You might even want to discuss the circumstances and the root causes of your sins and ask the priest for advice or direction.",
  "Listen to the advice the priest gives you and accept the penance from him. Then make an Act of Contrition for your sins.",
  "The priest will then dismiss you with the words of praise: \"Give thanks to the Lord for He is good.\" You respond: \"For His mercy endures forever.\" The priest will then conclude with: \"The Lord has freed you from your sins. Go in peace.\" And you respond: \"Thanks be to God.\"",
  "Spend some time with Our Lord thanking and praising Him for the gift of His mercy. Try to perform your penance as soon as possible.",
].map((step, i) => (
  <div key={i} className="flex gap-3">
    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
      {i + 1}
    </div>
    <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
  </div>
))}
              </div>
            </div>

            {/* Prayer Before Confession */}
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
              <h3 className="font-semibold text-purple-800 mb-3 text-sm uppercase tracking-widest">Prayer Before Confession</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{`O most merciful God! Prostrate at your feet, I implore your forgiveness. I sincerely desire to leave all my evil ways and to confess my sins with all sincerity to you and to your priest. I am a sinner, have mercy on me, O Lord. Give me a lively faith and a firm hope in the Passion of my Redeemer. Give me, for your mercy's sake, a sorrow for having offended so good a God. Mary, my mother, refuge of sinners, pray for me that I may make a good confession. Amen.`}</p>
            </div>

            {/* Act of Contrition */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="font-semibold text-amber-800 mb-3 text-sm uppercase tracking-widest">An Act of Contrition</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{`Oh my God, I am sorry for my sins with all my heart. In choosing to do wrong and failing to do good, I have sinned against you whom I should love above all things. I firmly intend, with your help, to do penance, to sin no more, and to avoid whatever leads me to sin. Our Savior Jesus Christ suffered and died for us. In His name, my God, have mercy. Amen.`}</p>
            </div>

          </div>

          <DialogFooter className="mt-6">
            <Button
              onClick={() => setShowGuideDialog(false)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  );
}