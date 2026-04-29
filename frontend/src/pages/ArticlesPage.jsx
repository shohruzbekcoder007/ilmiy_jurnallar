import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { articles, journals } from '../api/endpoints';
import { useLang } from '../context/LangContext';
import { pickI18n, authorsText, formatDate } from '../utils/format';
import { Eye, Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import { useDebounce } from '../hooks/useDebounce';

export default function ArticlesPage() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const debouncedFilters = useDebounce(filters, 300);

  const { data: jrs } = useQuery({ queryKey: ['journals-all'], queryFn: () => journals.list({ limit: 100 }) });
  const { data, isLoading } = useQuery({
    queryKey: ['articles', debouncedFilters],
    queryFn: () => articles.list(debouncedFilters),
  });

  return (
    <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
      <Sidebar
        filters={filters}
        onChange={setFilters}
        journals={jrs?.data?.items || []}
      />

      <div>
        <PageHeader title={t('nav.articles')} />
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">{t('common.loading')}</div>
        ) : (
          <div className="space-y-3">
            {(data?.data?.items || []).map((a) => (
              <article key={a._id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Link to={`/maqolalar/${a._id}`} className="text-lg font-semibold text-primary hover:underline">
                      {pickI18n(a.title, lang)}
                    </Link>
                    <div className="mt-1 text-sm text-gray-600">{authorsText(a.authors, lang)}</div>
                    <div className="mt-2 line-clamp-2 text-sm text-gray-500">{pickI18n(a.abstract, lang)}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>{pickI18n(a.journal?.title, lang)}</span>
                      {a.issue && <span>· {a.issue.year} ({a.issue.volume}/{a.issue.number})</span>}
                      {a.doi && <span>· DOI: {a.doi}</span>}
                      <span>· {formatDate(a.publishedAt, lang)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/maqolalar/${a._id}`} className="btn-outline">
                      <Eye className="h-4 w-4" /> {a.viewCount || 0}
                    </Link>
                    {a.fileUrl && (
                      <a href={a.fileUrl} target="_blank" rel="noreferrer" className="btn-outline">
                        <Download className="h-4 w-4" /> {a.downloadCount || 0}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
            {!data?.data?.items?.length && <div className="text-gray-500">{t('common.noData')}</div>}
          </div>
        )}
        <Pagination
          page={filters.page}
          total={data?.data?.total || 0}
          limit={filters.limit}
          onPage={(p) => setFilters((f) => ({ ...f, page: p }))}
        />
      </div>
    </div>
  );
}
