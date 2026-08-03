import React from 'react';

export default function Navbar({ onLoginClick, onAddRecipeClick }) {
  return (
    <header className="w-full bg-[#839958] py-4 px-6 md:px-16 flex items-center justify-between shadow-md">
      {/* Sección Izquierda: Logo y Enlace a Recetas */}
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

      {/* Sección Derecha: Acciones principales */}
      <div className="flex items-center gap-6">
        <button
          onClick={onAddRecipeClick}
          className="text-[#1D1D1D] hover:text-white font-semibold text-lg transition-colors hidden sm:block"
        >
          + Subir Receta
        </button>
        
        <button
          onClick={onLoginClick}
          className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-medium text-lg py-2 px-6 rounded-full shadow transition-all transform active:scale-95"
        >
          Entrar / Registro
        </button>
      </div>
    </header>
  );
}