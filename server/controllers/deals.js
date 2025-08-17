const db = require('../db');

// Get all deals with optional filters
exports.getAllDeals = async (req, res) => {
  try {
    const { status, source } = req.query;
    const conditions = [];
    const params = [];

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (source) {
      params.push(source);
      conditions.push(`source = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await db.query(
      `SELECT * FROM deals ${whereClause} ORDER BY created_at DESC`,
      params
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single deal by ID
exports.getDealById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM deals WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new deal
exports.createDeal = async (req, res) => {
  const {
    address,
    city,
    state,
    postal_code,
    country,
    latitude,
    longitude,
    source,
    status,
    notes,
    mls_id,
    zillow_url,
    list_price,
    arv,
    rehab_estimate,
    closing_costs_estimate,
    purchase_costs_estimate,
    expected_rent,
    holding_costs_estimate,
    property_type,
    bedrooms,
    bathrooms,
    square_feet,
    lot_size,
    year_built,
  } = req.body;

  if (!address || !status) {
    return res.status(400).json({ error: 'Address and status are required.' });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO deals (
        address, city, state, postal_code, country, latitude, longitude, source, status, notes, mls_id, zillow_url,
        list_price, arv, rehab_estimate, closing_costs_estimate, purchase_costs_estimate, expected_rent,
        holding_costs_estimate, property_type, bedrooms, bathrooms, square_feet, lot_size, year_built
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      ) RETURNING *`,
      [
        address, city, state, postal_code, country, latitude, longitude, source, status, notes, mls_id, zillow_url,
        list_price, arv, rehab_estimate, closing_costs_estimate, purchase_costs_estimate, expected_rent,
        holding_costs_estimate, property_type, bedrooms, bathrooms, square_feet, lot_size, year_built,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a deal
exports.updateDeal = async (req, res) => {
  const { id } = req.params;
  const {
    address,
    city,
    state,
    postal_code,
    country,
    latitude,
    longitude,
    source,
    status,
    notes,
    mls_id,
    zillow_url,
    list_price,
    arv,
    rehab_estimate,
    closing_costs_estimate,
    purchase_costs_estimate,
    expected_rent,
    holding_costs_estimate,
    property_type,
    bedrooms,
    bathrooms,
    square_feet,
    lot_size,
    year_built,
  } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE deals SET
        address = $1, city = $2, state = $3, postal_code = $4, country = $5,
        latitude = $6, longitude = $7, source = $8, status = $9, notes = $10,
        mls_id = $11, zillow_url = $12, list_price = $13, arv = $14, rehab_estimate = $15,
        closing_costs_estimate = $16, purchase_costs_estimate = $17, expected_rent = $18,
        holding_costs_estimate = $19, property_type = $20, bedrooms = $21, bathrooms = $22,
        square_feet = $23, lot_size = $24, year_built = $25, updated_at = CURRENT_TIMESTAMP
      WHERE id = $26 RETURNING *`,
      [
        address, city, state, postal_code, country,
        latitude, longitude, source, status, notes,
        mls_id, zillow_url, list_price, arv, rehab_estimate,
        closing_costs_estimate, purchase_costs_estimate, expected_rent,
        holding_costs_estimate, property_type, bedrooms, bathrooms,
        square_feet, lot_size, year_built, id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a deal
exports.deleteDeal = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM deals WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    res.status(200).json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};