// artemis-backend/src/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// =====================================================================
// GET /api/notifications - Notificaciones del usuario autenticado
// =====================================================================
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, type, title, message, recipe_id, is_read, created_at
       FROM notifications WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 30`,
      [req.userId]
    );
    const unreadCount = rows.filter((n) => !n.is_read).length;
    res.json({ success: true, unreadCount, data: rows });
  } catch (error) {
    console.error('[ERROR - GET /api/notifications]:', error.message);
    res.status(500).json({ success: false, message: 'Error al consultar notificaciones' });
  }
});

// =====================================================================
// POST /api/notifications/read - Marca como leídas todas las notificaciones
// =====================================================================
router.post('/read', requireAuth, async (req, res) => {
  try {
    await db.query(`UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`, [req.userId]);
    res.json({ success: true });
  } catch (error) {
    console.error('[ERROR - POST /api/notifications/read]:', error.message);
    res.status(500).json({ success: false, message: 'Error al marcar notificaciones como leídas' });
  }
});

module.exports = router;
