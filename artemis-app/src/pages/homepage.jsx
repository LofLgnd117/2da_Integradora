import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import SignupModal from '../components/SignupModal';
import LoginModal from '../components/LoginModal';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/recipes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log('[LOG - API]: Recetas cargadas desde PostgreSQL ->', data.data);
          setRecipes(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('[ERROR - API]: No se pudo conectar al backend ->', err);
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('[LOG]: Usuario buscó ->', searchQuery);
    navigate('/buscar');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      {/* Navegación Superior */}
      <Navbar 
        onLoginClick={() => setIsLoginOpen(true)} 
      />

      {/* Sub-menú de Categorías con parámetro en URL */}
      <div className="bg-white border-b border-gray-200 py-3 px-6 shadow-sm flex justify-center gap-8 md:gap-16 text-lg font-medium text-[#1D1D1D]">
      <button 
        onClick={() => navigate('/buscar?categoria=Populares')} 
        className="hover:text-[#2E5834] transition-colors">
      
        Populares
      </button>
      <button 
        onClick={() => navigate('/buscar?categoria=Comidas y Platillos')} 
        className="hover:text-[#2E5834] transition-colors">

        Comidas y Platillos
      </button>
      <button 
        onClick={() => navigate('/buscar?categoria=Dietas')} 
        className="hover:text-[#2E5834] transition-colors">

        Dietas
      </button>
      <button 
        onClick={() => navigate('/buscar?categoria=Ocasiones')} 
        className="hover:text-[#2E5834] transition-colors">

        Ocasiones
      </button>
      </div>

      {/* Hero Section con Formulario de Búsqueda Activo */}
      <section className="bg-[#1D1D1D] py-24 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold max-w-2xl leading-tight mb-10">
          ¡Alimenta tu cuerpo y corazón - <br />
          encuentra recetas que saben delicioso!
        </h1>

        {/* Formulario conectado: Al dar Enter te lleva a /buscar */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl bg-white rounded-full flex items-center px-6 py-3 shadow-lg">
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
        </form>
      </section>

      {/* Sección: Comidas Fáciles y Rápidas */}
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

          {/* Botón VER TODAS conectado a /buscar */}
          <button 
            onClick={() => navigate('/buscar')}
            className="text-[#1D1D1D] font-bold text-base hover:text-[#2E5834] flex items-center gap-2 shrink-0"
          >
            VER TODAS LAS RECETAS &rarr;
          </button>
        </div>

        {/* Cuadrícula responsiva de Recetas conectada a PostgreSQL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {loading ? (
            <p className="text-[#444444] text-lg col-span-full text-center py-8 font-semibold">
              Cargando recetas deliciosas desde la cocina...
            </p>
          ) : recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                author={recipe.author || 'Alina Cruz'}
                totalTime={`${recipe.total_time_minutes} min`}
                reviewsCount={12}
                imageSrc={recipe.image_url}
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-8">
              Aún no hay recetas registradas en la base de datos.
            </p>
          )}
        </div>
      </section>

      {/* Sección: Inspiración para Comer Sano */}
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