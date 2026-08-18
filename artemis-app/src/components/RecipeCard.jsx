import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';
import CustomModal from './CustomModal';

export default function RecipeCard({
  id,
  title,
  author = 'Alina Cruz',
  totalTime,
  reviewsCount = 12,
  imageSrc
}) {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  // Estado para cambiar visualmente el icono cuando el usuario lo guarda
  const [isSaved, setIsSaved] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

  // Función para guardar directamente desde la tarjeta
  const handleBookmarkClick = async (e) => {
    //EVITAMOS QUE AL DAR CLIC EN EL ICONO SE ABRA LA RECETA
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      setModal({
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
        body: JSON.stringify({ recipeId: id })
      });
      const data = await res.json();

      if (data.success) {
        setIsSaved(true);
        setModal({ isOpen: true, title: '¡Receta Guardada!', message: `🌟 "${title}" se guardó en tus favoritas.` });
      } else {
        setModal({ isOpen: true, title: 'No se pudo guardar', message: data.message || 'Ocurrió un error al guardar la receta.' });
      }
    } catch (err) {
      console.error('Error al guardar desde la tarjeta:', err);
      setModal({ isOpen: true, title: 'Sin conexión', message: 'No se pudo conectar con el servidor. Intenta de nuevo.' });
    }
  };

  return (
    <>
    <div
      onClick={() => navigate(`/receta/${id}`)}
      className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col group"
    >
      {/* Contenedor de la Imagen con Botón de Guardado */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* BOTÓN DE MARCADOR (BOOKMARK) CLICLEABLE */}
        <button
          onClick={handleBookmarkClick}
          title="Guardar receta"
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
            isSaved
              ? 'bg-[#2E5834] text-white scale-110'
              : 'bg-white/90 hover:bg-white text-gray-700 hover:text-[#2E5834]'
          }`}
        >
          {isSaved ? (
            // Icono relleno cuando ya se guardó
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
          ) : (
            // Icono de contorno normal
            <svg
              className="w-5 h-5 stroke-current fill-none"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Datos del Platillo */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-lg text-[#1D1D1D] line-clamp-1 group-hover:text-[#2E5834] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Por <span className="font-semibold text-gray-700">{author}</span>
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1 font-medium">
            ⏱️ {totalTime}
          </span>
          <span className="text-[#2E5834] font-bold text-xs bg-[#839958]/15 px-2.5 py-1 rounded-full">
            ★ {reviewsCount} reseñas
          </span>
        </div>
      </div>
    </div>

    <CustomModal
      isOpen={modal.isOpen}
      onClose={() => setModal({ isOpen: false, title: '', message: '' })}
      title={modal.title}
      message={modal.message}
      showCancel={false}
      confirmText="Entendido"
    />
    </>
  );
}