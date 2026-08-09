import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Leemos qué categoría o búsqueda viene en la URL
  const categoriaSeleccionada = searchParams.get('categoria') || '';
  const textoBusqueda = searchParams.get('buscar') || '';
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Consultamos al backend cada vez que cambie la URL
  useEffect(() => {
    setLoading(true);
    // Construimos la URL con los filtros
    let url = 'http://localhost:5000/api/recipes?';
    if (categoriaSeleccionada) url += `categoria=${encodeURIComponent(categoriaSeleccionada)}&`;
    if (textoBusqueda) url += `buscar=${encodeURIComponent(textoBusqueda)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecipes(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('[ERROR - BUSCADOR]:', err);
        setLoading(false);
      });
  }, [categoriaSeleccionada, textoBusqueda]);

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1">
        {/* Encabezado del Buscador */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#1D1D1D]">
              {categoriaSeleccionada 
                ? `Categoría: ${categoriaSeleccionada}` 
                : textoBusqueda 
                ? `Resultados para: "${textoBusqueda}"` 
                : 'Todas las Recetas'}
            </h1>
            <p className="text-gray-500 text-lg mt-1">
              {loading ? 'Buscando platillos...' : `Encontramos ${recipes.length} receta(s)`}
            </p>
          </div>

          {/* Botón para limpiar filtros y ver todo */}
          {(categoriaSeleccionada || textoBusqueda) && (
            <button
              onClick={() => navigate('/buscar')}
              className="self-start md:self-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-5 py-2 rounded-full text-sm transition-colors"
            >
              ✕ Limpiar filtro
            </button>
          )}
        </div>

        {/* Cuadrícula de Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <p className="text-xl font-bold text-[#2E5834] col-span-full text-center py-12">
              Filtrando recetas en la cocina...
            </p>
          ) : recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                author={recipe.author || 'Alina Cruz'}
                totalTime={`${recipe.total_time_minutes} min`}
                reviewsCount={12}
                imageSrc={recipe.image_url}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <p className="text-2xl font-bold text-gray-700 mb-2">No encontramos recetas con ese filtro</p>
              <p className="text-gray-500 mb-6">Intenta seleccionar otra categoría o buscar con otras palabras.</p>
              <button
                onClick={() => navigate('/buscar')}
                className="bg-[#2E5834] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1f3d23] transition-colors"
              >
                Ver Todas las Recetas
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}