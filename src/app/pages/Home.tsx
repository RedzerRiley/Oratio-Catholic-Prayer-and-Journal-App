import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { BookOpen, Sparkles, Cross, BookHeart, Sun, Moon, MessageCircleHeart, UserCircle, Church, CheckCircle, X } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { bibleQuotes } from '../data/prayers';

type AttendanceRecord = {
  date: string; // YYYY-MM-DD
  attended: boolean;
};

type DialogState = 'none' | 'prompt' | 'celebrate' | 'confession';

const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const isSunday = () => new Date().getDay() === 0;

// Get last 8 Sundays for the tracker
const getLastSundays = (): string[] => {
  const sundays: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() - d.getDay()); // go to most recent Sunday
  for (let i = 0; i < 8; i++) {
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    sundays.unshift(str);
    d.setDate(d.getDate() - 7);
  }
  return sundays;
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';
  const GreetingIcon = currentHour < 18 ? Sun : Moon;
  const displayName = user?.displayName?.split(' ')[0] ?? 'Friend';
  const photoURL = user?.photoURL;

  const [dialog, setDialog] = useState<DialogState>('none');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [todayAnswered, setTodayAnswered] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  const sundays = getLastSundays();
  const today = getTodayStr();

  // Load attendance from Firestore
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const ref = doc(db, 'users', user.uid, 'churchAttendance', 'record');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as { records: AttendanceRecord[] };
          setAttendance(data.records ?? []);
          if (isSunday()) {
            const answered = data.records?.some(r => r.date === today);
            setTodayAnswered(!!answered);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAttendance(false);
      }
    };
    load();
  }, [user]);

  // Auto-show prompt on Sundays if not yet answered
  useEffect(() => {
    if (!loadingAttendance && isSunday() && !todayAnswered) {
      const timer = setTimeout(() => setDialog('prompt'), 800);
      return () => clearTimeout(timer);
    }
  }, [loadingAttendance, todayAnswered]);

  const saveAttendance = async (attended: boolean) => {
    if (!user) return;
    const newRecord: AttendanceRecord = { date: today, attended };
    const updated = [...attendance.filter(r => r.date !== today), newRecord];
    setAttendance(updated);
    setTodayAnswered(true);
    try {
      const ref = doc(db, 'users', user.uid, 'churchAttendance', 'record');
      await setDoc(ref, { records: updated }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleYes = async () => {
    await saveAttendance(true);
    setDialog('celebrate');
  };

  const handleNo = async () => {
    await saveAttendance(false);
    setDialog('confession');
  };

  const attendanceMap = Object.fromEntries(attendance.map(r => [r.date, r.attended]));

  // Calculate current streak
  const streak = (() => {
    let count = 0;
    for (let i = sundays.length - 1; i >= 0; i--) {
      if (attendanceMap[sundays[i]] === true) count++;
      else break;
    }
    return count;
  })();

  const features = [
    { title: 'Daily Prayers', description: 'Essential Catholic prayers for everyday devotion', icon: BookOpen, color: 'bg-blue-500', link: '/daily-prayers' },
    { title: 'Holy Rosary', description: 'Pray the mysteries of the Rosary', icon: Sparkles, color: 'bg-purple-500', link: '/rosary' },
    { title: 'Novenas', description: 'Nine days of prayer to the saints', icon: Cross, color: 'bg-amber-500', link: '/novenas' },
    { title: 'Confession Journal', description: 'Prepare your heart for reconciliation', icon: BookHeart, color: 'bg-green-500', link: '/confessions' },
  ];

  // Pick a verse based on the day of the year — consistent all day, rotates daily
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const dailyVerse = bibleQuotes[dayOfYear % bibleQuotes.length];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GreetingIcon className="w-7 h-7 text-blue-200" />
              <div>
                <p className="text-blue-200 text-sm">{greeting},</p>
                <h1 className="text-2xl font-serif">{displayName} </h1>
              </div>
            </div>
            <Link to="/profile" className="flex-shrink-0">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white/40 object-cover shadow-md" />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-white/40 bg-white/20 flex items-center justify-center shadow-md">
                  <UserCircle className="w-7 h-7 text-white" />
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4">
        {/* Sunday reminder banner */}
        {isSunday() && !todayAnswered && (
          <button
            onClick={() => setDialog('prompt')}
            className="w-full bg-amber-500 text-white rounded-2xl px-5 py-3 mb-4 flex items-center gap-3 shadow-md active:scale-98 transition-all"
          >
            <Church className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium text-left">It's Sunday! Don't forget Holy Mass 🙏 Tap to log attendance.</p>
          </button>
        )}

        {/* Daily Verse */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-amber-500">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
              <MessageCircleHeart className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-2">Verse of the Day</h3>
              <p className="text-gray-800 mb-2 leading-relaxed">{dailyVerse.text}</p>
              <p className="text-sm text-amber-600 font-medium">— {dailyVerse.reference}</p>
            </div>
          </div>
        </div>

        {/* Explore */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Explore</h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => (
              <Link key={feature.title} to={feature.link} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all active:scale-95">
                <div className={`${feature.color} rounded-xl p-3 w-fit mb-3`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Church Attendance Tracker */}
        <button
          onClick={() => setDialog('prompt')}
          className="w-full bg-white rounded-2xl shadow-md p-5 mb-6 text-left active:scale-98 transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-xl p-2">
                <Church className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Mass Attendance</h3>
                <p className="text-xs text-gray-500">Tap to log · Last 8 Sundays</p>
              </div>
            </div>
            {streak > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-center">
                <p className="text-lg font-bold text-amber-600 leading-none">{streak}</p>
                <p className="text-xs text-amber-500">streak 🔥</p>
              </div>
            )}
          </div>

          {/* Sunday bars */}
          <div className="flex justify-between items-end gap-1">
            {sundays.map((sunday) => {
              const status = attendanceMap[sunday];
              const isToday = sunday === today && isSunday();
              return (
                <div key={sunday} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-full h-8 rounded-lg transition-all ${
                    status === true
                      ? 'bg-green-400'
                      : status === false
                      ? 'bg-red-300'
                      : isToday
                      ? 'bg-amber-300 animate-pulse'
                      : 'bg-gray-100'
                  }`} />
                  <p className="text-xs text-gray-400" style={{ fontSize: '9px' }}>
                    {new Date(sunday + 'T12:00:00').toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" /> Attended</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-300 inline-block" /> Missed</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-100 inline-block" /> No record</span>
          </div>
        </button>
      </div>

      {/* ── DIALOGS ───────────────────────────────────────────── */}

      {/* Prompt: Did you go to Mass? */}
      {dialog === 'prompt' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 pb-24" onClick={() => setDialog('none')}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Church className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-serif text-gray-800 mb-1">Did you go to Mass today?</h2>
              <p className="text-sm text-gray-500">Log your Sunday church attendance.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleNo}
                className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-lg hover:bg-gray-200 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleYes}
                className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Yes 🙏
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Celebrate! */}
      {dialog === 'celebrate' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center relative">
            <button onClick={() => setDialog('none')} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="text-5xl mb-2 animate-bounce">🎉</div>
            <div className="flex justify-center gap-2 text-2xl mb-4">
              <span>✝️</span><span>🙏</span><span>⛪</span>
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">God bless you!</h2>
            <p className="text-gray-600 mb-3 leading-relaxed">
              You attended Holy Mass today. Keep up this beautiful habit of faith!
            </p>
            {streak > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 my-3">
                <p className="text-amber-700 font-semibold">🔥 {streak}-Sunday streak!</p>
                <p className="text-amber-600 text-sm">Keep the flame burning!</p>
              </div>
            )}
            <p className="text-sm text-gray-400 italic mb-6">
              "I was glad when they said to me, 'Let us go to the house of the LORD!'" — Psalm 122:1
            </p>
            <button
              onClick={() => setDialog('none')}
              className="w-full bg-blue-600 text-white rounded-2xl py-3.5 font-semibold hover:bg-blue-700 transition-colors"
            >
              Amen! 🙏
            </button>
          </div>
        </div>
      )}

      {/* Missed Mass — go to confession */}
      {dialog === 'confession' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center relative">
            <button onClick={() => setDialog('none')} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookHeart className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">No worries, {displayName}</h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
              We all have moments when we can't make it to Mass. The Church understands that valid reasons — illness, travel, or emergencies — may prevent attendance.
            </p>
            <div className="bg-purple-50 rounded-2xl p-4 mb-5 text-left">
              <p className="text-purple-800 text-sm font-semibold mb-2">We encourage you to:</p>
              <ul className="space-y-2 text-sm text-purple-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                  <span>Go to <strong>Confession</strong> and tell your priest why you missed Mass this Sunday</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                  <span>Pray an <strong>Act of Contrition</strong> with sincere repentance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                  <span>Make every effort to attend Mass <strong>next Sunday</strong></span>
                </li>
              </ul>
            </div>
            <p className="text-xs text-gray-400 italic mb-5">
              "Come to me, all you who are weary and burdened, and I will give you rest." — Matthew 11:28
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDialog('none')}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-medium text-sm"
              >
                Close
              </button>
              <button
                onClick={() => { setDialog('none'); navigate('/confessions'); }}
                className="flex-1 py-3 rounded-2xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition-colors"
              >
                Open Journal
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}