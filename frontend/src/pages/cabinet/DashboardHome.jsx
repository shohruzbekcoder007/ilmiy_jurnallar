import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Send, FileText } from 'lucide-react';
import { articles } from '../../api/endpoints';
import { useLang } from '../../context/LangContext';
import { pickI18n, formatDate } from '../../utils/format';
import StatusBadge from '../../components/StatusBadge';
import PageHeader from '../../components/PageHeader';

export default function DashboardHome() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data, isLoading } = useQuery({ queryKey: ['mine'], queryFn: articles.mine });
  const items = data?.data?.items || [];
  return (
    <div>
      <PageHeader
        title={t('nav.cabinet')}
        action={<Link to="/cabinet/submit" className="btn-primary"><Send className="h-4 w-4" /> {t('hero.submit')}</Link>}
      />

      {isLoading ? (
        <div className="text-gray-500">{t('common.loading')}</div>
      ) : items.length === 0 ? (
        <div className="card text-center text-gray-500">
          <FileText className="mx-auto h-10 w-10 text-gray-300" />
          <div className="mt-2">{t('common.noData')}</div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <Link key={a._id} to={`/cabinet/articles/${a._id}`} className="card flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 font-medium text-primary">{pickI18n(a.title, lang)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {pickI18n(a.journal?.title, lang)}
                  {a.submittedAt && <> · {formatDate(a.submittedAt, lang)}</>}
                </div>
              </div>
              <StatusBadge status={a.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
