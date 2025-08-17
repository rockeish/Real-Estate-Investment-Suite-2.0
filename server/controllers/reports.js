const db = require('../db');

// Profit & Loss over a date range for a property or entire portfolio
exports.getProfitAndLoss = async (req, res) => {
  try {
    const { startDate, endDate, propertyId } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required (YYYY-MM-DD)' });
    }

    const params = [startDate, endDate];
    let propertyFilter = '';
    if (propertyId) {
      params.push(propertyId);
      propertyFilter = ` AND property_id = $${params.length}`;
    }

    const incomeQuery = `
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM financial_transactions
      WHERE transaction_type = 'income'
        AND transaction_date >= $1 AND transaction_date <= $2
        ${propertyFilter}
    `;

    const expenseQuery = `
      SELECT COALESCE(SUM(amount), 0) AS expenses
      FROM financial_transactions
      WHERE transaction_type = 'expense'
        AND transaction_date >= $1 AND transaction_date <= $2
        ${propertyFilter}
    `;

    const [incomeResult, expenseResult] = await Promise.all([
      db.query(incomeQuery, params),
      db.query(expenseQuery, params),
    ]);

    const income = Number(incomeResult.rows[0].income || 0);
    const expenses = Number(expenseResult.rows[0].expenses || 0);

    res.status(200).json({ startDate, endDate, propertyId: propertyId || null, income, expenses, net: income - expenses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rent roll snapshot: active leases and their rent amounts
exports.getRentRoll = async (req, res) => {
  try {
    const { asOfDate } = req.query;
    const date = asOfDate || new Date().toISOString().slice(0, 10);

    const { rows } = await db.query(`
      SELECT l.id AS lease_id, l.start_date, l.end_date, l.rent_amount, l.is_active,
             p.id AS property_id, p.address, u.unit_label,
             t.id AS tenant_id, t.full_name AS tenant_name
      FROM leases l
      LEFT JOIN properties p ON l.property_id = p.id
      LEFT JOIN property_units u ON l.unit_id = u.id
      LEFT JOIN tenants t ON l.tenant_id = t.id
      WHERE l.start_date <= $1 AND l.end_date >= $1 AND l.is_active = TRUE
      ORDER BY p.address, u.unit_label
    `, [date]);

    res.status(200).json({ asOfDate: date, leases: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tax preparation style summary mirroring Schedule E categories
exports.getTaxSummary = async (req, res) => {
  try {
    const { startDate, endDate, propertyId } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required (YYYY-MM-DD)' });
    }

    const params = [startDate, endDate];
    let propertyFilter = '';
    if (propertyId) {
      params.push(propertyId);
      propertyFilter = ` AND property_id = $${params.length}`;
    }

    const { rows } = await db.query(`
      SELECT category,
             SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) AS total_income,
             SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) AS total_expense
      FROM financial_transactions
      WHERE transaction_date >= $1 AND transaction_date <= $2
        ${propertyFilter}
      GROUP BY category
      ORDER BY category
    `, params);

    res.status(200).json({ startDate, endDate, propertyId: propertyId || null, categories: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};