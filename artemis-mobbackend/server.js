const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importamos la conexión a la base de datos
const db = require('./db'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON desde la app

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '¡El servidor de Ártemis está vivo y funcionando!' });
});

// ==========================================
// RUTA 1: Obtener todas las recetas (Para HomeScreen)
// ==========================================
app.get('/api/recetas', async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id, 
        r.title AS titulo, 
        r.total_time_minutes AS tiempo, 
        r.image_url AS imagen,
        u.first_name || ' ' || u.last_name AS chef
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener las recetas:", error);
    res.status(500).json({ error: 'Hubo un problema al consultar la base de datos' });
  }
});

// ==========================================
// RUTA 2: Obtener detalle de UNA receta (Para RecipeDetailScreen)
// ==========================================
app.get('/api/recetas/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;

    // 1. Obtener los datos principales
    const recipeQuery = `
      SELECT 
        r.*, 
        u.first_name || ' ' || u.last_name AS chef 
      FROM recipes r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.id = $1
    `;
    const recipeResult = await db.query(recipeQuery, [recipeId]);

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    const receta = recipeResult.rows[0];

    // 2. Obtener los ingredientes
    const ingredientsQuery = `
      SELECT quantity, unit, name 
      FROM recipe_ingredients 
      WHERE recipe_id = $1 
      ORDER BY sort_order
    `;
    const ingredientsResult = await db.query(ingredientsQuery, [recipeId]);

    // 3. Obtener los pasos
    const stepsQuery = `
      SELECT step_number, instruction_text 
      FROM recipe_steps 
      WHERE recipe_id = $1 
      ORDER BY step_number
    `;
    const stepsResult = await db.query(stepsQuery, [recipeId]);

    // Armamos el paquete completo
    const respuestaCompleta = {
      ...receta,
      ingredientes: ingredientsResult.rows,
      pasos: stepsResult.rows
    };

    res.json(respuestaCompleta);

  } catch (error) {
    console.error("Error al obtener el detalle de la receta:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});