-- Dificultad de la receta
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) NOT NULL DEFAULT 'Fácil';
ALTER TABLE recipes ADD CONSTRAINT recipes_difficulty_check
  CHECK (difficulty IN ('Fácil', 'Media', 'Difícil'));

-- Me gusta
CREATE TABLE IF NOT EXISTS recipe_likes (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (recipe_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_recipe_likes_recipe_id ON recipe_likes(recipe_id);

-- Reseñas
CREATE TABLE IF NOT EXISTS recipe_reviews (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_recipe_id ON recipe_reviews(recipe_id);

-- Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE SET NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, created_at DESC);

-- Privilegios para los dos roles de servicio (least privilege, igual que el resto del esquema)
GRANT SELECT, INSERT, UPDATE, DELETE ON recipe_likes, recipe_reviews, notifications TO artemis_web, artemis_api;
GRANT USAGE, SELECT ON recipe_likes_id_seq, recipe_reviews_id_seq, notifications_id_seq TO artemis_web, artemis_api;
