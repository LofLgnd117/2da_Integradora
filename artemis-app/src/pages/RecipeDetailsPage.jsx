import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CustomModal from '../components/CustomModal';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalNotice, setModalNotice] = useState({ isOpen: false, title: '', message: '' });
  const [isLiking, setIsLiking] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchRecipe = () => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_URL}/api/recipes/${id}`, { headers })
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
  };

  useEffect(() => {
    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      setModalNotice({
        isOpen: true,
        title: 'Inicia sesión primero',
        message: 'Necesitas iniciar sesión para darle "Me gusta" a una receta.'
      });
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    const previous = { likedByMe: recipe.likedByMe, likesCount: recipe.likesCount };
    setRecipe((prev) => ({
      ...prev,
      likedByMe: !prev.likedByMe,
      likesCount: prev.likedByMe ? prev.likesCount - 1 : prev.likesCount + 1
    }));
    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRecipe((prev) => ({ ...prev, likedByMe: data.liked, likesCount: data.likesCount }));
      } else {
        setRecipe((prev) => ({ ...prev, ...previous }));
      }
    } catch (err) {
      console.error('Error al actualizar "Me gusta":', err);
      setRecipe((prev) => ({ ...prev, ...previous }));
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setModalNotice({
        isOpen: true,
        title: 'Inicia sesión primero',
        message: 'Necesitas iniciar sesión para escribir una reseña.'
      });
      return;
    }
    if (!reviewText.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ comment: reviewText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setRecipe((prev) => ({ ...prev, reviews: [data.review, ...(prev.reviews || [])] }));
        setReviewText('');
      } else {
        setModalNotice({ isOpen: true, title: 'No se pudo publicar', message: data.message || 'Ocurrió un error al publicar tu reseña.' });
      }
    } catch (err) {
      console.error('Error al publicar reseña:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // FUNCIÓN PARA GUARDAR EN FAVORITOS NO MOVER
 const handleSaveRecipe = async () => {
  if (!isAuthenticated) {
    setModalNotice({
      isOpen: true,
      title: 'Inicia sesión primero',
      message: 'Necesitas iniciar sesión para guardar recetas en tu colección de favoritas.'
    });
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/recipes/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ recipeId: recipe.id })
    });
    const data = await res.json();
    if (data.success) {
      setModalNotice({
        isOpen: true,
        title: '¡Receta Guardada!',
        message: `"${recipe.title}" ha sido agregada a tu colección en Recetas Guardadas.`
      });
    } else {
      setModalNotice({
        isOpen: true,
        title: 'No se pudo guardar',
        message: data.message || 'Ocurrió un error al guardar la receta.'
      });
    }
  } catch (err) {
    console.error('Error al guardar:', err);
  }
};

// Esta función ejecuta el borrado real al confirmar en el modal
const executeDelete = async () => {
  try {
    const res = await fetch(`${API_URL}/api/recipes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      navigate('/perfil');
    } else {
      setShowDeleteModal(false);
      setModalNotice({
        isOpen: true,
        title: 'No se pudo eliminar',
        message: data.message || 'Ocurrió un error al eliminar la receta.'
      });
    }
  } catch (err) {
    console.error('Error al eliminar:', err);
  }
};

  // El botón de eliminar solo tiene sentido si el usuario logueado es el dueño de la receta
  const isOwner = isAuthenticated && recipe && user && recipe.user_id === user.id;

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

  const defaultSteps = [
    'Prepara tu espacio de trabajo lavando y cortando todos los ingredientes frescos según las medidas indicadas.',
    'Calienta un sartén grande o wok a fuego medio-alto con un chorrito de aceite de tu preferencia.',
    'Agrega los ingredientes principales y cocina mezclando constantemente para integrar todos los sabores del sazón.',
    'Sirve caliente de inmediato y decora con un toque final fresco para presentar en la mesa.'
  ];

  const displaySteps = recipe.steps && recipe.steps.length > 0
    ? recipe.steps.map((s) => s.instruction_text)
    : defaultSteps;

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

            {/* --- BOTONES DE ACCIÓN: GUARDAR (IZQUIERDA) Y ELIMINAR (DERECHA SEPARADO) --- */}
            <div className="mt-8 pt-6 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSaveRecipe}
                  className="bg-[#839958]/20 hover:bg-[#839958]/30 text-[#2E5834] font-bold px-6 py-3 rounded-full text-base flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <span>🔖</span> Guardar en mi colección
                </button>

                <button
                  onClick={handleToggleLike}
                  disabled={isLiking}
                  className={`font-bold px-6 py-3 rounded-full text-base flex items-center gap-2 transition-colors shadow-sm cursor-pointer ${
                    recipe.likedByMe
                      ? 'bg-[#2E5834] text-white hover:bg-[#1f3d23]'
                      : 'bg-[#839958]/20 hover:bg-[#839958]/30 text-[#2E5834]'
                  }`}
                >
                  <span>{recipe.likedByMe ? '❤️' : '🤍'}</span> {recipe.likesCount}
                </button>
              </div>

            {/* BOTÓN ELIMINAR: solo visible si el usuario logueado es el dueño de la receta */}
              {isOwner && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-6 py-3 rounded-full text-base flex items-center gap-2 transition-colors shadow-sm cursor-pointer ml-auto"
                >
                  <span>🗑️</span> Eliminar receta
                </button>
              )}
            </div>
        </div>

        {/* Imagen Principal Hero */}
        <div className="w-full h-[420px] md:h-[500px] rounded-[32px] overflow-hidden shadow-md mb-10 bg-gray-100">
          <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
        </div>

        {/* Barra de Datos Rápidos */}
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
            <p className="text-2xl font-black text-[#2E5834]">{recipe.difficulty || 'Fácil'}</p>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Autor</p>
            <p className="text-xl font-bold text-[#2E5834] truncate">{recipe.author || 'Alina Cruz'}</p>
          </div>
        </div>

        {/* CUERPO PRINCIPAL (INGREDIENTES E INSTRUCCIONES) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
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

          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-[#1D1D1D] mb-8">Instrucciones de Preparación</h2>
              <div className="space-y-8">
                {displaySteps.map((step, idx) => (
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

            <div className="bg-[#839958]/15 border border-[#839958]/30 p-8 rounded-[32px]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💡</span>
                <h3 className="text-xl font-bold text-[#2E5834]">Consejos del Chef</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {recipe.chef_tips || 'Para obtener un sabor aún más intenso, puedes marinar los ingredientes durante 15 minutos en el refrigerador antes de llevarlos al sartén caliente.'}
              </p>
            </div>
          </div>
        </div>

        {/* RESEÑAS */}
        <section className="border-t border-gray-200 pt-12">
          <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-black text-[#1D1D1D] mb-6">
              Reseñas de la Comunidad ({recipe.reviews ? recipe.reviews.length : 0})
            </h3>

            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview} className="mb-8">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Cuéntale a la comunidad qué te pareció esta receta..."
                  rows="3"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#2E5834] text-base bg-[#FBFBFB] mb-3"
                ></textarea>
                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewText.trim()}
                  className="bg-[#2E5834] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1f3d23] transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Publicando...' : 'Publicar reseña'}
                </button>
              </form>
            ) : (
              <p className="text-gray-500 mb-8">Inicia sesión para escribir una reseña.</p>
            )}

            {recipe.reviews && recipe.reviews.length > 0 ? (
              <div className="space-y-6">
                {recipe.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#839958] text-white font-bold flex items-center justify-center">
                        {review.author?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-[#1D1D1D]">{review.author}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg">{review.comment_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">Aún no hay reseñas. ¡Sé el primero en escribir una!</p>
            )}
          </div>
        </section>
        {/* MODAL DE CONFIRMACIÓN DE ELIMINADO */}
        <CustomModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={executeDelete}
          title="¿Eliminar esta receta?"
          message={`¿Estás seguro de que deseas eliminar "${recipe.title}"? Todos los datos de esta receta se borrarán permanentemente de Ártemis.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          isDestructive={true}
        />

        {/* MODAL DE AVISO (ÉXITO AL GUARDAR EN FAVORITOS) */}
        <CustomModal
          isOpen={modalNotice.isOpen}
          onClose={() => setModalNotice({ isOpen: false, title: '', message: '' })}
          title={modalNotice.title}
          message={modalNotice.message}
          showCancel={false}
          confirmText="Entendido"
        />
      </main>
    </div>
  );
}