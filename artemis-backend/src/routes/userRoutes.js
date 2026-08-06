// artemis-backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =====================================================================
// GET /api/users/:id - Obtener perfil del usuario y sus recetas publicadas
// =====================================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Datos del usuario en PostgreSQL
    const userRes = await db.query(
      `SELECT id, first_name, last_name, email, created_at 
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

    res.json({
      success: true,
      user: userRes.rows[0],
      recipesCount: recipesRes.rows.length,
      publishedRecipes: recipesRes.rows
    });
  } catch (error) {
    console.error('[ERROR - GET /api/users/:id]:', error.message);
    res.status(500).json({ success: false, message: 'Error al cargar perfil' });
  }
});

module.exports = router;