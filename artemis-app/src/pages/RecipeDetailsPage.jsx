import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function RecipeDetailsPage() {
  const { id } = useParams(); // 1. Obtenemos el ID de la URL (/receta/1)
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Consultamos el endpoint de detalle en Node.js
  useEffect(() => {
    fetch(`http://localhost:5000/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecipe(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('[ERROR - DETALLE RECETA]:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <p className="text-xl font-bold text-[#2E5834]">Cargando receta...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-600">No encontramos esta receta.</p>
        <button onClick={() => navigate('/')} className="bg-[#2E5834] text-white px-6 py-2 rounded-full font-bold">
          Volver a Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      <Navbar />

      {/* Contenido Principal de la Receta */}
      <main className="max-w-5xl mx-auto w-full px-6 py-12">
        {/* Categoría y Título */}
        <span className="bg-[#839958]/20 text-[#2E5834] font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wide">
          {recipe.category || 'Comidas y Platillos'}
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-[#1D1D1D] mt-4 mb-4">
          {recipe.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">{recipe.description}</p>

        {/* Imagen Principal */}
        <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-lg mb-10">
          <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
        </div>

        {/* Barra de Información Rápida */}
        <div className="flex flex-wrap gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12">
          <div>
            <p className="text-sm text-gray-400 font-semibold uppercase">Tiempo Total</p>
            <p className="text-xl font-bold text-[#1D1D1D]">{recipe.total_time_minutes} minutos</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 font-semibold uppercase">Porciones</p>
            <p className="text-xl font-bold text-[#1D1D1D]">{recipe.servings} personas</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 font-semibold uppercase">Autor</p>
            <p className="text-xl font-bold text-[#2E5834]">{recipe.author}</p>
          </div>
        </div>

        {/* Lista de Ingredientes desde PostgreSQL */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1D1D1D] mb-6">Ingredientes</h2>
          <ul className="space-y-4">
            {recipe.ingredients && recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-center gap-3 text-lg text-gray-700 border-b border-gray-100 pb-3">
                <span className="w-3 h-3 rounded-full bg-[#839958] inline-block shrink-0"></span>
                <span className="font-bold text-[#1D1D1D]">{ing.quantity} {ing.unit}</span>
                <span>de {ing.name}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}