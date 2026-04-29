import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, ExternalLink, Globe } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { pickI18n, categoryMeta, coverGradient } from '../utils/format';

export default function JournalCard({ journal }) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const cat = categoryMeta(journal.category);
  const grad = coverGradient(journal.category);
  const issn = journal.issn || journal.eissn;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Cover */}
      <div className={`relative h-40 w-full bg-gradient-to-br ${grad}`}>
        {journal.coverImage && (
          <img
            src={journal.coverImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow ${cat.color}`}>
          {cat.label}
        </span>
        <span className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-primary shadow">
          <BookOpen className="h-4 w-4" />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 min-h-[3rem] text-base font-bold text-ink">
          "{pickI18n(journal.title, lang)}" ilmiy jurnali
          {journal.indexedIn?.includes('OAK') && <span className="text-gray-500"> / OAK</span>}
        </h3>
        <p className="line-clamp-2 min-h-[2.5rem] text-sm text-gray-500">
          {pickI18n(journal.description, lang)}
        </p>

        {/* ISSN row */}
        <div className="mt-auto flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary-100 font-semibold text-primary">
            ID
          </span>
          <div className="leading-tight">
            <div className="text-[10px] uppercase text-gray-400">ISSN</div>
            <div className="font-semibold text-ink">{issn || '—'}</div>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
            <Globe className="h-3 w-3" /> ONLINE
          </span>
        </div>

        {/* Action */}
        <Link
          to={`/jurnallar/${journal.slug}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          {t('journals.openJournal', "Jurnalga o'tish")}
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
