const db = require('../db');

class CustomerService {
  // Search customers
  async search(query, filters = {}) {
    let sql = `
      SELECT 
        c.id, c.first_name, c.last_name, c.phone, c.email,
        c.total_visits, c.no_show_count, c.client_since, c.created_at,
        COUNT(DISTINCT a.id) as appointment_count,
        COUNT(DISTINCT cs.id) as chemical_count,
        MAX(a.appointment_date) as last_visit,
        EXISTS(SELECT 1 FROM allergies WHERE customer_id = c.id) as has_allergies
      FROM customers c
      LEFT JOIN appointments a ON c.id = a.customer_id
      LEFT JOIN chemical_services cs ON c.id = cs.customer_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;

    // Search by name, phone, or email
    if (query) {
      sql += ` AND (
        c.first_name ILIKE $${paramIndex} OR 
        c.last_name ILIKE $${paramIndex} OR 
        c.phone ILIKE $${paramIndex} OR 
        c.email ILIKE $${paramIndex}
      )`;
      params.push(`%${query}%`);
      paramIndex++;
    }

    // Filter by no-shows
    if (filters.noShows) {
      sql += ` AND c.no_show_count > 0`;
    }

    // Filter by allergies
    if (filters.allergies) {
      sql += ` AND EXISTS(SELECT 1 FROM allergies WHERE customer_id = c.id)`;
    }

    // Filter by chemical history
    if (filters.chemical) {
      sql += ` AND EXISTS(SELECT 1 FROM chemical_services WHERE customer_id = c.id)`;
    }

    sql += `
      GROUP BY c.id
      ORDER BY c.last_name, c.first_name
      LIMIT 50
    `;

    const result = await db.query(sql, params);
    return result.rows;
  }

  // Get customer by ID with full profile
  async getById(id) {
    // Get customer basic info
    const customerResult = await db.query(
      `SELECT * FROM customers WHERE id = $1`,
      [id]
    );

    if (customerResult.rows.length === 0) {
      return null;
    }

    const customer = customerResult.rows[0];

    // Get hair profile
    const hairProfileResult = await db.query(
      `SELECT * FROM hair_profiles WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [id]
    );
    customer.hair_profile = hairProfileResult.rows[0] || null;

    // Get allergies
    const allergiesResult = await db.query(
      `SELECT * FROM allergies WHERE customer_id = $1 ORDER BY severity DESC, allergen`,
      [id]
    );
    customer.allergies = allergiesResult.rows;

    // Get hair goals
    const goalsResult = await db.query(
      `SELECT * FROM hair_goals WHERE customer_id = $1 ORDER BY priority, created_at`,
      [id]
    );
    customer.hair_goals = goalsResult.rows;

    // Get latest consultation
    const consultationResult = await db.query(
      `SELECT * FROM consultations WHERE customer_id = $1 ORDER BY consultation_date DESC LIMIT 1`,
      [id]
    );
    customer.latest_consultation = consultationResult.rows[0] || null;

    // Get chemical service history
    const chemicalResult = await db.query(
      `SELECT * FROM chemical_services WHERE customer_id = $1 ORDER BY service_date DESC`,
      [id]
    );
    customer.chemical_history = chemicalResult.rows;

    // Get appointment history
    const appointmentsResult = await db.query(
      `SELECT 
        a.*, s.name as service_name
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.customer_id = $1
      ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [id]
    );
    customer.appointments = appointmentsResult.rows;

    return customer;
  }

  // Create new customer
  async create(data) {
    const { firstName, lastName, phone, email, dateOfBirth, notes } = data;

    const result = await db.query(
      `INSERT INTO customers (first_name, last_name, phone, email, date_of_birth, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [firstName, lastName, phone, email, dateOfBirth, notes]
    );

    return result.rows[0];
  }

  // Update customer
  async update(id, data) {
    const { firstName, lastName, phone, email, dateOfBirth, notes } = data;

    const result = await db.query(
      `UPDATE customers 
       SET first_name = $1, last_name = $2, phone = $3, email = $4, 
           date_of_birth = $5, notes = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [firstName, lastName, phone, email, dateOfBirth, notes, id]
    );

    return result.rows[0] || null;
  }

  // Create or update hair profile
  async upsertHairProfile(customerId, data) {
    const { hairType, hairCondition, porosity, density, texture, scalpCondition } = data;

    // Check if profile exists
    const existing = await db.query(
      'SELECT id FROM hair_profiles WHERE customer_id = $1',
      [customerId]
    );

    if (existing.rows.length > 0) {
      // Update
      const result = await db.query(
        `UPDATE hair_profiles 
         SET hair_type = $1, hair_condition = $2, porosity = $3, 
             density = $4, texture = $5, scalp_condition = $6,
             updated_at = CURRENT_TIMESTAMP
         WHERE customer_id = $7
         RETURNING *`,
        [hairType, hairCondition, porosity, density, texture, scalpCondition, customerId]
      );
      return result.rows[0];
    } else {
      // Create
      const result = await db.query(
        `INSERT INTO hair_profiles (customer_id, hair_type, hair_condition, porosity, density, texture, scalp_condition)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [customerId, hairType, hairCondition, porosity, density, texture, scalpCondition]
      );
      return result.rows[0];
    }
  }

  // Add allergy
  async addAllergy(customerId, data) {
    const { allergen, severity, reactionDescription } = data;

    const result = await db.query(
      `INSERT INTO allergies (customer_id, allergen, severity, reaction_description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [customerId, allergen, severity, reactionDescription]
    );

    return result.rows[0];
  }

  // Add hair goal
  async addHairGoal(customerId, data) {
    const { goal, priority } = data;

    const result = await db.query(
      `INSERT INTO hair_goals (customer_id, goal, priority)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [customerId, goal, priority]
    );

    return result.rows[0];
  }

  // Add consultation
  async addConsultation(customerId, data, createdBy) {
    const {
      consultationDate, hairType, currentCondition, desiredOutcome,
      previousChemicalServices, homeCareRoutine, recommendations, notes
    } = data;

    const result = await db.query(
      `INSERT INTO consultations (
        customer_id, consultation_date, hair_type, current_condition, desired_outcome,
        previous_chemical_services, home_care_routine, recommendations, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [customerId, consultationDate, hairType, currentCondition, desiredOutcome,
       previousChemicalServices, homeCareRoutine, recommendations, notes, createdBy]
    );

    return result.rows[0];
  }

  // Add chemical service
  async addChemicalService(customerId, data, createdBy) {
    const {
      appointmentId, serviceDate, serviceType, formula, developerVolume,
      processingTime, startingLevel, endingLevel, techniqueNotes,
      satisfactionRating, beforePhotos, afterPhotos
    } = data;

    const result = await db.query(
      `INSERT INTO chemical_services (
        customer_id, appointment_id, service_date, service_type, formula,
        developer_volume, processing_time, starting_level, ending_level,
        technique_notes, satisfaction_rating, before_photos, after_photos, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [customerId, appointmentId, serviceDate, serviceType, formula, developerVolume,
       processingTime, startingLevel, endingLevel, techniqueNotes,
       satisfactionRating, beforePhotos, afterPhotos, createdBy]
    );

    // Update customer's chemical count
    await db.query(
      `UPDATE customers SET chemical_count = chemical_count + 1 WHERE id = $1`,
      [customerId]
    );

    return result.rows[0];
  }
}

module.exports = new CustomerService();
