import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { dailyPrayers } from '../data/prayers';
import { Search, ChevronRight, BookMarked, X, BookOpen } from 'lucide-react';

const categoryColors: { [key: string]: string } = {
  Essential: 'bg-blue-100 text-blue-700',
  Daily: 'bg-green-100 text-green-700',
  Marian: 'bg-pink-100 text-pink-700',
  Protection: 'bg-amber-100 text-amber-700',
};

export default function DailyPrayers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrayer, setSelectedPrayer] = useState<typeof dailyPrayers[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Essential', 'Daily', 'Marian', 'Protection'];

  const filteredPrayers = dailyPrayers.filter((prayer) => {
    const matchesSearch =
      prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prayer.latin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || prayer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 pt-12 pb-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-serif mb-2">Daily Prayers</h1>
          <p className="text-blue-100 text-sm">Essential Catholic prayers</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-3">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search prayers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto mb-4 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Prayers List */}
        <div className="space-y-3">
          {filteredPrayers.map((prayer) => (
            <button
              key={prayer.id}
              onClick={() => setSelectedPrayer(prayer)}
              className="w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all text-left active:scale-98"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <BookMarked className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">{prayer.title}</h3>
                  </div>
                  {prayer.latin && (
                    <p className="text-sm text-gray-500 italic mb-2">{prayer.latin}</p>
                  )}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColors[prayer.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {prayer.category}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>

        {filteredPrayers.length === 0 && (
          <div className="text-center py-12">
            <BookMarked className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No prayers found</p>
          </div>
        )}
      </div>

      {/* Prayer Detail — full-screen slide-up sheet */}
      {selectedPrayer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedPrayer(null)}
          />

          {/* Sheet */}
          <div className="relative bg-white rounded-t-3xl max-h-[72vh] flex flex-col shadow-2xl mb-16">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pt-4 pb-5 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-2xl p-3 flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-gray-800 leading-tight">
                      {selectedPrayer.title}
                    </h2>
                    {selectedPrayer.latin && (
                      <p className="text-sm text-gray-400 italic mt-0.5">{selectedPrayer.latin}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPrayer(null)}
                  className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[selectedPrayer.category] ?? 'bg-gray-100 text-gray-600'}`}>
                {selectedPrayer.category}
              </span>
            </div>

            {/* Prayer text — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="text-gray-700 leading-loose text-base whitespace-pre-line">
                {selectedPrayer.text}
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedPrayer(null)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl py-3.5 font-semibold shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                Amen 🙏
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}