const db = require('../db');

// Get all leases
exports.getAllLeases = async (req, res) => {
  try {
    // Joining with properties and tenants to get more meaningful data
    const { rows } = await db.query(`
      SELECT
        l.id, l.start_date, l.end_date, l.rent_amount, l.is_active,
        p.address AS property_address,
        t.full_name AS tenant_name
      FROM leases l
      LEFT JOIN properties p ON l.property_id = p.id
      LEFT JOIN tenants t ON l.tenant_id = t.id
      ORDER BY l.start_date DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single lease by ID
exports.getLeaseById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM leases WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Lease not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new lease
exports.createLease = async (req, res) => {
  const {
    property_id,
    tenant_id,
    start_date,
    end_date,
    rent_amount,
    security_deposit,
    lease_document_url,
    is_active = true,
  } = req.body;

  if (!property_id || !tenant_id || !start_date || !end_date || !rent_amount) {
    return res.status(400).json({ error: 'Missing required fields for lease creation.' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO leases (property_id, tenant_id, start_date, end_date, rent_amount, security_deposit, lease_document_url, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [property_id, tenant_id, start_date, end_date, rent_amount, security_deposit, lease_document_url, is_active]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a lease
exports.updateLease = async (req, res) => {
  const { id } = req.params;
  const {
    property_id,
    tenant_id,
    start_date,
    end_date,
    rent_amount,
    security_deposit,
    lease_document_url,
    is_active,
  } = req.body;

  if (!property_id || !tenant_id || !start_date || !end_date || !rent_amount) {
    return res.status(400).json({ error: 'Missing required fields for lease update.' });
  }

  try {
    const { rows } = await db.query(
      'UPDATE leases SET property_id = $1, tenant_id = $2, start_date = $3, end_date = $4, rent_amount = $5, security_deposit = $6, lease_document_url = $7, is_active = $8 WHERE id = $9 RETURNING *',
      [property_id, tenant_id, start_date, end_date, rent_amount, security_deposit, lease_document_url, is_active, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Lease not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a lease
exports.deleteLease = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM leases WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Lease not found' });
    }
    res.status(200).json({ message: 'Lease deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
