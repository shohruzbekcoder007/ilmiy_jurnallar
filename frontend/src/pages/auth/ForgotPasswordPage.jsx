import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';
import { auth } from '../../api/endpoints';
import { AuthShell } from './LoginPage';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.forgot(email);
      setSent(true);
      toast.success(t('auth.resetSent'));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-2xl font-bold text-primary">{t('auth.resetTitle')}</h1>
      {sent ? (
        <p className="mt-3 text-sm text-gray-600">{t('auth.resetSent')}</p>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="label">{t('auth.email')}</label>
            <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button disabled={loading} className="btn-primary w-full"><Mail className="h-4 w-4" /> Yuborish</button>
        </form>
      )}
    </AuthShell>
  );
}
