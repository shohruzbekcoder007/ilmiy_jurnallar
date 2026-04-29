import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      toast.success(`Xush kelibsiz, ${u.fullName}`);
      const next = params.get('next');
      nav(next || (u.role === 'admin' ? '/admin' : u.role === 'editor' ? '/editor' : '/cabinet'));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="mb-1 text-2xl font-bold text-primary">{t('auth.loginTitle')}</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <label className="label">{t('auth.email')}</label>
          <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">{t('auth.password')}</label>
          <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button disabled={loading} className="btn-primary w-full"><LogIn className="h-4 w-4" /> {t('auth.loginAction')}</button>
        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">{t('auth.forgot')}</Link>
          <Link to="/register" className="text-gray-600 hover:underline">{t('auth.noAccount')}</Link>
        </div>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ children }) {
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md card">{children}</div>
    </div>
  );
}
