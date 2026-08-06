import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AddRecipePage() {
  const navigate = useNavigate();

  // Estado para los campos generales de la receta
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Comidas y Platillos',
    total_time_minutes: 30,
    servings: 4,
    image_url: ''
  });

  // Estado dinámico para la lista de ingredientes
  const [ingredients, setIngredients] = useState([
    { quantity: '1', unit: 'taza', name: '' },
    { quantity: '2', unit: 'cdas', name: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cambios en inputs generales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Cambios en una fila de ingrediente específica
  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  // Agregar una nueva fila vacía de ingrediente
  const addIngredientRow = () => {
    setIngredients([...ingredients, { quantity: '1', unit: 'pza', name: '' }]);
  };

  // Eliminar una fila de ingrediente
  const removeIngredientRow = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // Enviar el formulario a Node.js / PostgreSQL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Por favor escribe un título para tu receta.');
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      // Filtramos ingredientes que no tengan nombre escrito
      ingredients: ingredients.filter((i) => i.name.trim() !== '')
    };

    try {
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        alert('🌟 ¡Tu receta se ha publicado con éxito!');
        // Redirigimos a ver la receta recién creada
        navigate(`/receta/${data.recipeId}`);
      } else {
        setErrorMsg(data.message || 'Ocurrió un error al publicar.');
      }
    } catch (err) {
      console.error('[ERROR - SUBIR RECETA]:', err);
      setErrorMsg('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-6 py-12 flex-1">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-black text-[#1D1D1D] mb-2">
            Publicar una Receta
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Comparte tu sazón con la comunidad de Ártemis.
          </p>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Título del Platillo *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej. Sopa de Tortilla Tradicional"
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#2E5834] text-lg"
              />
            </div>

            {/* Categoría y Tiempo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#2E5834] bg-white text-lg"
                >
                  <option value="Populares">Populares</option>
                  <option value="Comidas y Platillos">Comidas y Platillos</option>
                  <option value="Dietas">Dietas</option>
                  <option value="Ocasiones">Ocasiones</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Tiempo (minutos)</label>
                <input
                  type="number"
                  name="total_time_minutes"
                  value={formData.total_time_minutes}
                  onChange={handleChange}
                  min="5"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#2E5834] text-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Porciones</label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#2E5834] text-lg"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Descripción breve</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Cuéntanos qué hace especial a esta receta..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#2E5834] text-lg"
              ></textarea>
            </div>

            {/* URL de Imagen */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">URL de la Imagen (Foto del platillo)</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#2E5834] text-lg"
              />
            </div>

            {/* INGREDIENTES DINÁMICOS */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-gray-700 font-bold text-xl">Ingredientes</label>
                <button
                  type="button"
                  onClick={addIngredientRow}
                  className="bg-[#839958]/20 text-[#2E5834] hover:bg-[#839958]/30 font-bold px-4 py-2 rounded-full text-sm transition-colors"
                >
                  + Agregar Ingrediente
                </button>
              </div>

              <div className="space-y-3">
                {ingredients.map((ing, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Cant. (1, 1/2)"
                      value={ing.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      className="w-28 px-3 py-2 rounded-xl border border-gray-300 text-base"
                    />
                    <input
                      type="text"
                      placeholder="Unidad (taza, g)"
                      value={ing.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      className="w-36 px-3 py-2 rounded-xl border border-gray-300 text-base"
                    />
                    <input
                      type="text"
                      placeholder="Nombre del ingrediente *"
                      value={ing.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-base"
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredientRow(index)}
                        className="text-red-500 hover:text-red-700 font-bold p-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Botón Guardar */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold py-4 rounded-full text-xl shadow-md transition-all disabled:opacity-50"
              >
                {loading ? 'Publicando en PostgreSQL...' : 'PUBLICAR RECETA AHORA'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}