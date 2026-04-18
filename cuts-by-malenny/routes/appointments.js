const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authService = require('../services/auth');
const appointmentService = require('../services/appointments');
const db = require('../db');

// Public route: Get available time slots
router.get('/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const slots = await appointmentService.getAvailableSlots(date);
    res.json(slots);
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ error: 'Failed to get available slots' });
  }
});

// Public route: Create appointment (booking from website)
router.post('/book', [
  body('service').notEmpty().withMessage('Service is required'),
  body('date').isDate().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required (HH:MM)'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, phone, email, service, date, time, notes, consultation } = req.body;
    
    // First, create or find customer
    let customerResult = await db.query(
      'SELECT id FROM customers WHERE phone = $1',
      [phone]
    );
    
    let customerId;
    if (customerResult.rows.length > 0) {
      // Existing customer
      customerId = customerResult.rows[0].id;
      
      // Update customer info
      await db.query(
        `UPDATE customers 
         SET first_name = $1, last_name = $2, email = COALESCE($3, email), updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [firstName, lastName, email, customerId]
      );
    } else {
      // Create new customer
      const newCustomer = await db.query(
        `INSERT INTO customers (first_name, last_name, phone, email)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [firstName, lastName, phone, email]
      );
      customerId = newCustomer.rows[0].id;
    }
    
    // Get service ID from service name (or create mapping)
    const serviceResult = await db.query(
      'SELECT id FROM services WHERE name ILIKE $1 AND is_active = true LIMIT 1',
      [`%${service.name}%`]
    );
    
    const serviceId = serviceResult.rows[0]?.id || null;
    
    // Create appointment
    const appointment = await appointmentService.create({
      customerId,
      serviceId,
      date,
      time,
      notes: notes || ''
    });
    
    // Save consultation data if provided
    if (consultation && (consultation.faceShape || consultation.hairType || consultation.desiredStyle)) {
      const concernsText = consultation.concerns?.length > 0 
        ? consultation.concerns.join(', ') 
        : 'None';
      
      await db.query(
        `INSERT INTO consultations (
          customer_id, consultation_date, hair_type, current_condition, 
          desired_outcome, recommendations, notes
        ) VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6)`,
        [
          customerId,
          `${consultation.faceShape || 'Unknown'} face, ${consultation.hairType || 'Unknown'} hair`,
          `Current: ${consultation.currentStyle || 'Not specified'}\nFrequency: ${consultation.haircutFrequency || 'Unknown'}`,
          consultation.desiredStyle || 'Not specified',
          `Work: ${consultation.workEnvironment || 'Unknown'}\nStyling time: ${consultation.stylingTime || 'Unknown'}`,
          `Concerns: ${concernsText}\nProducts: ${consultation.productPreference || 'None'}\nAdditional: ${consultation.additionalNotes || 'None'}`
        ]
      );
    }
    
    res.status(201).json({
      ...appointment,
      customerName: `${firstName} ${lastName}`,
      customerPhone: phone
    });
  } catch (error) {
    console.error('Booking error:', error);
    
    if (error.message.includes('already booked') || error.message.includes('being booked')) {
      return res.status(409).json({ 
        error: 'Slot unavailable',
        message: error.message 
      });
    }
    
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// All routes below require authentication
router.use(authService.requireAuth);

// GET /api/appointments - Get all appointments (with filters)
router.get('/', async (req, res) => {
  try {
    const { date, status, customerId } = req.query;
    const filters = { date, status, customerId };
    
    const appointments = await appointmentService.getAll(filters);
    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
});

// GET /api/appointments/today - Get today's appointments
router.get('/today', async (req, res) => {
  try {
    const appointments = await appointmentService.getToday();
    res.json(appointments);
  } catch (error) {
    console.error('Get today appointments error:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
});

// GET /api/appointments/upcoming - Get upcoming appointments
router.get('/upcoming', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const appointments = await appointmentService.getUpcoming(days);
    res.json(appointments);
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
});

// GET /api/appointments/:id - Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await appointmentService.getById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Failed to get appointment' });
  }
});

// POST /api/appointments - Create appointment (admin)
router.post('/', [
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('date').isDate().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const appointment = await appointmentService.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    
    if (error.message.includes('already booked') || error.message.includes('being booked')) {
      return res.status(409).json({ 
        error: 'Slot unavailable',
        message: error.message 
      });
    }
    
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// PATCH /api/appointments/:id/status - Update appointment status
router.patch('/:id/status', [
  body('status').isIn(['confirmed', 'completed', 'cancelled', 'noshow']).withMessage('Invalid status'),
  body('notes').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { status, notes } = req.body;
    let appointment;

    switch (status) {
      case 'completed':
        appointment = await appointmentService.complete(req.params.id, req.body.satisfactionRating);
        break;
      case 'cancelled':
        appointment = await appointmentService.cancel(req.params.id, notes);
        break;
      case 'noshow':
        appointment = await appointmentService.markNoShow(req.params.id);
        break;
      default:
        appointment = await appointmentService.updateStatus(req.params.id, status, notes);
    }

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// PATCH /api/appointments/:id/deposit - Update deposit status
router.patch('/:id/deposit', [
  body('paid').isBoolean().withMessage('Paid status is required'),
  body('transactionId').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { paid, transactionId } = req.body;
    const appointment = await appointmentService.updateDeposit(req.params.id, paid, transactionId);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Update deposit error:', error);
    res.status(500).json({ error: 'Failed to update deposit' });
  }
});

module.exports = router;
