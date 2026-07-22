import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Anasayfa', icon: '🏠', end: true },
  { to: '/aktuel', label: 'Aktüel', icon: '📋', end: false },
  { to: '/favoriler', label: 'Favoriler', icon: '❤️', end: false },
  { to: '/profil', label: 'Profil', icon: '👤', end: false },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 flex items-stretch pb-[env(safe-area-inset-bottom)]">
      {TABS.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-orange' : 'text-gray-400'
            }`
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
