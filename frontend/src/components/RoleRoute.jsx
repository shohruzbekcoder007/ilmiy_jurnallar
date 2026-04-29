import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ roles = [], children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="container-page py-10">Yuklanmoqda...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
