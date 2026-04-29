import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Newspaper } from 'lucide-react';
import { announcements } from '../api/endpoints';
import { useLang } from '../context/LangContext';
import { pickI18n, formatDate } from '../utils/format';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';

const TYPES = ['news', 'call_for_papers', 'conference'];

const TYPE_COLORS = {
  news: 'bg-blue-100 text-blue-700',
  call_for_papers: 'bg-orange-100 text-orange-700',
  conference: 'bg-purple-100 text-purple-700',
};

export default function AnnouncementsPage() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [filters, setFilters] = useState({ page: 1, limit: 10 });

  const { data } = useQuery({
    queryKey: ['announcements', filters],
    queryFn: () => announcements.list(filters),
  });

  return (
    <div className="container-page">
      <PageHeader title={t('nav.announcements')} />

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilters((f) => ({ ...f, type: undefined, page: 1 }))}
          className={`badge cursor-pointer ${!filters.type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          {t('common.all')}
        </button>
        {TYPES.map((tp) => (
          <button
            key={tp}
            onClick={() => setFilters((f) => ({ ...f, type: tp, page: 1 }))}
            className={`badge cursor-pointer ${filters.type === tp ? 'bg-primary text-white' : TYPE_COLORS[tp]}`}
          >
            {tp.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {(data?.data?.items || []).map((a) => (
          <Link to={`/elon/${a._id}`} key={a._id} className="card flex gap-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-primary-50 text-primary">
              <Newspaper className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`badge ${TYPE_COLORS[a.type]}`}>{a.type}</span>
                <span className="text-xs text-gray-400">{formatDate(a.publishedAt, lang)}</span>
              </div>
              <div className="mt-1 font-semibold text-ink">{pickI18n(a.title, lang)}</div>
              <div className="mt-1 line-clamp-2 text-sm text-gray-600">{pickI18n(a.body, lang)}</div>
            </div>
          </Link>
        ))}
        {!data?.data?.items?.length && <div className="text-gray-500">{t('common.noData')}</div>}
      </div>

      <Pagination
        page={filters.page}
        total={data?.data?.total || 0}
        limit={filters.limit}
        onPage={(p) => setFilters((f) => ({ ...f, page: p }))}
      />
    </div>
  );
}
