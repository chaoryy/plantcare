const pool = require('./db');

const migrate = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id        SERIAL PRIMARY KEY,
      email     VARCHAR(255) UNIQUE NOT NULL,
      password  VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS plants (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name       VARCHAR(255) NOT NULL,
      latin      VARCHAR(255),
      photo_url  TEXT,
      notes      TEXT,
      next_water DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS analyses (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      plant_id   INTEGER REFERENCES plants(id) ON DELETE SET NULL,
      type       VARCHAR(50) NOT NULL,
      image_url  TEXT,
      result     JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log('✅ Таблицы созданы');
  await pool.end();
};

migrate().catch((err) => {
  console.error('❌ Ошибка миграции:', err.message);
  process.exit(1);
});