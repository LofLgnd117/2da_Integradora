import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pestaña activa: 'recetas', 'datos', 'seguridad'
  const [activeTab, setActiveTab] = useState('recetas');

  // Consultamos al backend los datos del usuario 1 (Alina Cruz)
  useEffect(() => {
    fetch('http://localhost:5000/api/users/1')
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center font-sans">
        <p className="text-xl font-bold text-[#2E5834]">Cargando tu perfil...</p>
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

  const { user, publishedRecipes, recipesCount } = profile;
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-6 py-12 flex-1">
        {/* TARJETA DE CABECERA DE PERFIL */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          {/* Avatar con Iniciales */}
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#2E5834] text-white font-black text-4xl md:text-5xl flex items-center justify-center shadow-md shrink-0">
            {user.first_name[0]}{user.last_name[0]}
          </div>

          {/* Información Principal */}
          <div className="flex-1 text-center md:text-left">
            <span className="bg-[#839958]/20 text-[#2E5834] font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
              Cocinera de la Comunidad
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-[#1D1D1D] mt-3">
              {fullName}
            </h1>
            <p className="text-gray-500 text-base mt-1">{user.email}</p>

            {/* Badges y Estadísticas */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
              <div className="bg-[#FBFBFB] px-5 py-3 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-400 uppercase block">Recetas Publicadas</span>
                <span className="text-2xl font-black text-[#1D1D1D]">{recipesCount}</span>
              </div>
              <div className="bg-[#FBFBFB] px-5 py-3 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-400 uppercase block">Miembro Desde</span>
                <span className="text-lg font-bold text-[#2E5834]">
                  {new Date(user.created_at || Date.now()).toLocaleDateString('es-ES', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Botón Acción Rápida */}
          <button
            onClick={() => navigate('/subir')}
            className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold px-8 py-4 rounded-full text-base shadow-md transition-all self-center md:self-start cursor-pointer"
          >
            + Publicar Nueva Receta
          </button>
        </div>

        {/* NAVEGACIÓN DE PESTAÑAS (TABS) */}
        <div className="flex border-b border-gray-200 mb-10 gap-8">
          <button
            onClick={() => setActiveTab('recetas')}
            className={`pb-4 text-lg font-bold transition-colors relative cursor-pointer ${
              activeTab === 'recetas'
                ? 'text-[#2E5834] border-b-4 border-[#2E5834]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            📖 Mis Recetas ({recipesCount})
          </button>
          <button
            onClick={() => setActiveTab('datos')}
            className={`pb-4 text-lg font-bold transition-colors relative cursor-pointer ${
              activeTab === 'datos'
                ? 'text-[#2E5834] border-b-4 border-[#2E5834]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            👤 Datos Personales
          </button>
          <button
            onClick={() => setActiveTab('seguridad')}
            className={`pb-4 text-lg font-bold transition-colors relative cursor-pointer ${
              activeTab === 'seguridad'
                ? 'text-[#2E5834] border-b-4 border-[#2E5834]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🔒 Seguridad y Privacidad
          </button>
        </div>

        {/* CONTENIDO DE PESTAÑA 1: MIS RECETAS PUBLICADAS */}
        {activeTab === 'recetas' && (
          <div>
            {publishedRecipes && publishedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <div className="text-center py-16 bg-white rounded-[32px] border border-gray-100 p-8">
                <p className="text-xl font-bold text-gray-700 mb-2">Aún no has publicado ninguna receta</p>
                <p className="text-gray-500 mb-6">Comparte tus platillos favoritos con toda la comunidad de Ártemis.</p>
                <button
                  onClick={() => navigate('/subir')}
                  className="bg-[#2E5834] text-white px-8 py-3 rounded-full font-bold"
                >
                  Subir mi Primera Receta
                </button>
              </div>
            )}
          </div>
        )}

        {/* CONTENIDO DE PESTAÑA 2: DATOS PERSONALES */}
        {activeTab === 'datos' && (
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 max-w-2xl">
            <h3 className="text-2xl font-black text-[#1D1D1D] mb-6">Información de la Cuenta</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm font-bold uppercase mb-1">Nombre</label>
                <input
                  type="text"
                  readOnly
                  value={user.first_name}
                  className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-[#FBFBFB] font-bold text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-bold uppercase mb-1">Apellido</label>
                <input
                  type="text"
                  readOnly
                  value={user.last_name}
                  className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-[#FBFBFB] font-bold text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-bold uppercase mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  readOnly
                  value={user.email}
                  className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-[#FBFBFB] font-bold text-gray-800"
                />
              </div>
              <button
                onClick={() => alert('La edición de datos estará activa en la Fase 2 del proyecto.')}
                className="bg-[#839958]/20 text-[#2E5834] hover:bg-[#839958]/30 font-bold px-8 py-3 rounded-full transition-colors cursor-pointer"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        )}

        {/* CONTENIDO DE PESTAÑA 3: SEGURIDAD */}
        {activeTab === 'seguridad' && (
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 max-w-2xl space-y-8">
            <div>
              <h3 className="text-2xl font-black text-[#1D1D1D] mb-2">Seguridad y Contraseña</h3>
              <p className="text-gray-500 mb-6">Administra tus credenciales de acceso y permisos del sistema.</p>
              <button
                onClick={() => alert('Se enviará un enlace de recuperación a tu correo de registro.')}
                className="bg-[#2E5834] text-white font-bold px-8 py-3 rounded-full hover:bg-[#1f3d23] transition-colors cursor-pointer"
              >
                Cambiar Contraseña
              </button>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h4 className="font-bold text-gray-800 text-lg mb-2">Aviso de Privacidad</h4>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                En cumplimiento con las normas de privacidad, tus datos están protegidos y encriptados. Puedes solicitar la descarga de tus datos personales o dar de baja tu cuenta en cualquier momento.
              </p>
              <span className="text-xs font-bold text-[#2E5834] bg-[#839958]/15 px-3 py-1.5 rounded-full inline-block">
                ✓ Términos y Privacidad aceptados
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}