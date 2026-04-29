import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Iltimos, hamma maydonni to\'ldiring');
    toast.success('Xabaringiz yuborildi. Tez orada javob beramiz.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container-page">
      <PageHeader title={t('nav.contact')} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={submit} className="card space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="label">F.I.Sh</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Mavzu</label>
            <input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div>
            <label className="label">Xabar</label>
            <textarea rows={6} className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <button className="btn-primary"><Send className="h-4 w-4" /> Yuborish</button>
        </form>

        <aside className="space-y-3">
          <div className="card flex gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold">Manzil</div>
              <div className="text-sm text-gray-600">Toshkent shahri, O'zbekiston</div>
            </div>
          </div>
          <div className="card flex gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold">Telefon</div>
              <div className="text-sm text-gray-600">+998 (71) 000-00-00</div>
            </div>
          </div>
          <div className="card flex gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold">Email</div>
              <div className="text-sm text-gray-600">editor@tsue.uz</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
