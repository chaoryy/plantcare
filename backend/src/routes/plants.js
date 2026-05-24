const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const ai = require('../services/ai');
const fs = require('fs');
const sharp = require('sharp');

// Хелпер — сжимает фото до 4MB и конвертирует в base64
const compressImage = async (filePath, mimetype) => {
  const compressed = await sharp(filePath)
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();
  return {
    base64: compressed.toString('base64'),
    mimeType: 'image/jpeg',
  };
};

// POST /api/plants/analyze
router.post('/analyze', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Фото обязательно' });
  try {
    const { base64, mimeType } = await compressImage(req.file.path, req.file.mimetype);
    const result = await ai.identify(base64, mimeType);
    await pool.query(
      'INSERT INTO analyses (user_id, type, image_url, result) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'identify', req.file.filename, result]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/plants/diagnose
router.post('/diagnose', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Фото обязательно' });
  try {
    const { base64, mimeType } = await compressImage(req.file.path, req.file.mimetype);
    const result = await ai.diagnose(base64, mimeType);

    // Определяем статус
    let status = 'healthy';
    if (result.urgent === true) status = 'sick';
    else if (result.severity === 'средняя' || result.severity === 'высокая') status = 'sick';

    // Если передан plant_id — обновляем статус существующего растения
    const plantId = req.body.plant_id;
    if (plantId) {
      const id = plantId.replace('plant_', '');
      await pool.query(
        'UPDATE plants SET status = $1 WHERE id = $2 AND user_id = $3',
        [status, id, req.user.id]
      );
    }

    await pool.query(
      'INSERT INTO analyses (user_id, type, image_url, result) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'diagnose', req.file.filename, result]
    );

    res.json({ ...result, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/plants/recommend
router.post('/recommend', auth, async (req, res) => {
  const { conditions } = req.body;
  if (!conditions) return res.status(400).json({ error: 'Условия обязательны' });
  try {
    const result = await ai.recommend(conditions);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/plants/collection
router.post('/collection', auth, async (req, res) => {
  const { plant_name, latin, photo_url, notes, status } = req.body;
  console.log('Received status:', status);
  if (!plant_name) return res.status(400).json({ error: 'Название растения обязательно' });
  try {
    const result = await pool.query(
      `INSERT INTO plants (user_id, name, latin, photo_url, notes, next_water, status) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_DATE + INTERVAL '7 days', $6) 
       RETURNING id, created_at`,
      [req.user.id, plant_name, latin, photo_url, notes, status || 'healthy']
    );
    res.status(201).json({
      id: `plant_${result.rows[0].id}`,
      created_at: result.rows[0].created_at,
      status: status || 'healthy',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/plants/collection
router.get('/collection', auth, async (req, res) => {
  try {
    const result = await pool.query(
  'SELECT id, name, latin, photo_url, next_water, status FROM plants WHERE user_id = $1 ORDER BY created_at DESC',
  [req.user.id]
);
    const plants = result.rows.map(p => ({
      id: `plant_${p.id}`,
      name: p.name,
      latin: p.latin,
      photo_url: p.photo_url,
      next_water: p.next_water ? p.next_water.toISOString().slice(0, 10) : null,
      status: p.status || 'healthy',
    }));
    res.json({ plants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/plants/collection/:id
router.delete('/collection/:id', auth, async (req, res) => {
  const plantId = req.params.id.replace('plant_', '');
  try {
    const result = await pool.query(
      'DELETE FROM plants WHERE id = $1 AND user_id = $2 RETURNING id',
      [plantId, req.user.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Растение не найдено' });
    res.json({ status: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/plants/schedule
router.get('/schedule', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, next_water, notes as note 
       FROM plants 
       WHERE user_id = $1 
       AND next_water IS NOT NULL 
       AND next_water >= CURRENT_DATE
       ORDER BY next_water ASC`,
      [req.user.id]
    );

    const plants = result.rows.map(p => ({
      id: `plant_${p.id}`,
      name: p.name,
      next_water: p.next_water?.toISOString().slice(0, 10),
      note: p.note || '',
    }));

    res.json({ plants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;