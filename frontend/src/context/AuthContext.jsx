import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth as authApi } from '../api/endpoints';
import { setAccessToken, setOnUnauthorized } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const logoutLocal = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(logoutLocal);
    (async () => {
      try {
        const r = await authApi.refresh();
        const token = r?.data?.accessToken;
        if (token) {
          setAccessToken(token);
          const me = await authApi.me();
          setUser(me?.data?.user || null);
        }
      } catch { /* not logged in */ }
      setReady(true);
    })();
  }, [logoutLocal]);

  const login = async (email, password) => {
    const r = await authApi.login({ email, password });
    setAccessToken(r.data.accessToken);
    setUser(r.data.user);
    return r.data.user;
  };

  const register = async (payload) => {
    const r = await authApi.register(payload);
    setAccessToken(r.data.accessToken);
    setUser(r.data.user);
    return r.data.user;
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    logoutLocal();
  };

  const refreshUser = async () => {
    const me = await authApi.me();
    setUser(me?.data?.user || null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
