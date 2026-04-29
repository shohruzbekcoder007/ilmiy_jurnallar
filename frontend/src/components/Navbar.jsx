import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Menu, X, BookOpen, LogOut, UserCircle, GraduationCap } from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        {/* Left: university branding */}
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary text-secondary shadow-sm">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">Toshkent davlat</div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">iqtisodiyot universiteti</div>
          </div>
        </Link>

        {/* Center: portal brand */}
        <Link to="/" className="hidden flex-col items-center leading-tight md:flex">
          <div className="text-lg font-bold text-primary">TDIU ilmiy jurnallari</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Ilmiy portal</div>
        </Link>

        {/* Right: nav + auth + lang */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-2.5 py-2 text-sm font-medium transition ${
                  isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}

          <div className="ml-2 flex rounded-md border border-gray-200 p-0.5">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-[11px] font-semibold rounded ${
                  lang === l ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <Link
                to={user.role === 'admin' ? '/admin' : user.role === 'editor' ? '/editor' : '/cabinet'}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary hover:bg-primary-100"
              >
                <UserCircle className="h-4 w-4" />
                {t('nav.cabinet')}
              </Link>
              <button onClick={logout} className="btn-ghost p-2" title={t('nav.logout')}>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn-primary">{t('nav.register')}</Link>
            </div>
          )}
        </div>

        <button onClick={() => setOpen((o) => !o)} className="btn-ghost lg:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-bold text-primary">TDIU ilmiy jurnallari</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400">Ilmiy portal</div>
            </div>
          </div>
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
