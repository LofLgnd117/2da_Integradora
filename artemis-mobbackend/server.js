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

// ==========================================
// RUTA 3: Crear una nueva receta (CON INGREDIENTES Y PASOS)
// ==========================================
app.post('/api/recetas', async (req, res) => {
  try {
    // Extraemos todos los datos (incluyendo las nuevas listas y el consejo)
    const { titulo, descripcion, porciones, tiempo, categoria, chef_tips, ingredientes, pasos } = req.body;
    const userId = 1; 
    const imagenPorDefecto = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

    // Iniciamos una TRANSACCIÓN (Si algo falla, se cancela todo)
    await db.query('BEGIN');

    // 1. Insertamos la receta principal
    const insertRecipeQuery = `
      INSERT INTO recipes (user_id, title, description, servings, total_time_minutes, category, image_url, chef_tips)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;
    const recipeValues = [
      userId, 
      titulo || 'Receta sin título', 
      descripcion || '', 
      parseInt(porciones) || 4, 
      parseInt(tiempo) || 30, 
      categoria || 'Comidas y Platillos', 
      imagenPorDefecto,
      chef_tips || null // Guardamos el consejo del chef
    ];
    
    const recipeResult = await db.query(insertRecipeQuery, recipeValues);
    const newRecipeId = recipeResult.rows[0].id;

    // 2. Insertamos los Ingredientes
    if (ingredientes && ingredientes.length > 0) {
      const ingQuery = `INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit, sort_order) VALUES ($1, $2, $3, $4, $5)`;
      for (let i = 0; i < ingredientes.length; i++) {
        const ing = ingredientes[i];
        if (ing.name.trim() !== '') {
          // Guardamos la cantidad y dejamos la unidad vacía para simplificar
          await db.query(ingQuery, [newRecipeId, ing.name, ing.quantity, '', i + 1]);
        }
      }
    }

    // 3. Insertamos los Pasos (Instrucciones)
    if (pasos && pasos.length > 0) {
      const stepQuery = `INSERT INTO recipe_steps (recipe_id, step_number, instruction_text) VALUES ($1, $2, $3)`;
      for (let i = 0; i < pasos.length; i++) {
        if (pasos[i].trim() !== '') {
          await db.query(stepQuery, [newRecipeId, i + 1, pasos[i]]);
        }
      }
    }

    // Confirmamos la transacción
    await db.query('COMMIT');

    res.status(201).json({
      mensaje: '¡Receta creada con éxito con todos sus detalles!',
      nueva_receta_id: newRecipeId
    });

  } catch (error) {
    // Si hubo un error, revertimos todo para no dejar datos a medias
    await db.query('ROLLBACK');
    console.error("Error al guardar la nueva receta:", error);
    res.status(500).json({ error: 'Hubo un error al guardar la receta en la base de datos' });
  }
});





// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});