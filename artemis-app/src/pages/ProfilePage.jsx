import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';

// Recetas de muestra publicadas por el usuario (En Fase 3 llegarán de PostgreSQL: SELECT * FROM recipes WHERE user_id = X)
const MIS_RECETAS_MUESTRA = [
  {
    id: 301,
    title: 'Guisado de Papas con Coliflor (Aloo Gobi)',
    author: 'Alina Cruz',
    totalTime: '30 min',
    reviewsCount: 12,
    imageSrc: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/tji4ccov_expires_30_days.png',
  },
  {
    id: 302,
    title: 'Caldo Tlalpeño Casero',
    author: 'Alina Cruz',
    totalTime: '50 min',
    reviewsCount: 24,
    imageSrc: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/pnxzuukb_expires_30_days.png',
  },
];

export default function ProfilePage({ onOpenLogin }) {
  // 1. Pestaña activa ('edit' | 'settings' | 'recipes')
  const [activeTab, setActiveTab] = useState('edit');

  // 2. Estado dinámico del usuario (En Fase 3 se cargará al iniciar sesión)
  const [userData, setUserData] = useState({
    firstName: 'Alina',
    lastName: 'Cruz',
    email: 'alina.cruz@ejemplo.com',
    website: 'https://misrecetas.mx',
    aboutMe: 'Apasionada de la cocina tradicional mexicana y la repostería casera. Me encanta compartir recetas fáciles para toda la familia.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  });

  // Estado temporal para editar campos antes de guardar
  const [formData, setFormData] = useState({ ...userData });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Manejador para guardar cambios del perfil
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setUserData({ ...formData });
    console.log('[LOG]: Perfil actualizado correctamente ->', formData);
    alert('¡Tus datos de perfil se han actualizado con éxito!');
  };

  // Manejador para cambiar contraseña
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor, verifícalas.');
      return;
    }
    console.log('[LOG]: Solicitud de cambio de contraseña para ->', userData.email);
    alert('¡Contraseña actualizada correctamente!');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans text-[#1D1D1D]">
      {/* 1. Navegación Superior Reutilizada (Usuario conectado) */}
      <Navbar
        isLoggedIn={true}
        userName={`${userData.firstName} ${userData.lastName}`}
        onLoginClick={onOpenLogin}
        onAddRecipeClick={() => alert('Abriendo formulario para subir receta...')}
      />

      {/* 2. Sub-menú Superior */}
      <div className="bg-white border-b border-gray-200 py-3 px-6 shadow-sm flex justify-center gap-8 md:gap-16 text-lg font-medium">
        <button className="hover:text-[#2E5834] transition-colors">Populares</button>
        <button className="hover:text-[#2E5834] transition-colors">Comidas y Platillos</button>
        <button className="hover:text-[#2E5834] transition-colors">Dietas</button>
        <button className="hover:text-[#2E5834] transition-colors">Ocasiones</button>
      </div>

      {/* 3. Contenedor Principal: Menú Lateral + Contenido */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row">
        
        {/* COLUMNA IZQUIERDA: Menú de Navegación del Perfil */}
        <aside className="w-full md:w-80 bg-[#D7E0D8] p-8 shrink-0 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-gray-300">
          <h1 className="text-3xl font-bold text-[#1D1D1D] mb-4">
            Mi Perfil
          </h1>

          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('edit')}
              className={`w-full text-left py-4 px-6 rounded-2xl font-bold text-xl transition-all ${
                activeTab === 'edit'
                  ? 'bg-[#FBFBFB] text-[#2E5834] shadow-sm'
                  : 'text-[#1D1D1D] hover:bg-white/50'
              }`}
            >
              👤 Editar Perfil
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left py-4 px-6 rounded-2xl font-bold text-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#FBFBFB] text-[#2E5834] shadow-sm'
                  : 'text-[#1D1D1D] hover:bg-white/50'
              }`}
            >
              🔒 Seguridad y Cuenta
            </button>

            <button
              onClick={() => setActiveTab('recipes')}
              className={`w-full text-left py-4 px-6 rounded-2xl font-bold text-xl transition-all ${
                activeTab === 'recipes'
                  ? 'bg-[#FBFBFB] text-[#2E5834] shadow-sm'
                  : 'text-[#1D1D1D] hover:bg-white/50'
              }`}
            >
              🍳 Mis Recetas ({MIS_RECETAS_MUESTRA.length})
            </button>
          </nav>
        </aside>

        {/* COLUMNA DERECHA: Contenido Dinámico Según la Pestaña Activa */}
        <main className="flex-1 p-6 md:p-14 bg-white">
          
          {/* =========================================================
              PESTAÑA 1: EDITAR PERFIL ('edit')
              ========================================================= */}
          {activeTab === 'edit' && (
            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-10 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold border-b pb-4">
                Editar Perfil
              </h2>

              {/* Foto de Perfil con botón para cambiar */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-[#2E5834] shadow-md shrink-0">
                  <img
                    src={userData.avatarUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 text-center sm:text-left">
                  <span className="text-xl font-bold text-[#1D1D1D]">Foto de Perfil</span>
                  <p className="text-gray-500 text-base">
                    Sube una foto clara para que la comunidad te reconozca.
                  </p>
                  <button
                    type="button"
                    onClick={() => alert('Abriendo selector para cambiar foto...')}
                    className="self-center sm:self-start bg-gray-100 hover:bg-gray-200 text-[#1D1D1D] font-bold py-2.5 px-6 rounded-full border border-gray-300 transition-colors text-base mt-1"
                  >
                    📷 Cambiar Foto
                  </button>
                </div>
              </div>

              {/* Nombre y Apellidos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-xl font-medium text-[#444444]">
                    Nombre(s)
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834] focus:ring-2 focus:ring-[#2E5834]/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-xl font-medium text-[#444444]">
                    Apellidos
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834] focus:ring-2 focus:ring-[#2E5834]/20"
                  />
                </div>
              </div>

              {/* Sitio Web o Red Social */}
              <div className="flex flex-col gap-2">
                <label htmlFor="website" className="text-xl font-medium text-[#444444]">
                  Página Web o Red Social (Opcional)
                </label>
                <input
                  id="website"
                  type="url"
                  placeholder="https://"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834]"
                />
              </div>

              {/* Sobre Mí / Biografía */}
              <div className="flex flex-col gap-2">
                <label htmlFor="aboutMe" className="text-xl font-medium text-[#444444]">
                  Sobre Mí / Biografía
                </label>
                <textarea
                  id="aboutMe"
                  rows="4"
                  placeholder="Cuéntale a la comunidad un poco sobre ti y tu gusto por la cocina..."
                  value={formData.aboutMe}
                  onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                  className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834]"
                />
              </div>

              {/* Botón Guardar */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold text-xl py-4 px-10 rounded-full shadow-md transition-transform active:scale-98"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              PESTAÑA 2: SEGURIDAD Y CUENTA ('settings')
              ========================================================= */}
          {activeTab === 'settings' && (
            <div className="flex flex-col gap-10 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold border-b pb-4">
                Seguridad de la Cuenta
              </h2>

              {/* Correo Actual (Solo lectura o cambio con verificación) */}
              <div className="flex flex-col gap-2">
                <label className="text-xl font-medium text-[#444444]">
                  Correo Electrónico Registrado
                </label>
                <input
                  type="email"
                  disabled
                  value={userData.email}
                  className="w-full bg-gray-100 border border-gray-300 rounded-xl p-4 text-lg text-gray-500 cursor-not-allowed"
                />
                <p className="text-sm text-gray-500">
                  Para cambiar tu correo electrónico registrado, contacta al soporte de administración.
                </p>
              </div>

              {/* Formulario de Cambio de Contraseña */}
              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="text-2xl font-bold text-[#1D1D1D]">Cambiar Contraseña</h3>

                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-[#444444]">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Escribe tu nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-[#444444]">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Vuelve a escribir la nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834]"
                  />
                </div>

                <button
                  type="submit"
                  className="self-end bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold text-lg py-3 px-8 rounded-full shadow transition-all"
                >
                  Actualizar Contraseña
                </button>
              </form>
            </div>
          )}

          {/* =========================================================
              PESTAÑA 3: MIS RECETAS ('recipes')
              ========================================================= */}
          {activeTab === 'recipes' && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Mis Recetas Publicadas
                </h2>
                <button
                  onClick={() => alert('Abriendo formulario para crear nueva receta...')}
                  className="bg-[#839958] hover:bg-[#72874b] text-white font-bold px-6 py-2.5 rounded-full text-lg shadow transition-colors"
                >
                  + Nueva Receta
                </button>
              </div>

              {MIS_RECETAS_MUESTRA.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200 p-8">
                  <p className="text-gray-500 text-xl mb-4">
                    Aún no has publicado ninguna receta en Ártemis.
                  </p>
                  <button
                    onClick={() => alert('Abriendo formulario para crear nueva receta...')}
                    className="bg-[#2E5834] text-white font-bold px-8 py-3 rounded-full text-lg"
                  >
                    Publicar Mi Primera Receta
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {MIS_RECETAS_MUESTRA.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      title={recipe.title}
                      author={recipe.author}
                      totalTime={recipe.totalTime}
                      reviewsCount={recipe.reviewsCount}
                      imageSrc={recipe.imageSrc}
                      ratingImgSrc={recipe.ratingImgSrc}
                      onCardClick={() => alert(`Abriendo tu receta: ${recipe.title}`)}
                      onSaveClick={() => console.log(`[LOG]: Receta propia seleccionada -> ${recipe.title}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}