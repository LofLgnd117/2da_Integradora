// artemis-mobbackend/src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Limita intentos de login/registro para dificultar ataques de fuerza bruta.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera unos minutos antes de volver a intentarlo.' },
});

module.exports = { authLimiter };
