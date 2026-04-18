const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authService = require('../services/auth');
const db = require('../db');

// POST /api/auth/login - Login
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// POST /api/auth/register - Create new user (admin only)
router.post('/register', 
  authService.requireAuth,
  authService.requireAdmin,
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'staff']).withMessage('Invalid role')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password, role } = req.body;
      const user = await authService.createUser(username, email, password, role);
      res.status(201).json(user);
    } catch (error) {
      console.error('Register error:', error);
      res.status(400).json({ error: error.message });
    }
  }
);

// GET /api/auth/me - Get current user
router.get('/me', authService.requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, role, created_at, last_login FROM users WHERE id = $1',
      [req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// POST /api/auth/change-password - Change password
router.post('/change-password', 
  authService.requireAuth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user.userId, currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
