import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { users } from '../../api/endpoints';
import PageHeader from '../../components/PageHeader';

const ROLES = ['author', 'reviewer', 'editor', 'admin'];

export default function UserManager() {
  const qc = useQueryClient();
  const [filters, setFilters] = useState({ role: '', q: '' });
  const { data } = useQuery({ queryKey: ['users', filters], queryFn: () => users.list(filters) });

  const setRole = async (id, role) => {
    try {
      await users.changeRole(id, role);
      toast.success('Rol o\'zgartirildi');
      qc.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Faolligini olib tashlansinmi?')) return;
    try {
      await users.remove(id);
      toast.success('Bajarildi');
      qc.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <PageHeader title="Foydalanuvchilar" />
      <div className="mb-3 flex gap-2">
        <input className="input" placeholder="Qidiruv..." value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} />
        <select className="input w-40" value={filters.role} onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}>
          <option value="">Barcha rollar</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Ism</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amal</th>
            </tr>
          </thead>
          <tbody>
            {(data?.data?.items || []).map((u) => (
              <tr key={u._id} className="border-t border-gray-100">
                <td className="px-4 py-3">{u.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <select className="input w-32" value={u.role} onChange={(e) => setRole(u._id, e.target.value)}>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {u.isActive ? 'Faol' : 'Faolsiz'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(u._id)} className="btn-ghost"><Trash2 className="h-4 w-4 text-error" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
