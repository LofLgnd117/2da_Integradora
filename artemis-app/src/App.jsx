import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de las páginas de la Fase 1
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import AddRecipePage from './pages/AddRecipePage';
import ProfilePage from './pages/ProfilePage';
import SavedRecipesPage from './pages/SavedRecipesPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function AppRoutes() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] relative font-sans">
      <Routes>
        {/* 1. Ruta Principal: Inicio */}
        <Route path="/" element={<HomePage />} />

        {/* 2. Ruta de Búsqueda */}
        <Route path="/buscar" element={<SearchResultsPage />} />

        {/* 3. RUTA DINÁMICA DE DETALLE (Con :id para que coincida con cualquier receta) */}
        <Route path="/receta/:id" element={<RecipeDetailsPage />} />

        {/* Ruta de respaldo por si entran solo a /receta sin ID */}
        <Route path="/receta" element={<RecipeDetailsPage />} />

        {/* 4. Ruta para Subir Receta */}
        <Route path="/subir" element={<AddRecipePage />} />

        {/* 5. Ruta de Perfil */}
        <Route path="/perfil" element={<ProfilePage />} />

        {/* 6. Ruta de Recetarios Guardados */}
        <Route path="/guardadas" element={<SavedRecipesPage />} />

        {/* Ruta para restablecer contraseña desde el enlace enviado por correo */}
        <Route path="/restablecer-password/:token" element={<ResetPasswordPage />} />

        {/* 7. RUTA COMODÍN DE SEGURIDAD (*): Evita pantallas blancas si la URL no existe */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
