import React, { useState } from 'react';

// Importación de todas las páginas de la Fase 1
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import AddRecipePage from './pages/AddRecipePage';
import ProfilePage from './pages/ProfilePage';
import SavedRecipesPage from './pages/SavedRecipesPage';

export default function App() {
  // 1. Estado principal de navegación ('home' | 'search' | 'detail' | 'add' | 'profile' | 'saved')
  const [currentView, setCurrentView] = useState('home');

  // 2. Estado para controlar si el usuario está conectado en el prototipo
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 3. Función para cambiar de vista registrando el cambio en consola (Útil para tu reporte LFPDPPP/UX)
  const handleNavigate = (viewName) => {
    console.log(`[LOG - NAVEGACIÓN]: Cambiando a la vista -> "${viewName}"`);
    setCurrentView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al inicio de la página automáticamente
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] relative font-sans">
      
      {/* =========================================================
          RENDERIZADO CONDICIONAL DE PÁGINAS (Enrutador simple)
          ========================================================= */}
      {currentView === 'home' && (
        <HomePage
          onOpenLogin={() => alert('Abriendo modal de Login...')}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'search' && (
        <SearchResultsPage
          onOpenLogin={() => alert('Abriendo modal de Login...')}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'detail' && (
        <RecipeDetailsPage
          onOpenLogin={() => alert('Abriendo modal de Login...')}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'add' && (
        <AddRecipePage
          onOpenLogin={() => alert('Abriendo modal de Login...')}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'profile' && (
        <ProfilePage
          onOpenLogin={() => alert('Abriendo modal de Login...')}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'saved' && (
        <SavedRecipesPage
          onOpenLogin={() => alert('Abriendo modal de Login...')}
          onNavigate={handleNavigate}
        />
      )}

      {/* =========================================================
          BARRA FLOTANTE DE CONTROL UX (Solo para el evaluador)
          Esta barra te permite saltar entre pantallas en vivo.
          ========================================================= */}
      <div className="fixed bottom-4 right-4 z-50 bg-[#1D1D1D]/90 backdrop-blur-md text-white p-2.5 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-1.5 text-xs select-none">
        <span className="font-bold text-[#839958] px-2 uppercase tracking-wider hidden sm:inline">
          Modo Pruebas:
        </span>

        <button
          onClick={() => handleNavigate('home')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            currentView === 'home'
              ? 'bg-[#2E5834] text-white'
              : 'hover:bg-gray-800 text-gray-300'
          }`}
        >
          Inicio
        </button>

        <button
          onClick={() => handleNavigate('search')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            currentView === 'search'
              ? 'bg-[#2E5834] text-white'
              : 'hover:bg-gray-800 text-gray-300'
          }`}
        >
          Buscar
        </button>

        <button
          onClick={() => handleNavigate('detail')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            currentView === 'detail'
              ? 'bg-[#2E5834] text-white'
              : 'hover:bg-gray-800 text-gray-300'
          }`}
        >
          Detalle
        </button>

        <button
          onClick={() => handleNavigate('add')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            currentView === 'add'
              ? 'bg-[#2E5834] text-white'
              : 'hover:bg-gray-800 text-gray-300'
          }`}
        >
          + Subir
        </button>

        <button
          onClick={() => handleNavigate('profile')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            currentView === 'profile'
              ? 'bg-[#2E5834] text-white'
              : 'hover:bg-gray-800 text-gray-300'
          }`}
        >
          Perfil
        </button>

        <button
          onClick={() => handleNavigate('saved')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            currentView === 'saved'
              ? 'bg-[#2E5834] text-white'
              : 'hover:bg-gray-800 text-gray-300'
          }`}
        >
          Recetarios
        </button>
      </div>

    </div>
  );
}