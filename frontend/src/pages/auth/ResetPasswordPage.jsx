import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { auth } from '../../api/endpoints';
import { AuthShell } from './LoginPage';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const { token } = useParams();
  const nav = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Parollar mos emas');
    if (password.length < 8) return toast.error('Parol kamida 8 belgi bo\'lishi kerak');
    setLoading(true);
    try {
      await auth.reset(token, password);
      toast.success('Parol yangilandi');
      nav('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-2xl font-bold text-primary">{t('auth.resetTitle')}</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <label className="label">{t('auth.newPassword')}</label>
          <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="label">{t('auth.confirmPassword')}</label>
          <input type="password" required className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <button disabled={loading} className="btn-primary w-full">{t('common.save')}</button>
      </form>
    </AuthShell>
  );
}
