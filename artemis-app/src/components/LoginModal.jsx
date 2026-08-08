import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  //Estados limpios del formulario de Inicio de Sesión
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Si el modal no está activo, no renderiza nada
  if (!isOpen) return null;

  //Manejador de envío
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('[LOG]: Intento de Inicio de Sesión ->', {
      email,
      timestamp: new Date().toISOString(),
    });

    alert('¡Sesión iniciada correctamente! (En la Fase 3 esto enviará los datos a Node.js)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Contenedor Principal */}
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl relative my-8">
        
        {/* Botón de Cerrar Modal */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Cerrar ventana"
          className="absolute top-6 right-6 z-10 p-2 text-gray-500 hover:text-[#1D1D1D] hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* COLUMNA IZQUIERDA: Banner motivacional */}
        <div
          className="lg:w-5/12 bg-cover bg-center p-8 md:p-12 flex flex-col justify-end min-h-[260px] lg:min-h-full relative"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(29,29,29,0.2) 0%, rgba(29,29,29,0.85) 100%), url('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80')",
          }}
        >
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-snug relative z-10">
            ¡Qué gusto verte de nuevo en Ártemis!
          </h2>
          <p className="text-gray-200 text-lg mt-3 relative z-10">
            Inicia sesión para ver tus recetas guardadas, tus tableros y participar en la comunidad.
          </p>
        </div>

        {/* COLUMNA DERECHA: Formulario de Login */}
        <div className="lg:w-7/12 p-8 md:p-14 flex flex-col justify-center">
          {/* Cabecera del formulario */}
          <div className="mb-8">
            <span className="text-[#839958] font-bold tracking-wider text-sm uppercase block mb-1">
              Comunidad Ártemis
            </span>
            <h1 className="text-[#1D1D1D] text-3xl md:text-4xl font-bold">
              Iniciar Sesión
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Campo: Correo Electrónico */}
            <div className="flex flex-col gap-2">
              <label htmlFor="loginEmail" className="text-[#444444] text-lg font-medium">
                Correo Electrónico
              </label>
              <input
                id="loginEmail"
                type="email"
                required
                placeholder="Escribe tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-[#1D1D1D] placeholder-[#ACACAC] bg-white text-lg py-3.5 px-5 rounded-xl border border-gray-300 focus:border-[#2E5834] focus:ring-2 focus:ring-[#2E5834]/20 outline-none transition-all"
              />
            </div>

            {/* Campo: Contraseña */}
            <div className="flex flex-col gap-2">
              <label htmlFor="loginPassword" className="text-[#444444] text-lg font-medium">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Escribe tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-[#1D1D1D] placeholder-[#ACACAC] bg-white text-lg py-3.5 pl-5 pr-14 rounded-xl border border-gray-300 focus:border-[#2E5834] focus:ring-2 focus:ring-[#2E5834]/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1.5 text-gray-400 hover:text-[#1D1D1D] rounded-lg transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Botón Principal de Inicio de Sesión */}
            <button
              type="submit"
              className="w-full bg-[#839958] hover:bg-[#72874b] text-white font-bold text-xl py-4 rounded-xl shadow-md transition-all transform active:scale-98 mt-2"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Pie de modal para cambiar al Registro */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-100">
            <span className="text-[#636363] text-lg">
              ¿Aún no tienes una cuenta?
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSwitchToSignup) onSwitchToSignup();
              }}
              className="text-[#2E5834] hover:text-[#1f3d23] font-bold text-lg underline transition-colors"
            >
              Regístrate aquí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}