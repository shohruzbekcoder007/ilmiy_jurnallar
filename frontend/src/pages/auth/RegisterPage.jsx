import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { AuthShell } from './LoginPage';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    phone: '', orcid: '', affiliation: '', position: '', degree: '', preferredLanguage: 'uz',
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Parollar mos emas');
    if (form.password.length < 8) return toast.error('Parol kamida 8 belgi bo\'lishi kerak');
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const u = await register(payload);
      toast.success(`Xush kelibsiz, ${u.fullName}`);
      nav('/cabinet');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="mb-1 text-2xl font-bold text-primary">{t('auth.registerTitle')}</h1>
      <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label={t('auth.fullName')} required value={form.fullName} onChange={(v) => set('fullName', v)} />
        <Field label={t('auth.email')} type="email" required value={form.email} onChange={(v) => set('email', v)} />
        <Field label={t('auth.password')} type="password" required value={form.password} onChange={(v) => set('password', v)} />
        <Field label={t('auth.confirmPassword')} type="password" required value={form.confirmPassword} onChange={(v) => set('confirmPassword', v)} />
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
        <div className="md:col-span-2 mt-2 flex items-center justify-between">
          <Link to="/login" className="text-sm text-gray-600 hover:underline">{t('auth.haveAccount')}</Link>
          <button disabled={loading} className="btn-primary"><UserPlus className="h-4 w-4" /> {t('auth.registerAction')}</button>
        </div>
      </form>
    </AuthShell>
  );
}

function Field({ label, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type={type} required={required} className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
