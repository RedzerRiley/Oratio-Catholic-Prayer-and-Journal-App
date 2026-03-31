import { useState, useEffect } from 'react';
import { Cross } from 'lucide-react';

type IntroStep = 'logo' | 'welcome' | 'subtitle' | 'tagline' | 'proceed';

type Props = {
  onComplete: () => void;
  userName?: string;
};

export default function IntroScreen({ onComplete, userName }: Props) {
  const [step, setStep] = useState<IntroStep>('logo');
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Orchestrate the animation sequence
  useEffect(() => {
    setVisible(true);

    const timers = [
      setTimeout(() => setStep('welcome'), 800),
      setTimeout(() => setStep('subtitle'), 1800),
      setTimeout(() => setStep('tagline'), 2800),
      setTimeout(() => setStep('proceed'), 4000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleProceed = () => {
    setFadeOut(true);
    setTimeout(onComplete, 600);
  };

  const isVisible = (s: IntroStep) => {
    const order: IntroStep[] = ['logo', 'welcome', 'subtitle', 'tagline', 'proceed'];
    return order.indexOf(step) >= order.indexOf(s);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center px-8 transition-opacity duration-700 bg-[#0474c0] ${
        fadeOut ? 'opacity-0' : visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Subtle animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${8 + (i % 5) * 6}px`,
              height: `${8 + (i % 5) * 6}px`,
              top: `${(i * 13 + 7) % 95}%`,
              left: `${(i * 17 + 5) % 95}%`,
              animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 2}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative ring */}
      <div
        className={`absolute w-64 h-64 rounded-full border border-white/10 transition-all duration-1000 ${
          isVisible('welcome') ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
        style={{ transitionDelay: '200ms' }}
      />
      <div
        className={`absolute w-96 h-96 rounded-full border border-white/5 transition-all duration-1000 ${
          isVisible('subtitle') ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
        style={{ transitionDelay: '400ms' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* Logo */}
        <div
          className={`transition-all duration-700 ${
            isVisible('logo') ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'
          }`}
        >
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
              <Cross className="w-12 h-12 text-amber-300" />
            </div>
            {/* Glow */}
            <div className="absolute inset-0 bg-amber-400/20 rounded-3xl blur-xl scale-150" />
          </div>
        </div>

        {/* Welcome to Oratio */}
        <div
          className={`transition-all duration-700 ${
            isVisible('welcome') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <h1 className="text-4xl font-serif text-white mb-2 leading-tight">
            Welcome to<br />
            <span className="text-amber-300">Oratio</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div
          className={`transition-all duration-700 ${
            isVisible('subtitle') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <p className="text-blue-100 text-lg mt-3 leading-relaxed">
            Your Catholic companion<br />prayer app
          </p>
        </div>

        {/* Personalized tagline */}
        <div
          className={`transition-all duration-700 ${
            isVisible('tagline') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className="mt-6 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <p className="text-white text-sm">
              {userName ? (
                <>Hello, <span className="font-semibold text-amber-300">{userName}</span> 🙏 God bless you.</>
              ) : (
                <>May your prayers be heard. 🙏</>
              )}
            </p>
          </div>
        </div>

        {/* Proceed button */}
        <div
          className={`w-full mt-10 transition-all duration-700 ${
            isVisible('proceed') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <button
            onClick={handleProceed}
            className="w-full bg-white text-[#0474c0] font-bold text-lg rounded-2xl py-4 shadow-2xl active:scale-98 transition-all hover:bg-amber-50"
          >
            Begin ✝️
          </button>
          <p className="text-blue-200/60 text-xs mt-4 italic">
            "Ask and it will be given to you." — Matthew 7:7
          </p>
        </div>
      </div>
    </div>
  );
}