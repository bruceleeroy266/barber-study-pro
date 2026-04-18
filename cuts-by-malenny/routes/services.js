const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/services - Get all active services
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM services 
       WHERE is_active = true 
       ORDER BY category, name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
});

// GET /api/services/:id - Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM services WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to get service' });
  }
});

module.exports = router;
