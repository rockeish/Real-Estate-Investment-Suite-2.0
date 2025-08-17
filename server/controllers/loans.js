const db = require('../db');

// Get all loans, optionally filtered by propertyId
exports.getAllLoans = async (req, res) => {
  try {
    const { propertyId } = req.query;
    const params = [];
    let query = 'SELECT * FROM loans';
    if (propertyId) {
      params.push(propertyId);
      query += ` WHERE property_id = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';

    const { rows } = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single loan by ID
exports.getLoanById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM loans WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new loan
exports.createLoan = async (req, res) => {
  const {
    property_id,
    lender_name,
    loan_type,
    interest_rate,
    origination_date,
    term_months,
    original_balance,
    current_balance,
    escrow_monthly,
    monthly_payment,
    extra_payment,
  } = req.body;

  if (!property_id) {
    return res.status(400).json({ error: 'property_id is required' });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO loans (
        property_id, lender_name, loan_type, interest_rate, origination_date, term_months,
        original_balance, current_balance, escrow_monthly, monthly_payment, extra_payment
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *`,
      [
        property_id, lender_name, loan_type, interest_rate, origination_date, term_months,
        original_balance, current_balance, escrow_monthly, monthly_payment, extra_payment,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a loan
exports.updateLoan = async (req, res) => {
  const { id } = req.params;
  const {
    property_id,
    lender_name,
    loan_type,
    interest_rate,
    origination_date,
    term_months,
    original_balance,
    current_balance,
    escrow_monthly,
    monthly_payment,
    extra_payment,
  } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE loans SET
        property_id = $1, lender_name = $2, loan_type = $3, interest_rate = $4,
        origination_date = $5, term_months = $6, original_balance = $7, current_balance = $8,
        escrow_monthly = $9, monthly_payment = $10, extra_payment = $11
      WHERE id = $12 RETURNING *`,
      [
        property_id, lender_name, loan_type, interest_rate, origination_date, term_months,
        original_balance, current_balance, escrow_monthly, monthly_payment, extra_payment, id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a loan
exports.deleteLoan = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM loans WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.status(200).json({ message: 'Loan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};