const db = require('../db');

// Get all tenants
exports.getAllTenants = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tenants ORDER BY full_name');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single tenant by ID
exports.getTenantById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM tenants WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new tenant
exports.createTenant = async (req, res) => {
  const {
    full_name,
    email,
    phone_number,
    move_in_date,
    move_out_date,
    communication_log,
  } = req.body;

  if (!full_name) {
    return res.status(400).json({ error: 'Full name is a required field.' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO tenants (full_name, email, phone_number, move_in_date, move_out_date, communication_log) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [full_name, email, phone_number, move_in_date, move_out_date, communication_log]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a tenant
exports.updateTenant = async (req, res) => {
  const { id } = req.params;
  const {
    full_name,
    email,
    phone_number,
    move_in_date,
    move_out_date,
    communication_log,
  } = req.body;

  if (!full_name) {
    return res.status(400).json({ error: 'Full name is a required field.' });
  }

  try {
    const { rows } = await db.query(
      'UPDATE tenants SET full_name = $1, email = $2, phone_number = $3, move_in_date = $4, move_out_date = $5, communication_log = $6 WHERE id = $7 RETURNING *',
      [full_name, email, phone_number, move_in_date, move_out_date, communication_log, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a tenant
exports.deleteTenant = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM tenants WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.status(200).json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
