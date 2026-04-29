import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import { announcements } from '../../api/endpoints';
import PageHeader from '../../components/PageHeader';

const TYPES = ['news', 'call_for_papers', 'conference'];

const empty = () => ({
  title: { uz: '', ru: '', en: '' },
  body: { uz: '', ru: '', en: '' },
  type: 'news',
  attachmentUrl: '',
});

export default function AnnouncementManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty());
  const { data } = useQuery({ queryKey: ['announcements-admin'], queryFn: () => announcements.list({ limit: 50 }) });

  const open = (a) => {
    if (a) {
      setEditing(a._id);
      setForm({
        title: a.title || empty().title,
        body: a.body || empty().body,
        type: a.type,
        attachmentUrl: a.attachmentUrl || '',
      });
    } else {
      setEditing('new');
      setForm(empty());
    }
  };
  const close = () => { setEditing(null); setForm(empty()); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing === 'new') await announcements.create(form);
      else await announcements.update(editing, form);
      toast.success('Saqlandi');
      qc.invalidateQueries({ queryKey: ['announcements-admin'] });
      close();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('O\'chirilsinmi?')) return;
    try {
      await announcements.remove(id);
      toast.success('O\'chirildi');
      qc.invalidateQueries({ queryKey: ['announcements-admin'] });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <PageHeader title="E'lonlar" action={<button onClick={() => open(null)} className="btn-primary"><Plus className="h-4 w-4" /> Yangi</button>} />
      <div className="space-y-2">
        {(data?.data?.items || []).map((a) => (
          <div key={a._id} className="card flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-xs uppercase text-secondary font-semibold">{a.type}</div>
              <div className="font-semibold">{a.title?.uz}</div>
              <div className="line-clamp-1 text-sm text-gray-600">{a.body?.uz}</div>
            </div>
            <button onClick={() => open(a)} className="btn-ghost"><Edit3 className="h-4 w-4" /></button>
            <button onClick={() => remove(a._id)} className="btn-ghost"><Trash2 className="h-4 w-4 text-error" /></button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={close}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">E'lon</h3>
              <button type="button" onClick={close} className="btn-ghost"><X className="h-4 w-4" /></button>
            </div>
            <div>
              <label className="label">Turi</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <I18nField label="Sarlavha" obj={form.title} onChange={(l, v) => setForm({ ...form, title: { ...form.title, [l]: v } })} />
            <I18nField label="Matn" obj={form.body} textarea onChange={(l, v) => setForm({ ...form, body: { ...form.body, [l]: v } })} />
            <div><label className="label">Ilova URL</label><input className="input" value={form.attachmentUrl} onChange={(e) => setForm({ ...form, attachmentUrl: e.target.value })} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={close} className="btn-outline">Bekor</button>
              <button className="btn-primary">Saqlash</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function I18nField({ label, obj, onChange, textarea }) {
  const Comp = textarea ? 'textarea' : 'input';
  return (
    <div>
      <label className="label">{label}</label>
      <div className="grid gap-2 md:grid-cols-3">
        {['uz', 'ru', 'en'].map((l) => (
          <Comp key={l} placeholder={l.toUpperCase()} rows={textarea ? 4 : undefined} className="input" value={obj[l] || ''} onChange={(e) => onChange(l, e.target.value)} />
        ))}
      </div>
    </div>
  );
}
