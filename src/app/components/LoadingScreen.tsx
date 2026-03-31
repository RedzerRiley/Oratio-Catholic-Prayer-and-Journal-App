import { Cross } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0474c0] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background cross pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <Cross
            key={i}
            className="absolute text-white"
            style={{
              width: `${20 + (i % 4) * 10}px`,
              top: `${(i * 17) % 90}%`,
              left: `${(i * 23) % 90}%`,
              transform: `rotate(${i * 15}deg)`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center mb-6 border border-white/20 shadow-2xl">
          <Cross className="w-10 h-10 text-amber-300" />
        </div>

        <h1 className="text-4xl font-serif text-white mb-2 tracking-wide">Oratio</h1>
        <p className="text-blue-100 text-sm mb-12">Your Catholic companion</p>

        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-amber-300 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom quote */}
      <p className="absolute bottom-12 text-blue-200 text-xs px-8 text-center italic z-10">
        "Ask and it will be given to you; seek and you will find." — Matthew 7:7
      </p>
    </div>
  );
}