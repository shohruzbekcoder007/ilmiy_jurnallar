import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Menu, X, BookOpen, LogOut, UserCircle, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

const NAV = [
  { to: '/', key: 'home' },
  { to: '/jurnallar', key: 'journals' },
  { to: '/maqolalar', key: 'articles' },
  { to: '/imrad', key: 'imrad' },
  { to: '/elon', key: 'announcements' },
  { to: '/aloqa', key: 'contact' },
];

const LANGS = ['uz', 'ru', 'en'];

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const nav = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      nav(`/search?q=${encodeURIComponent(q.trim())}`);
      setQ('');
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 shadow-sm backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <BookOpen className="h-6 w-6" />
          <div className="leading-tight">
            <div className="text-sm font-bold">TDIU</div>
            <div className="text-[11px] text-gray-500">Ilmiy Jurnallar</div>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-primary-50 text-primary' : 'text-ink hover:bg-gray-100'
                }`
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <form onSubmit={onSearch} className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('common.search')}
              className="input pl-8 w-44"
            />
          </form>

          <div className="flex rounded-md border border-gray-200 p-0.5">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  lang === l ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'editor' ? '/editor' : '/cabinet'} className="btn-outline">
                <UserCircle className="h-4 w-4" />
                {t('nav.cabinet')}
              </Link>
              <button onClick={logout} className="btn-ghost" title={t('nav.logout')}>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-outline">{t('nav.login')}</Link>
              <Link to="/register" className="btn-primary">{t('nav.register')}</Link>
            </div>
          )}
        </div>

        <button onClick={() => setOpen((o) => !o)} className="btn-ghost lg:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
          <form onSubmit={onSearch} className="mb-3 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('common.search')} className="input pl-8" />
          </form>
          <nav className="grid gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-primary-50 text-primary' : 'hover:bg-gray-100'}`
                }
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex justify-between">
            <div className="flex rounded-md border border-gray-200 p-0.5">
              {LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    lang === l ? 'bg-primary text-white' : 'text-gray-600'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            {user ? (
              <button onClick={() => { logout(); setOpen(false); }} className="btn-outline">
                <LogOut className="h-4 w-4" /> {t('nav.logout')}
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-outline">{t('nav.login')}</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary">{t('nav.register')}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
