import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, UploadCloud, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { articles, upload } from '../../api/endpoints';
import { useLang } from '../../context/LangContext';
import { pickI18n, formatDate } from '../../utils/format';
import StatusBadge from '../../components/StatusBadge';
import PageHeader from '../../components/PageHeader';

export default function MyArticleDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data, refetch } = useQuery({ queryKey: ['article', id], queryFn: () => articles.get(id) });
  const { data: tl } = useQuery({ queryKey: ['timeline', id], queryFn: () => articles.timeline(id) });
  const a = data?.data?.article;
  const [uploading, setUploading] = useState(false);

  if (!a) return <div className="container-page py-12">{t('common.loading')}</div>;

  const reupload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', f);
      const r = await upload.pdf(fd);
      await articles.update(id, { fileUrl: r.data.url });
      toast.success('PDF yangilandi');
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    } finally {
      setUploading(false);
    }
  };

  const resubmit = async () => {
    try {
      await articles.update(id, { status: 'submitted' });
      toast.success('Tahririyatga yuborildi');
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <Link to="/cabinet" className="btn-ghost mb-3 inline-flex"><ChevronLeft className="h-4 w-4" /> {t('common.back')}</Link>
      <PageHeader
        title={pickI18n(a.title, lang)}
        action={<StatusBadge status={a.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="card">
          <div className="text-xs uppercase text-gray-500">{t('articles.abstract')}</div>
          <p className="mt-1 whitespace-pre-line text-sm text-gray-700">{pickI18n(a.abstract, lang)}</p>

          {a.status === 'revision_needed' && (
            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm">
              <div className="font-semibold text-orange-700">Qayta ishlash so'ralgan</div>
              <p className="mt-1 text-orange-700">Faylni yangilang va qaytadan yuboring.</p>
              <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded border border-orange-300 bg-white px-3 py-1.5 text-xs">
                <UploadCloud className="h-4 w-4" /> Yangi PDF yuklash
                <input type="file" hidden accept="application/pdf" onChange={reupload} />
              </label>
              {uploading && <span className="ml-2 text-xs">Yuklanmoqda...</span>}
              <div className="mt-3">
                <button onClick={resubmit} className="btn-primary text-xs">
                  <Send className="h-3.5 w-3.5" /> Qaytadan yuborish
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="card">
          <div className="font-semibold mb-2">Jarayon</div>
          <ol className="space-y-3 text-sm">
            {(tl?.data?.items || []).map((s) => (
              <li key={s._id} className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <div className="font-medium text-ink">{s.action}</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(s.timestamp, lang)} {s.performedBy?.fullName && `· ${s.performedBy.fullName}`}
                  </div>
                  {s.note && <div className="mt-1 text-xs text-gray-600">{s.note}</div>}
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
