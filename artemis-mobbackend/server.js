const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

const db = require('./db');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const prefix = file.fieldname === 'avatar' ? 'avatar' : 'receta';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'));
    }
    cb(null, true);
  },
});

const DEFAULT_RECIPE_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
const DEFAULT_AVATAR = 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/p0afafy0_expires_30_days.png';

function buildFileUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

// ==========================================
// AUTENTICACIÓN: middlewares
// ==========================================
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Inicia sesión de nuevo.' });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
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
      const payload = jwt.verify(header.slice(7), JWT_SECRET);
      req.userId = payload.userId;
    } catch (error) {
      // Token inválido: seguimos como visitante anónimo
    }
  }
  next();
}

app.get('/', (req, res) => {
  res.json({ mensaje: '¡El servidor de Ártemis está vivo y funcionando!' });
});

// ==========================================
// RUTA: Registro de usuario
// ==========================================
app.post('/api/registro', async (req, res) => {
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
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ token, user });
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
app.post('/api/login', async (req, res) => {
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
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({ token, user });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Hubo un problema al iniciar sesión.' });
  }
});

// ==========================================
// RUTA: Obtener todas las recetas (Para HomeScreen)
// ==========================================
app.get('/api/recetas', async (req, res) => {
  try {
    const query = `
      SELECT
        r.id,
        r.title AS titulo,
        r.total_time_minutes AS tiempo,
        r.image_url AS imagen,
        r.category AS categoria,
        u.first_name || ' ' || u.last_name AS chef
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener las recetas:", error);
    res.status(500).json({ error: 'Hubo un problema al consultar la base de datos' });
  }
});

// ==========================================
// RUTA: Buscar recetas (antes de /:id para evitar conflictos)
// ==========================================
app.get('/api/recetas/buscar', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const query = `
      SELECT
        r.id,
        r.title AS titulo,
        r.total_time_minutes AS tiempo,
        r.image_url AS imagen,
        u.first_name || ' ' || u.last_name AS chef
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      WHERE r.title ILIKE $1 OR u.first_name ILIKE $1 OR r.category ILIKE $1
      ORDER BY r.created_at DESC;
    `;

    const result = await db.query(query, [`%${q}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al buscar recetas:", error);
    res.status(500).json({ error: 'Hubo un problema al realizar la búsqueda' });
  }
});

// ==========================================
// RUTA: Recetas guardadas del usuario autenticado (antes de /:id)
// ==========================================
app.get('/api/recetas/guardadas', authMiddleware, async (req, res) => {
  try {
    const query = `
      SELECT
        r.id,
        r.title AS titulo,
        r.total_time_minutes AS tiempo,
        r.image_url AS imagen,
        r.category AS categoria,
        u.first_name || ' ' || u.last_name AS chef,
        br.saved_at
      FROM board_recipes br
      JOIN saved_boards sb ON br.board_id = sb.id
      JOIN recipes r ON br.recipe_id = r.id
      JOIN users u ON r.user_id = u.id
      WHERE sb.user_id = $1
      ORDER BY br.saved_at DESC;
    `;
    const result = await db.query(query, [req.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener recetas guardadas:', error);
    res.status(500).json({ error: 'Hubo un problema al consultar tus recetas guardadas' });
  }
});

// ==========================================
// RUTA: Obtener detalle de UNA receta
// ==========================================
app.get('/api/recetas/:id', optionalAuthMiddleware, async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipeQuery = `
      SELECT
        r.*,
        u.first_name || ' ' || u.last_name AS chef
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `;
    const recipeResult = await db.query(recipeQuery, [recipeId]);

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    const receta = recipeResult.rows[0];

    const ingredientsQuery = `
      SELECT quantity, unit, name
      FROM recipe_ingredients
      WHERE recipe_id = $1
      ORDER BY sort_order
    `;
    const ingredientsResult = await db.query(ingredientsQuery, [recipeId]);

    const stepsQuery = `
      SELECT step_number, instruction_text
      FROM recipe_steps
      WHERE recipe_id = $1
      ORDER BY step_number
    `;
    const stepsResult = await db.query(stepsQuery, [recipeId]);

    let esDueno = false;
    let estaGuardada = false;
    if (req.userId) {
      esDueno = receta.user_id === req.userId;
      const savedCheck = await db.query(
        `SELECT 1 FROM board_recipes br
         JOIN saved_boards sb ON br.board_id = sb.id
         WHERE sb.user_id = $1 AND br.recipe_id = $2`,
        [req.userId, recipeId]
      );
      estaGuardada = savedCheck.rows.length > 0;
    }

    res.json({
      ...receta,
      ingredientes: ingredientsResult.rows,
      pasos: stepsResult.rows,
      es_dueno: esDueno,
      esta_guardada: estaGuardada,
    });
  } catch (error) {
    console.error("Error al obtener el detalle de la receta:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// RUTA: Crear una nueva receta (protegida, con foto opcional)
// ==========================================
app.post('/api/recetas', authMiddleware, upload.single('imagen'), async (req, res) => {
  const client = await db.connect();
  try {
    const { titulo, descripcion, porciones, tiempo, categoria, chef_tips } = req.body;

    let ingredientes = [];
    if (req.body.ingredientes) {
      ingredientes = typeof req.body.ingredientes === 'string'
        ? JSON.parse(req.body.ingredientes)
        : req.body.ingredientes;
    }
    let pasos = [];
    if (req.body.pasos) {
      pasos = typeof req.body.pasos === 'string' ? JSON.parse(req.body.pasos) : req.body.pasos;
    }

    const finalImageUrl = req.file ? buildFileUrl(req, req.file.filename) : DEFAULT_RECIPE_IMAGE;

    await client.query('BEGIN');

    const insertRecipeQuery = `
      INSERT INTO recipes (user_id, title, description, servings, total_time_minutes, category, image_url, chef_tips)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;
    const recipeValues = [
      req.userId,
      titulo?.trim() || 'Receta sin título',
      descripcion?.trim() || '',
      parseInt(porciones) || 4,
      parseInt(tiempo) || 30,
      categoria || 'Comidas y Platillos',
      finalImageUrl,
      chef_tips?.trim() || null,
    ];

    const recipeResult = await client.query(insertRecipeQuery, recipeValues);
    const newRecipeId = recipeResult.rows[0].id;

    if (ingredientes.length > 0) {
      const ingQuery = `INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit, sort_order) VALUES ($1, $2, $3, $4, $5)`;
      for (let i = 0; i < ingredientes.length; i++) {
        const ing = ingredientes[i];
        if (ing.name && ing.name.trim() !== '') {
          await client.query(ingQuery, [newRecipeId, ing.name.trim(), ing.quantity || '', '', i + 1]);
        }
      }
    }

    if (pasos.length > 0) {
      const stepQuery = `INSERT INTO recipe_steps (recipe_id, step_number, instruction_text) VALUES ($1, $2, $3)`;
      for (let i = 0; i < pasos.length; i++) {
        if (pasos[i] && pasos[i].trim() !== '') {
          await client.query(stepQuery, [newRecipeId, i + 1, pasos[i]]);
        }
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ mensaje: '¡Receta creada con éxito!', nueva_receta_id: newRecipeId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error al guardar:", error);
    res.status(500).json({ error: 'Hubo un error al guardar' });
  } finally {
    client.release();
  }
});

// ==========================================
// RUTA: Eliminar una receta (protegida, solo el dueño)
// ==========================================
app.delete('/api/recetas/:id', authMiddleware, async (req, res) => {
  const client = await db.connect();
  try {
    const recipeId = req.params.id;

    const ownerCheck = await client.query('SELECT user_id FROM recipes WHERE id = $1', [recipeId]);
    if (ownerCheck.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    if (ownerCheck.rows[0].user_id !== req.userId) {
      client.release();
      return res.status(403).json({ error: 'No puedes eliminar una receta que no te pertenece' });
    }

    await client.query('BEGIN');
    await client.query('DELETE FROM board_recipes WHERE recipe_id = $1', [recipeId]);
    await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [recipeId]);
    await client.query('DELETE FROM recipe_steps WHERE recipe_id = $1', [recipeId]);
    await client.query('DELETE FROM recipes WHERE id = $1', [recipeId]);
    await client.query('COMMIT');

    res.json({ mensaje: '¡Receta eliminada!' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error al eliminar:", error);
    res.status(500).json({ error: 'Error al intentar eliminar' });
  } finally {
    client.release();
  }
});

// ==========================================
// RUTA: Guardar / quitar receta de "Mis Favoritas" (protegidas)
// ==========================================
app.post('/api/recetas/:id/guardar', authMiddleware, async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipeCheck = await db.query('SELECT id FROM recipes WHERE id = $1', [recipeId]);
    if (recipeCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    let boardRes = await db.query(
      `SELECT id FROM saved_boards WHERE user_id = $1 AND title = 'Mis Favoritas' LIMIT 1`,
      [req.userId]
    );

    let boardId;
    if (boardRes.rows.length === 0) {
      const newBoard = await db.query(
        `INSERT INTO saved_boards (user_id, title) VALUES ($1, 'Mis Favoritas') RETURNING id`,
        [req.userId]
      );
      boardId = newBoard.rows[0].id;
    } else {
      boardId = boardRes.rows[0].id;
    }

    await db.query(
      `INSERT INTO board_recipes (board_id, recipe_id) VALUES ($1, $2)
       ON CONFLICT (board_id, recipe_id) DO NOTHING`,
      [boardId, recipeId]
    );

    res.json({ mensaje: '¡Receta guardada en tus favoritas!' });
  } catch (error) {
    console.error('Error al guardar receta:', error);
    res.status(500).json({ error: 'Hubo un problema al guardar la receta' });
  }
});

app.delete('/api/recetas/:id/guardar', authMiddleware, async (req, res) => {
  try {
    const recipeId = req.params.id;
    await db.query(
      `DELETE FROM board_recipes br
       USING saved_boards sb
       WHERE br.board_id = sb.id AND sb.user_id = $1 AND br.recipe_id = $2`,
      [req.userId, recipeId]
    );
    res.json({ mensaje: 'Receta quitada de tus favoritas' });
  } catch (error) {
    console.error('Error al quitar receta guardada:', error);
    res.status(500).json({ error: 'Hubo un problema al quitar la receta guardada' });
  }
});

// ==========================================
// RUTA: Obtener recetas de un usuario específico (Para ProfileScreen)
// ==========================================
app.get('/api/usuarios/:id/recetas', async (req, res) => {
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
app.get('/api/usuarios/:id', optionalAuthMiddleware, async (req, res) => {
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
app.put('/api/usuarios/:id', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.id;
    if (String(req.userId) !== String(userId)) {
      return res.status(403).json({ error: 'No puedes editar el perfil de otra persona' });
    }

    const { first_name, last_name, website, about_me } = req.body;
    const avatarUrl = req.file ? buildFileUrl(req, req.file.filename) : undefined;

    const result = await db.query(
      `UPDATE users SET
        first_name = COALESCE(NULLIF($1, ''), first_name),
        last_name = COALESCE(NULLIF($2, ''), last_name),
        website = $3,
        about_me = $4,
        avatar_url = COALESCE($5, avatar_url),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, first_name, last_name, email, website, about_me, avatar_url`,
      [first_name, last_name, website || null, about_me || null, avatarUrl, userId]
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
app.delete('/api/usuarios/:id', authMiddleware, async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
