const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

class AuthService {
  // Hash password
  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // Compare password
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  // Generate JWT token
  generateToken(user) {
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Login user
  async login(username, password) {
    // Get user from database
    const result = await db.query(
      'SELECT id, username, email, password_hash, role FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await this.comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  // Create new user (admin only)
  async createUser(username, email, password, role = 'staff') {
    // Check if user exists
    const existing = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existing.rows.length > 0) {
      throw new Error('Username or email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const result = await db.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role, created_at`,
      [username, email, passwordHash, role]
    );

    return result.rows[0];
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    // Get current password hash
    const result = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValid = await this.comparePassword(currentPassword, result.rows[0].password_hash);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newHash = await this.hashPassword(newPassword);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newHash, userId]
    );

    return true;
  }

  // Middleware to protect routes
  requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.prototype.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  }

  // Middleware to require admin role
  requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  }
}

module.exports = new AuthService();
