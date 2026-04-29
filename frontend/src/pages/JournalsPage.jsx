import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { journals } from '../api/endpoints';
import { useLang } from '../context/LangContext';
import { pickI18n } from '../utils/format';
import IndexBadge from '../components/IndexBadge';
import PageHeader from '../components/PageHeader';

const INDEXES = ['Scopus', 'Web of Science', 'OAK'];
const FREQUENCIES = ['monthly', 'quarterly', 'biannual', 'annual'];

export default function JournalsPage() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useQuery({
    queryKey: ['journals', filters],
    queryFn: () => journals.list(filters),
  });

  return (
    <div className="container-page">
      <PageHeader title={t('nav.journals')} subtitle={t('hero.explore')} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          className="input w-auto"
          value={filters.indexedIn || ''}
          onChange={(e) => setFilters((f) => ({ ...f, indexedIn: e.target.value || undefined }))}
        >
          <option value="">{t('common.all')} — {t('journals.indexedIn')}</option>
          {INDEXES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select
          className="input w-auto"
          value={filters.frequency || ''}
          onChange={(e) => setFilters((f) => ({ ...f, frequency: e.target.value || undefined }))}
        >
          <option value="">{t('common.all')} — {t('journals.frequency')}</option>
          {FREQUENCIES.map((fr) => <option key={fr} value={fr}>{t(`journals.freq.${fr}`)}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">{t('common.loading')}</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(data?.data?.items || []).map((j) => (
            <Link to={`/jurnallar/${j.slug}`} key={j._id} className="card flex gap-4">
              <div className="flex h-28 w-20 flex-none items-center justify-center rounded-lg bg-primary-50">
                {j.coverImage ? (
                  <img src={j.coverImage} alt="" className="h-full w-full rounded-lg object-cover" />
                ) : (
                  <BookOpen className="h-8 w-8 text-primary" />
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-2 font-semibold text-primary hover:underline">
                  {pickI18n(j.title, lang)}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {j.issn && <>ISSN: {j.issn} </>}
                  {j.eissn && <> · eISSN: {j.eissn}</>}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {t('journals.frequency')}: {t(`journals.freq.${j.frequency}`, j.frequency)}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(j.indexedIn || []).map((i) => <IndexBadge key={i} name={i} />)}
                </div>
              </div>
            </Link>
          ))}
          {!data?.data?.items?.length && <div className="text-gray-500">{t('common.noData')}</div>}
        </div>
      )}
    </div>
  );
}
