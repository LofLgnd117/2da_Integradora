import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';
import SignupModal from '../components/SignupModal';
import LoginModal from '../components/LoginModal';

// Datos temporales de muestra en español (En Fase 3 esto llegará por API desde Node.js/PostgreSQL)
const SAMPLE_RECIPES = [
  {
    id: 1,
    title: 'Arroz Frito con Huevo y Verduras',
    author: 'Amanda Suárez',
    totalTime: '15 min',
    reviewsCount: 18,
    imageSrc: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/tji4ccov_expires_30_days.png',
  },
  {
    id: 2,
    title: 'Macarrones con Queso Rápidos',
    author: 'Elena Quittner',
    totalTime: '20 min',
    reviewsCount: 29,
    imageSrc: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/pnxzuukb_expires_30_days.png',
  },
  {
    id: 3,
    title: 'Pizza Casera en Pan Francés',
    author: 'Milton Clark',
    totalTime: '25 min',
    reviewsCount: 11,
    imageSrc: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/w87zgc9i_expires_30_days.png',
  },
  {
    id: 4,
    title: 'Camarones al Ajo con Chorizo',
    author: 'Emilia Weinberger',
    totalTime: '40 min',
    reviewsCount: 33,
    imageSrc: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    ratingImgSrc: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/o1do2jsp_expires_30_days.png',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      {/* 1. Navegación Superior */}
      <Navbar 
        onLoginClick={() => setIsLoginOpen(true)} 
        onAddRecipeClick={() => alert('Pronto abriremos aquí el formulario para subir receta...')} 
      />

      {/* 2. Sub-menú de Categorías (WCAG 2.1 - Alto contraste y texto legible) */}
      <div className="bg-white border-b border-gray-200 py-3 px-6 shadow-sm flex justify-center gap-8 md:gap-16 text-lg font-medium text-[#1D1D1D]">
        <button className="hover:text-[#2E5834] transition-colors">Populares</button>
        <button className="hover:text-[#2E5834] transition-colors">Comidas y Platillos</button>
        <button className="hover:text-[#2E5834] transition-colors">Dietas</button>
        <button className="hover:text-[#2E5834] transition-colors">Ocasiones</button>
      </div>

      {/* 3. Hero Section y Buscador Principal */}
      <section className="bg-[#1D1D1D] py-24 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold max-w-2xl leading-tight mb-10">
          ¡Alimenta tu cuerpo y corazón - <br />
          encuentra recetas que saben delicioso!
        </h1>

        {/* Barra de Búsqueda Accesible */}
        <div className="w-full max-w-3xl bg-white rounded-full flex items-center px-6 py-3 shadow-lg">
          <svg className="w-6 h-6 text-gray-400 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por platillo, ingrediente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-[#1D1D1D] placeholder-gray-400 text-lg md:text-xl bg-transparent focus:outline-none"
          />
        </div>
      </section>

      {/* 4. Sección: Comidas Fáciles y Rápidas */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-[#1D1D1D] text-3xl md:text-4xl font-bold mb-2">
              Comidas Fáciles y Rápidas
            </h2>
            <p className="text-[#444444] text-lg max-w-2xl">
              ¡Satisface tu antojo en un instante! Explora nuestras recetas sencillas y prácticas sin perder ese sabor casero delicioso.
            </p>
          </div>
          <button className="text-[#1D1D1D] font-bold text-base hover:text-[#2E5834] flex items-center gap-2 shrink-0">
            VER TODAS LAS RECETAS &rarr;
          </button>
        </div>

        {/* Cuadrícula responsiva de Recetas Reutilizando RecipeCard.jsx */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {SAMPLE_RECIPES.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              author={recipe.author}
              totalTime={recipe.totalTime}
              reviewsCount={recipe.reviewsCount}
              imageSrc={recipe.imageSrc}
              ratingImgSrc={recipe.ratingImgSrc}
              onCardClick={() => console.log(`[LOG]: Clic en receta -> ${recipe.title}`)}
              onSaveClick={() => console.log(`[LOG]: Receta guardada en tablero -> ${recipe.title}`)}
            />
          ))}
        </div>
      </section>

      {/* 5. Sección: Inspiración para Comer Sano */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[#1D1D1D] text-3xl md:text-4xl font-bold mb-10">
            Inspiración para Comer Sano
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-[400px] rounded-2xl overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80"
                alt="Platillo saludable"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-8">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-[#1D1D1D] text-2xl font-bold mb-2">
                  Platillos Deliciosos y Llenos de Nutrientes
                </h3>
                <p className="text-[#444444] text-lg">
                  Explora una colección de recetas caseras que no solo alegran tu paladar, sino que cuidan tu salud en cada bocado.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-[#1D1D1D] text-2xl font-bold mb-2">
                  Energía Natural con Ingredientes Frescos
                </h3>
                <p className="text-[#444444] text-lg">
                  Descubre el mundo de la cocina natural con opciones deliciosas que te dan energía para disfrutar cada día al máximo.
                </p>
              </div>

              <div>
                <h3 className="text-[#1D1D1D] text-2xl font-bold mb-2">
                  Maravillas en un Solo Sartén sin Complicaciones
                </h3>
                <p className="text-[#444444] text-lg">
                  Simplifica tu tiempo en la cocina con recetas prácticas que se preparan en un solo sartén, sin ensuciar de más ni complicarte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modales de Autenticación */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => setIsSignupOpen(true)}
      />

      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)} 
        onSwitchToLogin={() => setIsLoginOpen(true)}
      />
    </div>
  );
}