import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronLeft, ChevronRight, Plus, Trash2, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { journals, articles, upload, users } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';

const STEPS = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];

const empty = () => ({
  journal: '',
  title: { uz: '', ru: '', en: '' },
  abstract: { uz: '', ru: '', en: '' },
  keywords: [{ uz: '', en: '' }],
  language: 'uz',
  udk: '',
  doi: '',
  authors: [],
  imradStructure: { introduction: '', methodology: '', results: '', discussion: '', conclusion: '' },
  fileUrl: '',
  coverLetterUrl: '',
});

export default function SubmitArticlePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => {
    const f = empty();
    f.authors = [{ user: user?._id, fullName: user?.fullName, isCorresponding: true, order: 1 }];
    return f;
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: jrs } = useQuery({ queryKey: ['journals-all'], queryFn: () => journals.list({ limit: 100 }) });

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const send = async (status) => {
    if (!form.journal) return toast.error(t('submit.selectJournal'));
    if (!form.title.uz) return toast.error(t('articles.title') + ' (UZ)');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        status,
        authors: form.authors.map((a, i) => ({
          user: a.user,
          order: i + 1,
          isCorresponding: !!a.isCorresponding,
        })),
      };
      const r = await articles.submit(payload);
      toast.success(status === 'submitted' ? 'Maqola yuborildi' : 'Qoralama saqlandi');
      nav(`/cabinet/articles/${r.data.article._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onFile = async (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await upload.pdf(fd);
      setForm((f) => ({ ...f, [key]: r.data.url }));
      toast.success('Fayl yuklandi');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <PageHeader title={t('submit.title')} />

      <div className="mb-6 flex items-center gap-2 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i === step ? 'bg-primary text-white' : i < step ? 'bg-success text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </button>
            <span className={`text-xs ${i === step ? 'text-primary font-semibold' : 'text-gray-500'}`}>
              {t(`submit.${s}`)}
            </span>
            {i < STEPS.length - 1 && <div className="h-px w-8 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="card space-y-4">
        {step === 0 && <Step1 form={form} setForm={setForm} journals={jrs?.data?.items || []} />}
        {step === 1 && <Step2 form={form} setForm={setForm} />}
        {step === 2 && <Step3 form={form} setForm={setForm} />}
        {step === 3 && <Step4 form={form} setForm={setForm} />}
        {step === 4 && <Step5 form={form} onFile={onFile} uploading={uploading} />}
        {step === 5 && <Step6 form={form} journals={jrs?.data?.items || []} />}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button className="btn-outline" onClick={back} disabled={step === 0}>
          <ChevronLeft className="h-4 w-4" /> {t('common.back')}
        </button>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={() => send('draft')} disabled={submitting}>
            {t('submit.saveDraft')}
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={next}>
              {t('common.next')} <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button className="btn-primary" onClick={() => send('submitted')} disabled={submitting}>
              {t('submit.submitForReview')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step1({ form, setForm, journals }) {
  const { t } = useTranslation();
  return (
    <div>
      <label className="label">{t('submit.selectJournal')}</label>
      <select className="input" value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })}>
        <option value="">—</option>
        {journals.map((j) => (
          <option key={j._id} value={j._id}>{j.title?.uz}</option>
        ))}
      </select>
    </div>
  );
}

function Step2({ form, setForm }) {
  const { t } = useTranslation();
  const setI18n = (group, lang, value) => setForm((f) => ({ ...f, [group]: { ...f[group], [lang]: value } }));
  const addKw = () => setForm((f) => ({ ...f, keywords: [...f.keywords, { uz: '', en: '' }] }));
  const setKw = (i, k, v) => setForm((f) => {
    const next = [...f.keywords];
    next[i] = { ...next[i], [k]: v };
    return { ...f, keywords: next };
  });
  const rmKw = (i) => setForm((f) => ({ ...f, keywords: f.keywords.filter((_, x) => x !== i) }));
  return (
    <div className="space-y-4">
      <I18nField label={t('articles.title')} obj={form.title} onChange={(l, v) => setI18n('title', l, v)} />
      <I18nField label={t('articles.abstract')} obj={form.abstract} onChange={(l, v) => setI18n('abstract', l, v)} textarea />
      <div>
        <div className="flex items-center justify-between">
          <label className="label">{t('articles.keywords')}</label>
          <button type="button" onClick={addKw} className="btn-ghost text-xs"><Plus className="h-3 w-3" /> Qo'shish</button>
        </div>
        <div className="space-y-2">
          {form.keywords.map((k, i) => (
            <div key={i} className="flex gap-2">
              <input className="input" placeholder="UZ" value={k.uz} onChange={(e) => setKw(i, 'uz', e.target.value)} />
              <input className="input" placeholder="EN" value={k.en} onChange={(e) => setKw(i, 'en', e.target.value)} />
              <button type="button" onClick={() => rmKw(i)} className="btn-ghost"><Trash2 className="h-4 w-4 text-error" /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="label">{t('articles.udk')}</label>
          <input className="input" value={form.udk} onChange={(e) => setForm({ ...form, udk: e.target.value })} />
        </div>
        <div>
          <label className="label">{t('articles.doi')}</label>
          <input className="input" value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} />
        </div>
        <div>
          <label className="label">{t('articles.language')}</label>
          <select className="input" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
            <option value="uz">UZ</option>
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Step3({ form, setForm }) {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);

  const search = async () => {
    if (q.length < 2) return;
    const r = await users.search(q);
    setResults(r?.data?.items || []);
  };

  const add = (u) => {
    if (form.authors.find((a) => a.user === u._id)) return;
    setForm((f) => ({
      ...f,
      authors: [...f.authors, { user: u._id, fullName: u.fullName, order: f.authors.length + 1, isCorresponding: false }],
    }));
    setResults([]);
    setQ('');
  };

  const rm = (i) => setForm((f) => ({ ...f, authors: f.authors.filter((_, x) => x !== i) }));
  const setCorr = (i) => setForm((f) => ({
    ...f,
    authors: f.authors.map((a, x) => ({ ...a, isCorresponding: x === i })),
  }));

  return (
    <div className="space-y-3">
      <div>
        <label className="label">{t('submit.addAuthor')}</label>
        <div className="flex gap-2">
          <input className="input" placeholder="Email yoki ism" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" onClick={search} className="btn-outline">Qidirish</button>
        </div>
        {results.length > 0 && (
          <div className="mt-2 rounded-lg border bg-white">
            {results.map((u) => (
              <button key={u._id} onClick={() => add(u)} className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50">
                <span><span className="font-medium">{u.fullName}</span> <span className="text-xs text-gray-500">{u.email}</span></span>
                <Plus className="h-4 w-4 text-primary" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {form.authors.map((a, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border bg-white p-3">
            <div>
              <div className="font-medium">{a.fullName}</div>
              <div className="text-xs text-gray-500">Tartib: {i + 1}</div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-xs">
                <input type="radio" name="corr" checked={!!a.isCorresponding} onChange={() => setCorr(i)} />
                Korrespondent
              </label>
              <button type="button" onClick={() => rm(i)} className="btn-ghost"><Trash2 className="h-4 w-4 text-error" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4({ form, setForm }) {
  const { t } = useTranslation();
  const set = (k, v) => setForm((f) => ({ ...f, imradStructure: { ...f.imradStructure, [k]: v } }));
  return (
    <div className="space-y-3">
      {[
        ['introduction', t('imrad.intro')],
        ['methodology', t('imrad.methods')],
        ['results', t('imrad.results')],
        ['discussion', t('imrad.discussion')],
        ['conclusion', t('imrad.conclusion')],
      ].map(([k, label]) => (
        <div key={k}>
          <label className="label">{label}</label>
          <textarea rows={4} className="input" value={form.imradStructure[k]} onChange={(e) => set(k, e.target.value)} />
        </div>
      ))}
    </div>
  );
}

function Step5({ form, onFile, uploading }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <FileBox
        label={t('submit.uploadPdf')}
        url={form.fileUrl}
        onChange={(e) => onFile(e, 'fileUrl')}
        loading={uploading}
      />
      <FileBox
        label={t('submit.coverLetter')}
        url={form.coverLetterUrl}
        onChange={(e) => onFile(e, 'coverLetterUrl')}
        loading={uploading}
      />
    </div>
  );
}

function FileBox({ label, url, onChange, loading }) {
  return (
    <div>
      <label className="label">{label}</label>
      <label className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:bg-gray-50">
        <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
        <div className="mt-1 text-sm text-gray-600">PDF tanlang</div>
        <input type="file" accept="application/pdf" hidden onChange={onChange} />
      </label>
      {loading && <div className="mt-2 text-xs text-gray-500">Yuklanmoqda...</div>}
      {url && <a href={url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-primary hover:underline">Faylni ko'rish</a>}
    </div>
  );
}

function Step6({ form, journals }) {
  const { t } = useTranslation();
  const journal = journals.find((j) => j._id === form.journal);
  return (
    <div className="space-y-3 text-sm">
      <Row label={t('articles.journal')} value={journal?.title?.uz} />
      <Row label={`${t('articles.title')} (UZ)`} value={form.title.uz} />
      <Row label={`${t('articles.title')} (RU)`} value={form.title.ru} />
      <Row label={`${t('articles.title')} (EN)`} value={form.title.en} />
      <Row label={t('articles.keywords')} value={form.keywords.map((k) => k.uz).filter(Boolean).join(', ')} />
      <Row label={t('articles.authors')} value={form.authors.map((a) => a.fullName).join(', ')} />
      <Row label="PDF" value={form.fileUrl ? '✓' : '—'} />
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
          <Comp
            key={l}
            placeholder={l.toUpperCase()}
            rows={textarea ? 3 : undefined}
            className="input"
            value={obj[l] || ''}
            onChange={(e) => onChange(l, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-2 border-b border-gray-100 py-2 last:border-0">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="text-ink">{value || <span className="text-gray-400">—</span>}</div>
    </div>
  );
}
