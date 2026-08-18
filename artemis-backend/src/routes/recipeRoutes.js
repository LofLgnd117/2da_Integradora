const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { upload, buildFileUrl } = require('../middleware/upload');
const { notify, unlockBadge } = require('../services/gamification');

const ALLOWED_DIFFICULTIES = ['Fácil', 'Media', 'Difícil'];

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
             u.first_name || ' ' || u.last_name AS author,
             (SELECT COUNT(*) FROM recipe_likes rl WHERE rl.recipe_id = r.id) AS likes_count
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
router.get('/:id', optionalAuth, async (req, res) => {
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

    const stepsRes = await db.query(`
      SELECT step_number, instruction_text
      FROM recipe_steps
      WHERE recipe_id = $1
      ORDER BY step_number ASC`, [id]);

    const likesRes = await db.query(`SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = $1`, [id]);

    const reviewsRes = await db.query(`
      SELECT rr.id, rr.comment_text, rr.created_at, rr.user_id,
             u.first_name || ' ' || u.last_name AS author
      FROM recipe_reviews rr
      JOIN users u ON rr.user_id = u.id
      WHERE rr.recipe_id = $1
      ORDER BY rr.created_at DESC`, [id]);

    let likedByMe = false;
    if (req.userId) {
      const likedRes = await db.query(
        `SELECT 1 FROM recipe_likes WHERE recipe_id = $1 AND user_id = $2`,
        [id, req.userId]
      );
      likedByMe = likedRes.rows.length > 0;
    }

    const recipeData = recipeRes.rows[0];
    recipeData.ingredients = ingredientsRes.rows;
    recipeData.steps = stepsRes.rows;
    recipeData.likesCount = parseInt(likesRes.rows[0].count, 10);
    recipeData.likedByMe = likedByMe;
    recipeData.reviews = reviewsRes.rows;

    res.json({ success: true, data: recipeData });
  } catch (error) {
    console.error('[ERROR - GET /api/recipes/:id]:', error.message);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// =====================================================================
// POST /api/recipes - Crear una nueva receta con sus ingredientes
// =====================================================================
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  const client = await db.connect();
  try {
    const {
      title,
      description,
      total_time_minutes,
      servings,
      category,
      chef_tips,
      difficulty
    } = req.body;

    const finalDifficulty = ALLOWED_DIFFICULTIES.includes(difficulty) ? difficulty : 'Fácil';

    let finalImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
    if (req.file) {
      finalImageUrl = buildFileUrl(req, req.file.filename);
    }

    let ingredientsList = [];
    if (req.body.ingredients) {
      ingredientsList = typeof req.body.ingredients === 'string'
        ? JSON.parse(req.body.ingredients)
        : req.body.ingredients;
    }

    let stepsList = [];
    if (req.body.steps) {
      stepsList = typeof req.body.steps === 'string'
        ? JSON.parse(req.body.steps)
        : req.body.steps;
    }

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'El título y la categoría son obligatorios.' });
    }

    await client.query('BEGIN');

    const recipeQuery = `
      INSERT INTO recipes (user_id, title, description, total_time_minutes, servings, image_url, category, chef_tips, difficulty)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
    `;
    const recipeValues = [
      req.userId,
      title.trim(),
      description ? description.trim() : '',
      parseInt(total_time_minutes) || 30,
      parseInt(servings) || 4,
      finalImageUrl,
      category,
      chef_tips ? chef_tips.trim() : null,
      finalDifficulty
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

    if (stepsList && Array.isArray(stepsList) && stepsList.length > 0) {
      const stepQuery = `
        INSERT INTO recipe_steps (recipe_id, step_number, instruction_text)
        VALUES ($1, $2, $3);
      `;
      let stepNumber = 1;
      for (const stepText of stepsList) {
        if (stepText && stepText.trim() !== '') {
          await client.query(stepQuery, [newRecipeId, stepNumber, stepText.trim()]);
          stepNumber++;
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
router.post('/save', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { recipeId } = req.body;

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

    const savedCountRes = await db.query(`SELECT COUNT(*) FROM board_recipes WHERE board_id = $1`, [boardId]);
    if (parseInt(savedCountRes.rows[0].count, 10) === 2) {
      await unlockBadge(db, userId, 'maestro_del_orden');
    }

    res.json({ success: true, message: '¡Receta guardada en tus favoritas!' });
  } catch (error) {
    console.error('[ERROR - POST /api/recipes/save]:', error.message);
    res.status(500).json({ success: false, message: 'Error al guardar la receta' });
  }
});

// =====================================================================
// GET /api/recipes/saved/:userId - Obtener todas las recetas guardadas del usuario
// Solo el dueño de la cuenta puede consultar su propia lista de favoritas.
// =====================================================================
router.get('/saved/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (parseInt(userId, 10) !== req.userId) {
      return res.status(403).json({ success: false, message: 'No puedes ver las recetas guardadas de otro usuario.' });
    }

    const query = `
      SELECT r.id, r.title, r.description, r.total_time_minutes,
             r.servings, r.image_url, r.category,
             u.first_name || ' ' || u.last_name AS author,
             br.saved_at,
             (SELECT COUNT(*) FROM recipe_likes rl WHERE rl.recipe_id = r.id) AS likes_count
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

// =====================================================================
// DELETE /api/recipes/save/:recipeId - Quitar una receta de "Mis Favoritas"
// =====================================================================
router.delete('/save/:recipeId', requireAuth, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.userId;

    const boardRes = await db.query(
      `SELECT id FROM saved_boards WHERE user_id = $1 AND title = 'Mis Favoritas' LIMIT 1`,
      [userId]
    );

    if (boardRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No tienes recetas guardadas.' });
    }

    const boardId = boardRes.rows[0].id;

    const deleteRes = await db.query(
      `DELETE FROM board_recipes WHERE board_id = $1 AND recipe_id = $2 RETURNING recipe_id`,
      [boardId, recipeId]
    );

    if (deleteRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Esa receta no estaba en tus favoritas.' });
    }

    res.json({ success: true, message: 'Receta quitada de tus favoritas.' });
  } catch (error) {
    console.error('[ERROR - DELETE /api/recipes/save/:recipeId]:', error.message);
    res.status(500).json({ success: false, message: 'Error al quitar la receta de favoritas' });
  }
});

// =====================================================================
// DELETE /api/recipes/:id - Eliminar receta y limpiar sus relaciones reales
// Solo el dueño de la receta puede eliminarla.
// =====================================================================
router.delete('/:id', requireAuth, async (req, res) => {
  const client = await db.connect();
  try {
    const { id } = req.params;

    // 0. Verificamos que la receta exista y que quien la borra sea el dueño.
    const ownerRes = await client.query('SELECT user_id FROM recipes WHERE id = $1', [id]);

    if (ownerRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'La receta no existe o ya fue borrada.' });
    }

    if (ownerRes.rows[0].user_id !== req.userId) {
      return res.status(403).json({ success: false, message: 'No puedes eliminar una receta que no te pertenece.' });
    }

    await client.query('BEGIN');

    // 1. Limpiamos ÚNICAMENTE las tablas relacionales que sí existen en tu BD:
    await client.query('DELETE FROM board_recipes WHERE recipe_id = $1', [id]);
    await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [id]);

    // 2. Eliminamos la receta principal de la tabla recipes:
    const result = await client.query('DELETE FROM recipes WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'La receta no existe o ya fue borrada.' });
    }

    await client.query('COMMIT');
    console.log(`[LOG - DELETE]: Receta ID ${id} eliminada correctamente de PostgreSQL.`);

    res.json({ success: true, message: '¡Receta eliminada con éxito!' });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[ERROR - DELETE /api/recipes/:id]:', error.message);
    res.status(500).json({ success: false, message: 'Error al eliminar de PostgreSQL' });
  } finally {
    client.release();
  }
});

// =====================================================================
// POST /api/recipes/:id/like - Alternar "Me gusta" en una receta
// =====================================================================
router.post('/:id/like', requireAuth, async (req, res) => {
  const client = await db.connect();
  try {
    const { id } = req.params;

    const recipeRes = await client.query('SELECT user_id, title, first_like_notified FROM recipes WHERE id = $1', [id]);
    if (recipeRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Receta no encontrada' });
    }
    const recipe = recipeRes.rows[0];

    await client.query('BEGIN');

    const existing = await client.query(
      'SELECT 1 FROM recipe_likes WHERE recipe_id = $1 AND user_id = $2',
      [id, req.userId]
    );

    let liked;
    if (existing.rows.length > 0) {
      await client.query('DELETE FROM recipe_likes WHERE recipe_id = $1 AND user_id = $2', [id, req.userId]);
      liked = false;
    } else {
      await client.query('INSERT INTO recipe_likes (recipe_id, user_id) VALUES ($1, $2)', [id, req.userId]);
      liked = true;

      if (!recipe.first_like_notified) {
        await client.query('UPDATE recipes SET first_like_notified = TRUE WHERE id = $1', [id]);
        await notify(
          client,
          recipe.user_id,
          'like',
          '🌟 ¡Primer Me Gusta en tu Receta!',
          `A alguien de la comunidad le encantó tu "${recipe.title}". ¡Tu sazón inspira a otros!`,
          id
        );
        await unlockBadge(client, recipe.user_id, 'receta_de_oro');
      }
    }

    const countRes = await client.query('SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = $1', [id]);

    await client.query('COMMIT');
    res.json({ success: true, liked, likesCount: parseInt(countRes.rows[0].count, 10) });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[ERROR - POST /api/recipes/:id/like]:', error.message);
    res.status(500).json({ success: false, message: 'Error al actualizar el "Me gusta"' });
  } finally {
    client.release();
  }
});

// =====================================================================
// POST /api/recipes/:id/reviews - Publicar una reseña en una receta
// =====================================================================
router.post('/:id/reviews', requireAuth, async (req, res) => {
  const client = await db.connect();
  try {
    const { id } = req.params;
    const { comment } = req.body || {};

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Escribe algo antes de publicar tu reseña.' });
    }

    const recipeRes = await client.query('SELECT user_id FROM recipes WHERE id = $1', [id]);
    if (recipeRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Receta no encontrada' });
    }
    const recipeOwnerId = recipeRes.rows[0].user_id;

    await client.query('BEGIN');

    const insertRes = await client.query(
      `INSERT INTO recipe_reviews (recipe_id, user_id, comment_text)
       VALUES ($1, $2, $3)
       RETURNING id, comment_text, created_at`,
      [id, req.userId, comment.trim()]
    );

    if (recipeOwnerId !== req.userId) {
      await unlockBadge(client, req.userId, 'critico_del_barrio');
    }

    await client.query('COMMIT');

    const authorRes = await db.query('SELECT first_name, last_name FROM users WHERE id = $1', [req.userId]);
    const author = authorRes.rows[0] ? `${authorRes.rows[0].first_name} ${authorRes.rows[0].last_name}` : '';

    res.status(201).json({ success: true, review: { ...insertRes.rows[0], author, user_id: req.userId } });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[ERROR - POST /api/recipes/:id/reviews]:', error.message);
    res.status(500).json({ success: false, message: 'Error al publicar la reseña' });
  } finally {
    client.release();
  }
});

module.exports = router;