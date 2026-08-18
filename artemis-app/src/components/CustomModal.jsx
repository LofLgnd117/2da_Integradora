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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 animate-fadeIn">
      {/* Caja del Modal — mismo lenguaje visual que los modales de la app móvil */}
      <div className="w-full max-w-sm bg-[#2E5834] rounded-[24px] p-8 shadow-2xl flex flex-col items-center text-center">
        <p className="text-[#0A3323] text-lg font-bold mb-4">Ártemis</p>

        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
          isDestructive ? 'bg-[#FFAEAE]' : 'bg-[#839958]/40'
        }`}>
          <span className={`text-4xl font-bold ${isDestructive ? 'text-[#CC3333]' : 'text-[#F7F4D5]'}`}>
            {isDestructive ? '!' : '✓'}
          </span>
        </div>

        <h3 className="text-[#0A3323] text-2xl font-black mb-2">
          {title}
        </h3>
        <p className="text-[#F7F4D5] text-sm leading-relaxed mb-8 px-2">
          {message}
        </p>

        <div className="w-full flex flex-col gap-4">
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className={`w-full min-h-[56px] rounded-xl font-bold text-base transition-colors ${
              isDestructive
                ? 'bg-[#CC3333] hover:bg-[#b32c2c] text-white'
                : 'bg-[#0A3323] hover:bg-[#092a1c] text-[#F7F4D5]'
            }`}
          >
            {confirmText}
          </button>

          {showCancel && (
            <button
              onClick={onClose}
              className="w-full min-h-[56px] rounded-xl border border-[#F7F4D5]/30 bg-[#839958] hover:bg-[#768c4e] text-[#F7F4D5] font-bold text-base transition-colors"
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
