import React from 'react';

export default function CustomModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  isDestructive = false,
  showCancel = true
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Caja del Modal Estilo Figma */}
      <div className="bg-white rounded-[32px] max-w-lg w-full p-8 md:p-10 shadow-2xl border border-gray-100 relative">
        {/* Botón Cerrar (X) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 font-bold text-2xl transition-colors"
        >
          ✕
        </button>

        {/* Título */}
        <h3 className="text-3xl font-black text-[#1D1D1D] mb-4 pr-6">
          {title}
        </h3>

        {/* Mensaje */}
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          {message}
        </p>

        {/* Botones de Acción Estilo Figma */}
        <div className="flex items-center justify-between gap-4">
          {showCancel ? (
            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-full border-2 border-[#2E5834] text-[#2E5834] font-bold text-lg hover:bg-[#839958]/10 transition-colors"
            >
              {cancelText}
            </button>
          ) : (
            <div></div> // Espaciador si solo es modal de aviso
          )}

          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className={`px-8 py-3.5 rounded-full font-bold text-lg text-white shadow-md transition-all ${
              isDestructive
                ? 'bg-[#2E5834] hover:bg-[#1f3d23]' // En tu Figma el botón de Delete es verde oscuro
                : 'bg-[#2E5834] hover:bg-[#1f3d23]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}