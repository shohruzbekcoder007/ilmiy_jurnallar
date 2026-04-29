import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Paperclip } from 'lucide-react';
import { announcements } from '../api/endpoints';
import { useLang } from '../context/LangContext';
import { pickI18n, formatDate } from '../utils/format';

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data } = useQuery({ queryKey: ['announcement', id], queryFn: () => announcements.get(id) });
  const a = data?.data?.item;
  if (!a) return <div className="container-page py-12">{t('common.loading')}</div>;
  return (
    <div className="container-page max-w-3xl">
      <Link to="/elon" className="btn-ghost mb-4 inline-flex">
        <ChevronLeft className="h-4 w-4" /> {t('common.back')}
      </Link>
      <article className="card">
        <div className="text-xs uppercase text-secondary font-semibold">{a.type}</div>
        <h1 className="mt-2 text-2xl font-bold text-primary">{pickI18n(a.title, lang)}</h1>
        <div className="mt-1 text-xs text-gray-500">{formatDate(a.publishedAt, lang)}</div>
        <div className="prose prose-sm mt-4 max-w-none whitespace-pre-line text-gray-700">
          {pickI18n(a.body, lang)}
        </div>
        {a.attachmentUrl && (
          <a href={a.attachmentUrl} target="_blank" rel="noreferrer" className="btn-outline mt-4 inline-flex">
            <Paperclip className="h-4 w-4" /> Ilova
          </a>
        )}
      </article>
    </div>
  );
}
