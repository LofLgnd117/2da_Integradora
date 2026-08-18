// artemis-backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authLimiter } = require('../middleware/rateLimiter');

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = '30d';

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

// =====================================================================
// POST /api/auth/registro - Crea una cuenta nueva
// =====================================================================
router.post('/registro', authLimiter, async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body || {};

    if (
      !first_name || !first_name.trim() ||
      !last_name || !last_name.trim() ||
      !email || !email.trim() ||
      !password
    ) {
      return res.status(400).json({ success: false, message: 'Nombre, apellido, correo y contraseña son obligatorios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const insertRes = await db.query(
      `INSERT INTO users (first_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, email`,
      [first_name.trim(), last_name.trim(), email.trim().toLowerCase(), passwordHash]
    );

    const user = insertRes.rows[0];
    const token = signToken(user.id);

    res.status(201).json({ success: true, token, user });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Ya existe una cuenta registrada con ese correo electrónico.' });
    }
    console.error('[ERROR - POST /api/auth/registro]:', error.message);
    res.status(500).json({ success: false, message: 'Error al crear la cuenta. Intenta de nuevo.' });
  }
});

// =====================================================================
// POST /api/auth/login - Inicia sesión con correo y contraseña
// =====================================================================
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Correo y contraseña son obligatorios.' });
    }

    const userRes = await db.query(
      `SELECT id, first_name, last_name, email, password_hash FROM users WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    // Mensaje genérico en ambos casos (usuario no existe / contraseña incorrecta)
    // para no revelar cuál correo sí está registrado.
    const genericError = { success: false, message: 'Correo o contraseña incorrectos.' };

    if (userRes.rows.length === 0) {
      return res.status(401).json(genericError);
    }

    const user = userRes.rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash || '');

    if (!passwordMatches) {
      return res.status(401).json(genericError);
    }

    const token = signToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('[ERROR - POST /api/auth/login]:', error.message);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión. Intenta de nuevo.' });
  }
});

module.exports = router;
