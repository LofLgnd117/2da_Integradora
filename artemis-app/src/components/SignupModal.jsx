import React, { useState } from 'react';

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  //Estados para capturar los datos del formulario
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  // Si el modal no está abierto, no renderizamos nada en pantalla
  if (!isOpen) return null;

  //Manejador del envío (Listo para conectar a Node.js/PostgreSQL en la Fase 3)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!acceptPrivacy) {
      alert('Por favor, acepta el Aviso de Privacidad para poder continuar.');
      console.log('[LOG]: Intento fallido de registro - LFPDPPP no aceptada');
      return;
    }

    console.log('[LOG]: Registro enviado exitosamente ->', {
      fullName,
      email,
      privacyAccepted: acceptPrivacy,
      timestamp: new Date().toISOString(),
    });

    alert('¡Cuenta creada con éxito! (En la Fase 3 esto enviará los datos a tu servidor)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Contenedor Principal */}
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl relative my-8">
        
        {/* Botón de Cerrar Modal (Accesible para adultos mayores) */}
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

        {/* COLUMNA IZQUIERDA: Banner motivacional con fondo gastronómico */}
        <div
          className="lg:w-5/12 bg-cover bg-center p-8 md:p-12 flex flex-col justify-end min-h-[260px] lg:min-h-full relative"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(29,29,29,0.2) 0%, rgba(29,29,29,0.85) 100%), url('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80')",
          }}
        >
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-snug relative z-10">
            ¡Empieza tu aventura culinaria con nosotros!
          </h2>
          <p className="text-gray-200 text-lg mt-3 relative z-10">
            Regístrate para descubrir recetas deliciosas, guardar tus favoritas y compartir tus secretos de cocina.
          </p>
        </div>

        {/* COLUMNA DERECHA: Formulario de Registro */}
        <div className="lg:w-7/12 p-8 md:p-14 flex flex-col justify-center">
          {/* Cabecera del formulario */}
          <div className="mb-8">
            <span className="text-[#839958] font-bold tracking-wider text-sm uppercase block mb-1">
              Comunidad Ártemis
            </span>
            <h1 className="text-[#1D1D1D] text-3xl md:text-4xl font-bold">
              Crear una Cuenta
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Campo: Nombre Completo */}
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-[#444444] text-lg font-medium">
                Nombre Completo
              </label>
              <input
                id="fullName"
                type="text"
                required
                placeholder="Escribe tu nombre y apellido"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-[#1D1D1D] placeholder-[#ACACAC] bg-white text-lg py-3.5 px-5 rounded-xl border border-gray-300 focus:border-[#2E5834] focus:ring-2 focus:ring-[#2E5834]/20 outline-none transition-all"
              />
            </div>

            {/* Campo: Correo Electrónico */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[#444444] text-lg font-medium">
                Correo Electrónico
              </label>
              <input
                id="email"
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
              <label htmlFor="password" className="text-[#444444] text-lg font-medium">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Crea una contraseña segura"
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

            {/* CASILLA DE PRIVACIDAD LFPDPPP (WCAG 2.1 - Fácil lectura y área de clic amplia) */}
            <div className="flex items-start gap-3.5 pt-1">
              <input
                id="lfpdppp"
                type="checkbox"
                checked={acceptPrivacy}
                onChange={(e) => setAcceptPrivacy(e.target.checked)}
                className="mt-1 w-6 h-6 shrink-0 rounded border-gray-300 text-[#2E5834] focus:ring-[#2E5834] cursor-pointer"
              />
              <label htmlFor="lfpdppp" className="text-[#444444] text-base leading-snug cursor-pointer select-none">
                Acepto el{' '}
                <a
                  href="#privacidad"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Aquí se mostrará el Aviso de Privacidad Integral conforme a la LFPDPPP para adultos mayores.');
                  }}
                  className="text-[#2E5834] font-semibold underline hover:text-[#1f3d23]"
                >
                  Aviso de Privacidad
                </a>{' '}
                y el uso de mis datos para fines de investigación académica (LFPDPPP).
              </label>
            </div>

            {/* Botón Principal de Envío */}
            <button
              type="submit"
              className="w-full bg-[#839958] hover:bg-[#72874b] text-white font-bold text-xl py-4 rounded-xl shadow-md transition-all transform active:scale-98 mt-2"
            >
              Crear Cuenta
            </button>
          </form>

          {/* Pie de modal para cambiar a Inicio de Sesión */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-100">
            <span className="text-[#636363] text-lg">
              ¿Ya tienes una cuenta?
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSwitchToLogin) onSwitchToLogin();
              }}
              className="text-[#2E5834] hover:text-[#1f3d23] font-bold text-lg underline transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}