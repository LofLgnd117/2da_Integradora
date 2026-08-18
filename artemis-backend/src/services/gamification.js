// artemis-backend/src/services/gamification.js

// "Maestro del Orden" quedó redefinido a "guardar tu segunda receta": la app
// solo tiene un tablero de favoritas por usuario, no varios recetarios.
const BADGES = {
  critico_del_barrio: {
    label: 'Crítico del Barrio',
    description: 'Publica tu primera reseña en la receta de alguien más.',
  },
  maestro_del_orden: {
    label: 'Maestro del Orden',
    description: 'Guarda tu segunda receta en Recetas Guardadas.',
  },
  receta_de_oro: {
    label: 'Receta de Oro',
    description: 'Recibe tu primer "Me Gusta" en una receta tuya.',
  },
};

async function notify(client, userId, type, title, message, recipeId = null) {
  await client.query(
    `INSERT INTO notifications (user_id, type, title, message, recipe_id) VALUES ($1, $2, $3, $4, $5)`,
    [userId, type, title, message, recipeId]
  );
}

async function unlockBadge(client, userId, badgeType) {
  const badge = BADGES[badgeType];
  if (!badge) throw new Error(`Badge desconocido: ${badgeType}`);

  const res = await client.query(
    `INSERT INTO user_badges (user_id, badge_type) VALUES ($1, $2)
     ON CONFLICT (user_id, badge_type) DO NOTHING RETURNING id`,
    [userId, badgeType]
  );

  if (res.rows.length > 0) {
    await notify(client, userId, 'badge', '🏅 Medalla Desbloqueada', `Has obtenido el logro "${badge.label}" — ${badge.description}`);
    return true;
  }
  return false;
}

// Racha diaria estilo Duolingo: sube un día seguido de otro, un "salvavidas"
// perdona un día saltado sin romper la racha, y se agota sin salvavidas.
async function applyLoginStreak(db, userId) {
  const { rows } = await db.query(
    `SELECT current_streak, streak_saves_left, last_login_date FROM users WHERE id = $1`,
    [userId]
  );
  if (rows.length === 0) return { current_streak: 0, streak_saves_left: 0 };

  let { current_streak, streak_saves_left } = rows[0];
  const lastLoginDate = rows[0].last_login_date;
  const today = new Date().toISOString().slice(0, 10);
  const lastDateStr = lastLoginDate ? new Date(lastLoginDate).toISOString().slice(0, 10) : null;

  if (lastDateStr === today) {
    // ya se contó hoy, no hacemos nada
  } else if (lastDateStr === null) {
    current_streak = 1;
  } else {
    const diffDays = Math.round((new Date(today) - new Date(lastDateStr)) / 86400000);
    if (diffDays === 1) {
      current_streak += 1;
    } else if (diffDays > 1 && streak_saves_left > 0) {
      streak_saves_left -= 1;
    } else if (diffDays > 1) {
      current_streak = 1;
    }
  }

  await db.query(
    `UPDATE users SET current_streak = $1, streak_saves_left = $2, last_login_date = $3 WHERE id = $4`,
    [current_streak, streak_saves_left, today, userId]
  );

  return { current_streak, streak_saves_left };
}

module.exports = { BADGES, notify, unlockBadge, applyLoginStreak };
