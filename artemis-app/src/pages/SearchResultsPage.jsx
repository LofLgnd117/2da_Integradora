import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import FilterSidebar from '../components/FilterSidebar';

// Arreglo de muestra en español (En la Fase 3, llegará de tu API en Node.js)
const SAMPLE_SEARCH_RECIPES = [
  {
    id: 101,
    title: 'Pollo Makhani (Pollo a la Mantequilla)',
    author: 'Tarla Dalal',
    totalTime: '35 min',
    reviewsCount: 42,
    cuisine: 'Hindú',
    imageSrc: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/gwwk5kdk_expires_30_days.png',
  },
  {
    id: 102,
    title: 'Pollo Teriyaki al Horno',
    author: 'Lisa Nguyen',
    totalTime: '1 h 5 min',
    reviewsCount: 38,
    cuisine: 'Asiática',
    imageSrc: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/a136s78n_expires_30_days.png',
  },
  {
    id: 103,
    title: 'Chili Blanco de Pollo Fácil',
    author: 'Ephesis',
    totalTime: '50 min',
    reviewsCount: 33,
    cuisine: 'Mexicana',
    imageSrc: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/474b0rm8_expires_30_days.png',
  },
  {
    id: 104,
    title: 'Espagueti con Pollo',
    author: 'Ree Drummond',
    totalTime: '1 h 40 min',
    reviewsCount: 27,
    cuisine: 'Italiana',
    imageSrc: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/stjtsly8_expires_30_days.png',
  },
  {
    id: 105,
    title: 'Pollo Frito Estilo Coreano',
    author: 'Jeong Kwan',
    totalTime: '40 min',
    reviewsCount: 44,
    cuisine: 'Asiática',
    imageSrc: 'https://images.unsplash.com/photo-1527477247444-e7951d3e686b?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/0mt9s7x1_expires_30_days.png',
  },
  {
    id: 106,
    title: 'Pollo a la Parmesana',
    author: 'John Mitzewich',
    totalTime: '45 min',
    reviewsCount: 35,
    cuisine: 'Italiana',
    imageSrc: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/zl4ktma5_expires_30_days.png',
  },
];

export default function SearchResultsPage({ onOpenLogin }) {
  const [searchTerm, setSearchTerm] = useState('Pollo');
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [sortBy, setSortBy] = useState('Relevancia');

  // Función para marcar/desmarcar casillas de tipo de cocina
  const handleCuisineToggle = (cuisine) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  // Filtrado dinámico en tiempo real
  const filteredRecipes = useMemo(() => {
    return SAMPLE_SEARCH_RECIPES.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesCuisine =
        selectedCuisines.length === 0 ||
        selectedCuisines.includes(recipe.cuisine);

      return matchesSearch && matchesCuisine;
    });
  }, [searchTerm, selectedCuisines]);

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      {/* 1. Navegación Superior Reutilizada */}
      <Navbar
        onLoginClick={onOpenLogin}
        onAddRecipeClick={() => alert('Abriendo formulario para agregar receta...')}
      />

      {/* 2. Sub-menú superior en español */}
      <div className="bg-white border-b border-gray-200 py-3 px-6 shadow-sm flex justify-center gap-8 md:gap-16 text-lg font-medium text-[#1D1D1D]">
        <button className="hover:text-[#2E5834] transition-colors">Populares</button>
        <button className="hover:text-[#2E5834] transition-colors">Comidas y Platillos</button>
        <button className="hover:text-[#2E5834] transition-colors">Dietas</button>
        <button className="hover:text-[#2E5834] transition-colors">Ocasiones</button>
      </div>

      {/* 3. Encabezado Verde Oscuro de Búsqueda y Migas de Pan (Breadcrumbs) */}
      <header className="bg-[#0A3323] py-8 px-6 flex flex-col items-center">
        <div className="w-full max-w-7xl flex items-center gap-2 text-[#F0F0F0] text-base mb-6">
          <span className="hover:underline cursor-pointer">Inicio</span>
          <span>&rsaquo;</span>
          <span className="font-semibold">Buscar</span>
        </div>

        {/* Buscador grande con botón de limpiar (WCAG 2.1 - Fácil lectura) */}
        <div className="w-full max-w-3xl bg-white rounded-full flex items-center px-6 py-3 shadow-lg">
          <svg className="w-6 h-6 text-gray-400 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar recetas, ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-[#1D1D1D] text-xl bg-transparent focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-gray-600 font-bold p-1"
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* 4. Barra de ordenamiento (Sort by) */}
      <div className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-gray-200">
        <span className="text-gray-500 text-lg">
          Mostrando <strong className="text-[#1D1D1D]">{filteredRecipes.length}</strong> resultados
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[#444444] text-lg font-medium">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg py-2 px-4 text-lg font-bold text-[#1D1D1D] focus:outline-none focus:border-[#2E5834] cursor-pointer"
          >
            <option value="Relevancia">Relevancia</option>
            <option value="Más recientes">Más recientes</option>
            <option value="Popularidad">Popularidad</option>
          </select>
        </div>
      </div>

      {/* 5. Cuerpo Principal: Sidebar Izquierdo + Cuadrícula de Recetas */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-12 items-start">
        {/* Barra Lateral de Filtros */}
        <FilterSidebar
          selectedCuisines={selectedCuisines}
          onCuisineChange={handleCuisineToggle}
        />

        {/* Cuadrícula de Resultados Reutilizando RecipeCard.jsx */}
        <section className="flex-1 w-full">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-[#1D1D1D] mb-2">No se encontraron recetas</h3>
              <p className="text-gray-500 text-lg">
                No encontramos ninguna receta que coincida con tu búsqueda o los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  title={recipe.title}
                  author={recipe.author}
                  totalTime={recipe.totalTime}
                  reviewsCount={recipe.reviewsCount}
                  imageSrc={recipe.imageSrc}
                  ratingImgSrc={recipe.ratingImgSrc}
                  onCardClick={() => console.log(`[LOG]: Clic en resultado -> ${recipe.title}`)}
                  onSaveClick={() => console.log(`[LOG]: Receta guardada -> ${recipe.title}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}