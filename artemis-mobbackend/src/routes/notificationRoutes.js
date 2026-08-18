// artemis-mobbackend/src/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

// ==========================================
// RUTA: Notificaciones del usuario autenticado
// ==========================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, type, title, message, recipe_id, is_read, created_at
       FROM notifications WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 30`,
      [req.userId]
    );
    const unreadCount = rows.filter((n) => !n.is_read).length;
    res.json({ unreadCount, notificaciones: rows });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Hubo un problema al consultar tus notificaciones' });
  }
});

// ==========================================
// RUTA: Marcar todas las notificaciones como leídas
// ==========================================
router.post('/leidas', authMiddleware, async (req, res) => {
  try {
    await db.query(`UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`, [req.userId]);
    res.json({ mensaje: 'Notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error al marcar notificaciones como leídas:', error);
    res.status(500).json({ error: 'Hubo un problema al actualizar tus notificaciones' });
  }
});

module.exports = router;
