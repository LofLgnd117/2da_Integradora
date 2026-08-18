import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'artemis_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // Evita que las páginas decidan "no hay sesión" antes de leer localStorage
  const [initialized, setInitialized] = useState(false);

  // Al montar la app, recuperamos la sesión guardada (si existe) para persistir entre recargas
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.token && parsed.user) {
          setUser(parsed.user);
          setToken(parsed.token);
        }
      }
    } catch (err) {
      console.error('[AuthContext]: No se pudo leer la sesión guardada ->', err);
    } finally {
      setInitialized(true);
    }
  }, []);

  const persistSession = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
  };

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'No se pudo iniciar sesión. Intenta de nuevo.');
    }

    persistSession(data.user, data.token);
    return data.user;
  }, []);

  const register = useCallback(async (first_name, last_name, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name, last_name, email, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'No se pudo crear la cuenta. Intenta de nuevo.');
    }

    persistSession(data.user, data.token);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Fusiona cambios parciales del usuario (p. ej. tras editar el perfil) y
  // los persiste, sin necesidad de volver a iniciar sesión.
  const updateUser = useCallback((partialUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...partialUser };
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, user: merged }));
      } catch (err) {
        console.error('[AuthContext]: No se pudo persistir el usuario actualizado ->', err);
      }
      return merged;
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    initialized,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return ctx;
}
