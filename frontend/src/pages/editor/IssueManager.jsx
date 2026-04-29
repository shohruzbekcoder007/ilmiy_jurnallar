import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { journals, issues as issuesApi } from '../../api/endpoints';
import PageHeader from '../../components/PageHeader';
import { formatDate } from '../../utils/format';
import { useLang } from '../../context/LangContext';

export default function IssueManager() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const qc = useQueryClient();
  const [journalId, setJournalId] = useState('');
  const [form, setForm] = useState({ volume: 1, number: 1, year: new Date().getFullYear(), publishedAt: '', isPublished: false });

  const { data: jrs } = useQuery({ queryKey: ['journals-all'], queryFn: () => journals.list({ limit: 100 }) });
  const journal = (jrs?.data?.items || []).find((j) => j._id === journalId);
  const { data: iss } = useQuery({
    queryKey: ['journal-issues-mgr', journal?.slug],
    queryFn: () => journals.issues(journal.slug),
    enabled: !!journal?.slug,
  });

  const create = async (e) => {
    e.preventDefault();
    if (!journalId) return toast.error('Jurnalni tanlang');
    try {
      await issuesApi.create({ ...form, journal: journalId, publishedAt: form.publishedAt || undefined });
      toast.success('Son yaratildi');
      qc.invalidateQueries({ queryKey: ['journal-issues-mgr', journal.slug] });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('O\'chirilsinmi?')) return;
    try {
      await issuesApi.remove(id);
      toast.success('O\'chirildi');
      qc.invalidateQueries({ queryKey: ['journal-issues-mgr', journal.slug] });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <PageHeader title="Sonlar" />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="card">
          <select className="input mb-3" value={journalId} onChange={(e) => setJournalId(e.target.value)}>
            <option value="">Jurnalni tanlang</option>
            {(jrs?.data?.items || []).map((j) => <option key={j._id} value={j._id}>{j.title?.uz}</option>)}
          </select>
          <div className="space-y-2">
            {(iss?.data?.issues || []).map((i) => (
              <div key={i._id} className="flex items-center justify-between rounded-lg border bg-white p-3">
                <div>
                  <div className="font-medium">{i.year} — Tom {i.volume}, Son {i.number}</div>
                  <div className="text-xs text-gray-500">{formatDate(i.publishedAt, lang)} · {i.isPublished ? 'Nashr qilingan' : 'Nashr qilinmagan'}</div>
                </div>
                <button onClick={() => remove(i._id)} className="btn-ghost"><Trash2 className="h-4 w-4 text-error" /></button>
              </div>
            ))}
            {!iss?.data?.issues?.length && journal && <div className="text-gray-500">{t('common.noData')}</div>}
          </div>
        </div>

        <form onSubmit={create} className="card space-y-3">
          <h3 className="font-semibold">Yangi son</h3>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="label">Tom</label><input type="number" className="input" value={form.volume} onChange={(e) => setForm({ ...form, volume: Number(e.target.value) })} /></div>
            <div><label className="label">Son</label><input type="number" className="input" value={form.number} onChange={(e) => setForm({ ...form, number: Number(e.target.value) })} /></div>
            <div><label className="label">Yil</label><input type="number" className="input" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} /></div>
          </div>
          <div><label className="label">Sana</label><input type="date" className="input" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Nashr qilingan</label>
          <button className="btn-primary w-full"><Plus className="h-4 w-4" /> Qo'shish</button>
        </form>
      </div>
    </div>
  );
}
