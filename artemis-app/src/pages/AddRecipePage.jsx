import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AddRecipePage() {
  const navigate = useNavigate();

  // 1. Datos generales de la receta
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Comidas y Platillos',
    total_time_minutes: 45,
    servings: 4
  });

  // 2. Archivo de imagen real
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 3. Ingredientes dinámicos
  const [ingredients, setIngredients] = useState([
    { quantity: '1', unit: 'taza', name: '' },
    { quantity: '2', unit: 'cdas', name: '' }
  ]);

  // 4. Pasos de instrucción dinámicos (Para estilo Figma)
  const [steps, setSteps] = useState([
    'Lava y desinfecta perfectamente todos los ingredientes.',
    'Cocina a fuego medio durante 15 minutos removiendo constantemente.'
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Manejo de inputs generales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo de imagen y vista previa
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Manejo de Ingredientes
  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredientRow = () => {
    setIngredients([...ingredients, { quantity: '1', unit: 'pza', name: '' }]);
  };

  const removeIngredientRow = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // Manejo de Pasos
  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStepRow = () => {
    setSteps([...steps, '']);
  };

  const removeStepRow = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  // Enviar formulario a Node.js / PostgreSQL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Por favor escribe un título para tu receta.');
      return;
    }

    setLoading(true);

    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('description', formData.description);
    dataToSend.append('category', formData.category);
    dataToSend.append('total_time_minutes', formData.total_time_minutes);
    dataToSend.append('servings', formData.servings);

    if (imageFile) {
      dataToSend.append('image', imageFile);
    }

    const validIngredients = ingredients.filter((i) => i.name.trim() !== '');
    dataToSend.append('ingredients', JSON.stringify(validIngredients));

    try {
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        body: dataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert('🌟 ¡Tu receta se ha publicado con éxito!');
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
        <div className="bg-white p-8 md:p-14 rounded-[32px] shadow-sm border border-gray-100">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h1 className="text-3xl md:text-5xl font-black text-[#1D1D1D] mb-3">
              Publicar una Receta
            </h1>
            <p className="text-gray-500 text-lg">
              ¿Tienes una joya en tu cocina? Añade tu receta y presume tu creatividad culinaria con la comunidad.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-8 font-semibold text-center">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* ZONA PUNTEADA DE CARGA DE IMAGEN (ESTILO FIGMA) */}
            <div>
              <label className="block text-gray-800 font-bold text-lg mb-3">Foto del Platillo *</label>
              <div className="relative border-2 border-dashed border-[#839958] bg-[#839958]/10 hover:bg-[#839958]/15 transition-all rounded-3xl p-8 text-center cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="h-64 w-full object-cover rounded-2xl shadow-md mb-4"
                    />
                    <span className="bg-[#2E5834] text-white px-5 py-2 rounded-full font-bold text-sm">
                      📸 Cambiar foto seleccionada
                    </span>
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-[#2E5834] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow-md group-hover:scale-105 transition-transform">
                      +
                    </div>
                    <p className="text-[#2E5834] font-bold text-lg">Añadir una foto</p>
                    <p className="text-gray-500 text-sm mt-1">Sube una imagen clara en formato JPG o PNG</p>
                  </div>
                )}
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="block text-gray-800 font-bold text-lg mb-2">Título de la Receta *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej. Pollo Kung Pao Tradicional"
                required
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#2E5834] text-lg bg-[#FBFBFB]"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-gray-800 font-bold text-lg mb-2">Descripción *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Comparte qué hace especial a este platillo, su historia o por qué te encanta..."
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#2E5834] text-lg bg-[#FBFBFB]"
              ></textarea>
            </div>

            {/* Porciones, Tiempo y Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-800 font-bold text-base mb-2">Porciones *</label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#2E5834] text-lg bg-[#FBFBFB]"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-bold text-base mb-2">Tiempo Total (min) *</label>
                <input
                  type="number"
                  name="total_time_minutes"
                  value={formData.total_time_minutes}
                  onChange={handleChange}
                  min="5"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#2E5834] text-lg bg-[#FBFBFB]"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-bold text-base mb-2">Categoría *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#2E5834] bg-[#FBFBFB] text-lg"
                >
                  <option value="Populares">Populares</option>
                  <option value="Comidas y Platillos">Comidas y Platillos</option>
                  <option value="Dietas">Dietas</option>
                  <option value="Ocasiones">Ocasiones</option>
                </select>
              </div>
            </div>

            {/* SECCIÓN INGREDIENTES */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-800 font-bold text-xl">Ingredientes *</h3>
                  <p className="text-gray-500 text-sm">Lista cada ingrediente con su cantidad y medida.</p>
                </div>
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
                      placeholder="Cant."
                      value={ing.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      className="w-24 px-4 py-3 rounded-2xl border border-gray-200 text-base bg-[#FBFBFB]"
                    />
                    <input
                      type="text"
                      placeholder="Medida"
                      value={ing.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      className="w-32 px-4 py-3 rounded-2xl border border-gray-200 text-base bg-[#FBFBFB]"
                    />
                    <input
                      type="text"
                      placeholder="Nombre del ingrediente *"
                      value={ing.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-base bg-[#FBFBFB]"
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredientRow(index)}
                        className="text-gray-400 hover:text-red-500 font-bold p-2 text-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN INSTRUCCIONES / PASOS (MAQUETA ACTIVA FIGMA) */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-800 font-bold text-xl">Instrucciones *</h3>
                  <p className="text-gray-500 text-sm">Divide tu preparación en pasos claros y sencillos.</p>
                </div>
                <button
                  type="button"
                  onClick={addStepRow}
                  className="bg-[#839958]/20 text-[#2E5834] hover:bg-[#839958]/30 font-bold px-4 py-2 rounded-full text-sm transition-colors"
                >
                  + Agregar Paso
                </button>
              </div>

              <div className="space-y-4">
                {steps.map((stepText, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#2E5834] text-white font-bold flex items-center justify-center shrink-0 mt-1">
                      {index + 1}
                    </span>
                    <textarea
                      rows="2"
                      placeholder={`Describe el paso ${index + 1}...`}
                      value={stepText}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#2E5834] text-base bg-[#FBFBFB]"
                    ></textarea>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStepRow(index)}
                        className="text-gray-400 hover:text-red-500 font-bold p-2 mt-1 text-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* BOTÓN SUBMIT FIGMA STYLE */}
            <div className="pt-6 flex justify-end gap-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-4 rounded-full border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2E5834] hover:bg-[#1f3d23] text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Publicar Receta'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}