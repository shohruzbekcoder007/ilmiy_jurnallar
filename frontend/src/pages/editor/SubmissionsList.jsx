import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { articles } from '../../api/endpoints';
import { useLang } from '../../context/LangContext';
import { pickI18n, formatDate } from '../../utils/format';
import StatusBadge from '../../components/StatusBadge';
import PageHeader from '../../components/PageHeader';

const STATUSES = ['submitted', 'under_review', 'revision_needed', 'accepted', 'rejected'];

export default function SubmissionsList() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [status, setStatus] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['submissions', status],
    queryFn: () => articles.submissions(status ? { status } : {}),
  });

  return (
    <div>
      <PageHeader title="Yuborilgan maqolalar" />
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={() => setStatus('')} className={`badge cursor-pointer ${!status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
          {t('common.all')}
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`badge cursor-pointer ${status === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
            {t(`status.${s}`)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-gray-500">{t('common.loading')}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">{t('articles.title')}</th>
                <th className="px-4 py-3">{t('articles.journal')}</th>
                <th className="px-4 py-3">{t('articles.authors')}</th>
                <th className="px-4 py-3">Sana</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data?.items || []).map((a) => (
                <tr key={a._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/editor/articles/${a._id}`} className="font-medium text-primary hover:underline">
                      {pickI18n(a.title, lang)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{pickI18n(a.journal?.title, lang)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {(a.authors || []).map((au) => au.user?.fullName).filter(Boolean).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(a.submittedAt || a.createdAt, lang)}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
