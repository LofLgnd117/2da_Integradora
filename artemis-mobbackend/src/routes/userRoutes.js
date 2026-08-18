// artemis-mobbackend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth');
const { upload, buildFileUrl } = require('../middleware/upload');

// ==========================================
// RUTA: Obtener recetas de un usuario específico (Para ProfileScreen)
// ==========================================
router.get('/:id/recetas', async (req, res) => {
  try {
    const userId = req.params.id;

    const query = `
      SELECT
        r.id,
        r.title AS titulo,
        r.total_time_minutes AS tiempo,
        r.image_url AS imagen,
        u.first_name || ' ' || u.last_name AS chef
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC;
    `;

    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener las recetas del usuario:", error);
    res.status(500).json({ error: 'Hubo un problema al consultar la base de datos' });
  }
});

// ==========================================
// RUTA: Perfil de un usuario
// ==========================================
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const isSelf = req.userId && String(req.userId) === String(userId);

    const fields = isSelf
      ? 'id, first_name, last_name, email, website, about_me, avatar_url, created_at'
      : 'id, first_name, last_name, website, about_me, avatar_url, created_at';

    const result = await db.query(`SELECT ${fields} FROM users WHERE id = $1`, [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const recipesCount = await db.query('SELECT COUNT(*) FROM recipes WHERE user_id = $1', [userId]);

    res.json({ ...result.rows[0], recetas_count: parseInt(recipesCount.rows[0].count, 10) });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ error: 'Hubo un problema al consultar el perfil' });
  }
});

// ==========================================
// RUTA: Actualizar perfil propio (protegida, solo uno mismo)
// ==========================================
router.put('/:id', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.id;
    if (String(req.userId) !== String(userId)) {
      return res.status(403).json({ error: 'No puedes editar el perfil de otra persona' });
    }

    const { first_name, last_name, website, about_me } = req.body;
    const avatarUrl = req.file ? buildFileUrl(req, req.file.filename) : undefined;

    // COALESCE(NULLIF($n, ''), columna) conserva el valor anterior cuando el
    // cliente no manda el campo (undefined/''), en vez de sobreescribirlo con null.
    const result = await db.query(
      `UPDATE users SET
        first_name = COALESCE(NULLIF($1, ''), first_name),
        last_name = COALESCE(NULLIF($2, ''), last_name),
        website = COALESCE(NULLIF($3, ''), website),
        about_me = COALESCE(NULLIF($4, ''), about_me),
        avatar_url = COALESCE($5, avatar_url),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, first_name, last_name, email, website, about_me, avatar_url`,
      [first_name, last_name, website, about_me, avatarUrl, userId]
    );

    res.json({ mensaje: 'Perfil actualizado', user: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ error: 'Hubo un problema al actualizar el perfil' });
  }
});

// ==========================================
// RUTA: Eliminar cuenta propia (protegida, solo uno mismo)
// ==========================================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    if (String(req.userId) !== String(userId)) {
      return res.status(403).json({ error: 'No puedes eliminar la cuenta de otra persona' });
    }

    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Cuenta eliminada' });
  } catch (error) {
    console.error('Error al eliminar la cuenta:', error);
    res.status(500).json({ error: 'Hubo un problema al eliminar la cuenta' });
  }
});

module.exports = router;
