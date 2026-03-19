import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { novenas, Novena } from '../data/prayers';
import { Cross, Calendar, Heart, ChevronRight, BookOpen, CheckCircle, Lock } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// ─── Date helpers ────────────────────────────────────────────
const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const addDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

type NovenaProgress = { startDate: string; completedDays: number[] };
type Screen = 'list' | 'detail' | 'prayer' | 'completed';

// ─── localStorage helpers ────────────────────────────────────
const getProgress = (novenaId: string): NovenaProgress | null => {
  try {
    const raw = localStorage.getItem(`novena_progress_${novenaId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const saveProgress = (novenaId: string, progress: NovenaProgress) => {
  localStorage.setItem(`novena_progress_${novenaId}`, JSON.stringify(progress));
};

// ─── Day status helper ───────────────────────────────────────
const getDayStatus = (novenaId: string, day: number): 'completed' | 'available' | 'locked' => {
  const progress = getProgress(novenaId);
  const today = getTodayStr();
  if (!progress) return day === 1 ? 'available' : 'locked';
  if (progress.completedDays.includes(day)) return 'completed';
  const prevDone = progress.completedDays.includes(day - 1) || day === 1;
  const unlockDate = addDays(progress.startDate, day - 1);
  return prevDone && today >= unlockDate ? 'available' : 'locked';
};

const getUnlockDateDisplay = (novenaId: string, day: number) => {
  const progress = getProgress(novenaId);
  if (!progress) return '';
  return new Date(addDays(progress.startDate, day - 1) + 'T12:00:00')
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ─── Component ───────────────────────────────────────────────
export default function Novenas() {
  const [selectedNovena, setSelectedNovena] = useState<Novena | null>(null);
  const [screen, setScreen] = useState<Screen>('list');
  const [activeDay, setActiveDay] = useState(1);
  const [completedDay, setCompletedDay] = useState(1);

  const handleSelectNovena = (novena: Novena) => { setSelectedNovena(novena); setScreen('detail'); };
  const handleStartDay = (day: number) => { setActiveDay(day); setScreen('prayer'); };

  const handleFinishPrayer = () => {
    if (!selectedNovena) return;
    const today = getTodayStr();
    let progress = getProgress(selectedNovena.id) ?? { startDate: today, completedDays: [] };
    if (!progress.completedDays.includes(activeDay)) progress.completedDays.push(activeDay);
    saveProgress(selectedNovena.id, progress);
    setCompletedDay(activeDay);
    setScreen('completed');
  };

  // ── PRAYER SCREEN ───────────────────────────────────────────
  if (screen === 'prayer' && selectedNovena) {
    const prayerText = selectedNovena.prayers[activeDay - 1] ?? 'Prayer coming soon.';

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 pt-12 pb-6 rounded-b-3xl">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <button onClick={() => setScreen('detail')} className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <p className="text-amber-200 text-xs uppercase tracking-widest">Day {activeDay} of {selectedNovena.days}</p>
              <h1 className="text-xl font-serif">{selectedNovena.title}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-6 mt-6">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: selectedNovena.days }, (_, i) => {
              const status = getDayStatus(selectedNovena.id, i + 1);
              return (
                <div key={i} className={`h-2.5 rounded-full transition-all ${
                  i + 1 === activeDay ? 'bg-amber-500 w-6'
                  : status === 'completed' ? 'bg-amber-400 w-2.5'
                  : 'bg-gray-200 w-2.5'
                }`} />
              );
            })}
          </div>

          {/* Prayer card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h2 className="font-semibold text-gray-800">Day {activeDay} Prayer</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">{prayerText}</p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 mb-6 text-sm text-amber-800">
            <p className="font-medium mb-1">After praying:</p>
            <p>Take a moment in silence, then press <span className="font-semibold">"I have prayed"</span> to mark this day complete.</p>
          </div>
        </div>

        <div className="fixed bottom-20 left-0 right-0 px-6">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleFinishPrayer}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl py-4 font-semibold shadow-xl hover:shadow-2xl transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              I have prayed — Complete Day {activeDay}
            </button>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  // ── COMPLETED SCREEN ────────────────────────────────────────
  if (screen === 'completed' && selectedNovena) {
    const progress = getProgress(selectedNovena.id);
    const allDone = progress && progress.completedDays.length === selectedNovena.days;

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24 flex flex-col">
        <div className="max-w-md mx-auto px-6 flex-1 flex flex-col items-center justify-center text-center pt-16">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-amber-500" />
            </div>
            <div className="absolute inset-0 bg-amber-300/30 rounded-full animate-ping" />
          </div>
          <h2 className="text-2xl font-serif text-gray-800 mb-2">
            {allDone ? '🎉 Novena Complete!' : `Completed Day ${completedDay}!`}
          </h2>
          <p className="text-gray-600 mb-2">
            {allDone
              ? `You have completed all ${selectedNovena.days} days of the ${selectedNovena.title}. May your prayers be answered.`
              : `Completed Day ${completedDay} of the ${selectedNovena.title}.`}
          </p>
          {!allDone && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-4 py-3 mt-2">
              Come back tomorrow to continue Day {completedDay + 1} 🙏
            </p>
          )}
          <button
            onClick={() => setScreen('detail')}
            className="mt-8 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl py-4 font-semibold shadow-lg hover:shadow-xl transition-all active:scale-98"
          >
            Back to Novena
          </button>
        </div>
        <Navigation />
      </div>
    );
  }

  // ── DETAIL SCREEN ───────────────────────────────────────────
  if (screen === 'detail' && selectedNovena) {
    const progress = getProgress(selectedNovena.id);

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-20">
        <div className="relative">
          <div className="h-64 overflow-hidden">
            <ImageWithFallback src={selectedNovena.image} alt={selectedNovena.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
          </div>
          <button onClick={() => setScreen('list')} className="absolute top-6 left-6 bg-white/90 rounded-full p-2 hover:bg-white transition-colors">
            <ChevronRight className="w-6 h-6 rotate-180 text-gray-800" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-serif mb-2">{selectedNovena.title}</h1>
            <p className="text-white/90">{selectedNovena.description}</p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-6 mt-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <Calendar className="w-5 h-5 text-amber-600 mb-2" />
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold text-gray-800">{selectedNovena.days} Days</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <Cross className="w-5 h-5 text-amber-600 mb-2" />
              <p className="text-sm text-gray-600">Patron</p>
              <p className="font-semibold text-gray-800">{selectedNovena.patron}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-gray-800">Intention</h3>
            </div>
            <p className="text-gray-700">{selectedNovena.intention}</p>
          </div>

          <h3 className="font-semibold text-gray-800 mb-3">Your Progress</h3>
          <div className="space-y-3 mb-6">
            {Array.from({ length: selectedNovena.days }, (_, i) => {
              const day = i + 1;
              const status = getDayStatus(selectedNovena.id, day);
              const unlockDate = status === 'locked' && progress ? getUnlockDateDisplay(selectedNovena.id, day) : null;

              return (
                <button
                  key={day}
                  onClick={() => status === 'available' && handleStartDay(day)}
                  disabled={status !== 'available'}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    status === 'completed' ? 'bg-amber-50 border border-amber-200'
                    : status === 'available' ? 'bg-white shadow-md hover:shadow-lg active:scale-98 border border-transparent'
                    : 'bg-gray-50 border border-gray-100 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    status === 'completed' ? 'bg-amber-400' : status === 'available' ? 'bg-amber-500' : 'bg-gray-200'
                  }`}>
                    {status === 'completed' ? <CheckCircle className="w-5 h-5 text-white" />
                     : status === 'locked' ? <Lock className="w-4 h-4 text-gray-400" />
                     : <span className="text-white font-bold text-sm">{day}</span>}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${status === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>Day {day}</p>
                    <p className={`text-xs ${status === 'completed' ? 'text-amber-600' : status === 'locked' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {status === 'completed' ? 'Completed ✓'
                       : status === 'available' ? 'Tap to pray'
                       : unlockDate ? `Unlocks ${unlockDate}` : 'Complete previous day first'}
                    </p>
                  </div>
                  {status === 'available' && <ChevronRight className="w-4 h-4 text-amber-500" />}
                </button>
              );
            })}
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  // ── LIST SCREEN ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-20">
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Cross className="w-8 h-8" />
            <h1 className="text-3xl font-serif">Novenas</h1>
          </div>
          <p className="text-amber-100 text-sm">Nine days of prayer</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">What is a Novena?</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            A novena is a Catholic prayer practice consisting of nine consecutive days of prayer, asking for a special intention or devotion to a particular saint or aspect of God.
          </p>
        </div>

        <div className="space-y-4">
          {novenas.map((novena) => {
            const progress = getProgress(novena.id);
            const completedCount = progress?.completedDays.length ?? 0;

            return (
              <button
                key={novena.id}
                onClick={() => handleSelectNovena(novena)}
                className="w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                    <ImageWithFallback src={novena.image} alt={novena.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 py-4 pr-4 text-left">
                    <h3 className="font-semibold text-gray-800 mb-1">{novena.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{novena.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {novena.days} days
                      </span>
                      {completedCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 font-medium">Day {completedCount}/{novena.days}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center pr-4">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {completedCount > 0 && (
                  <div className="mx-4 mb-3">
                    <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(completedCount / novena.days) * 100}%` }} />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <Navigation />
    </div>
  );
}