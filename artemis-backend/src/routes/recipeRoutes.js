const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// =====================================================================
// GET /api/recipes - Obtener recetas con filtro dinámico por categoría o búsqueda
// =====================================================================
router.get('/', async (req, res) => {
  try {
    const { categoria, buscar } = req.query;
    
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

    if (categoria && categoria.trim() !== '') {
      query += ` AND r.category = $${paramIndex}`;
      values.push(categoria.trim());
      paramIndex++;
    }

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

// 1. Asegurar que exista la carpeta de guardado
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configurar dónde y con qué nombre se guardarán las fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receta-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// =====================================================================
// POST /api/recipes - Crear una nueva receta con sus ingredientes
// =====================================================================
router.post('/', upload.single('image'), async (req, res) => {
  const client = await db.connect();
  try {
    const {
      title,
      description,
      total_time_minutes,
      servings,
      category
    } = req.body;

    let finalImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
    if (req.file) {
      finalImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    let ingredientsList = [];
    if (req.body.ingredients) {
      ingredientsList = typeof req.body.ingredients === 'string' 
        ? JSON.parse(req.body.ingredients) 
        : req.body.ingredients;
    }

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'El título y la categoría son obligatorios.' });
    }

    await client.query('BEGIN');

    const recipeQuery = `
      INSERT INTO recipes (user_id, title, description, total_time_minutes, servings, image_url, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;
    const recipeValues = [
      1,
      title.trim(),
      description ? description.trim() : '',
      parseInt(total_time_minutes) || 30,
      parseInt(servings) || 4,
      finalImageUrl,
      category
    ];
    
    const recipeRes = await client.query(recipeQuery, recipeValues);
    const newRecipeId = recipeRes.rows[0].id;

    if (ingredientsList && Array.isArray(ingredientsList) && ingredientsList.length > 0) {
      const ingQuery = `
        INSERT INTO recipe_ingredients (recipe_id, quantity, unit, name, sort_order)
        VALUES ($1, $2, $3, $4, $5);
      `;
      for (let i = 0; i < ingredientsList.length; i++) {
        const ing = ingredientsList[i];
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

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: '¡Receta publicada con éxito!', recipeId: newRecipeId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[ERROR - POST /api/recipes]:', error.message);
    res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
  } finally {
    client.release();
  }
});

// =====================================================================
// POST /api/recipes/save - Guardar una receta en el tablero del usuario
// =====================================================================
router.post('/save', async (req, res) => {
  try {
    const { userId = 1, recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ success: false, message: 'Se requiere el ID de la receta' });
    }

    let boardRes = await db.query(
      `SELECT id FROM saved_boards WHERE user_id = $1 AND title = 'Mis Favoritas' LIMIT 1`,
      [userId]
    );

    let boardId;
    if (boardRes.rows.length === 0) {
      const newBoard = await db.query(
        `INSERT INTO saved_boards (user_id, title) VALUES ($1, 'Mis Favoritas') RETURNING id`,
        [userId]
      );
      boardId = newBoard.rows[0].id;
    } else {
      boardId = boardRes.rows[0].id;
    }

    await db.query(
      `INSERT INTO board_recipes (board_id, recipe_id, saved_at) 
       VALUES ($1, $2, CURRENT_TIMESTAMP) 
       ON CONFLICT (board_id, recipe_id) DO NOTHING`,
      [boardId, recipeId]
    );

    res.json({ success: true, message: '¡Receta guardada en tus favoritas!' });
  } catch (error) {
    console.error('[ERROR - POST /api/recipes/save]:', error.message);
    res.status(500).json({ success: false, message: 'Error al guardar la receta' });
  }
});

// =====================================================================
// GET /api/recipes/saved/:userId - Obtener todas las recetas guardadas del usuario
// =====================================================================
router.get('/saved/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT r.id, r.title, r.description, r.total_time_minutes, 
             r.servings, r.image_url, r.category,
             u.first_name || ' ' || u.last_name AS author,
             br.saved_at
      FROM board_recipes br
      JOIN saved_boards sb ON br.board_id = sb.id
      JOIN recipes r ON br.recipe_id = r.id
      JOIN users u ON r.user_id = u.id
      WHERE sb.user_id = $1
      ORDER BY br.saved_at DESC;
    `;

    const { rows } = await db.query(query, [userId]);

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('[ERROR - GET /api/recipes/saved/:userId]:', error.message);
    res.status(500).json({ success: false, message: 'Error al consultar recetas guardadas' });
  }
});

module.exports = router;