import React from 'react';

export default function RecipeCard({
  title,
  author,
  totalTime,
  reviewsCount,
  imageSrc,
  ratingImgSrc,
  onSaveClick,
  onCardClick,
}) {
  return (
    <div 
      onClick={onCardClick}
      className="flex flex-col gap-2.5 cursor-pointer group transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Contenedor de Imagen con Botón de Guardar (Bookmark) */}
      <div
        className="flex flex-col items-end self-stretch pt-3.5 pr-3.5 h-[280px] rounded-2xl bg-cover bg-center relative overflow-hidden shadow-sm"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(29,29,29,0.4) 0%, rgba(29,29,29,0) 30%), url(${imageSrc})`,
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Evita que el clic en guardar abra la receta
            if (onSaveClick) onSaveClick();
          }}
          className="p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-md"
          aria-label="Guardar receta en tablero"
        >
          {/* Ícono de marcador en SVG limpio (reemplaza la imagen caducable del bookmark) */}
          <svg className="w-6 h-6 text-[#1D1D1D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Detalle de la Receta */}
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-[#1D1D1D] text-2xl font-bold line-clamp-1 group-hover:text-[#2E5834] transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 text-base">
          <span className="text-[#1D1D1D]">By</span>
          <span className="text-[#C57D5D] font-medium">{author}</span>
        </div>

        <span className="text-[#1D1D1D] text-base font-medium">
          Total time: {totalTime}
        </span>

        <div className="flex items-center gap-2 mt-1">
          {/* Estrellas de calificación */}
          <img src={ratingImgSrc} alt="Calificación" className="h-5 object-contain" />
          <span className="text-[#1D1D1D] text-base font-semibold">
            ({reviewsCount})
          </span>
        </div>
      </div>
    </div>
  );
}