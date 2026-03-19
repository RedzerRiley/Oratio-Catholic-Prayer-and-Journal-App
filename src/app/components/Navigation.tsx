import { NavLink } from 'react-router';
import { Home, BookOpen, Sparkles, Cross, BookHeart } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/daily-prayers', icon: BookOpen, label: 'Prayers' },
  { to: '/rosary', icon: Sparkles, label: 'Rosary' },
  { to: '/novenas', icon: Cross, label: 'Novenas' },
  { to: '/confessions', icon: BookHeart, label: 'Journal' },
];

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'fill-blue-100' : ''}`} />
                <span className="text-xs">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}