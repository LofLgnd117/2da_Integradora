// artemis-mobbackend/src/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');
const { upload, buildFileUrl } = require('../middleware/upload');

const DEFAULT_RECIPE_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

// ==========================================
// RUTA: Obtener todas las recetas (Para HomeScreen)
// ==========================================
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT
        r.id,
        r.title AS titulo,
        r.total_time_minutes AS tiempo,
        r.image_url AS imagen,
        r.category AS categoria,
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
// RUTA: Buscar recetas (antes de /:id para evitar conflictos)
// ==========================================
router.get('/buscar', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const query = `
      SELECT
        r.id,
        r.title AS titulo,
        r.total_time_minutes AS tiempo,
        r.image_url AS imagen,
        u.first_name || ' ' || u.last_name AS chef
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      WHERE r.title ILIKE $1 OR u.first_name ILIKE $1 OR r.category ILIKE $1
      ORDER BY r.created_at DESC;
    `;

    const result = await db.query(query, [`%${q}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al buscar recetas:", error);
    res.status(500).json({ error: 'Hubo un problema al realizar la búsqueda' });
  }
});

// ==========================================
// RUTA: Recetas guardadas del usuario autenticado (antes de /:id)
// ==========================================
router.get('/guardadas', authMiddleware, async (req, res) => {
  try {
    const query = `
      SELECT
        r.id,
        r.title AS titulo,
        r.total_time_minutes AS tiempo,
        r.image_url AS imagen,
        r.category AS categoria,
        u.first_name || ' ' || u.last_name AS chef,
        br.saved_at
      FROM board_recipes br
      JOIN saved_boards sb ON br.board_id = sb.id
      JOIN recipes r ON br.recipe_id = r.id
      JOIN users u ON r.user_id = u.id
      WHERE sb.user_id = $1
      ORDER BY br.saved_at DESC;
    `;
    const result = await db.query(query, [req.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener recetas guardadas:', error);
    res.status(500).json({ error: 'Hubo un problema al consultar tus recetas guardadas' });
  }
});

// ==========================================
// RUTA: Obtener detalle de UNA receta
// ==========================================
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const recipeId = req.params.id;

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

    const ingredientsQuery = `
      SELECT quantity, unit, name
      FROM recipe_ingredients
      WHERE recipe_id = $1
      ORDER BY sort_order
    `;
    const ingredientsResult = await db.query(ingredientsQuery, [recipeId]);

    const stepsQuery = `
      SELECT step_number, instruction_text
      FROM recipe_steps
      WHERE recipe_id = $1
      ORDER BY step_number
    `;
    const stepsResult = await db.query(stepsQuery, [recipeId]);

    let esDueno = false;
    let estaGuardada = false;
    if (req.userId) {
      esDueno = receta.user_id === req.userId;
      const savedCheck = await db.query(
        `SELECT 1 FROM board_recipes br
         JOIN saved_boards sb ON br.board_id = sb.id
         WHERE sb.user_id = $1 AND br.recipe_id = $2`,
        [req.userId, recipeId]
      );
      estaGuardada = savedCheck.rows.length > 0;
    }

    res.json({
      ...receta,
      ingredientes: ingredientsResult.rows,
      pasos: stepsResult.rows,
      es_dueno: esDueno,
      esta_guardada: estaGuardada,
    });
  } catch (error) {
    console.error("Error al obtener el detalle de la receta:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// RUTA: Crear una nueva receta (protegida, con foto opcional)
// ==========================================
router.post('/', authMiddleware, upload.single('imagen'), async (req, res) => {
  const client = await db.connect();
  try {
    const { titulo, descripcion, porciones, tiempo, categoria, chef_tips } = req.body;

    let ingredientes = [];
    if (req.body.ingredientes) {
      ingredientes = typeof req.body.ingredientes === 'string'
        ? JSON.parse(req.body.ingredientes)
        : req.body.ingredientes;
    }
    let pasos = [];
    if (req.body.pasos) {
      pasos = typeof req.body.pasos === 'string' ? JSON.parse(req.body.pasos) : req.body.pasos;
    }

    const finalImageUrl = req.file ? buildFileUrl(req, req.file.filename) : DEFAULT_RECIPE_IMAGE;

    await client.query('BEGIN');

    const insertRecipeQuery = `
      INSERT INTO recipes (user_id, title, description, servings, total_time_minutes, category, image_url, chef_tips)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;
    const recipeValues = [
      req.userId,
      titulo?.trim() || 'Receta sin título',
      descripcion?.trim() || '',
      parseInt(porciones) || 4,
      parseInt(tiempo) || 30,
      categoria || 'Comidas y Platillos',
      finalImageUrl,
      chef_tips?.trim() || null,
    ];

    const recipeResult = await client.query(insertRecipeQuery, recipeValues);
    const newRecipeId = recipeResult.rows[0].id;

    if (ingredientes.length > 0) {
      const ingQuery = `INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit, sort_order) VALUES ($1, $2, $3, $4, $5)`;
      for (let i = 0; i < ingredientes.length; i++) {
        const ing = ingredientes[i];
        if (ing.name && ing.name.trim() !== '') {
          await client.query(ingQuery, [newRecipeId, ing.name.trim(), ing.quantity || '', '', i + 1]);
        }
      }
    }

    if (pasos.length > 0) {
      const stepQuery = `INSERT INTO recipe_steps (recipe_id, step_number, instruction_text) VALUES ($1, $2, $3)`;
      for (let i = 0; i < pasos.length; i++) {
        if (pasos[i] && pasos[i].trim() !== '') {
          await client.query(stepQuery, [newRecipeId, i + 1, pasos[i]]);
        }
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ mensaje: '¡Receta creada con éxito!', nueva_receta_id: newRecipeId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error al guardar:", error);
    res.status(500).json({ error: 'Hubo un error al guardar' });
  } finally {
    client.release();
  }
});

// ==========================================
// RUTA: Eliminar una receta (protegida, solo el dueño)
// ==========================================
router.delete('/:id', authMiddleware, async (req, res) => {
  const client = await db.connect();
  try {
    const recipeId = req.params.id;

    const ownerCheck = await client.query('SELECT user_id FROM recipes WHERE id = $1', [recipeId]);
    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    if (ownerCheck.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'No puedes eliminar una receta que no te pertenece' });
    }

    await client.query('BEGIN');
    await client.query('DELETE FROM board_recipes WHERE recipe_id = $1', [recipeId]);
    await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [recipeId]);
    await client.query('DELETE FROM recipe_steps WHERE recipe_id = $1', [recipeId]);
    await client.query('DELETE FROM recipes WHERE id = $1', [recipeId]);
    await client.query('COMMIT');

    res.json({ mensaje: '¡Receta eliminada!' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error al eliminar:", error);
    res.status(500).json({ error: 'Error al intentar eliminar' });
  } finally {
    client.release();
  }
});

// ==========================================
// RUTA: Guardar / quitar receta de "Mis Favoritas" (protegidas)
// ==========================================
router.post('/:id/guardar', authMiddleware, async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipeCheck = await db.query('SELECT id FROM recipes WHERE id = $1', [recipeId]);
    if (recipeCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    let boardRes = await db.query(
      `SELECT id FROM saved_boards WHERE user_id = $1 AND title = 'Mis Favoritas' LIMIT 1`,
      [req.userId]
    );

    let boardId;
    if (boardRes.rows.length === 0) {
      const newBoard = await db.query(
        `INSERT INTO saved_boards (user_id, title) VALUES ($1, 'Mis Favoritas') RETURNING id`,
        [req.userId]
      );
      boardId = newBoard.rows[0].id;
    } else {
      boardId = boardRes.rows[0].id;
    }

    await db.query(
      `INSERT INTO board_recipes (board_id, recipe_id) VALUES ($1, $2)
       ON CONFLICT (board_id, recipe_id) DO NOTHING`,
      [boardId, recipeId]
    );

    res.json({ mensaje: '¡Receta guardada en tus favoritas!' });
  } catch (error) {
    console.error('Error al guardar receta:', error);
    res.status(500).json({ error: 'Hubo un problema al guardar la receta' });
  }
});

router.delete('/:id/guardar', authMiddleware, async (req, res) => {
  try {
    const recipeId = req.params.id;
    await db.query(
      `DELETE FROM board_recipes br
       USING saved_boards sb
       WHERE br.board_id = sb.id AND sb.user_id = $1 AND br.recipe_id = $2`,
      [req.userId, recipeId]
    );
    res.json({ mensaje: 'Receta quitada de tus favoritas' });
  } catch (error) {
    console.error('Error al quitar receta guardada:', error);
    res.status(500).json({ error: 'Hubo un problema al quitar la receta guardada' });
  }
});

module.exports = router;
