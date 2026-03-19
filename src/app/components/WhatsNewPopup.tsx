import { Sparkles, X, Calendar } from 'lucide-react';
import { latestVersion } from '../data/changelog';

type Props = {
  onClose: () => void;
};

const categoryColors = {
  New: 'bg-green-100 text-green-700 border-green-200',
  Improved: 'bg-blue-100 text-blue-700 border-blue-200',
  Fixed: 'bg-amber-100 text-amber-700 border-amber-200',
  Removed: 'bg-red-100 text-red-700 border-red-200',
};

const categoryIcons = {
  New: '✨',
  Improved: '⚡',
  Fixed: '🔧',
  Removed: '🗑️',
};

export default function WhatsNewPopup({ onClose }: Props) {
  const v = latestVersion;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-3xl px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="text-amber-300 font-semibold text-sm uppercase tracking-widest">What's New</span>
              </div>
              <h2 className="text-2xl font-serif text-white">{v.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  v{v.version}
                </span>
                <div className="flex items-center gap-1 text-purple-200 text-xs">
                  <Calendar className="w-3 h-3" />
                  {v.date}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors mt-1">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <p className="text-purple-100 text-sm mt-3 leading-relaxed">{v.description}</p>
        </div>

        {/* Changes list — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {v.changes.map((section, i) => (
            <div key={i}>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold mb-3 ${categoryColors[section.category]}`}>
                <span>{categoryIcons[section.category]}</span>
                {section.category}
              </div>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-8 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl py-3.5 font-semibold shadow-md active:scale-98 transition-all"
          >
            Let's Go 🙏
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Oratio v{v.version}</p>
        </div>
      </div>
    </div>
  );
}
