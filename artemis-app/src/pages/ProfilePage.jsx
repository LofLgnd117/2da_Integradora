import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import CustomModal from '../components/CustomModal';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const BADGES_CATALOG = [
  { type: 'critico_del_barrio', emoji: '🥉', label: 'Crítico del Barrio', description: 'Publica tu primera reseña en la receta de alguien más.' },
  { type: 'maestro_del_orden', emoji: '🥈', label: 'Maestro del Orden', description: 'Guarda tu segunda receta en Recetas Guardadas.' },
  { type: 'receta_de_oro', emoji: '🥇', label: 'Receta de Oro', description: 'Recibe tu primer "Me Gusta" en una receta tuya.' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, initialized } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pestañas alineadas: 'recipes', 'edit', 'settings', 'logros'
  const [activeTab, setActiveTab] = useState('recipes');

  // Notificacion de guardado/éxito en perfil
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    // Esperamos a que AuthContext termine de leer localStorage antes de decidir
    if (!initialized) return;

    if (!isAuthenticated || !authUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/api/users/${authUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('[ERROR - PERFIL]:', err);
        setLoading(false);
      });
  }, [initialized, isAuthenticated, authUser]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center font-sans">
        <p className="text-xl font-bold text-[#2E5834]">Cargando tu perfil...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center py-24">
          <div className="w-20 h-20 bg-[#839958]/20 text-[#2E5834] rounded-full flex items-center justify-center text-3xl mb-2 font-bold">
            🔒
          </div>
          <p className="text-2xl font-bold text-gray-700">Inicia sesión para ver tu perfil</p>
          <p className="text-gray-500 max-w-md">
            Usa el botón "Iniciar Sesión" en la barra superior para acceder a tus recetas, tus ajustes y tu racha de cocina.
          </p>
          <button onClick={() => navigate('/')} className="bg-[#2E5834] text-white px-8 py-3 rounded-full font-bold mt-2">
            Volver a Inicio
          </button>
        </div>
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center gap-4 font-sans">
        <p className="text-2xl font-bold text-gray-700">No se pudo cargar la cuenta.</p>
        <button onClick={() => navigate('/')} className="bg-[#2E5834] text-white px-8 py-3 rounded-full font-bold">
          Volver a Inicio
        </button>
      </div>
    );
  }

  const { user, publishedRecipes, badges = [] } = profile;
  const fullName = `${user.first_name} ${user.last_name}`;
  const unlockedTypes = new Set(badges.map((b) => b.badge_type));
  const streakDays = user.current_streak || 0;
  const savesLeft = user.streak_saves_left ?? 0;

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1">
        {/* Contenedor Principal (Sidebar + Content) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* BARRA LATERAL IZQUIERDA */}
          <aside className="md:col-span-1 bg-[#839958]/15 rounded-[24px] p-6 border border-[#839958]/30 sticky top-24">
            <h2 className="text-2xl font-black text-[#1D1D1D] mb-6 px-4">
              Mi Perfil
            </h2>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('recipes')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-base transition-all ${
                  activeTab === 'recipes'
                    ? 'bg-white text-[#2E5834] shadow-sm'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                Mis Recetas
              </button>

              <button
                onClick={() => setActiveTab('edit')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-base transition-all ${
                  activeTab === 'edit'
                    ? 'bg-white text-[#2E5834] shadow-sm'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                Editar Perfil
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-base transition-all ${
                  activeTab === 'settings'
                    ? 'bg-white text-[#2E5834] shadow-sm'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                Ajustes de Cuenta
              </button>

              <button
                onClick={() => setActiveTab('logros')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-base transition-all ${
                  activeTab === 'logros'
                    ? 'bg-white text-[#2E5834] shadow-sm'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                🏆 Logros y Racha
              </button>
            </nav>
          </aside>

          {/* ÁREA DE CONTENIDO DERECHA */}
          <section className="md:col-span-3 bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-sm">
            
            {/* MIS RECETAS */}
            {activeTab === 'recipes' && (
              <div>
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                  <div>
                    <h3 className="text-3xl font-black text-[#1D1D1D]">Mis Recetas</h3>
                    <p className="text-gray-500 mt-1">Platillos que has compartido con la comunidad de Ártemis.</p>
                  </div>
                  <button
                    onClick={() => navigate('/subir')}
                    className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold px-6 py-3 rounded-full text-sm shadow-md transition-all"
                  >
                    + Publicar Receta
                  </button>
                </div>

                {publishedRecipes && publishedRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publishedRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        id={recipe.id}
                        title={recipe.title}
                        author={fullName}
                        totalTime={`${recipe.total_time_minutes} min`}
                        reviewsCount={12}
                        imageSrc={recipe.image_url}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xl font-bold text-gray-600 mb-4">Aún no tienes recetas publicadas.</p>
                    <button
                      onClick={() => navigate('/subir')}
                      className="bg-[#2E5834] text-white px-8 py-3 rounded-full font-bold"
                    >
                      Crear mi primera receta
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* EDITAR PERFIL */}
            {activeTab === 'edit' && (
              <div>
                <h3 className="text-3xl font-black text-[#1D1D1D] mb-8 border-b border-gray-100 pb-4">
                  Editar Tu Perfil
                </h3>

                {/* Foto de Perfil Mockup */}
                <div className="mb-8">
                  <label className="block font-bold text-gray-700 mb-3">Foto de Perfil</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 relative">
                      AC
                      <span className="absolute bottom-0 right-0 bg-[#2E5834] text-white p-1 rounded-full text-xs">
                        📷
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 max-w-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        defaultValue={user.first_name}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E5834]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Apellido</label>
                      <input
                        type="text"
                        defaultValue={user.last_name}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E5834]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sitio Web / Redes</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E5834]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sobre Mí</label>
                    <textarea
                      rows="3"
                      placeholder="Cuéntanos sobre ti y tu pasión por la cocina..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E5834]"
                    ></textarea>
                  </div>

                  <button
                    onClick={() => setModalInfo({
                      isOpen: true,
                      title: '¡Perfil Actualizado!',
                      message: 'Tus cambios se han guardado correctamente en tu cuenta de Ártemis.'
                    })}
                    className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold px-8 py-3.5 rounded-full shadow-md transition-all"
                  >
                    Actualizar Perfil
                  </button>
                </div>
              </div>
            )}

            {/* AJUSTES DE CUENTA */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-3xl font-black text-[#1D1D1D] mb-8 border-b border-gray-100 pb-4">
                  Ajustes de Cuenta
                </h3>

                <div className="space-y-6 max-w-xl">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      readOnly
                      value={user.email}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
                    <p className="text-sm text-gray-500 mb-4">
                      Tu seguridad es nuestra prioridad. Si deseas cambiar tu contraseña, te enviaremos un enlace de restablecimiento seguro a tu correo.
                    </p>
                    <button
                      onClick={() => setModalInfo({
                        isOpen: true,
                        title: 'Enlace Enviado',
                        message: `Hemos enviado un correo a ${user.email} con las instrucciones para restablecer tu contraseña.`
                      })}
                      className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold px-8 py-3.5 rounded-full shadow-md transition-all"
                    >
                      Restablecer Contraseña
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* LOGROS Y RACHA */}
            {activeTab === 'logros' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-[#1D1D1D] to-[#2E5834] text-white rounded-3xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="bg-white/20 text-white font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
                      {streakDays > 0 ? 'Racha Activa' : 'Sin racha activa'}
                    </span>
                    <h3 className="text-3xl font-black mt-3">
                      🔥 Racha de Cocina: {streakDays} {streakDays === 1 ? 'Día' : 'Días'}
                    </h3>
                    <p className="text-gray-200 mt-1 text-base">
                      {streakDays > 0
                        ? '¡Excelente constancia! Estás alimentando tu cuerpo y corazón cada día que entras.'
                        : 'Inicia sesión días seguidos para empezar tu racha de cocina.'}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
                    <p className="text-xs font-bold text-gray-300 uppercase mb-1">Salvavidas Disponibles</p>
                    <div className="flex gap-2 justify-center text-2xl">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className={i < savesLeft ? 'opacity-100' : 'opacity-30'}>🛡️</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{savesLeft} permisos de descanso</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl font-black text-[#1D1D1D] mb-4">Medallas de Honor</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {BADGES_CATALOG.map((badge) => {
                      const unlocked = unlockedTypes.has(badge.type);
                      return (
                        <div
                          key={badge.type}
                          className={unlocked ? 'bg-white p-6 rounded-3xl border-2 border-[#2E5834] shadow-sm' : 'bg-[#FBFBFB] p-6 rounded-3xl border border-gray-200'}
                        >
                          <div className={`w-14 h-14 rounded-2xl font-bold flex items-center justify-center text-2xl mb-4 ${
                            unlocked ? 'bg-[#2E5834] text-white shadow-md' : 'bg-[#839958]/20 text-[#2E5834]'
                          }`}>
                            {badge.emoji}
                          </div>
                          <h5 className="font-bold text-lg text-[#1D1D1D]">{badge.label}</h5>
                          <p className="text-gray-500 text-sm mt-1">{badge.description}</p>
                          {unlocked ? (
                            <span className="mt-4 inline-block bg-[#839958]/20 text-[#2E5834] font-bold text-xs px-3 py-1 rounded-full">✨ Desbloqueada</span>
                          ) : (
                            <span className="mt-4 inline-block bg-gray-200 text-gray-600 font-bold text-xs px-3 py-1 rounded-full">🔒 Por desbloquear</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <CustomModal
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ isOpen: false, title: '', message: '' })}
        title={modalInfo.title}
        message={modalInfo.message}
        showCancel={false}
        confirmText="Entendido"
      />
    </div>
  );
}