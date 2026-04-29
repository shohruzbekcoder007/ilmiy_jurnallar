import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { stats } from '../api/endpoints';
import { useLang } from '../context/LangContext';
import { pickI18n, authorsText } from '../utils/format';
import PageHeader from '../components/PageHeader';

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data } = useQuery({ queryKey: ['search', q], queryFn: () => stats.search(q), enabled: q.length >= 2 });

  return (
    <div className="container-page">
      <PageHeader title={`${t('nav.search')}: "${q}"`} />
      <section className="mb-6">
        <h2 className="mb-2 font-semibold">{t('nav.journals')}</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(data?.data?.journals || []).map((j) => (
            <Link key={j._id} to={`/jurnallar/${j.slug}`} className="card">
              <div className="font-semibold text-primary">{pickI18n(j.title, lang)}</div>
              <div className="text-xs text-gray-500">{j.issn || j.eissn}</div>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-2 font-semibold">{t('nav.articles')}</h2>
        <div className="space-y-3">
          {(data?.data?.articles || []).map((a) => (
            <Link key={a._id} to={`/maqolalar/${a._id}`} className="card block">
              <div className="font-semibold text-primary">{pickI18n(a.title, lang)}</div>
              <div className="text-sm text-gray-600">{authorsText(a.authors, lang)}</div>
              <div className="mt-1 text-xs text-gray-500">{pickI18n(a.journal?.title, lang)}</div>
            </Link>
          ))}
          {!data?.data?.articles?.length && !data?.data?.journals?.length && <div className="text-gray-500">{t('common.noData')}</div>}
        </div>
      </section>
    </div>
  );
}
