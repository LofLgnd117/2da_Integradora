import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const TOKEN_KEY = 'artemis_token';
const USER_KEY = 'artemis_user';

const AuthContext = createContext(null);

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
}

const REQUEST_TIMEOUT_MS = 12000;

// fetch en React Native no tiene límite de tiempo por defecto: si el servidor
// no es alcanzable (IP equivocada, servidor apagado, otra red Wi-Fi), la
// petición se queda esperando indefinidamente sin avisar nada al usuario.
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('No se pudo conectar con el servidor. Verifica que estés en la misma red Wi-Fi que el servidor y que esté encendido.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error al restaurar la sesión:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persistSession = useCallback(async (newToken, newUser) => {
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJsonSafely(response);
    if (!response.ok) {
      throw new Error(data.error || 'No se pudo iniciar sesión.');
    }
    await persistSession(data.token, data.user);
    return data.user;
  }, [persistSession]);

  const register = useCallback(async (firstName, lastName, email, password) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
    });
    const data = await parseJsonSafely(response);
    if (!response.ok) {
      throw new Error(data.error || 'No se pudo crear la cuenta.');
    }
    await persistSession(data.token, data.user);
    return data.user;
  }, [persistSession]);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (partialUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...partialUser };
      AsyncStorage.setItem(USER_KEY, JSON.stringify(merged)).catch(() => {});
      return merged;
    });
  }, []);

  // Helper para llamadas autenticadas: agrega el header Authorization automáticamente.
  const authFetch = useCallback((path, options = {}) => {
    const headers = { ...(options.headers || {}) };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetchWithTimeout(`${API_BASE_URL}${path}`, { ...options, headers });
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateUser,
    authFetch,
  }), [token, user, isLoading, login, register, logout, updateUser, authFetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
