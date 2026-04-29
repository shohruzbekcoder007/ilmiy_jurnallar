import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { stats } from '../../api/endpoints';
import PageHeader from '../../components/PageHeader';
import { useLang } from '../../context/LangContext';
import { pickI18n } from '../../utils/format';

export default function AdminStats() {
  const { lang } = useLang();
  const { data: summary } = useQuery({ queryKey: ['stats'], queryFn: stats.summary });
  const { data: ad } = useQuery({ queryKey: ['stats-admin'], queryFn: stats.admin });

  const monthly = (ad?.data?.submissionsPerMonth || []).map((m) => ({
    name: `${m._id.y}-${String(m._id.m).padStart(2, '0')}`,
    count: m.count,
  }));
  const top = (ad?.data?.topArticles || []).map((a) => ({
    name: pickI18n(a.title, lang).slice(0, 30) + '...',
    downloads: a.downloadCount,
    views: a.viewCount,
  }));

  const s = summary?.data || {};

  return (
    <div>
      <PageHeader title="Statistika" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-6">
        <Stat label="Jurnallar" value={s.totalJournals} />
        <Stat label="Maqolalar" value={s.totalArticles} />
        <Stat label="Mualliflar" value={s.totalAuthors} />
        <Stat label="Yuklab olishlar" value={s.totalDownloads} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-3 font-semibold">Yuborilgan maqolalar (oy bo'yicha)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#1A3A6E" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="mb-3 font-semibold">TOP yuklab olingan maqolalar</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="downloads" fill="#C8A951" />
              <Bar dataKey="views" fill="#1A3A6E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-primary">{value ?? '—'}</div>
    </div>
  );
}
