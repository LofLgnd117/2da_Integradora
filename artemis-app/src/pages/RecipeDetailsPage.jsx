import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <p className="text-xl font-bold text-[#2E5834]">Cargando platillo...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-gray-700">No encontramos esta receta.</p>
        <button onClick={() => navigate('/')} className="bg-[#2E5834] text-white px-8 py-3 rounded-full font-bold">
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Pasos de muestra por si la receta nueva aún no tiene tabla de instrucciones conectada
  const defaultSteps = [
    'Prepara tu espacio de trabajo lavando y cortando todos los ingredientes frescos según las medidas indicadas.',
    'Calienta un sartén grande o wok a fuego medio-alto con un chorrito de aceite de tu preferencia.',
    'Agrega los ingredientes principales y cocina mezclando constantemente para integrar todos los sabores del sazón.',
    'Sirve caliente de inmediato y decora con un toque final fresco para presentar en la mesa.'
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-6 py-12">
        {/* Etiqueta de Categoría y Cabecera */}
        <div className="mb-6">
          <span className="bg-[#839958]/20 text-[#2E5834] font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
            {recipe.category || 'Comidas y Platillos'}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#1D1D1D] mt-4 mb-4 leading-tight">
            {recipe.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
            {recipe.description || 'Una receta clásica y reconfortante preparada con cariño para toda la mesa.'}
          </p>
        </div>

        {/* Imagen Principal Hero */}
        <div className="w-full h-[420px] md:h-[500px] rounded-[32px] overflow-hidden shadow-md mb-10 bg-gray-100">
          <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
        </div>

        {/* Barra de Datos Rápidos (Figma Style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-12">
          <div className="p-3">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tiempo Total</p>
            <p className="text-2xl font-black text-[#1D1D1D]">{recipe.total_time_minutes} min</p>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Porciones</p>
            <p className="text-2xl font-black text-[#1D1D1D]">{recipe.servings} personas</p>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Dificultad</p>
            <p className="text-2xl font-black text-[#2E5834]">Fácil</p>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Autor</p>
            <p className="text-xl font-bold text-[#2E5834] truncate">{recipe.author || 'Alina Cruz'}</p>
          </div>
        </div>

        {/* CUERPO PRINCIPAL: INGREDIENTES E INSTRUCCIONES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
          {/* Columna Izquierda (1/3): Ingredientes */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-2xl font-black text-[#1D1D1D] mb-6">Ingredientes</h2>
              <ul className="space-y-4">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-3 border-b border-gray-100 pb-3">
                      <span className="w-5 h-5 rounded-md border-2 border-[#839958] flex items-center justify-center mt-0.5 shrink-0 text-white text-xs bg-[#839958]">
                        ✓
                      </span>
                      <span className="text-gray-800 text-lg leading-snug">
                        <strong className="font-bold text-[#1D1D1D]">{ing.quantity} {ing.unit}</strong> de {ing.name}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">Consulta las cantidades en la descripción de la receta.</p>
                )}
              </ul>
            </div>
          </div>

          {/* Columna Derecha (2/3): Instrucciones y Tips */}
          <div className="lg:col-span-2 space-y-10">
            {/* Instrucciones */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-[#1D1D1D] mb-8">Instrucciones de Preparación</h2>
              <div className="space-y-8">
                {defaultSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full bg-[#2E5834] text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">Paso {idx + 1}</h4>
                      <p className="text-gray-600 text-lg leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recuadro Consejos del Chef (Figma UI) */}
            <div className="bg-[#839958]/15 border border-[#839958]/30 p-8 rounded-[32px]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💡</span>
                <h3 className="text-xl font-bold text-[#2E5834]">Consejos del Chef</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Para obtener un sabor aún más intenso, puedes marinar los ingredientes durante 15 minutos en el refrigerador antes de llevarlos al sartén caliente.
              </p>
            </div>
          </div>
        </div>

        {/* MAQUETA VISUAL FIGMA: TABLA NUTRICIONAL Y RESEÑAS (PARA DEMO DE PRESENTACIÓN) */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-black text-[#1D1D1D] mb-6">Información Nutricional (Por porción)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-400 font-bold text-sm">Calorías</p>
              <p className="text-3xl font-black text-[#1D1D1D] mt-1">320 kcal</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-400 font-bold text-sm">Proteínas</p>
              <p className="text-3xl font-black text-[#1D1D1D] mt-1">24 g</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-400 font-bold text-sm">Carbohidratos</p>
              <p className="text-3xl font-black text-[#1D1D1D] mt-1">18 g</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-400 font-bold text-sm">Grasas Saludables</p>
              <p className="text-3xl font-black text-[#1D1D1D] mt-1">12 g</p>
            </div>
          </div>

          {/* Reseñas de la comunidad (Visual Demo) */}
          <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-black text-[#1D1D1D] mb-6">Reseñas de la Comunidad (12)</h3>
            <div className="border-b border-gray-100 pb-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#839958] text-white font-bold flex items-center justify-center">
                  M
                </div>
                <div>
                  <p className="font-bold text-[#1D1D1D]">Martha Gómez</p>
                  <p className="text-xs text-gray-400">Hace 2 días</p>
                </div>
              </div>
              <p className="text-gray-600 text-lg">
                "¡Excelente receta! Muy fácil de seguir y el sabor quedó maravilloso. A toda mi familia le encantó."
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={() => alert('¡Función de comentarios en vivo disponible en Fase 2!')}
                className="bg-[#2E5834] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1f3d23] transition-colors"
              >
                Escribir una reseña
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}