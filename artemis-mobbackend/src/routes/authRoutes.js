// artemis-mobbackend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authLimiter } = require('../middleware/rateLimiter');
const { applyLoginStreak } = require('../services/gamification');
const { createResetCode, findValidResetCode, consumeResetCode, sendResetEmail } = require('../services/passwordReset');

// ==========================================
// RUTA: Registro de usuario
// ==========================================
router.post('/registro', authLimiter, async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Nombre, apellido, correo y contraseña son obligatorios.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (first_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, email, website, about_me, avatar_url, created_at`,
      [first_name.trim(), last_name.trim(), email.trim().toLowerCase(), passwordHash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const streak = await applyLoginStreak(db, user.id);

    res.status(201).json({ token, user: { ...user, ...streak } });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo.' });
    }
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Hubo un problema al crear la cuenta.' });
  }
});

// ==========================================
// RUTA: Inicio de sesión
// ==========================================
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    }

    const result = await db.query(
      `SELECT id, first_name, last_name, email, password_hash, website, about_me, avatar_url, created_at
       FROM users WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    delete user.password_hash;
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const streak = await applyLoginStreak(db, user.id);

    res.json({ token, user: { ...user, ...streak } });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Hubo un problema al iniciar sesión.' });
  }
});

// ==========================================
// RUTA: Solicitar código de restablecimiento de contraseña
// Responde igual exista o no la cuenta, para no revelar qué correos están
// registrados.
// ==========================================
router.post('/olvide-password', authLimiter, async (req, res) => {
  const genericResponse = { mensaje: 'Si ese correo está registrado, te enviamos un código para restablecer tu contraseña.' };
  try {
    const { email } = req.body || {};
    if (!email?.trim()) {
      return res.status(400).json({ error: 'Escribe tu correo electrónico.' });
    }

    const result = await db.query('SELECT id, email FROM users WHERE email = $1', [email.trim().toLowerCase()]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const code = await createResetCode(db, user.id);
      sendResetEmail(user.email, code);
    }

    res.json(genericResponse);
  } catch (error) {
    console.error('Error al solicitar restablecimiento:', error);
    res.status(500).json({ error: 'Hubo un problema al procesar la solicitud.' });
  }
});

// ==========================================
// RUTA: Aplicar nueva contraseña usando el código recibido
// ==========================================
router.post('/restablecer-password', authLimiter, async (req, res) => {
  try {
    const { email, code, password } = req.body || {};

    if (!email?.trim() || !code || !password) {
      return res.status(400).json({ error: 'Faltan datos para restablecer la contraseña.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ error: 'Código inválido o expirado. Solicita uno nuevo.' });
    }

    const tokenRow = await findValidResetCode(db, userRes.rows[0].id, code);
    if (!tokenRow) {
      return res.status(400).json({ error: 'Código inválido o expirado. Solicita uno nuevo.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await db.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [passwordHash, userRes.rows[0].id]);
    await consumeResetCode(db, tokenRow.id);

    res.json({ mensaje: 'Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.' });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ error: 'Hubo un problema al restablecer la contraseña.' });
  }
});

module.exports = router;
