import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Send, FileText, User } from 'lucide-react';

export default function CabinetLayout() {
  const { t } = useTranslation();
  const items = [
    { to: '/cabinet', end: true, icon: LayoutDashboard, label: t('nav.cabinet') },
    { to: '/cabinet/submit', icon: Send, label: t('hero.submit') },
    { to: '/cabinet/profile', icon: User, label: 'Profil' },
  ];
  return (
    <div className="container-page grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="card sticky top-20 self-start space-y-1">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${isActive ? 'bg-primary-50 text-primary' : 'hover:bg-gray-100'}`
            }
          >
            <it.icon className="h-4 w-4" /> {it.label}
          </NavLink>
        ))}
      </aside>
      <div><Outlet /></div>
    </div>
  );
}
