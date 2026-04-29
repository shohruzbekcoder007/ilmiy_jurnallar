import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { articles, reviews, users, journals, issues as issuesApi } from '../../api/endpoints';
import { useLang } from '../../context/LangContext';
import { pickI18n, formatDate } from '../../utils/format';
import StatusBadge from '../../components/StatusBadge';
import PageHeader from '../../components/PageHeader';

export default function ArticleReviewPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { lang } = useLang();
  const qc = useQueryClient();
  const [note, setNote] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [doi, setDoi] = useState('');
  const [issueId, setIssueId] = useState('');

  const { data } = useQuery({ queryKey: ['article', id], queryFn: () => articles.get(id) });
  const { data: rvs } = useQuery({ queryKey: ['reviews', id], queryFn: () => reviews.ofArticle(id) });
  const a = data?.data?.article;
  const { data: iss } = useQuery({
    queryKey: ['journal-issues', a?.journal?.slug],
    queryFn: () => journals.issues(a.journal.slug),
    enabled: !!a?.journal?.slug,
  });

  if (!a) return <div className="container-page py-12">{t('common.loading')}</div>;

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['article', id] });
    qc.invalidateQueries({ queryKey: ['reviews', id] });
  };

  const assign = async () => {
    if (!reviewerEmail) return;
    const r = await users.search(reviewerEmail);
    const found = r?.data?.items?.[0];
    if (!found) return toast.error('Reviewer topilmadi');
    try {
      await articles.assignReviewer(id, [found._id]);
      toast.success(`Tayinlandi: ${found.fullName}`);
      setReviewerEmail('');
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const setStatus = async (status) => {
    try {
      await articles.changeStatus(id, status, note);
      toast.success('Holat yangilandi');
      setNote('');
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const publish = async () => {
    if (!issueId) return toast.error('Sonni tanlang');
    try {
      await articles.publish(id, { issue: issueId, doi: doi || undefined });
      toast.success('Nashr qilindi');
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <Link to="/editor" className="btn-ghost mb-3 inline-flex"><ChevronLeft className="h-4 w-4" /> Orqaga</Link>
      <PageHeader title={pickI18n(a.title, lang)} action={<StatusBadge status={a.status} />} />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="card">
            <div className="text-xs uppercase text-gray-500">{t('articles.abstract')}</div>
            <p className="mt-1 whitespace-pre-line text-sm text-gray-700">{pickI18n(a.abstract, lang)}</p>
            <div className="mt-3 text-sm text-gray-600">
              <strong>{t('articles.authors')}:</strong>{' '}
              {(a.authors || []).map((au) => au.user?.fullName).filter(Boolean).join(', ')}
            </div>
            {a.fileUrl && (
              <a href={a.fileUrl} target="_blank" rel="noreferrer" className="btn-outline mt-3 inline-flex">
                PDF ko'rish
              </a>
            )}
          </div>

          <div className="card">
            <h3 className="mb-2 font-semibold">Taqrizlar</h3>
            {(rvs?.data?.items || []).length === 0 && <div className="text-sm text-gray-500">Hali taqriz yo'q</div>}
            <div className="space-y-2">
              {(rvs?.data?.items || []).map((r) => (
                <div key={r._id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{r.reviewer?.fullName || 'Anonim'}</div>
                    <span className="badge bg-primary-50 text-primary">{r.recommendation}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{r.comments}</p>
                  <div className="mt-1 text-xs text-gray-400">{formatDate(r.submittedAt, lang)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card">
            <h3 className="mb-2 font-semibold">Taqrizchi tayinlash</h3>
            <div className="flex gap-2">
              <input className="input" placeholder="Email" value={reviewerEmail} onChange={(e) => setReviewerEmail(e.target.value)} />
              <button onClick={assign} className="btn-primary">+</button>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-2 font-semibold">Holatni o'zgartirish</h3>
            <textarea rows={3} className="input mb-2" placeholder="Izoh (ixtiyoriy)" value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setStatus('accepted')} className="btn-primary">Qabul qilish</button>
              <button onClick={() => setStatus('rejected')} className="btn-outline text-error">Rad etish</button>
              <button onClick={() => setStatus('revision_needed')} className="btn-outline col-span-2">Qayta ishlashga</button>
            </div>
          </div>

          {a.status === 'accepted' && (
            <div className="card">
              <h3 className="mb-2 font-semibold">Nashr qilish</h3>
              <select className="input mb-2" value={issueId} onChange={(e) => setIssueId(e.target.value)}>
                <option value="">Sonni tanlang</option>
                {(iss?.data?.issues || []).map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.year} — Tom {i.volume}, Son {i.number}
                  </option>
                ))}
              </select>
              <input className="input mb-2" placeholder="DOI (ixtiyoriy)" value={doi} onChange={(e) => setDoi(e.target.value)} />
              <button onClick={publish} className="btn-primary w-full">Nashr qilish</button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
