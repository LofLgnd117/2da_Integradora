import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';

export default function SavedRecipesPage() {
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Consultamos al backend las recetas guardadas del usuario 1 (Alina Cruz)
  useEffect(() => {
    fetch('http://localhost:5000/api/recipes/saved/1')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSavedRecipes(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('[ERROR - RECETAS GUARDADAS]:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1">
        {/* Cabecera de la sección */}
        <div className="border-b border-gray-200 pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="bg-[#839958]/20 text-[#2E5834] font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
              Mi Colección
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#1D1D1D] mt-3">
              Recetas Guardadas
            </h1>
            <p className="text-gray-500 text-lg mt-2">
              Tu recetario personal con los platillos que más te han inspirado.
            </p>
          </div>

          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-200 shadow-sm self-start md:self-auto">
            <span className="text-gray-400 font-bold text-sm uppercase block">Total en favoritos</span>
            <span className="text-2xl font-black text-[#2E5834]">
              {loading ? '...' : `${savedRecipes.length} platillos`}
            </span>
          </div>
        </div>

        {/* Cuadrícula de Recetas Guardadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <p className="text-xl font-bold text-[#2E5834] col-span-full text-center py-16">
              Abriendo tu recetario personal...
            </p>
          ) : savedRecipes.length > 0 ? (
            savedRecipes.map((recipe) => (
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
            <div className="col-span-full text-center py-20 bg-white rounded-[32px] border border-gray-100 p-10 shadow-sm">
              <div className="w-20 h-20 bg-[#839958]/20 text-[#2E5834] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 font-bold">
                📖
              </div>
              <h3 className="text-2xl font-black text-[#1D1D1D] mb-2">
                Aún no tienes recetas guardadas
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                Explora nuestro catálogo y guarda tus platillos favoritos para tenerlos siempre a la mano cuando cocines.
              </p>
              <button
                onClick={() => navigate('/buscar')}
                className="bg-[#2E5834] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1f3d23] transition-colors shadow-md"
              >
                Explorar Recetas Ahora
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}