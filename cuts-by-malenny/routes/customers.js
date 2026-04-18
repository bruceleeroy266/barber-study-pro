const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authService = require('../services/auth');
const customerService = require('../services/customers');

// All routes require authentication
router.use(authService.requireAuth);

// GET /api/customers/search - Search customers
router.get('/search', async (req, res) => {
  try {
    const { q, noShows, allergies, chemical } = req.query;
    const filters = {
      noShows: noShows === 'true',
      allergies: allergies === 'true',
      chemical: chemical === 'true'
    };
    
    const customers = await customerService.search(q, filters);
    res.json(customers);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search customers' });
  }
});

// GET /api/customers/:id - Get customer by ID with full profile
router.get('/:id', async (req, res) => {
  try {
    const customer = await customerService.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Failed to get customer' });
  }
});

// POST /api/customers - Create new customer
router.post('/', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').optional().isEmail().withMessage('Invalid email')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const customer = await customerService.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT /api/customers/:id - Update customer
router.put('/:id', [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('email').optional().isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const customer = await customerService.update(req.params.id, req.body);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// POST /api/customers/:id/hair-profile - Create/update hair profile
router.post('/:id/hair-profile', async (req, res) => {
  try {
    const profile = await customerService.upsertHairProfile(req.params.id, req.body);
    res.json(profile);
  } catch (error) {
    console.error('Hair profile error:', error);
    res.status(500).json({ error: 'Failed to save hair profile' });
  }
});

// POST /api/customers/:id/allergies - Add allergy
router.post('/:id/allergies', [
  body('allergen').trim().notEmpty().withMessage('Allergen is required'),
  body('severity').isIn(['mild', 'moderate', 'severe']).withMessage('Invalid severity')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const allergy = await customerService.addAllergy(req.params.id, req.body);
    res.status(201).json(allergy);
  } catch (error) {
    console.error('Add allergy error:', error);
    res.status(500).json({ error: 'Failed to add allergy' });
  }
});

// POST /api/customers/:id/hair-goals - Add hair goal
router.post('/:id/hair-goals', [
  body('goal').trim().notEmpty().withMessage('Goal is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const goal = await customerService.addHairGoal(req.params.id, req.body);
    res.status(201).json(goal);
  } catch (error) {
    console.error('Add hair goal error:', error);
    res.status(500).json({ error: 'Failed to add hair goal' });
  }
});

// POST /api/customers/:id/consultations - Add consultation
router.post('/:id/consultations', async (req, res) => {
  try {
    const consultation = await customerService.addConsultation(
      req.params.id, 
      req.body, 
      req.user.userId
    );
    res.status(201).json(consultation);
  } catch (error) {
    console.error('Add consultation error:', error);
    res.status(500).json({ error: 'Failed to add consultation' });
  }
});

// POST /api/customers/:id/chemical-services - Add chemical service
router.post('/:id/chemical-services', [
  body('serviceType').trim().notEmpty().withMessage('Service type is required'),
  body('formula').trim().notEmpty().withMessage('Formula is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const service = await customerService.addChemicalService(
      req.params.id, 
      req.body, 
      req.user.userId
    );
    res.status(201).json(service);
  } catch (error) {
    console.error('Add chemical service error:', error);
    res.status(500).json({ error: 'Failed to add chemical service' });
  }
});

module.exports = router;
