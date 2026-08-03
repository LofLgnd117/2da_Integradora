import React, { useState } from 'react';

// Tipos de cocina en español acordes a los gustos y claridad para el usuario
const TIPOS_COCINA = [
  'Italiana',
  'Mexicana',
  'Hindú',
  'Asiática',
  'Mediterránea',
  'Americana',
  'Medio Oriente',
  'Africana',
  'Francesa'
];

export default function FilterSidebar({ selectedCuisines, onCuisineChange }) {
  // Estado para colapsar o expandir secciones de filtros (WCAG 2.1)
  const [openSection, setOpenSection] = useState('Tipo de Cocina');

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6 font-sans">
      <h2 className="text-[#1D1D1D] text-2xl font-bold tracking-wide">
        FILTRAR POR
      </h2>

      {/* Sección 1: Tipo de Cocina */}
      <div className="border-b border-gray-200 pb-6">
        <button
          type="button"
          onClick={() => toggleSection('Tipo de Cocina')}
          className="w-full flex justify-between items-center text-left py-2 font-bold text-xl text-[#1D1D1D] hover:text-[#2E5834] transition-colors"
        >
          <span>Tipo de Cocina</span>
          <span className="text-2xl">{openSection === 'Tipo de Cocina' ? '−' : '+'}</span>
        </button>

        {openSection === 'Tipo de Cocina' && (
          <div className="flex flex-col gap-3 mt-4 pl-1">
            {TIPOS_COCINA.map((cuisine) => {
              const isChecked = selectedCuisines.includes(cuisine);
              return (
                <label
                  key={cuisine}
                  className="flex items-center justify-between cursor-pointer group py-1 select-none"
                >
                  <span className="text-[#444444] group-hover:text-[#1D1D1D] text-lg">
                    {cuisine}
                  </span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onCuisineChange(cuisine)}
                    className="w-5 h-5 rounded border-gray-300 text-[#2E5834] focus:ring-[#2E5834] cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Secciones colapsables en español (Listas para expandirse y conectarse en Fase 3) */}
      {['Dieta y Restricciones', 'Tipo de Comida', 'Ingredientes', 'Tiempo de Cocción', 'Alergias'].map((filterName) => (
        <div key={filterName} className="border-b border-gray-200 pb-6">
          <button
            type="button"
            onClick={() => toggleSection(filterName)}
            className="w-full flex justify-between items-center text-left py-2 font-bold text-xl text-[#1D1D1D] hover:text-[#2E5834] transition-colors"
          >
            <span>{filterName}</span>
            <span className="text-2xl">{openSection === filterName ? '−' : '+'}</span>
          </button>
        </div>
      ))}
    </aside>
  );
}