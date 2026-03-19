import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { rosaryMysteries, dailyPrayers } from '../data/prayers';
import { Sparkles, ChevronRight, ChevronLeft, X, Award, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

type MysteryType = 'joyful' | 'luminous' | 'sorrowful' | 'glorious';

const STREAK_MILESTONES = [3, 5, 10, 15, 20, 30, 50, 100];

const getMysteryForToday = (): MysteryType => {
  const day = new Date().getDay();
  if (day === 1 || day === 6) return 'joyful';
  if (day === 4) return 'luminous';
  if (day === 2 || day === 5) return 'sorrowful';
  return 'glorious';
};

const getPrayerText = (id: string) =>
  dailyPrayers.find(p => p.id === id)?.text ?? '';

const mysteries = [
  { id: 'joyful' as MysteryType, name: 'Joyful Mysteries', color: 'bg-yellow-500', lightColor: 'bg-yellow-50', borderColor: 'border-yellow-200', day: 'Monday & Saturday' },
  { id: 'luminous' as MysteryType, name: 'Luminous Mysteries', color: 'bg-blue-500', lightColor: 'bg-blue-50', borderColor: 'border-blue-200', day: 'Thursday' },
  { id: 'sorrowful' as MysteryType, name: 'Sorrowful Mysteries', color: 'bg-purple-500', lightColor: 'bg-purple-50', borderColor: 'border-purple-200', day: 'Tuesday & Friday' },
  { id: 'glorious' as MysteryType, name: 'Glorious Mysteries', color: 'bg-pink-500', lightColor: 'bg-pink-50', borderColor: 'border-pink-200', day: 'Wednesday & Sunday' },
];

type Step =
  | { type: 'intro' }
  | { type: 'prayer'; title: string; subtitle: string; text: string }
  | { type: 'decade'; num: number; mysteryTitle: string; mysteryMeditation: string }
  | { type: 'complete' };

function buildSteps(mystery: MysteryType): Step[] {
  const steps: Step[] = [];
  steps.push({ type: 'intro' });
  steps.push({ type: 'prayer', title: "Sign of the Cross & Apostles' Creed", subtitle: 'Opening', text: `Begin with the Sign of the Cross:\n\n"In the name of the Father, and of the Son, and of the Holy Spirit. Amen."\n\nThen pray the Apostles' Creed:\n\n${getPrayerText('apostles-creed')}` });
  steps.push({ type: 'prayer', title: 'Our Father', subtitle: 'Opening prayer', text: getPrayerText('our-father') });
  steps.push({ type: 'prayer', title: 'Three Hail Marys', subtitle: 'For faith, hope and charity', text: `Pray the Hail Mary three times:\n\n${getPrayerText('hail-mary')}` });
  steps.push({ type: 'prayer', title: 'Glory Be', subtitle: 'After the three Hail Marys', text: getPrayerText('glory-be') });
  rosaryMysteries[mystery].forEach((m, i) => {
    steps.push({ type: 'decade', num: i + 1, mysteryTitle: m.title, mysteryMeditation: m.meditation });
  });
  steps.push({ type: 'complete' });
  return steps;
}

const decadeSubLabels = ['Announce Mystery', 'Our Father', 'Ten Hail Marys', 'Glory Be'];

function DecadeStep({ step, mysteryColor, onDecadeComplete }: {
  step: Extract<Step, { type: 'decade' }>;
  mysteryColor: string;
  onDecadeComplete: () => void;
}) {
  const [sub, setSub] = useState(0);
  const subTexts = [
    `Announce the mystery and meditate:\n\n"${step.mysteryMeditation}"`,
    getPrayerText('our-father'),
    `Pray the Hail Mary ten times while meditating on the mystery:\n\n${getPrayerText('hail-mary')}`,
    getPrayerText('glory-be'),
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-1.5 mb-5">
        {decadeSubLabels.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= sub ? mysteryColor : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Decade {step.num} · {decadeSubLabels[sub]}</p>
      <h3 className="text-xl font-serif text-gray-800 mb-4">{sub === 0 ? step.mysteryTitle : decadeSubLabels[sub]}</h3>
      <div className="bg-gray-50 rounded-2xl p-5 flex-1 overflow-y-auto mb-4">
        <p className="text-gray-700 leading-loose whitespace-pre-line text-base">{subTexts[sub]}</p>
      </div>
      <div className="flex gap-3">
        {sub > 0 && (
          <button onClick={() => setSub(sub - 1)} className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        {sub < 3 ? (
          <button onClick={() => setSub(sub + 1)} className={`flex-1 py-3 ${mysteryColor} text-white rounded-2xl font-semibold`}>Next</button>
        ) : (
          <button onClick={onDecadeComplete} className="flex-1 py-3 bg-gray-800 text-white rounded-2xl font-semibold flex items-center justify-center gap-2">
            {step.num < 5 ? 'Next Decade →' : 'Finish Rosary →'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Rosary() {
  const { user } = useAuth();
  const [selectedMystery, setSelectedMystery] = useState<MysteryType>(getMysteryForToday());
  const [showGuide, setShowGuide] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rosaryCount, setRosaryCount] = useState(0);
  const [showMilestone, setShowMilestone] = useState<number | null>(null);

  const mysteryMeta = mysteries.find(m => m.id === selectedMystery)!;
  const steps = buildSteps(selectedMystery);
  const currentStep = steps[stepIndex];
  const progress = (stepIndex / (steps.length - 1)) * 100;

  const milestoneMessages: Record<number, string> = {
    3: "You're building a beautiful habit! Our Lady is proud of you.",
    5: 'Five rosaries! You are walking faithfully with Mary.',
    10: 'Ten rosaries prayed! Your dedication is an inspiration.',
    15: 'Fifteen rosaries! St. Dominic would be so proud.',
    20: 'Twenty rosaries! You are a true devotee of Our Lady.',
    30: 'Thirty rosaries! A full month of faithful prayer. Incredible!',
    50: 'Fifty rosaries! You are a spiritual warrior. Keep going!',
    100: 'One hundred rosaries! You have prayed an entire Psalter. Blessed!',
  };

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const ref = doc(db, 'users', user.uid, 'rosary', 'stats');
        const snap = await getDoc(ref);
        if (snap.exists()) setRosaryCount(snap.data().count ?? 0);
      } catch (err) { console.error(err); }
    };
    load();
  }, [user]);

  const handleCompleteRosary = async () => {
    const newCount = rosaryCount + 1;
    setRosaryCount(newCount);
    if (user) {
      try {
        const ref = doc(db, 'users', user.uid, 'rosary', 'stats');
        await setDoc(ref, { count: newCount }, { merge: true });
      } catch (err) { console.error(err); }
    }
    if (STREAK_MILESTONES.includes(newCount)) setShowMilestone(newCount);
    setShowGuide(false);
    setStepIndex(0);
  };

  const handleNext = () => { if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1); };
  const handleBack = () => { if (stepIndex > 0) setStepIndex(stepIndex - 1); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-serif">Holy Rosary</h1>
              <p className="text-purple-100 text-sm">Meditate on the mysteries</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4">
        {/* Mystery selector */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-5">
          <h2 className="text-sm font-medium text-gray-600 mb-3">Select Mystery</h2>
          <div className="grid grid-cols-2 gap-3">
            {mysteries.map((mystery) => (
              <button key={mystery.id} onClick={() => setSelectedMystery(mystery.id)}
                className={`p-4 rounded-xl transition-all ${selectedMystery === mystery.id ? `${mystery.color} text-white shadow-md` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <div className="font-semibold mb-1 text-sm">{mystery.name}</div>
                <div className={`text-xs ${selectedMystery === mystery.id ? 'text-white/90' : 'text-gray-500'}`}>{mystery.day}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Rosary count card + Start button */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Count display */}
          <div className={`${mysteryMeta.color} px-6 py-5 flex items-center justify-between`}>
            <div>
              <p className="text-white/80 text-sm font-medium">Rosaries Prayed</p>
              <p className="text-4xl font-bold text-white leading-none mt-1">{rosaryCount}</p>
            </div>
            <div className="text-5xl opacity-80">🌹</div>
          </div>

          {/* Next milestone */}
          {(() => {
            const next = STREAK_MILESTONES.find(m => m > rosaryCount);
            const prev = STREAK_MILESTONES.filter(m => m <= rosaryCount).pop();
            const pct = next
              ? Math.round(((rosaryCount - (prev ?? 0)) / (next - (prev ?? 0))) * 100)
              : 100;
            return next ? (
              <div className="px-6 py-3 border-b border-gray-100">
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-xs text-gray-500">Next milestone: <span className="font-semibold text-gray-700">{next} rosaries</span></p>
                  <p className="text-xs text-gray-400">{rosaryCount}/{next}</p>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${mysteryMeta.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ) : null;
          })()}

          {/* Start button */}
          <button
            onClick={() => { setStepIndex(0); setShowGuide(true); }}
            className="w-full px-6 py-4 flex items-center justify-between group hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`${mysteryMeta.color} rounded-xl p-2.5`}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Begin Praying </p>
                <p className="text-xs text-gray-500">Step-by-step · {mysteryMeta.name}</p>
              </div>
            </div>
            <div className={`${mysteryMeta.color} rounded-full p-1.5`}>
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* ── GUIDE OVERLAY ──────────────────────────────────────── */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className={`${mysteryMeta.color} text-white px-6 pt-12 pb-5`}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">{mysteryMeta.name}</p>
              <button onClick={() => setShowGuide(false)} className="bg-white/20 rounded-full p-1.5"><X className="w-4 h-4" /></button>
            </div>
            <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-white/70 text-xs mt-1.5">Step {stepIndex + 1} of {steps.length}</p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {currentStep.type === 'intro' && (
              <div className="flex flex-col items-center text-center justify-center min-h-full">
                <div className={`w-20 h-20 ${mysteryMeta.color} rounded-full flex items-center justify-center mb-6 shadow-xl`}>
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-serif text-gray-800 mb-1">Let's Get Started</h2>
                <p className="text-gray-400 mb-6 text-sm">Today's Mystery</p>
                <div className={`${mysteryMeta.color} text-white rounded-2xl px-6 py-4 mb-4 w-full`}>
                  <p className="text-lg font-bold">{mysteryMeta.name}</p>
                  <p className="text-white/80 text-sm">{mysteryMeta.day}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 w-full text-left">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">The Five Mysteries</p>
                  {rosaryMysteries[selectedMystery].map((m, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      <span className={`w-6 h-6 ${mysteryMeta.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{i + 1}</span>
                      <p className="text-sm text-gray-700">{m.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep.type === 'prayer' && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{currentStep.subtitle}</p>
                <h2 className="text-2xl font-serif text-gray-800 mb-5">{currentStep.title}</h2>
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-gray-700 leading-loose whitespace-pre-line text-base">{currentStep.text}</p>
                </div>
              </div>
            )}

            {currentStep.type === 'decade' && (
              <DecadeStep step={currentStep} mysteryColor={mysteryMeta.color} onDecadeComplete={handleNext} />
            )}

            {currentStep.type === 'complete' && (
              <div className="flex flex-col items-center text-center justify-center min-h-full">
                <div className="text-6xl mb-4 animate-bounce">🌹</div>
                <div className="flex gap-2 text-3xl mb-6">✝️🙏📿</div>
                <h2 className="text-3xl font-serif text-gray-800 mb-3">Rosary Complete!</h2>
                <p className="text-gray-500 mb-4 leading-relaxed">You have finished praying the Holy Rosary.<br />May Our Lady intercede for your intentions.</p>
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 my-2 w-full">
                  <p className="text-purple-500 text-sm font-medium">Total Rosaries Prayed</p>
                  <p className="text-5xl font-bold text-purple-600">{rosaryCount + 1}</p>
                </div>
                <p className="text-xs text-gray-400 italic mt-4">"The Rosary is the weapon for these times." — St. Padre Pio</p>
              </div>
            )}
          </div>

          <div className="px-6 pb-20 pt-4 border-t border-gray-100">
            {currentStep.type === 'complete' ? (
              <button onClick={handleCompleteRosary} className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl py-4 font-bold text-lg shadow-lg active:scale-98">
                🌹 Save & Complete
              </button>
            ) : currentStep.type === 'decade' ? null : (
              <div className="flex gap-3">
                {stepIndex > 0 && (
                  <button onClick={handleBack} className="w-12 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <button onClick={handleNext} className={`flex-1 ${mysteryMeta.color} text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 shadow-md active:scale-98`}>
                  {stepIndex === 0 ? 'Begin' : 'Next'}<ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MILESTONE POPUP ────────────────────────────────────── */}
      {showMilestone !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center shadow-2xl">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-purple-600" />
              </div>
              <div className="absolute inset-0 bg-purple-300/30 rounded-full animate-ping" />
            </div>
            <div className="text-4xl mb-2">🌹</div>
            <h2 className="text-2xl font-serif text-gray-800 mb-1">{showMilestone} Rosaries Prayed!</h2>
            <p className="text-gray-500 mb-4 text-sm leading-relaxed">{milestoneMessages[showMilestone]}</p>
            <div className="bg-purple-50 rounded-2xl px-4 py-3 mb-5">
              <p className="text-purple-700 text-sm italic">"Never will anyone who says his Rosary every day be led astray." — St. Louis de Montfort</p>
            </div>
            <button onClick={() => setShowMilestone(null)} className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl py-3.5 font-semibold">
              Thanks be to God 🙏
            </button>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}