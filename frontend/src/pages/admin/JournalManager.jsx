import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import { journals } from '../../api/endpoints';
import PageHeader from '../../components/PageHeader';
import IndexBadge from '../../components/IndexBadge';

const FREQS = ['monthly', 'quarterly', 'biannual', 'annual'];
const INDEXES = ['Scopus', 'Web of Science', 'OAK'];

const empty = () => ({
  title: { uz: '', ru: '', en: '' },
  description: { uz: '', ru: '', en: '' },
  issn: '',
  eissn: '',
  frequency: 'quarterly',
  indexedIn: [],
});

export default function JournalManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty());
  const { data } = useQuery({ queryKey: ['journals-admin'], queryFn: () => journals.list({ limit: 100 }) });

  const open = (j) => {
    if (j) {
      setEditing(j._id);
      setForm({
        title: j.title || empty().title,
        description: j.description || empty().description,
        issn: j.issn || '',
        eissn: j.eissn || '',
        frequency: j.frequency || 'quarterly',
        indexedIn: j.indexedIn || [],
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
      if (editing === 'new') await journals.create(form);
      else await journals.update(editing, form);
      toast.success('Saqlandi');
      qc.invalidateQueries({ queryKey: ['journals-admin'] });
      close();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('O\'chirilsinmi?')) return;
    try {
      await journals.remove(id);
      toast.success('O\'chirildi');
      qc.invalidateQueries({ queryKey: ['journals-admin'] });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const toggleIdx = (name) => setForm((f) => ({
    ...f,
    indexedIn: f.indexedIn.includes(name) ? f.indexedIn.filter((i) => i !== name) : [...f.indexedIn, name],
  }));

  return (
    <div>
      <PageHeader
        title="Jurnallar"
        action={<button onClick={() => open(null)} className="btn-primary"><Plus className="h-4 w-4" /> Yangi</button>}
      />

      <div className="space-y-2">
        {(data?.data?.items || []).map((j) => (
          <div key={j._id} className="card flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-primary">{j.title?.uz}</div>
              <div className="text-xs text-gray-500">{j.issn || j.eissn} · {j.frequency}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {(j.indexedIn || []).map((i) => <IndexBadge key={i} name={i} />)}
              </div>
            </div>
            <button onClick={() => open(j)} className="btn-ghost"><Edit3 className="h-4 w-4" /></button>
            <button onClick={() => remove(j._id)} className="btn-ghost"><Trash2 className="h-4 w-4 text-error" /></button>
          </div>
        ))}
      </div>

      {editing && (
        <Modal onClose={close} title={editing === 'new' ? 'Yangi jurnal' : 'Tahrirlash'}>
          <form onSubmit={save} className="space-y-3">
            <I18nField label="Sarlavha" obj={form.title} onChange={(l, v) => setForm({ ...form, title: { ...form.title, [l]: v } })} />
            <I18nField label="Tavsif" obj={form.description} textarea onChange={(l, v) => setForm({ ...form, description: { ...form.description, [l]: v } })} />
            <div className="grid gap-2 md:grid-cols-3">
              <div><label className="label">ISSN</label><input className="input" value={form.issn} onChange={(e) => setForm({ ...form, issn: e.target.value })} /></div>
              <div><label className="label">eISSN</label><input className="input" value={form.eissn} onChange={(e) => setForm({ ...form, eissn: e.target.value })} /></div>
              <div><label className="label">Davriyligi</label>
                <select className="input" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                  {FREQS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Indekslar</label>
              <div className="flex flex-wrap gap-2">
                {INDEXES.map((i) => (
                  <button type="button" key={i} onClick={() => toggleIdx(i)} className={`badge cursor-pointer ${form.indexedIn.includes(i) ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={close} className="btn-outline">Bekor</button>
              <button className="btn-primary">Saqlash</button>
            </div>
          </form>
        </Modal>
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
          <Comp key={l} placeholder={l.toUpperCase()} rows={textarea ? 3 : undefined} className="input" value={obj[l] || ''} onChange={(e) => onChange(l, e.target.value)} />
        ))}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="btn-ghost"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
