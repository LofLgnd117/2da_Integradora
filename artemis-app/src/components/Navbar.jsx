import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logoArtemis from '../assets/logo-artemis.png';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Justo ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
}

export default function Navbar({ onLoginClick }) {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  // Navbar controla sus propios modales de sesión: hoy ninguna página los
  // renderizaba (LoginModal/SignupModal existían pero no estaban conectados
  // a nada), así que como Navbar aparece en todas las páginas, es el lugar
  // más simple para que "Iniciar Sesión" abra el modal desde cualquier vista.
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null

  const openLoginModal = () => {
    if (onLoginClick) onLoginClick();
    setAuthModal('login');
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const fetchNotifications = useCallback(() => {
    if (!isAuthenticated) return;
    fetch(`${API_URL}/api/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications(data.data);
          setUnreadCount(data.unreadCount);
        }
      })
      .catch((err) => console.error('[ERROR - NOTIFICACIONES]:', err));
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchNotifications();
    if (!isAuthenticated) return;
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications, isAuthenticated]);

  const toggleNotifications = () => {
    const opening = !showNotifications;
    setShowNotifications(opening);
    if (opening && unreadCount > 0) {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      fetch(`${API_URL}/api/notifications/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch((err) => console.error('[ERROR - MARCAR LEÍDAS]:', err));
    }
  };

  return (
    //CAMBIOS DEL COLOR DE FONDO PARA FUNDIRSE CON EL LOGO
    <nav className="bg-[#839958] text-white px-6 py-[13.2px] shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div
          onClick={() => navigate('/')}
          className="flex items-center cursor-pointer group"
        >
          <img
            src={logoArtemis}
            alt="Logo Ártemis"
            className="h-[53px] w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Botones de Navegación del Menú */}
        <div className="flex items-center gap-[26.4px] font-semibold text-[17.6px]">
          <button 
            onClick={() => navigate('/')} 
            className="hover:text-gray-200 transition-colors cursor-pointer"
          >
            Inicio
          </button>
          <button 
            onClick={() => navigate('/buscar')} 
            className="hover:text-gray-200 transition-colors cursor-pointer"
          >
            Recetas
          </button>
          <button 
            onClick={() => navigate('/guardadas')} 
            className="hover:text-gray-200 transition-colors cursor-pointer"
          >
            Guardadas
          </button>

          {/* Bandeja de Notificaciones (Dopamina) */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative p-[8.8px] rounded-full hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
                title="Notificaciones"
              >
                <svg className="w-[26.4px] h-[26.4px] fill-current" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                </svg>

                {unreadCount > 0 && (
                  <span className="absolute top-[4.4px] right-[4.4px] w-[13.2px] h-[13.2px] bg-red-500 border-2 border-[#839958] rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Dropdown de Notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white text-[#1D1D1D] rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="bg-[#1D1D1D] text-white px-6 py-4 flex items-center justify-between">
                    <span className="font-bold text-lg">Notificaciones</span>
                    {notifications.length > 0 && (
                      <span className="text-xs bg-[#2E5834] px-2.5 py-1 rounded-full font-bold">
                        {notifications.length}
                      </span>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-5 transition-colors ${
                            !notif.is_read ? 'bg-[#839958]/10' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-sm text-[#1D1D1D]">{notif.title}</p>
                            <span className="text-[11px] text-gray-400 shrink-0">{timeAgo(notif.created_at)}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-8 px-4">
                        Aún no tienes notificaciones. Aquí verás tus medallas y los "Me gusta" en tus recetas.
                      </p>
                    )}
                  </div>

                  <div className="p-3 text-center bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-[#2E5834] hover:underline cursor-pointer"
                    >
                      Cerrar bandeja
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SESIÓN: si hay usuario logueado, mostramos su nombre + menú con "Cerrar sesión";
              si no, mostramos el botón para abrir el modal de Iniciar Sesión */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold px-[22px] py-[8.8px] rounded-full text-[15.4px] transition-colors cursor-pointer shadow-sm flex items-center gap-2"
              >
                {user?.first_name || 'Mi cuenta'}
                <svg className="w-[17.6px] h-[17.6px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white text-[#1D1D1D] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/perfil');
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-gray-50 font-semibold cursor-pointer"
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 hover:bg-red-50 font-semibold text-red-600 cursor-pointer border-t border-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold px-[22px] py-[8.8px] rounded-full text-[15.4px] transition-colors cursor-pointer shadow-sm"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Modales de sesión, accesibles desde cualquier página */}
      <LoginModal
        isOpen={authModal === 'login'}
        onClose={() => setAuthModal(null)}
        onSwitchToSignup={() => setAuthModal('signup')}
      />
      <SignupModal
        isOpen={authModal === 'signup'}
        onClose={() => setAuthModal(null)}
        onSwitchToLogin={() => setAuthModal('login')}
      />
    </nav>
  );
}