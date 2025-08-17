const db = require('../db');

// List payments with optional filters
exports.getAllPayments = async (req, res) => {
  try {
    const { propertyId, tenantId, status } = req.query;
    const conditions = [];
    const params = [];

    if (propertyId) { params.push(propertyId); conditions.push(`property_id = $${params.length}`); }
    if (tenantId) { params.push(tenantId); conditions.push(`tenant_id = $${params.length}`); }
    if (status) { params.push(status); conditions.push(`status = $${params.length}`); }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await db.query(
      `SELECT * FROM rent_payments ${whereClause} ORDER BY due_date DESC`,
      params
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single payment
exports.getPaymentById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM rent_payments WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a payment
exports.createPayment = async (req, res) => {
  const {
    lease_id,
    property_id,
    unit_id,
    tenant_id,
    due_date,
    amount_due,
    amount_paid,
    paid_date,
    status,
    late_fee_amount,
    notes,
  } = req.body;

  if (!lease_id || !property_id || !due_date || !amount_due || !status) {
    return res.status(400).json({ error: 'lease_id, property_id, due_date, amount_due and status are required' });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO rent_payments (
        lease_id, property_id, unit_id, tenant_id, due_date, amount_due, amount_paid, paid_date, status, late_fee_amount, notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *`,
      [
        lease_id, property_id, unit_id, tenant_id, due_date, amount_due, amount_paid, paid_date, status, late_fee_amount, notes
      ]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a payment
exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  const {
    lease_id,
    property_id,
    unit_id,
    tenant_id,
    due_date,
    amount_due,
    amount_paid,
    paid_date,
    status,
    late_fee_amount,
    notes,
  } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE rent_payments SET
        lease_id = $1, property_id = $2, unit_id = $3, tenant_id = $4, due_date = $5, amount_due = $6,
        amount_paid = $7, paid_date = $8, status = $9, late_fee_amount = $10, notes = $11
      WHERE id = $12 RETURNING *`,
      [
        lease_id, property_id, unit_id, tenant_id, due_date, amount_due,
        amount_paid, paid_date, status, late_fee_amount, notes, id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM rent_payments WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};