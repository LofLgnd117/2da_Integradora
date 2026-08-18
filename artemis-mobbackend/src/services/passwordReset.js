// artemis-mobbackend/src/services/passwordReset.js
//
// A diferencia de la web (que manda un enlace clicleable), aquí se manda un
// código de 6 dígitos que el usuario escribe a mano en la app. Evita tener
// que configurar deep links (esquema de URL personalizado) para esta primera
// versión — el usuario nunca tiene que "abrir un enlace" fuera de la app.
const crypto = require('crypto');

const CODE_TTL_MS = 15 * 60 * 1000; // 15 minutos

function hashCode(rawCode) {
  return crypto.createHash('sha256').update(rawCode).digest('hex');
}

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

async function createResetCode(db, userId) {
  const code = generateCode();
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);

  await db.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, codeHash, expiresAt]
  );

  return code;
}

// Se busca por user_id + código (no solo por código) porque un código de 6
// dígitos tiene mucho menos entropía que el token largo de la web; acotarlo
// a la cuenta evita cualquier ambigüedad entre solicitudes de distintos
// usuarios.
async function findValidResetCode(db, userId, rawCode) {
  const codeHash = hashCode(rawCode);
  const { rows } = await db.query(
    `SELECT id FROM password_reset_tokens
     WHERE user_id = $1 AND token_hash = $2 AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP`,
    [userId, codeHash]
  );
  return rows[0] || null;
}

async function consumeResetCode(db, tokenId) {
  await db.query(`UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = $1`, [tokenId]);
}

// Simula el envío del correo: en desarrollo, el código queda impreso en la
// consola del servidor. Para producción hay que conectar aquí un proveedor
// real (Resend, SendGrid, SES, Nodemailer + SMTP, etc.) — el mismo pendiente
// que en artemis-backend.
function sendResetEmail(email, code) {
  console.log('\n[CÓDIGO DE RESTABLECIMIENTO — modo desarrollo, sin proveedor real conectado]');
  console.log(`Para: ${email}`);
  console.log(`Código: ${code} (válido 15 minutos)\n`);
}

module.exports = { createResetCode, findValidResetCode, consumeResetCode, sendResetEmail };
