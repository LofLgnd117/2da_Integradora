// artemis-backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// =====================================================================
// GET /api/users/:id - Obtener perfil del usuario y sus recetas publicadas
// =====================================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Datos del usuario en PostgreSQL
    const userRes = await db.query(
      `SELECT id, first_name, last_name, email, created_at,
              current_streak, streak_saves_left
       FROM users WHERE id = $1`,
      [id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // 2. Recetas que este usuario ha publicado
    const recipesRes = await db.query(
      `SELECT id, title, total_time_minutes, servings, image_url, category
       FROM recipes WHERE user_id = $1 ORDER BY created_at DESC`,
      [id]
    );

    // 3. Medallas desbloqueadas
    const badgesRes = await db.query(
      `SELECT badge_type, unlocked_at FROM user_badges WHERE user_id = $1 ORDER BY unlocked_at ASC`,
      [id]
    );

    res.json({
      success: true,
      user: userRes.rows[0],
      recipesCount: recipesRes.rows.length,
      publishedRecipes: recipesRes.rows,
      badges: badgesRes.rows
    });
  } catch (error) {
    console.error('[ERROR - GET /api/users/:id]:', error.message);
    res.status(500).json({ success: false, message: 'Error al cargar perfil' });
  }
});

// =====================================================================
// PUT /api/users/:id - Editar el propio perfil (solo el dueño de la cuenta)
// =====================================================================
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) !== req.userId) {
      return res.status(403).json({ success: false, message: 'No puedes editar el perfil de otro usuario.' });
    }

    const { first_name, last_name, website, about_me } = req.body || {};

    const updateRes = await db.query(
      `UPDATE users
       SET first_name = COALESCE(NULLIF($1, ''), first_name),
           last_name = COALESCE(NULLIF($2, ''), last_name),
           website = COALESCE($3, website),
           about_me = COALESCE($4, about_me),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, first_name, last_name, email, website, about_me`,
      [first_name, last_name, website, about_me, id]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, user: updateRes.rows[0] });
  } catch (error) {
    console.error('[ERROR - PUT /api/users/:id]:', error.message);
    res.status(500).json({ success: false, message: 'Error al actualizar el perfil' });
  }
});

module.exports = router;