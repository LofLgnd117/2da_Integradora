import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';

// 1. RECETAS DE MUESTRA PARA EL INTERIOR DEL RECETARIO
const RECETAS_GUARDADAS_MUESTRA = [
  {
    id: 401,
    title: 'Guisado de Papas con Coliflor (Aloo Gobi)',
    author: 'Alina Cruz',
    totalTime: '30 min',
    reviewsCount: 12,
    imageSrc: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/tji4ccov_expires_30_days.png',
  },
  {
    id: 402,
    title: 'Pastel de Mantequilla y Elote',
    author: 'Preppy Kitchen',
    totalTime: '55 min',
    reviewsCount: 30,
    imageSrc: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/pnxzuukb_expires_30_days.png',
  },
  {
    id: 403,
    title: 'Pollo Kung Pao Casero',
    author: 'Judy Leung',
    totalTime: '40 min',
    reviewsCount: 27,
    imageSrc: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/w87zgc9i_expires_30_days.png',
  },
];

// 2. TABLEROS / RECETARIOS INICIALES
const RECETARIOS_INICIALES = [
  {
    id: 1,
    title: 'Todas las Recetas',
    count: 6,
    timeAgo: 'hace 2 min',
    mainImg: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=80',
    subImg1: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80',
    subImg2: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    title: 'Mis Recetas Propias',
    count: 1,
    timeAgo: 'hace 2 min',
    mainImg: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80',
    subImg1: null,
    subImg2: null,
  },
  {
    id: 3,
    title: 'Cenas y Antojos',
    count: 3,
    timeAgo: 'hace 10 min',
    mainImg: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
    subImg1: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=300&q=80',
    subImg2: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80',
  },
];

export default function SavedRecipesPage({ onOpenLogin }) {
  // Estado para alternar entre la lista de carpetas ('grid') y ver una carpeta por dentro ('detail')
  const [currentView, setCurrentView] = useState('grid');
  const [selectedBoard, setSelectedBoard] = useState(null);

  // Lista dinámica de recetarios
  const [boards, setBoards] = useState(RECETARIOS_INICIALES);
  const [sortBy, setSortBy] = useState('Más recientes');

  // Estado para el modal de Crear / Editar Recetario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [boardTitleInput, setBoardTitleInput] = useState('');
  const [editingBoardId, setEditingBoardId] = useState(null);

  // --- MANEJADORES DE RECETARIOS ---
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setBoardTitleInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (board, e) => {
    e.stopPropagation(); // Evita abrir la carpeta al hacer clic en editar
    setModalMode('edit');
    setEditingBoardId(board.id);
    setBoardTitleInput(board.title);
    setIsModalOpen(true);
  };

  const handleSaveBoard = (e) => {
    e.preventDefault();
    if (!boardTitleInput.trim()) return;

    if (modalMode === 'create') {
      const newBoard = {
        id: Date.now(),
        title: boardTitleInput.trim(),
        count: 0,
        timeAgo: 'ahora mismo',
        mainImg: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80',
        subImg1: null,
        subImg2: null,
      };
      setBoards([newBoard, ...boards]);
      console.log('[LOG]: Nuevo recetario creado ->', newBoard.title);
    } else {
      setBoards(boards.map((b) => 
        b.id === editingBoardId ? { ...b, title: boardTitleInput.trim() } : b
      ));
      console.log('[LOG]: Recetario editado ID:', editingBoardId, 'Nuevo nombre:', boardTitleInput);
    }

    setIsModalOpen(false);
  };

  const handleDeleteBoard = () => {
    if (confirm('¿Estás seguro de que deseas eliminar este recetario? Las recetas guardadas aquí no se borrarán de la plataforma.')) {
      setBoards(boards.filter((b) => b.id !== editingBoardId));
      console.log('[LOG]: Recetario eliminado ID:', editingBoardId);
      setIsModalOpen(false);
    }
  };

  const handleOpenBoardDetail = (board) => {
    setSelectedBoard(board);
    setCurrentView('detail');
    console.log('[LOG]: Abriendo carpeta de recetario ->', board.title);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans text-[#1D1D1D]">
      {/* 1. Navegación Superior (Usuario Conectado) */}
      <Navbar
        isLoggedIn={true}
        userName="Alina Cruz"
        onLoginClick={onOpenLogin}
        onAddRecipeClick={() => alert('Abriendo formulario para subir receta...')}
        onSavedRecipesClick={() => setCurrentView('grid')}
      />

      {/* 2. Sub-menú Superior en Español */}
      <div className="bg-white border-b border-gray-200 py-3 px-6 shadow-sm flex justify-center gap-8 md:gap-16 text-lg font-medium">
        <button className="hover:text-[#2E5834] transition-colors">Populares</button>
        <button className="hover:text-[#2E5834] transition-colors">Comidas y Platillos</button>
        <button className="hover:text-[#2E5834] transition-colors">Dietas</button>
        <button className="hover:text-[#2E5834] transition-colors">Ocasiones</button>
      </div>

      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-1">
        {/* =========================================================
            VISTA 1: CUADRÍCULA DE CARPETAS / RECETARIOS ('grid')
            ========================================================= */}
        {currentView === 'grid' && (
          <div className="flex flex-col gap-10">
            {/* Encabezado y Ordenamiento */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1D]">
                Mis Recetarios Guardados
              </h1>

              <div className="flex items-center gap-3">
                <span className="text-[#444444] text-lg font-medium">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg py-2 px-4 text-lg font-bold text-[#1D1D1D] focus:outline-none focus:border-[#2E5834] cursor-pointer"
                >
                  <option value="Más recientes">Más recientes</option>
                  <option value="Nombre A-Z">Nombre A-Z</option>
                  <option value="Mayor cantidad">Mayor cantidad</option>
                </select>
              </div>
            </div>

            {/* Cuadrícula de Carpetas + Botón de Crear */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
              
              {/* Tarjetas de Recetarios existentes */}
              {boards.map((board) => (
                <div
                  key={board.id}
                  onClick={() => handleOpenBoardDetail(board)}
                  className="group cursor-pointer flex flex-col gap-3 transition-transform hover:-translate-y-1"
                >
                  {/* Collage visual de portada (Figma Layout) */}
                  <div className="w-full h-64 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow flex gap-1 overflow-hidden">
                    {/* Imagen principal izquierda */}
                    <div className="flex-1 h-full rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={board.mainImg}
                        alt={board.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Dos imágenes derechas apiladas */}
                    <div className="w-1/3 flex flex-col gap-1">
                      <div className="flex-1 rounded-xl overflow-hidden bg-gray-100">
                        {board.subImg1 ? (
                          <img src={board.subImg1} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">🍲</div>
                        )}
                      </div>
                      <div className="flex-1 rounded-xl overflow-hidden bg-gray-100">
                        {board.subImg2 ? (
                          <img src={board.subImg2} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">🥗</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Texto del Recetario y Botón de Edición Rápida */}
                  <div className="flex items-start justify-between px-1">
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-bold text-[#1D1D1D] group-hover:text-[#2E5834] transition-colors">
                        {board.title}
                      </h2>
                      <div className="flex items-center gap-3 text-gray-500 text-base">
                        <span>{board.count} recetas</span>
                        <span>•</span>
                        <span>{board.timeAgo}</span>
                      </div>
                    </div>

                    {/* Botón para editar o eliminar carpeta (Accesible) */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditModal(board, e)}
                      aria-label="Editar recetario"
                      className="p-2 text-gray-400 hover:text-[#1D1D1D] hover:bg-gray-100 rounded-full transition-colors"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              ))}

              {/* BOTÓN GRANDE: + Nuevo Recetario (WCAG 2.1 - Fácil de ver y hacer clic) */}
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="w-full h-64 bg-[#E9E9E9]/70 hover:bg-[#E9E9E9] border-3 border-dashed border-gray-400 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl font-bold text-[#2E5834] group-hover:scale-110 transition-transform">
                  +
                </div>
                <span className="text-2xl font-bold text-[#444444] group-hover:text-[#1D1D1D]">
                  + Nuevo Recetario
                </span>
              </button>

            </div>
          </div>
        )}

        {/* =========================================================
            VISTA 2: INTERIOR DEL RECETARIO SELECCIONADO ('detail')
            ========================================================= */}
        {currentView === 'detail' && selectedBoard && (
          <div className="flex flex-col gap-8">
            {/* Cabecera con botón de regreso y título de carpeta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('grid')}
                  className="bg-white hover:bg-gray-100 border border-gray-300 px-5 py-2.5 rounded-full font-bold text-lg text-[#1D1D1D] flex items-center gap-2 transition-colors shadow-sm"
                >
                  &larr; Volver a recetarios
                </button>
                <h1 className="text-4xl font-bold text-[#1D1D1D]">
                  {selectedBoard.title}
                </h1>
              </div>

              <span className="text-gray-500 text-lg">
                Mostrando <strong>{RECETAS_GUARDADAS_MUESTRA.length}</strong> recetas en esta carpeta
              </span>
            </div>

            {/* Lista de Recetas Guardadas Reutilizando RecipeCard.jsx */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {RECETAS_GUARDADAS_MUESTRA.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  title={recipe.title}
                  author={recipe.author}
                  totalTime={recipe.totalTime}
                  reviewsCount={recipe.reviewsCount}
                  imageSrc={recipe.imageSrc}
                  ratingImgSrc={recipe.ratingImgSrc}
                  onCardClick={() => alert(`Abriendo detalle de: ${recipe.title}`)}
                  onSaveClick={() => alert(`Receta removida de "${selectedBoard.title}"`)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* =========================================================
          MODAL CREAR / EDITAR RECETARIO (WCAG 2.1 - Español claro)
          ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 md:p-10 w-full max-w-lg shadow-2xl flex flex-col gap-6 relative">
            
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Cerrar modal"
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl font-bold p-2"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-[#1D1D1D]">
              {modalMode === 'create' ? 'Crear Nuevo Recetario' : 'Editar Recetario'}
            </h2>

            <form onSubmit={handleSaveBoard} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="boardName" className="text-xl font-bold text-[#444444]">
                  Nombre del Recetario
                </label>
                <input
                  id="boardName"
                  type="text"
                  required
                  placeholder="ej. Desayunos de domingo, Antojos dulces..."
                  value={boardTitleInput}
                  onChange={(e) => setBoardTitleInput(e.target.value)}
                  className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-xl focus:outline-none focus:border-[#2E5834] focus:ring-2 focus:ring-[#2E5834]/20"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                {modalMode === 'edit' ? (
                  <button
                    type="button"
                    onClick={handleDeleteBoard}
                    className="text-red-600 hover:text-red-800 font-bold text-lg px-4 py-2 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    🗑️ Eliminar carpeta
                  </button>
                ) : (
                  <div></div> // Espaciador
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-full border border-gray-300 font-bold text-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-full bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold text-lg shadow transition-transform active:scale-95"
                  >
                    {modalMode === 'create' ? 'Crear Recetario' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}