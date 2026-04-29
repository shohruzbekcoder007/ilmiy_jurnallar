import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Search, Sparkles, GraduationCap, Newspaper } from 'lucide-react';
import { stats, journals, articles, announcements } from '../api/endpoints';
import { useLang } from '../context/LangContext';
import { pickI18n, formatDate, authorsText } from '../utils/format';
import JournalCard from '../components/JournalCard';

export default function HomePage() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const nav = useNavigate();
  const [q, setQ] = useState('');

  const { data: summary } = useQuery({ queryKey: ['stats'], queryFn: stats.summary });
  const { data: jrn } = useQuery({ queryKey: ['journals', 'home'], queryFn: () => journals.list({ limit: 8 }) });
  const { data: arts } = useQuery({ queryKey: ['articles', 'home'], queryFn: () => articles.list({ limit: 6 }) });
  const { data: news } = useQuery({ queryKey: ['announcements', 'home'], queryFn: () => announcements.list({ limit: 3 }) });

  const s = summary?.data || {};

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="-mt-6 space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0E1F3F] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(800px 400px at 20% 10%, rgba(80,140,255,.25), transparent 60%), radial-gradient(700px 350px at 80% 80%, rgba(120,80,255,.18), transparent 60%)',
          }}
        />
        <div className="container-page relative py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-200 ring-1 ring-white/15">
            <Sparkles className="h-3.5 w-3.5" /> Ilm-fan va innovatsiya
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
            Ilmiy Jurnallar
            <br />
            <span className="bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
              Portali
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-white/75 md:text-lg">
            Iqtisodiyotning turli sohalaridagi {s.totalJournals || 12} ta nufuzli ilmiy
            jurnalimiz bilan tanishing va o'z tadqiqotlaringizni xalqaro darajaga olib chiqing.
          </p>

          <form onSubmit={onSearch} className="mx-auto mt-8 max-w-2xl">
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur focus-within:ring-2 focus-within:ring-sky-400">
              <Search className="ml-2 h-5 w-5 text-white/60" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Jurnal yoki mavzuni qidiring..."
                className="flex-1 bg-transparent px-2 py-2 text-sm text-white placeholder-white/50 outline-none"
              />
              <button className="rounded-xl bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-sky-400">
                {t('nav.search')}
              </button>
            </div>
          </form>

          {/* Stats inside hero */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
            <HeroStat value={s.totalJournals ?? 12} label="Ilmiy jurnallar" />
            <HeroStat value="5,000+" label="O'qituvchilar" />
            <HeroStat value={s.totalAuthors ?? '2,000+'} label="Mualliflar" />
            <HeroStat value={s.totalArticles ?? '10,000+'} label="Maqolalar" />
          </div>
        </div>
      </section>

      {/* JOURNALS LIST */}
      <section className="container-page">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <div className="text-xl font-bold uppercase tracking-wide text-primary md:text-2xl">
            Toshkent davlat iqtisodiyot universiteti
          </div>
          <h2 className="mt-2 text-2xl font-bold text-ink md:text-3xl">
            Ilmiy jurnallar ro'yxati
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            IMRAD standartlar asosida chop etiluvchi universitet nashrlari
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(jrn?.data?.items || []).map((j) => (
            <JournalCard key={j._id} journal={j} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/jurnallar" className="btn-outline">
            Barcha jurnallar
          </Link>
        </div>
      </section>

      {/* LATEST ARTICLES */}
      <section className="container-page">
        <SectionHeader title={t('nav.articles')} link="/maqolalar" />
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">{t('articles.title')}</th>
                <th className="px-4 py-3">{t('articles.authors')}</th>
                <th className="px-4 py-3">{t('articles.journal')}</th>
                <th className="px-4 py-3 text-right">{t('common.year')}</th>
              </tr>
            </thead>
            <tbody>
              {(arts?.data?.items || []).map((a) => (
                <tr key={a._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/maqolalar/${a._id}`} className="font-medium text-primary hover:underline">
                      {pickI18n(a.title, lang)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{authorsText(a.authors, lang)}</td>
                  <td className="px-4 py-3 text-gray-600">{pickI18n(a.journal?.title, lang)}</td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {a.publishedAt ? new Date(a.publishedAt).getFullYear() : '—'}
                  </td>
                </tr>
              ))}
              {!arts?.data?.items?.length && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-400">{t('common.noData')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="container-page">
        <SectionHeader title={t('nav.announcements')} link="/elon" />
        <div className="grid gap-4 md:grid-cols-3">
          {(news?.data?.items || []).map((a) => (
            <Link to={`/elon/${a._id}`} key={a._id} className="card">
              <div className="flex items-center gap-2 text-secondary text-xs uppercase font-semibold">
                <Newspaper className="h-4 w-4" /> {a.type}
              </div>
              <div className="mt-2 line-clamp-2 font-semibold text-ink">{pickI18n(a.title, lang)}</div>
              <div className="mt-2 line-clamp-3 text-sm text-gray-600">{pickI18n(a.body, lang)}</div>
              <div className="mt-3 text-xs text-gray-400">{formatDate(a.publishedAt, lang)}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* IMRAD CTA */}
      <section className="container-page">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-700 p-8 text-white shadow-md md:p-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-200">
                <GraduationCap className="h-3.5 w-3.5" /> {t('imrad.title')}
              </div>
              <h2 className="mt-3 text-2xl font-bold md:text-3xl">IMRAD strukturasi bo'yicha qo'llanma</h2>
              <p className="mt-2 max-w-xl text-white/80">
                Maqolangizni xalqaro standartlarga muvofiq tayyorlash uchun batafsil yo'riqnoma.
              </p>
            </div>
            <Link to="/imrad" className="btn-secondary">
              {t('common.more')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ value, label }) {
  return (
    <div className="text-left md:text-center">
      <div className="text-3xl font-bold text-white md:text-4xl">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-white/60">{label}</div>
    </div>
  );
}

function SectionHeader({ title, link }) {
  const { t } = useTranslation();
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      {link && (
        <Link to={link} className="text-sm font-medium text-primary hover:underline">
          {t('common.viewAll')}
        </Link>
      )}
    </div>
  );
}
