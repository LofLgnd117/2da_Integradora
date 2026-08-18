// Se puede sobreescribir en build/producción definiendo VITE_API_URL en el .env de Vite.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
