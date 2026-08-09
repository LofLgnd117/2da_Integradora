import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/recipes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecipes(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('[ERROR - API]:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      <Navbar />

      {/* Sub-menú de Categorías */}
      <div className="bg-white border-b border-gray-200 py-3 px-6 shadow-sm flex justify-center gap-8 md:gap-16 text-lg font-medium text-[#1D1D1D]">
        <button onClick={() => navigate('/buscar?categoria=Populares')} className="hover:text-[#2E5834] transition-colors">Populares</button>
        <button onClick={() => navigate('/buscar?categoria=Comidas y Platillos')} className="hover:text-[#2E5834] transition-colors">Comidas y Platillos</button>
        <button onClick={() => navigate('/buscar?categoria=Dietas')} className="hover:text-[#2E5834] transition-colors">Dietas</button>
        <button onClick={() => navigate('/buscar?categoria=Ocasiones')} className="hover:text-[#2E5834] transition-colors">Ocasiones</button>
      </div>

      {/* Hero Section con Formulario de Búsqueda */}
      <section className="bg-[#1D1D1D] py-24 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold max-w-2xl leading-tight mb-10">
          ¡Alimenta tu cuerpo y corazón - <br />
          encuentra recetas que saben delicioso!
        </h1>

        {/* FORMULARIO DE BÚSQUEDA BLINDADO */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim() !== '') {
              navigate(`/buscar?buscar=${encodeURIComponent(searchQuery.trim())}`);
            } else {
              navigate('/buscar');
            }
          }} 
          className="w-full max-w-3xl bg-white rounded-full flex items-center px-3 py-2 shadow-lg"
        >
          <svg className="w-6 h-6 text-gray-400 ml-3 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            type="text"
            placeholder="Buscar por platillo, ingrediente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-[#1D1D1D] placeholder-gray-400 text-lg md:text-xl bg-transparent focus:outline-none"
          />
          
          <button
            type="submit"
            className="bg-[#2E5834] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1f3d23] transition-colors ml-4 shadow-sm shrink-0 cursor-pointer"
          >
            Buscar
          </button>
        </form>
      </section>

      {/* Sección: Comidas Fáciles y Rápidas */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-[#1D1D1D] text-3xl md:text-4xl font-bold mb-2">Comidas Fáciles y Rápidas</h2>
            <p className="text-[#444444] text-lg max-w-2xl">
              ¡Satisface tu antojo en un instante! Explora nuestras recetas sencillas y prácticas sin perder ese sabor casero delicioso.
            </p>
          </div>
          <button onClick={() => navigate('/buscar')} className="text-[#1D1D1D] font-bold text-base hover:text-[#2E5834] flex items-center gap-2 shrink-0">
            VER TODAS LAS RECETAS &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {loading ? (
            <p className="text-[#444444] text-lg col-span-full text-center py-8 font-semibold">Cargando recetas deliciosas...</p>
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
            <p className="text-gray-500 col-span-full text-center py-8">Aún no hay recetas registradas.</p>
          )}
        </div>
      </section>
    </div>
  );
}