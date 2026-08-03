import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function AddRecipePage({ onOpenLogin }) {
  // 1. ESTADOS GENERALES DEL FORMULARIO
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [prepHours, setPrepHours] = useState('');
  const [prepMins, setPrepMins] = useState('');
  const [cookHours, setCookHours] = useState('');
  const [cookMins, setCookMins] = useState('');
  const [cooksTips, setCooksTips] = useState('');

  // 2. ESTADOS DINÁMICOS: INGREDIENTES E INSTRUCCIONES
  const [ingredients, setIngredients] = useState([
    { id: 1, qty: '', unit: 'taza', item: '' },
    { id: 2, qty: '', unit: 'cda', item: '' },
  ]);

  const [instructions, setInstructions] = useState([
    { id: 1, text: '' },
    { id: 2, text: '' },
  ]);

  // 3. ESTADOS PARA ETIQUETAS (TAGS)
  const [tags, setTags] = useState({
    cuisine: '',
    mealType: '',
    dietary: '',
    cookingMethod: '',
    mainIngredient: '',
  });

  // --- MANEJADORES DE INGREDIENTES ---
  const handleAddIngredient = () => {
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1;
    setIngredients([...ingredients, { id: newId, qty: '', unit: 'taza', item: '' }]);
    console.log('[LOG]: Usuario agregó nueva fila de ingrediente. Total:', ingredients.length + 1);
  };

  const handleRemoveIngredient = (idToRemove) => {
    if (ingredients.length <= 1) {
      alert('Debes mantener al menos un ingrediente en la receta.');
      return;
    }
    setIngredients(ingredients.filter(i => i.id !== idToRemove));
    console.log('[LOG]: Usuario eliminó fila de ingrediente ID:', idToRemove);
  };

  const handleIngredientChange = (id, field, value) => {
    setIngredients(ingredients.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // --- MANEJADORES DE INSTRUCCIONES ---
  const handleAddInstruction = () => {
    const newId = instructions.length > 0 ? Math.max(...instructions.map(i => i.id)) + 1 : 1;
    setInstructions([...instructions, { id: newId, text: '' }]);
    console.log('[LOG]: Usuario agregó nuevo paso de instrucción. Total:', instructions.length + 1);
  };

  const handleRemoveInstruction = (idToRemove) => {
    if (instructions.length <= 1) {
      alert('Debes mantener al menos un paso en las instrucciones.');
      return;
    }
    setInstructions(instructions.filter(i => i.id !== idToRemove));
    console.log('[LOG]: Usuario eliminó paso ID:', idToRemove);
  };

  const handleInstructionChange = (id, value) => {
    setInstructions(instructions.map(item => 
      item.id === id ? { ...item, text: value } : item
    ));
  };

  // --- MANEJADOR DE ENVÍO ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRecipePayload = {
      title,
      description,
      servings,
      prepTime: `${prepHours || 0}h ${prepMins || 0}m`,
      cookTime: `${cookHours || 0}h ${cookMins || 0}m`,
      ingredients,
      instructions,
      cooksTips,
      tags,
      createdAt: new Date().toISOString()
    };

    console.log('[LOG]: Envío exitoso del formulario ->', newRecipePayload);
    alert('¡Excelente! Tu receta se ha completado y está lista para enviarse al servidor.');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans text-[#1D1D1D]">
      {/* Navegación Superior Reutilizada */}
      <Navbar
        onLoginClick={onOpenLogin}
        onAddRecipeClick={() => alert('Ya estás en la pantalla para agregar receta')}
      />

      {/* Sub-menú Superior */}
      <div className="bg-white border-b border-gray-200 py-3 px-6 shadow-sm flex justify-center gap-8 md:gap-16 text-lg font-medium">
        <button className="hover:text-[#2E5834] transition-colors">Popular</button>
        <button className="hover:text-[#2E5834] transition-colors">Comidas y Platillos</button>
        <button className="hover:text-[#2E5834] transition-colors">Dietas</button>
        <button className="hover:text-[#2E5834] transition-colors">Ocasiones</button>
      </div>

      {/* Contenedor Principal */}
      <main className="w-full max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="bg-white rounded-3xl p-6 md:p-14 shadow-lg border border-gray-100 flex flex-col gap-10">
          
          {/* Encabezado y Descripción */}
          <div className="flex flex-col items-center text-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold">Subir una Receta</h1>
            <p className="text-[#444444] text-lg md:text-xl max-w-2xl">
              ¿Te sientes como un artista en la cocina? ¡Queremos ver tu obra maestra! Comparte tu receta y demuestra tu creatividad culinaria.
            </p>
          </div>

          <div className="h-px bg-gray-200 w-full" />

          {/* Formulario Principal */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-12">
            
            {/* ZONA SUBIR FOTO */}
            <div
              onClick={() => alert('Abriendo selector de archivos del dispositivo...')}
              className="w-full bg-[#D6E0D8]/40 hover:bg-[#D6E0D8]/60 cursor-pointer border-3 border-dashed border-gray-400 rounded-2xl py-16 flex flex-col items-center justify-center transition-all group"
            >
              <div className="bg-[#2E5834] group-hover:bg-[#1f3d23] text-white px-6 py-3 rounded-full flex items-center gap-3 font-bold text-lg shadow-md transition-transform group-hover:scale-105">
                <span className="text-2xl">+</span>
                <span>Agregar foto</span>
              </div>
            </div>

            {/* Título de Receta */}
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-xl font-bold flex items-center gap-1">
                <span>Título de la receta</span>
                <span className="text-[#DB0F0F]">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                placeholder="Escribe el nombre de tu platillo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834] focus:ring-2 focus:ring-[#2E5834]/20"
              />
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-xl font-bold flex items-center gap-1">
                <span>Descripción</span>
                <span className="text-[#DB0F0F]">*</span>
              </label>
              <textarea
                id="description"
                rows="3"
                required
                placeholder="Describe tu receta de una manera que haga que a todos se les antoje."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834] focus:ring-2 focus:ring-[#2E5834]/20"
              />
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Porciones y Tiempos de Cocción */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Porciones */}
              <div className="flex flex-col gap-2">
                <label htmlFor="servings" className="text-xl font-bold flex items-center gap-1">
                  <span>Porciones</span>
                  <span className="text-[#DB0F0F]">*</span>
                </label>
                <input
                  id="servings"
                  type="number"
                  min="1"
                  required
                  placeholder="ej., 4 personas"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834]"
                />
              </div>

              {/* Tiempo de Preparación */}
              <div className="flex flex-col gap-2">
                <label className="text-xl font-bold flex items-center gap-1">
                  <span>Preparación</span>
                  <span className="text-[#DB0F0F]">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={prepHours}
                      onChange={(e) => setPrepHours(e.target.value)}
                      className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 pr-12 text-lg focus:outline-none focus:border-[#2E5834]"
                    />
                    <span className="absolute right-4 top-4 text-gray-400">hrs</span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="30"
                      value={prepMins}
                      onChange={(e) => setPrepMins(e.target.value)}
                      className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 pr-14 text-lg focus:outline-none focus:border-[#2E5834]"
                    />
                    <span className="absolute right-4 top-4 text-gray-400">min</span>
                  </div>
                </div>
              </div>

              {/* Tiempo de Cocción */}
              <div className="flex flex-col gap-2">
                <label className="text-xl font-bold flex items-center gap-1">
                  <span>Cocción</span>
                  <span className="text-[#DB0F0F]">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={cookHours}
                      onChange={(e) => setCookHours(e.target.value)}
                      className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 pr-12 text-lg focus:outline-none focus:border-[#2E5834]"
                    />
                    <span className="absolute right-4 top-4 text-gray-400">hrs</span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="15"
                      value={cookMins}
                      onChange={(e) => setCookMins(e.target.value)}
                      className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 pr-14 text-lg focus:outline-none focus:border-[#2E5834]"
                    />
                    <span className="absolute right-4 top-4 text-gray-400">min</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* LISTA DINÁMICA DE INGREDIENTES */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-2xl font-bold flex items-center gap-1">
                  <span>Ingredientes</span>
                  <span className="text-[#DB0F0F]">*</span>
                </label>
                <p className="text-[#444444] text-lg">
                  Escribe un ingrediente por renglón con sus cantidades y medidas.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {ingredients.map((ing) => (
                  <div key={ing.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                    <div className="w-28 shrink-0">
                      <input
                        type="text"
                        placeholder="Cant."
                        value={ing.qty}
                        onChange={(e) => handleIngredientChange(ing.id, 'qty', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl p-3 text-lg focus:outline-none focus:border-[#2E5834]"
                      />
                    </div>

                    <div className="w-44 shrink-0">
                      <select
                        value={ing.unit}
                        onChange={(e) => handleIngredientChange(ing.id, 'unit', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl p-3 text-lg focus:outline-none focus:border-[#2E5834] cursor-pointer"
                      >
                        <option value="taza">taza(s)</option>
                        <option value="cda">cucharada(s)</option>
                        <option value="cdta">cucharadita(s)</option>
                        <option value="g">gramo(s)</option>
                        <option value="kg">kilo(s)</option>
                        <option value="ml">ml</option>
                        <option value="l">litro(s)</option>
                        <option value="pieza">pieza / entero</option>
                        <option value="pizca">pizca</option>
                        <option value="al gusto">al gusto</option>
                      </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Nombre del ingrediente (ej. harina de trigo)"
                        value={ing.item}
                        onChange={(e) => handleIngredientChange(ing.id, 'item', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl p-3 text-lg focus:outline-none focus:border-[#2E5834]"
                      />
                    </div>

                    {/* Botón Borrar Fila */}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ing.id)}
                      aria-label="Eliminar ingrediente"
                      className="p-3 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddIngredient}
                className="self-start font-bold text-xl text-[#2E5834] hover:text-[#1f3d23] py-2 px-4 rounded-xl hover:bg-[#D6E0D8]/40 transition-colors"
              >
                + Agregar ingrediente
              </button>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* LISTA DINÁMICA DE INSTRUCCIONES */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-2xl font-bold flex items-center gap-1">
                  <span>Instrucciones</span>
                  <span className="text-[#DB0F0F]">*</span>
                </label>
                <p className="text-[#444444] text-lg">
                  Explica tu receta paso a paso para que sea fácil de seguir en la cocina.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {instructions.map((inst, index) => (
                  <div key={inst.id} className="flex items-start gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    <span className="w-10 h-10 rounded-full bg-[#839958] text-white font-bold text-lg flex items-center justify-center shrink-0 mt-1">
                      {index + 1}
                    </span>

                    <textarea
                      rows="2"
                      placeholder={`¿Qué se debe hacer en el paso ${index + 1}?`}
                      value={inst.text}
                      onChange={(e) => handleInstructionChange(inst.id, e.target.value)}
                      className="flex-1 bg-white border border-gray-300 rounded-xl p-3 text-lg focus:outline-none focus:border-[#2E5834]"
                    />

                    {/* Botón Borrar Paso */}
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(inst.id)}
                      aria-label="Eliminar paso"
                      className="p-3 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors mt-1"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddInstruction}
                className="self-start font-bold text-xl text-[#2E5834] hover:text-[#1f3d23] py-2 px-4 rounded-xl hover:bg-[#D6E0D8]/40 transition-colors"
              >
                + Agregar paso
              </button>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Consejos de cocina */}
            <div className="flex flex-col gap-2">
              <label htmlFor="tips" className="text-xl font-bold">
                Tips y Consejos de Cocina
              </label>
              <textarea
                id="tips"
                rows="3"
                placeholder="¡Comparte tus secretos! Trucos de horno, sustitutos de ingredientes o consejos para que quede perfecta."
                value={cooksTips}
                onChange={(e) => setCooksTips(e.target.value)}
                className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834]"
              />
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Categorías y Etiquetas */}
            <div className="flex flex-col gap-6">
              <label className="text-xl font-bold flex items-center gap-1">
                <span>Categorías y Etiquetas</span>
                <span className="text-[#DB0F0F]">*</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  value={tags.cuisine}
                  onChange={(e) => setTags({ ...tags, cuisine: e.target.value })}
                  className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834] cursor-pointer font-medium"
                >
                  <option value="">Selecciona el tipo de cocina</option>
                  <option value="Mexicana">Mexicana</option>
                  <option value="Italiana">Italiana</option>
                  <option value="Casera / Tradicional">Casera / Tradicional</option>
                  <option value="Repostería / Dulce">Repostería / Dulce</option>
                  <option value="Internacional">Internacional</option>
                </select>

                <select
                  value={tags.mealType}
                  onChange={(e) => setTags({ ...tags, mealType: e.target.value })}
                  className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834] cursor-pointer font-medium"
                >
                  <option value="">Selecciona el tipo de comida</option>
                  <option value="Desayuno">Desayuno y Almuerzo</option>
                  <option value="Comida principal">Comida Principal</option>
                  <option value="Cena">Cena</option>
                  <option value="Postre / Panadería">Postre y Panadería</option>
                </select>

                <select
                  value={tags.dietary}
                  onChange={(e) => setTags({ ...tags, dietary: e.target.value })}
                  className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834] cursor-pointer font-medium"
                >
                  <option value="">Restricción alimentaria</option>
                  <option value="Ninguna">Ninguna (Estándar)</option>
                  <option value="Vegetariana">Vegetariana</option>
                  <option value="Vegana">Vegana</option>
                  <option value="Baja en azúcar">Baja en Azúcar / Diabéticos</option>
                </select>

                <select
                  value={tags.cookingMethod}
                  onChange={(e) => setTags({ ...tags, cookingMethod: e.target.value })}
                  className="w-full bg-[#FBFBFB] border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:border-[#2E5834] cursor-pointer font-medium"
                >
                  <option value="">Método de cocción</option>
                  <option value="Horno">Al Horno</option>
                  <option value="Estufa / Sartén">Estufa / Sartén</option>
                  <option value="Sin cocción">Sin Cocción / Frío</option>
                  <option value="Olla de cocción">Olla Express / Lenta</option>
                </select>
              </div>
            </div>

            {/* Botones de Envío y Cancelar */}
            <div className="flex items-center justify-end gap-5 pt-6">
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Estás seguro de que deseas cancelar la creación de esta receta?')) {
                    console.log('[LOG]: Usuario canceló el formulario');
                    alert('Regresando a Inicio...');
                  }
                }}
                className="px-8 py-3.5 rounded-full border-2 border-[#2E5834] text-[#2E5834] font-bold text-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-full bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold text-xl shadow-md transition-all"
              >
                Publicar Receta
              </button>
            </div>

            <p className="text-sm text-gray-500 border-t pt-4">
              Si encontraste esta receta en una revista, libro de cocina o página web, no podemos publicarla aquí. Nuestra plataforma promueve la originalidad y el respeto a los derechos de autor.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}