// artemis-backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Extrae el token del header "Authorization: Bearer <token>"
function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice('Bearer '.length).trim();
}

// =====================================================================
// requireAuth - Bloquea la petición si no hay un token válido.
// Si es válido, deja disponible req.userId con el id del usuario dueño del token.
// =====================================================================
function requireAuth(req, res, next) {
  const token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Debes iniciar sesión para continuar.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Tu sesión no es válida o ha expirado. Inicia sesión de nuevo.' });
  }
}

// =====================================================================
// optionalAuth - No bloquea la petición si no hay token o es inválido,
// pero si hay uno válido, deja disponible req.userId (útil para saber
// "es dueño" sin exigir sesión, por ejemplo en rutas públicas de lectura).
// =====================================================================
function optionalAuth(req, res, next) {
  const token = getTokenFromHeader(req);

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
  } catch (error) {
    // Token presente pero inválido/expirado: seguimos como visitante anónimo.
  }

  next();
}

module.exports = { requireAuth, optionalAuth };
