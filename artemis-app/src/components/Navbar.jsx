import React, { useState } from 'react';

export default function Navbar({
  isLoggedIn = true, // <-- Si está en true, muestra los iconos de usuario; si es false, muestra "Entrar / Registro"
  userName = 'Alina Cruz',
  onLoginClick,
  onAddRecipeClick,
  onProfileClick,
  onSavedRecipesClick,
  onLogoutClick,
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="w-full bg-[#839958] py-4 px-6 md:px-16 flex items-center justify-between shadow-md select-none">
      {/* Sección Izquierda: Logo y Enlace */}
      <div className="flex items-center gap-8">
        <div className="text-white font-black text-3xl tracking-wider cursor-pointer">
          ÁRTEMIS
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <button className="text-[#1D1D1D] hover:text-white font-semibold text-lg transition-colors">
            Recetas
          </button>
        </nav>
      </div>

      {/* Sección Derecha: Cambia dinámicamente si inició sesión o no */}
      <div className="flex items-center gap-6">
        <button
          onClick={onAddRecipeClick}
          className="text-[#1D1D1D] hover:text-white font-semibold text-lg transition-colors hidden sm:block"
        >
          + Subir Receta
        </button>

        {isLoggedIn ? (
          /* =========================================================
             VISTA USUARIO CONECTADO (Marcardor + Ícono de Perfil)
             ========================================================= */
          <div className="flex items-center gap-4 relative">
            {/* Botón: Recetas Guardadas (Marcador/Bookmark) */}
            <button
              onClick={onSavedRecipesClick}
              title="Mis Recetas Guardadas"
              className="p-2 text-[#1D1D1D] hover:text-white transition-colors"
              aria-label="Ver recetas guardadas"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* Botón: Perfil de Usuario con Menú Desplegable */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-[#2E5834] text-white px-3 py-1.5 rounded-full hover:bg-[#1f3d23] transition-colors shadow-sm"
              >
                {/* Ícono de Usuario simple */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-base hidden md:inline">{userName}</span>
                <span className="text-xs">▼</span>
              </button>

              {/* Menú flotante (WCAG 2.1 - Letra clara y buen contraste) */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 flex flex-col text-left">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Sesión iniciada como</p>
                    <p className="text-base font-bold text-[#1D1D1D] truncate">{userName}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      if (onProfileClick) onProfileClick();
                    }}
                    className="w-full text-left px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    👤 Mi Perfil y Cuenta
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      if (onSavedRecipesClick) onSavedRecipesClick();
                    }}
                    className="w-full text-left px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    🔖 Recetas Guardadas
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      if (onLogoutClick) onLogoutClick();
                    }}
                    className="w-full text-left px-4 py-3 text-lg font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* =========================================================
             VISTA INVITADO (Botón verde Entrar / Registro)
             ========================================================= */
          <button
            onClick={onLoginClick}
            className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-medium text-lg py-2 px-6 rounded-full shadow transition-all transform active:scale-95"
          >
            Entrar / Registro
          </button>
        )}
      </div>
    </header>
  );
}