const db = require('../db');

class AppointmentService {
  // Get available time slots for a date
  async getAvailableSlots(date) {
    // Define business hours
    const businessHours = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30'
    ];

    // Get booked slots
    const bookedResult = await db.query(
      `SELECT appointment_time::text as time 
       FROM appointments 
       WHERE appointment_date = $1 
       AND status = 'confirmed'`,
      [date]
    );

    const bookedSlots = bookedResult.rows.map(row => row.time.substring(0, 5));

    // Format all slots with availability
    return businessHours.map(time => {
      const [hours, minutes] = time.split(':');
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : (hours === '00' ? 12 : hours);
      const displayTime = `${displayHours}:${minutes} ${period}`;

      return {
        time: time,
        display: displayTime,
        available: !bookedSlots.includes(time)
      };
    });
  }

  // Create appointment with triple protection against double-booking
  async create(data) {
    const { customerId, serviceId, date, time, notes } = data;

    return await db.transaction(async (client) => {
      // Layer 1: Advisory lock (prevents concurrent bookings)
      const advisoryLockId = this.generateAdvisoryLockId(date, time);
      const lockResult = await client.query(
        'SELECT pg_try_advisory_lock($1) as acquired',
        [advisoryLockId]
      );

      if (!lockResult.rows[0].acquired) {
        throw new Error('Slot is currently being booked by another user');
      }

      try {
        // Layer 2: Row-level locking - lock any existing appointments for this slot
        await client.query(
          `SELECT 1 FROM appointments 
           WHERE appointment_date = $1 AND appointment_time = $2 AND status = 'confirmed'
           FOR UPDATE`,
          [date, time]
        );

        // Check if slot is available
        const checkResult = await client.query(
          `SELECT id FROM appointments 
           WHERE appointment_date = $1 AND appointment_time = $2 AND status = 'confirmed'`,
          [date, time]
        );

        if (checkResult.rows.length > 0) {
          throw new Error('Slot is already booked');
        }

        // Create appointment
        const result = await client.query(
          `INSERT INTO appointments (customer_id, service_id, appointment_date, appointment_time, status, notes)
           VALUES ($1, $2, $3, $4, 'confirmed', $5)
           RETURNING *`,
          [customerId, serviceId, date, time, notes]
        );

        // Update customer visit count
        await client.query(
          `UPDATE customers SET total_visits = total_visits + 1 WHERE id = $1`,
          [customerId]
        );

        return result.rows[0];

      } finally {
        // Release advisory lock
        await client.query('SELECT pg_advisory_unlock($1)', [advisoryLockId]);
      }
    });
  }

  // Use database function for safe booking (alternative method)
  async createSafe(data) {
    const { customerId, serviceId, date, time, notes } = data;

    const result = await db.query(
      `SELECT * FROM book_appointment_safe($1, $2, $3, $4, $5)`,
      [customerId, serviceId, date, time, notes]
    );

    const { success, appointment_id, error_message } = result.rows[0];

    if (!success) {
      throw new Error(error_message);
    }

    // Fetch the created appointment
    const appointmentResult = await db.query(
      'SELECT * FROM appointments WHERE id = $1',
      [appointment_id]
    );

    return appointmentResult.rows[0];
  }

  // Get appointments (with filters)
  async getAll(filters = {}) {
    let sql = `
      SELECT 
        a.*,
        c.first_name || ' ' || c.last_name as customer_name,
        c.phone as customer_phone,
        s.name as service_name,
        s.price as service_price,
        s.duration_minutes
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      JOIN services s ON a.service_id = s.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;

    if (filters.date) {
      sql += ` AND a.appointment_date = $${paramIndex}`;
      params.push(filters.date);
      paramIndex++;
    }

    if (filters.status) {
      sql += ` AND a.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.customerId) {
      sql += ` AND a.customer_id = $${paramIndex}`;
      params.push(filters.customerId);
      paramIndex++;
    }

    sql += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC`;

    const result = await db.query(sql, params);
    return result.rows;
  }

  // Get appointment by ID
  async getById(id) {
    const result = await db.query(
      `SELECT 
        a.*,
        c.first_name || ' ' || c.last_name as customer_name,
        c.phone as customer_phone,
        c.email as customer_email,
        s.name as service_name,
        s.price as service_price,
        s.duration_minutes
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      JOIN services s ON a.service_id = s.id
      WHERE a.id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  // Update appointment status
  async updateStatus(id, status, notes = null) {
    const result = await db.query(
      `UPDATE appointments 
       SET status = $1, notes = COALESCE($2, notes), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, notes, id]
    );

    // If no-show, increment customer counter
    if (status === 'noshow') {
      await db.query(
        `UPDATE customers SET no_show_count = no_show_count + 1 
         WHERE id = (SELECT customer_id FROM appointments WHERE id = $1)`,
        [id]
      );
    }

    return result.rows[0] || null;
  }

  // Cancel appointment
  async cancel(id, reason = null) {
    return await this.updateStatus(id, 'cancelled', reason);
  }

  // Complete appointment
  async complete(id, satisfactionRating = null) {
    const result = await db.query(
      `UPDATE appointments 
       SET status = 'completed', satisfaction_rating = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [satisfactionRating, id]
    );

    return result.rows[0] || null;
  }

  // Mark as no-show
  async markNoShow(id) {
    return await this.updateStatus(id, 'noshow', 'Customer did not show');
  }

  // Update deposit payment status
  async updateDeposit(id, paid, transactionId = null) {
    const result = await db.query(
      `UPDATE appointments 
       SET deposit_paid = $1, deposit_transaction_id = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [paid, transactionId, id]
    );

    return result.rows[0] || null;
  }

  // Get today's appointments
  async getToday() {
    const today = new Date().toISOString().split('T')[0];
    return await this.getAll({ date: today });
  }

  // Get upcoming appointments
  async getUpcoming(days = 7) {
    const result = await db.query(
      `SELECT 
        a.*,
        c.first_name || ' ' || c.last_name as customer_name,
        c.phone as customer_phone,
        s.name as service_name
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      JOIN services s ON a.service_id = s.id
      WHERE a.appointment_date >= CURRENT_DATE
      AND a.appointment_date <= CURRENT_DATE + $1
      AND a.status = 'confirmed'
      ORDER BY a.appointment_date, a.appointment_time`,
      [days]
    );

    return result.rows;
  }

  // Generate advisory lock ID from date and time
  generateAdvisoryLockId(date, time) {
    // Create a unique integer from date and time
    const dateNum = parseInt(date.replace(/-/g, ''));
    const timeNum = parseInt(time.replace(/:/g, ''));
    return (dateNum * 1000000) + timeNum;
  }
}

module.exports = new AppointmentService();
