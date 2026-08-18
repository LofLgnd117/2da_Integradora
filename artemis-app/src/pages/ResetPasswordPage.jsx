import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { API_URL } from '../config/api';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/restablecer-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.message || 'No se pudo restablecer tu contraseña.');
      }
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
      setErrorMsg('No se pudo conectar con el servidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#839958]/20 text-[#2E5834] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 font-bold">
                ✓
              </div>
              <h1 className="text-2xl font-black text-[#1D1D1D] mb-3">¡Contraseña actualizada!</h1>
              <p className="text-gray-500 mb-8">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                Ir al inicio
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-[#1D1D1D] mb-2">Crea una nueva contraseña</h1>
              <p className="text-gray-500 mb-8">Escribe tu nueva contraseña para tu cuenta de Ártemis.</p>

              {errorMsg && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 font-semibold text-center text-sm">
                  ⚠️ {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="newPassword" className="text-[#444444] font-medium">Nueva contraseña</label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-[#1D1D1D] bg-white py-3 px-4 rounded-xl border border-gray-300 focus:border-[#2E5834] focus:ring-2 focus:ring-[#2E5834]/20 outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="confirmNewPassword" className="text-[#444444] font-medium">Confirmar contraseña</label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-[#1D1D1D] bg-white py-3 px-4 rounded-xl border border-gray-300 focus:border-[#2E5834] focus:ring-2 focus:ring-[#2E5834]/20 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 mt-2"
                >
                  {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-8">
                <Link to="/" className="text-[#2E5834] font-semibold hover:underline">Volver al inicio</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
