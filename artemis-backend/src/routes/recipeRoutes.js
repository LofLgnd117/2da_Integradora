// artemis-backend/src/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =====================================================================
// GET /api/recipes - Obtener recetas con filtro dinámico por categoría o búsqueda
// =====================================================================
router.get('/', async (req, res) => {
  try {
    const { categoria, buscar } = req.query;
    
    // LOG DE DEPURACIÓN: Verás en tu terminal qué filtro llegó desde React
    console.log('[LOG - FILTROS RECIBIDOS]:', { categoria, buscar });

    let query = `
      SELECT r.id, r.title, r.description, r.total_time_minutes, 
             r.servings, r.image_url, r.category,
             u.first_name || ' ' || u.last_name AS author
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    // 1. Filtro exacto por categoría (ej. ?categoria=Dietas)
    if (categoria && categoria.trim() !== '') {
      query += ` AND r.category = $${paramIndex}`;
      values.push(categoria.trim());
      paramIndex++;
    }

    // 2. Filtro de texto por título o descripción (ej. ?buscar=pollo)
    if (buscar && buscar.trim() !== '') {
      query += ` AND (r.title ILIKE $${paramIndex} OR r.description ILIKE $${paramIndex})`;
      values.push(`%${buscar.trim()}%`);
      paramIndex++;
    }

    query += ` ORDER BY r.created_at DESC;`;

    const { rows } = await db.query(query, values);
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('[ERROR - GET /api/recipes]:', error.message);
    res.status(500).json({ success: false, message: 'Error al consultar PostgreSQL' });
  }
});

// =====================================================================
// GET /api/recipes/:id - Obtener detalle de una receta específica
// =====================================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const recipeRes = await db.query(`
      SELECT r.*, u.first_name || ' ' || u.last_name AS author 
      FROM recipes r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.id = $1`, [id]);

    if (recipeRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Receta no encontrada' });
    }

    const ingredientsRes = await db.query(`
      SELECT quantity, unit, name 
      FROM recipe_ingredients 
      WHERE recipe_id = $1 
      ORDER BY sort_order ASC`, [id]);

    const recipeData = recipeRes.rows[0];
    recipeData.ingredients = ingredientsRes.rows;

    res.json({ success: true, data: recipeData });
  } catch (error) {
    console.error('[ERROR - GET /api/recipes/:id]:', error.message);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// =====================================================================
// POST /api/recipes - Crear una nueva receta con sus ingredientes
// =====================================================================
router.post('/', async (req, res) => {
  const client = await db.connect();
  try {
    const {
      title,
      description,
      total_time_minutes,
      servings,
      image_url,
      category,
      ingredients // Array esperado: [{ quantity: "500", unit: "g", name: "Pollo" }, ...]
    } = req.body;

    // Validación básica
    if (!title || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'El título y la categoría son obligatorios.' 
      });
    }

    // Iniciamos la transacción SQL
    await client.query('BEGIN');

    // 1. Insertar la cabecera de la receta (asumimos user_id = 1 de Alina Cruz para la demo)
    const recipeQuery = `
      INSERT INTO recipes (user_id, title, description, total_time_minutes, servings, image_url, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;
    const recipeValues = [
      1, // ID de Alina Cruz
      title.trim(),
      description ? description.trim() : '',
      parseInt(total_time_minutes) || 30,
      parseInt(servings) || 4,
      image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      category
    ];
    
    const recipeRes = await client.query(recipeQuery, recipeValues);
    const newRecipeId = recipeRes.rows[0].id;

    // 2. Insertar cada uno de los ingredientes en recipe_ingredients
    if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
      const ingQuery = `
        INSERT INTO recipe_ingredients (recipe_id, quantity, unit, name, sort_order)
        VALUES ($1, $2, $3, $4, $5);
      `;
      for (let i = 0; i < ingredients.length; i++) {
        const ing = ingredients[i];
        if (ing.name && ing.name.trim() !== '') {
          await client.query(ingQuery, [
            newRecipeId,
            ing.quantity || '1',
            ing.unit || 'pza',
            ing.name.trim(),
            i + 1
          ]);
        }
      }
    }

    // Si todo salió perfecto, confirmamos los cambios en PostgreSQL
    await client.query('COMMIT');

    console.log(`[LOG - POST /api/recipes]: Receta "${title}" creada con ID ${newRecipeId}`);

    res.status(201).json({
      success: true,
      message: '¡Receta publicada con éxito!',
      recipeId: newRecipeId
    });
  } catch (error) {
    // Si hubo cualquier error, deshacemos los cambios
    await client.query('ROLLBACK');
    console.error('[ERROR - POST /api/recipes]:', error.message);
    res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
  } finally {
    client.release();
  }
});

module.exports = router;