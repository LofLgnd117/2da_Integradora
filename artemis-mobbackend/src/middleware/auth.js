// artemis-mobbackend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ==========================================
// AUTENTICACIÓN: middlewares
// ==========================================
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Inicia sesión de nuevo.' });
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Sesión inválida o expirada. Inicia sesión de nuevo.' });
  }
}

function optionalAuthMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
      req.userId = payload.userId;
    } catch (error) {
      // Token inválido: seguimos como visitante anónimo
    }
  }
  next();
}

module.exports = { authMiddleware, optionalAuthMiddleware };
