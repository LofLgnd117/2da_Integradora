// artemis-backend/src/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =====================================================================
// GET /api/recipes - Obtener recetas con filtro de búsqueda y categoría
// =====================================================================
router.get('/', async (req, res) => {
  try {
    const { categoria, buscar } = req.query;
    
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

    // 1. Si enviaron una categoría (ej. ?categoria=Dietas)
    if (categoria) {
      query += ` AND r.category = $${paramIndex}`;
      values.push(categoria);
      paramIndex++;
    }

    // 2. Si escribieron en el buscador (ej. ?buscar=pollo)
    if (buscar) {
      query += ` AND (ILIKE(r.title, $${paramIndex}) OR ILIKE(r.description, $${paramIndex}))`;
      // En PostgreSQL ILIKE no existe como función en todas las versiones, usamos operador ILIKE:
      // Corregimos sintaxis SQL segura:
    }

    // Reemplazo limpio y seguro para búsqueda de texto en PostgreSQL:
    query = `
      SELECT r.id, r.title, r.description, r.total_time_minutes, 
             r.servings, r.image_url, r.category,
             u.first_name || ' ' || u.last_name AS author
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      WHERE ($1::text IS NULL OR r.category = $1)
        AND ($2::text IS NULL OR r.title ILIKE '%' || $2 || '%' OR r.description ILIKE '%' || $2 || '%')
      ORDER BY r.created_at DESC;
    `;

    const { rows } = await db.query(query, [categoria || null, buscar || null]);
    
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

module.exports = router;