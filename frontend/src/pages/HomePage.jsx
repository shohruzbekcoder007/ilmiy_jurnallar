import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, Users, Download, ArrowRight, Newspaper } from 'lucide-react';
import { stats, journals, articles, announcements } from '../api/endpoints';
import { useLang } from '../context/LangContext';
import { pickI18n, formatDate, authorsText } from '../utils/format';
import IndexBadge from '../components/IndexBadge';

export default function HomePage() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data: summary } = useQuery({ queryKey: ['stats'], queryFn: stats.summary });
  const { data: jrn } = useQuery({ queryKey: ['journals', 'home'], queryFn: () => journals.list({ limit: 6 }) });
  const { data: arts } = useQuery({ queryKey: ['articles', 'home'], queryFn: () => articles.list({ limit: 6 }) });
  const { data: news } = useQuery({ queryKey: ['announcements', 'home'], queryFn: () => announcements.list({ limit: 3 }) });

  const s = summary?.data || {};

  return (
    <div className="container-page space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-primary to-primary-700 p-8 text-white shadow-md md:p-12">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="h-8 w-8 text-secondary" />
          <span className="text-sm uppercase tracking-wider text-white/80">TDIU</span>
        </div>
        <h1 className="text-3xl font-bold md:text-5xl">{t('hero.title')}</h1>
        <p className="mt-4 max-w-2xl text-white/85">{t('hero.subtitle')}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/cabinet/submit" className="btn-secondary">{t('hero.submit')}</Link>
          <Link to="/jurnallar" className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20">
            {t('hero.explore')}
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={<BookOpen className="h-5 w-5" />} label={t('stats.journals')} value={s.totalJournals} />
        <StatCard icon={<FileText className="h-5 w-5" />} label={t('stats.articles')} value={s.totalArticles} />
        <StatCard icon={<Users className="h-5 w-5" />} label={t('stats.authors')} value={s.totalAuthors} />
        <StatCard icon={<Download className="h-5 w-5" />} label={t('stats.downloads')} value={s.totalDownloads} />
      </section>

      <section>
        <SectionHeader title={t('nav.journals')} link="/jurnallar" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(jrn?.data?.items || []).map((j) => (
            <Link to={`/jurnallar/${j.slug}`} key={j._id} className="card group">
              <div className="flex h-32 w-full items-center justify-center rounded-lg bg-primary-50">
                {j.coverImage ? (
                  <img src={j.coverImage} alt="" className="h-full w-full rounded-lg object-cover" />
                ) : (
                  <BookOpen className="h-10 w-10 text-primary" />
                )}
              </div>
              <div className="mt-3 line-clamp-2 font-semibold text-primary group-hover:underline">
                {pickI18n(j.title, lang)}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {j.issn && <span>ISSN: {j.issn}</span>}
                {j.eissn && <span> · eISSN: {j.eissn}</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {(j.indexedIn || []).map((i) => <IndexBadge key={i} name={i} />)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title={t('nav.articles')} link="/maqolalar" />
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
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
                  <td className="px-4 py-3 text-right text-gray-500">{a.publishedAt ? new Date(a.publishedAt).getFullYear() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
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

      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-primary">{t('imrad.title')}</h2>
        <p className="mt-2 text-sm text-gray-600 max-w-3xl">
          IMRAD — Introduction, Methods, Results, And Discussion. Bu xalqaro ilmiy maqolalar uchun standart struktura.
        </p>
        <Link to="/imrad" className="btn-primary mt-4">
          {t('common.more')} <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="card flex items-center gap-3">
      <div className="rounded-lg bg-primary-50 p-3 text-primary">{icon}</div>
      <div>
        <div className="text-xs uppercase text-gray-500">{label}</div>
        <div className="text-xl font-bold text-primary">{value ?? '—'}</div>
      </div>
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
