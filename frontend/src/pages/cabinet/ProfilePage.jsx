import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../api/endpoints';
import PageHeader from '../../components/PageHeader';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    orcid: user?.orcid || '',
    affiliation: user?.affiliation || '',
    position: user?.position || '',
    degree: user?.degree || '',
    preferredLanguage: user?.preferredLanguage || 'uz',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await auth.updateMe(form);
      await refreshUser();
      toast.success('Saqlandi');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Profil" />
      <form onSubmit={submit} className="card grid gap-3 md:grid-cols-2">
        <Field label={t('auth.fullName')} value={form.fullName} onChange={(v) => set('fullName', v)} />
        <Field label={t('auth.phone')} value={form.phone} onChange={(v) => set('phone', v)} />
        <Field label={t('auth.orcid')} value={form.orcid} onChange={(v) => set('orcid', v)} />
        <Field label={t('auth.affiliation')} value={form.affiliation} onChange={(v) => set('affiliation', v)} />
        <Field label={t('auth.position')} value={form.position} onChange={(v) => set('position', v)} />
        <Field label={t('auth.degree')} value={form.degree} onChange={(v) => set('degree', v)} />
        <div>
          <label className="label">{t('common.language')}</label>
          <select className="input" value={form.preferredLanguage} onChange={(e) => set('preferredLanguage', e.target.value)}>
            <option value="uz">UZ</option>
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>
        </div>
        <div className="md:col-span-2 mt-2">
          <button disabled={saving} className="btn-primary">{t('common.save')}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
