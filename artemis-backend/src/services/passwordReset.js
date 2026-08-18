// artemis-backend/src/services/passwordReset.js
const crypto = require('crypto');

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

// Crea una solicitud de restablecimiento y regresa el token SIN hashear
// (ese es el que se debe mandar por correo; nunca se guarda en texto plano).
async function createResetRequest(db, userId) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await db.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  return rawToken;
}

// Verifica un token recibido del usuario; si es válido y no ha sido usado
// ni expiró, regresa el user_id asociado. No lo marca como usado (eso lo
// hace consumeResetToken una vez que la contraseña ya se actualizó).
async function findValidResetToken(db, rawToken) {
  const tokenHash = hashToken(rawToken);
  const { rows } = await db.query(
    `SELECT id, user_id FROM password_reset_tokens
     WHERE token_hash = $1 AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP`,
    [tokenHash]
  );
  return rows[0] || null;
}

async function consumeResetToken(db, tokenId) {
  await db.query(`UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = $1`, [tokenId]);
}

// Simula el envío del correo: en desarrollo, el enlace queda impreso en la
// consola del servidor. Para producción hay que conectar aquí un proveedor
// real (Resend, SendGrid, SES, Nodemailer + SMTP, etc.).
function sendResetEmail(email, resetLink) {
  console.log('\n[CORREO DE RESTABLECIMIENTO — modo desarrollo, sin proveedor real conectado]');
  console.log(`Para: ${email}`);
  console.log(`Enlace: ${resetLink}\n`);
}

module.exports = { createResetRequest, findValidResetToken, consumeResetToken, sendResetEmail, TOKEN_TTL_MS };
