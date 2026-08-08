import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoArtemis from '../assets/logo-artemis.png';

export default function Navbar({ onLoginClick }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "🌟 ¡Primer Me Gusta en tu Receta!",
      message: 'A alguien de la comunidad le encantó tu "Pollo Kung Pao Casero". ¡Tu sazón inspira a otros!',
      time: "Hace 10 min",
      unread: true
    },
    {
      id: 2,
      title: "🥇 Medalla Desbloqueada",
      message: 'Has obtenido el logro "Receta de Oro" por recibir tu primera valoración en la plataforma.',
      time: "Hace 2 horas",
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    //CAMBIOS DEL COLOR DE FONDO PARA FUNDIRSE CON EL LOGO
    <nav className="bg-[#839958] text-white px-6 py-3 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center cursor-pointer group"
        >
          <img 
            src={logoArtemis} 
            alt="Logo Ártemis" 
            className="h-11 w-auto object-contain group-hover:scale-105 transition-transform" 
          />
        </div>

        {/* Botones de Navegación del Menú */}
        <div className="flex items-center gap-6 font-semibold text-base">
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
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
              title="Notificaciones"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
              </svg>

              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-[#839958] rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Dropdown de Notificaciones */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white text-[#1D1D1D] rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="bg-[#1D1D1D] text-white px-6 py-4 flex items-center justify-between">
                  <span className="font-bold text-lg">Notificaciones</span>
                  <span className="text-xs bg-[#2E5834] px-2.5 py-1 rounded-full font-bold">
                    {unreadCount} nuevas
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-5 transition-colors ${
                        notif.unread ? 'bg-[#839958]/10' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm text-[#1D1D1D]">{notif.title}</p>
                        <span className="text-[11px] text-gray-400 shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
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

          {/* BOTÓN DE PERFIL EN VERDE OSCURO PARA HACER CONTRASTE */}
          <button
            onClick={() => navigate('/perfil')}
            className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold px-5 py-2 rounded-full text-sm transition-colors cursor-pointer shadow-sm"
          >
            Alina Cruz
          </button>
        </div>
      </div>
    </nav>
  );
}