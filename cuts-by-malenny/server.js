require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const appointmentRoutes = require('./routes/appointments');
const serviceRoutes = require('./routes/services');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Stricter rate limit for booking endpoint
const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 booking attempts per minute
  message: { error: 'Too many booking attempts, please try again later.' }
});
app.use('/api/appointments/book', bookingLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (frontend)
app.use(express.static(path.join(__dirname)));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   ✂️ Cuts by Malenny API Server                        ║
║                                                        ║
║   Running on port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                    ║
║                                                        ║
║   Endpoints:                                           ║
║   • GET  /api/health          - Health check           ║
║   • POST /api/auth/login      - Login                  ║
║   • GET  /api/services        - List services          ║
║   • GET  /api/appointments    - List appointments      ║
║   • POST /api/appointments    - Create appointment     ║
║   • GET  /api/customers       - Search customers       ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
