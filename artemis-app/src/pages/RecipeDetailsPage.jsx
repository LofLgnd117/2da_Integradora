import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';

// 1. MODELO DE DATOS EN ESPAÑOL (En Fase 3 esto llegará vía API desde Node.js/PostgreSQL)
const RECIPE_DATA = {
  id: 'kung-pao-chicken',
  title: 'Pollo Kung Pao',
  author: 'Judy Leung',
  date: '10 de enero de 2024',
  rating: '4.0',
  reviewsCount: 27,
  heroImage: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80',
  overview: `El Pollo Kung Pao es uno de los platillos favoritos de la cocina oriental: ¡es jugoso, lleno de sabor y totalmente delicioso! Lo mejor de todo es que es muy fácil de preparar en casa, así que no necesitarás pedir comida a domicilio cuando tengas antojo. Nos encanta su increíble salsa agridulce y salada, con ese toque especial ligeramente picante.

Si te preguntas si esta receta es muy complicada, ¡para nada! A diferencia de otros platillos que nadan en salsa, aquí la salsa es muy concentrada y sabrosa, por lo que con un poco basta para darle un sabor espectacular a todo el pollo y al arroz.

Hay buenas razones por las que a todos les encanta el Pollo Kung Pao: combina sabores dulces, salados y un toque doradito de cacahuate. Es un platillo sencillo, casero y con sabor de restaurante. ¡Anímate a prepararlo en casa!`,
  cooksTips: `Como en todo platillo salteado, la cocina es rápida, así que te recomendamos tener todos tus ingredientes picados y listos antes de encender la estufa. Deja cocinar la salsa hasta que tome una consistencia espesita como de jarabe; ¡ese es el secreto!

El vino de arroz (o jerez seco) es un ingrediente clave que hace que la comida oriental casera tenga ese aroma y sabor auténtico.`,
  times: {
    prep: '30 min',
    cook: '10 min',
    total: '40 min',
    servings: 4,
  },
  ingredientGroups: [
    {
      groupName: 'Para Tostar los Cacahuates:',
      items: [
        '1 cucharadita de aceite vegetal',
        '160 g de cacahuates crudos (pelados, con o sin cascarita)',
      ],
    },
    {
      groupName: 'Para Marinar el Pollo:',
      items: [
        '340 g de pechuga de pollo (cortada en cubos medianos)',
        '1 cucharadita de aceite vegetal',
        '1 cucharadita de fécula de maíz (maicena)',
        '1 cucharadita de vino de arroz o jerez seco',
        '1/8 de cucharadita de sal',
        '1 pizca de pimienta blanca',
      ],
    },
    {
      groupName: 'Para la Salsa:',
      items: [
        '1 cucharada de salsa de soya ligera',
        '1/2 cucharadita de salsa de soya oscura (o tradicional)',
        '1 cucharada de vinagre de arroz o vinagre blanco',
        '1 cucharadita de azúcar',
        '45 ml de agua (3 cucharadas)',
        '1 cucharadita de fécula de maíz (maicena)',
      ],
    },
    {
      groupName: 'Para el Salteado:',
      items: [
        '45 ml de aceite vegetal (3 cucharadas)',
        '3 dientes de ajo (machacados y rebanados)',
        '2 rebanadas delgadas de jengibre fresco (picado finamente)',
        '2 chiles secos de árbol (sin semillas y picados al gusto)',
        '1/2 cucharadita de pimienta entera molida',
        '6 cebollitas cambray (solo la parte blanca, en trozos de 2 cm)',
      ],
    },
  ],
  substitutions: [
    { name: 'Salsa de Soya Ligera:', replacement: 'Salsa de soya tradicional (de supermercado)' },
    { name: 'Salsa de Soya Oscura:', replacement: 'Salsa de soya tradicional o salsa inglesa ligera' },
    { name: 'Vinagre de Arroz:', replacement: 'Vinagre blanco de caña o vinagre de manzana' },
    { name: 'Fécula de Maíz (Maicena):', replacement: 'Harina de trigo de todo uso o fécula de papa' },
    { name: 'Vino de Arroz (Shaoxing):', replacement: 'Jerez seco. Si prefieres no usar alcohol, cámbialo por caldo de pollo.' },
    { name: 'Pimienta Sichuan:', replacement: 'Pimienta blanca o pimienta negra molida' },
  ],
  instructions: [
    {
      step: 1,
      text: 'Calienta una cucharadita de aceite en un sartén grande o wok a fuego medio y agrega los cacahuates. Mueve constantemente durante 3 minutos para que no se quemen. Apaga el fuego y síguelos moviendo un minuto más con el calor del sartén. Guárdalos en un plato para que se enfríen y queden bien crujientes.',
      img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    },
    {
      step: 2,
      text: 'En un tazón, mezcla los cubos de pollo con 1 cucharadita de aceite, 1 cucharadita de fécula de maíz, 1 cucharadita de vino de arroz (o jerez), sal y pimienta. Déjalo reposar y marinar durante 20 minutos.',
      img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80',
    },
    {
      step: 3,
      text: 'En un tazón pequeño, mezcla muy bien la salsa de soya, el vinagre, el azúcar, el agua y la cucharadita de fécula de maíz. Reserva esta salsa para más adelante.',
      img: null,
    },
    {
      step: 4,
      text: 'Calienta 2 cucharadas de aceite en el sartén a fuego alto. Sella el pollo hasta que cambie de color y esté doradito. Saca el pollo del sartén y resérvalo en un plato.',
      img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    },
  ],
  nutrition: [
    { label: 'Calorías', val: '440', dv: '4%' },
    { label: 'Carbohidratos', val: '11 g', dv: '4%' },
    { label: 'Proteínas', val: '29 g', dv: '58%' },
    { label: 'Grasas Totales', val: '33 g', dv: '51%' },
    { label: 'Grasas Saturadas', val: '6 g', dv: '30%' },
    { label: 'Sodio', val: '477 mg', dv: '20%' },
  ],
  tags: [
    'Pollo Kung Pao', 'Cocina Oriental', 'Pollo Picante', 
    'Salteado', 'Estilo Restaurante', 'Sabores Caseros'
  ],
  reviews: [
    {
      id: 1,
      author: 'Ángela Macías',
      date: '25/01/2024',
      text: 'Mi esposo y yo acabamos de probar el Pollo Kung Pao y quedó delicioso. Seguí la receta paso a paso con los ingredientes que encontré en el súper. ¡Muy recomendable!',
      helpful: 0,
    },
    {
      id: 2,
      author: 'Benjamín Ortega',
      date: '24/01/2024',
      text: 'Lo preparé en casa y le agregué unos cuadritos de pimiento morrón verde para darle más color. La salsa queda espesita y muy sabrosa. ¡Excelente receta!',
      helpful: 0,
    },
  ],
  relatedRecipes: [
    {
      id: 201,
      title: 'Brochetas de Pollo Crujiente',
      author: 'Ree Drummond',
      totalTime: '3 hrs',
      reviewsCount: 27,
      imageSrc: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 202,
      title: 'Pollo Crujiente con Ajonjolí',
      author: 'Nicky Corbishley',
      totalTime: '30 min',
      reviewsCount: 31,
      imageSrc: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 203,
      title: 'Pollo Teriyaki al Horno',
      author: 'Lisa Nguyen',
      totalTime: '1 h 5 min',
      reviewsCount: 38,
      imageSrc: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 204,
      title: 'Arroz Frito con Pollo',
      author: 'Bill Leung',
      totalTime: '35 min',
      reviewsCount: 42,
      imageSrc: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    },
  ],
};

export default function RecipeDetailsPage({ onOpenLogin }) {
  // Estados interactivos para medición UX en el experimento
  const [isSaved, setIsSaved] = useState(false);
  const [privateNote, setPrivateNote] = useState('');
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(5);

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    console.log(`[LOG]: Receta ${!isSaved ? 'guardada en tablero' : 'eliminada de guardados'} -> ${RECIPE_DATA.title}`);
  };

  const handleNoteSave = () => {
    if (!privateNote.trim()) return;
    alert('Nota privada guardada correctamente en tu cuenta.');
    console.log('[LOG]: Nota privada agregada:', privateNote);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userReview.trim()) return;
    alert('¡Gracias! Tu reseña ha sido enviada.');
    console.log('[LOG]: Nueva reseña enviada:', { rating: userRating, comment: userReview });
    setUserReview('');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans text-[#1D1D1D]">
      {/* 1. Navegación Superior */}
      <Navbar
        onLoginClick={onOpenLogin}
        onAddRecipeClick={() => alert('Pronto abriremos aquí el formulario para subir receta...')}
      />

      {/* 2. Sub-menú de Categorías (WCAG 2.1 - Legible para adultos mayores) */}
      <div className="bg-white border-b border-gray-200 py-3 px-6 shadow-sm flex justify-center gap-8 md:gap-16 text-lg font-medium">
        <button className="hover:text-[#2E5834] transition-colors">Populares</button>
        <button className="hover:text-[#2E5834] transition-colors">Comidas y Platillos</button>
        <button className="hover:text-[#2E5834] transition-colors">Dietas</button>
        <button className="hover:text-[#2E5834] transition-colors">Ocasiones</button>
      </div>

      <main className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-14">
        {/* 3. Migas de pan y Cabecera de Receta */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-gray-500 text-lg">
            <span className="hover:underline cursor-pointer">Inicio</span>
            <span>&rsaquo;</span>
            <span className="hover:underline cursor-pointer">Buscar</span>
            <span>&rsaquo;</span>
            <span className="text-[#1D1D1D] font-semibold">{RECIPE_DATA.title}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {RECIPE_DATA.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center gap-2 font-bold text-xl text-[#2E5834]">
                <span>★ {RECIPE_DATA.rating}</span>
                <span className="text-gray-500 font-normal">({RECIPE_DATA.reviewsCount} opiniones)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Por</span>
                <span className="text-[#C57D5D] font-bold">{RECIPE_DATA.author}</span>
              </div>
              <span className="text-gray-500">{RECIPE_DATA.date}</span>
            </div>

            {/* Botones de acción principales (WCAG 2.1 - Fácil interacción para adultos mayores) */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSaveToggle}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-2 font-bold text-lg transition-all ${
                  isSaved
                    ? 'bg-[#2E5834] text-white border-[#2E5834]'
                    : 'bg-white text-[#1D1D1D] border-[#1D1D1D] hover:bg-gray-100'
                }`}
              >
                <span>{isSaved ? '★ GUARDADO' : '☆ GUARDAR'}</span>
              </button>

              <button
                onClick={() => alert('Abriendo sección de calificación...')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[#1D1D1D] bg-white text-[#1D1D1D] hover:bg-gray-100 font-bold text-lg transition-all"
              >
                <span>CALIFICAR</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[#1D1D1D] bg-white text-[#1D1D1D] hover:bg-gray-100 font-bold text-lg transition-all"
              >
                <span>IMPRIMIR</span>
              </button>
            </div>
          </div>

          {/* Imagen Principal Hero */}
          <div className="w-full h-[350px] md:h-[550px] rounded-3xl overflow-hidden shadow-lg">
            <img
              src={RECIPE_DATA.heroImage}
              alt={RECIPE_DATA.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* 4. Descripción general y Consejos del cocinero */}
        <section className="flex flex-col gap-10 max-w-4xl">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Descripción General</h2>
            <p className="text-gray-700 text-xl leading-relaxed whitespace-pre-line">
              {RECIPE_DATA.overview}
            </p>
          </div>

          <div className="flex flex-col gap-4 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-[#2E5834]">Tips del Cocinero</h3>
            <p className="text-gray-700 text-xl leading-relaxed whitespace-pre-line">
              {RECIPE_DATA.cooksTips}
            </p>
          </div>
        </section>

        {/* 5. Tarjeta informativa de Tiempos y Porciones */}
        <section className="bg-[#F3F3F3] rounded-3xl p-8 flex flex-wrap justify-around items-center gap-8 text-center">
          <div>
            <span className="text-gray-500 text-lg block">Preparación</span>
            <span className="text-2xl font-bold">{RECIPE_DATA.times.prep}</span>
          </div>
          <div className="h-10 w-px bg-gray-300 hidden md:block"></div>
          <div>
            <span className="text-gray-500 text-lg block">Cocción</span>
            <span className="text-2xl font-bold">{RECIPE_DATA.times.cook}</span>
          </div>
          <div className="h-10 w-px bg-gray-300 hidden md:block"></div>
          <div>
            <span className="text-gray-500 text-lg block">Tiempo Total</span>
            <span className="text-2xl font-bold">{RECIPE_DATA.times.total}</span>
          </div>
          <div className="h-10 w-px bg-gray-300 hidden md:block"></div>
          <div>
            <span className="text-gray-500 text-lg block">Porciones</span>
            <span className="text-2xl font-bold text-[#2E5834] bg-white px-4 py-1 rounded-lg border border-gray-300 shadow-sm inline-block mt-1">
              {RECIPE_DATA.times.servings}
            </span>
          </div>
        </section>

        {/* 6. Ingredientes */}
        <section className="flex flex-col gap-8 max-w-4xl">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-bold">Ingredientes</h2>
            <button
              onClick={() => alert('Lista de compras guardada. (Se implementará en Fase 3)')}
              className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold px-6 py-3 rounded-full transition-colors text-lg shadow-sm"
            >
              + AGREGAR A LISTA DEL SÚPER
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {RECIPE_DATA.ingredientGroups.map((group, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#1D1D1D] border-b pb-2">{group.groupName}</h3>
                <ul className="flex flex-col gap-3">
                  {group.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3 text-lg text-gray-700">
                      <span className="text-[#2E5834] font-bold mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Sustituciones */}
        <section className="flex flex-col gap-6 max-w-4xl">
          <h2 className="text-3xl font-bold">Ingredientes Alternativos (Sustituciones)</h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
            {RECIPE_DATA.substitutions.map((sub, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-lg border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <strong className="text-[#1D1D1D] min-w-[220px]">{sub.name}</strong>
                <span className="text-gray-600">{sub.replacement}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Instrucciones paso a paso */}
        <section className="flex flex-col gap-8 max-w-4xl">
          <h2 className="text-3xl font-bold">Instrucciones Paso a Paso</h2>
          <div className="flex flex-col gap-10">
            {RECIPE_DATA.instructions.map((item) => (
              <div key={item.step} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full bg-[#839958] text-white font-bold text-xl flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <p className="text-xl text-gray-800 leading-relaxed pt-1">
                    {item.text}
                  </p>
                </div>
                {item.img && (
                  <div className="w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden bg-gray-100">
                    <img src={item.img} alt={`Paso ${item.step}`} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 9. Información Nutricional y Notas Privadas (Doble Columna) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Columna Izquierda: Nutrición */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-6">
            <h3 className="text-2xl font-bold">Información Nutricional</h3>
            <p className="text-gray-500 text-base">Porciones por receta: {RECIPE_DATA.times.servings}</p>
            <div className="flex flex-col divide-y divide-gray-200">
              <div className="flex justify-between font-bold text-lg py-2 bg-gray-50 px-2 rounded">
                <span>Por Porción</span>
                <span>% Valor Diario*</span>
              </div>
              {RECIPE_DATA.nutrition.map((nut, idx) => (
                <div key={idx} className="flex justify-between text-lg py-3 px-2">
                  <span className="font-medium text-gray-700">{nut.label}: {nut.val}</span>
                  <span className="font-bold text-gray-900">{nut.dv}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 italic">*Basado en una dieta de 2,000 calorías al día.</p>
          </div>

          {/* Columna Derecha: Notas Privadas (Fácil de entender para el adulto mayor) */}
          <div className="bg-white p-8 rounded-3xl border-2 border-[#1D1D1D] shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📝</span>
              <h3 className="text-2xl font-bold">Notas Privadas</h3>
            </div>
            <p className="text-gray-600 text-lg">
              ¡Psst... tus secretos están a salvo aquí! Usa las notas privadas para apuntar tus ideas, trucos o cambios personales.
            </p>
            <textarea
              rows="4"
              value={privateNote}
              onChange={(e) => setPrivateNote(e.target.value)}
              placeholder="Escribe aquí tus notas personales sobre la receta..."
              className="w-full p-4 rounded-xl border border-gray-300 text-lg focus:outline-none focus:border-[#2E5834]"
            ></textarea>
            <button
              onClick={handleNoteSave}
              className="self-end bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold px-8 py-3 rounded-full transition-colors text-lg"
            >
              Guardar Nota
            </button>
          </div>
        </section>

        {/* 10. Etiquetas (Tags) */}
        <section className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold">Etiquetas</h3>
          <div className="flex flex-wrap gap-3">
            {RECIPE_DATA.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-white border border-gray-300 text-gray-700 font-medium text-lg px-5 py-2 rounded-full cursor-pointer hover:border-[#2E5834] hover:text-[#2E5834] transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* 11. Reseñas y Formulario de Comentarios */}
        <section className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-10">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-3xl font-bold">Reseñas y Opiniones ({RECIPE_DATA.reviewsCount})</h3>
            <span className="text-2xl font-bold text-[#2E5834]">★ {RECIPE_DATA.rating}</span>
          </div>

          {/* Formulario para agregar reseña */}
          <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-2xl flex flex-col gap-4">
            <h4 className="text-xl font-bold">Escribe una Reseña</h4>
            <div className="flex items-center gap-4">
              <label className="text-lg font-medium">Tu Calificación:</label>
              <select
                value={userRating}
                onChange={(e) => setUserRating(Number(e.target.value))}
                className="p-2 rounded border border-gray-300 font-bold text-lg bg-white"
              >
                <option value="5">★★★★★ (5/5 Excelente)</option>
                <option value="4">★★★★☆ (4/5 Muy buena)</option>
                <option value="3">★★★☆☆ (3/5 Buena)</option>
                <option value="2">★★☆☆☆ (2/5 Regular)</option>
                <option value="1">★☆☆☆☆ (1/5 No me gustó)</option>
              </select>
            </div>
            <textarea
              rows="3"
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="¡Comparte tu experiencia! Cuéntanos qué te pareció la receta..."
              className="w-full p-4 rounded-xl border border-gray-300 text-lg bg-white focus:outline-none focus:border-[#2E5834]"
              required
            ></textarea>
            <button
              type="submit"
              className="self-end bg-[#839958] hover:bg-[#72874b] text-white font-bold px-8 py-3 rounded-full text-lg transition-colors"
            >
              Publicar Reseña
            </button>
          </form>

          {/* Lista de comentarios */}
          <div className="flex flex-col gap-8">
            {RECIPE_DATA.reviews.map((rev) => (
              <div key={rev.id} className="border-b border-gray-200 pb-6 last:border-0 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xl">{rev.author}</span>
                  <span className="text-gray-500">{rev.date}</span>
                </div>
                <p className="text-gray-700 text-lg">{rev.text}</p>
                <button
                  onClick={() => alert('¡Gracias por tu voto de utilidad!')}
                  className="self-start text-gray-500 hover:text-[#2E5834] text-base font-medium mt-1"
                >
                  👍 Útil (0)
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 12. Sección Recomendados Reutilizando RecipeCard.jsx */}
        <section className="flex flex-col gap-8 pt-6">
          <h2 className="text-3xl font-bold">Recetas que te Encantarán</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {RECIPE_DATA.relatedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                title={recipe.title}
                author={recipe.author}
                totalTime={recipe.totalTime}
                reviewsCount={recipe.reviewsCount}
                imageSrc={recipe.imageSrc}
                onCardClick={() => alert(`Abriendo ${recipe.title}...`)}
                onSaveClick={() => console.log(`[LOG]: Guardado -> ${recipe.title}`)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}