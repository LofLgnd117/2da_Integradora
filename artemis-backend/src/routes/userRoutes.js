// artemis-backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { upload, buildFileUrl } = require('../middleware/upload');

// =====================================================================
// GET /api/users/:id - Obtener perfil del usuario y sus recetas publicadas
// =====================================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Datos del usuario en PostgreSQL
    const userRes = await db.query(
      `SELECT id, first_name, last_name, email, website, about_me, avatar_url, created_at,
              current_streak, streak_saves_left
       FROM users WHERE id = $1`,
      [id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // 2. Recetas que este usuario ha publicado
    const recipesRes = await db.query(
      `SELECT r.id, r.title, r.total_time_minutes, r.servings, r.image_url, r.category,
              (SELECT COUNT(*) FROM recipe_likes rl WHERE rl.recipe_id = r.id) AS likes_count
       FROM recipes r WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
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
router.put('/:id', requireAuth, upload.single('avatar'), async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) !== req.userId) {
      return res.status(403).json({ success: false, message: 'No puedes editar el perfil de otro usuario.' });
    }

    const { first_name, last_name, website, about_me } = req.body || {};
    const avatarUrl = req.file ? buildFileUrl(req, req.file.filename) : undefined;

    const updateRes = await db.query(
      `UPDATE users
       SET first_name = COALESCE(NULLIF($1, ''), first_name),
           last_name = COALESCE(NULLIF($2, ''), last_name),
           website = COALESCE($3, website),
           about_me = COALESCE($4, about_me),
           avatar_url = COALESCE($5, avatar_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, first_name, last_name, email, website, about_me, avatar_url`,
      [first_name, last_name, website, about_me, avatarUrl, id]
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

// =====================================================================
// DELETE /api/users/:id - Eliminar la propia cuenta (solo el dueño)
// =====================================================================
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) !== req.userId) {
      return res.status(403).json({ success: false, message: 'No puedes eliminar la cuenta de otro usuario.' });
    }

    const deleteRes = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (deleteRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Cuenta eliminada correctamente.' });
  } catch (error) {
    console.error('[ERROR - DELETE /api/users/:id]:', error.message);
    res.status(500).json({ success: false, message: 'Error al eliminar la cuenta' });
  }
});

module.exports = router;