const db = require('../db')

// List units (optionally filter by propertyId)
exports.getAllUnits = async (req, res) => {
  try {
    const { propertyId } = req.query
    const params = []
    let query = `SELECT * FROM property_units`
    if (propertyId) {
      params.push(propertyId)
      query += ` WHERE property_id = $${params.length}`
    }
    query += ' ORDER BY id DESC'
    const { rows } = await db.query(query, params)
    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get a single unit
exports.getUnitById = async (req, res) => {
  const { id } = req.params
  try {
    const { rows } = await db.query(
      'SELECT * FROM property_units WHERE id = $1',
      [id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Unit not found' })
    }
    res.status(200).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create a unit
exports.createUnit = async (req, res) => {
  const {
    property_id,
    unit_label,
    bedrooms,
    bathrooms,
    square_feet,
    market_rent,
    current_rent,
    occupied = false,
  } = req.body

  if (!property_id || !unit_label) {
    return res
      .status(400)
      .json({ error: 'property_id and unit_label are required' })
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO property_units (
        property_id, unit_label, bedrooms, bathrooms, square_feet, market_rent, current_rent, occupied
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING *`,
      [
        property_id,
        unit_label,
        bedrooms,
        bathrooms,
        square_feet,
        market_rent,
        current_rent,
        occupied,
      ]
    )
    res.status(201).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update a unit
exports.updateUnit = async (req, res) => {
  const { id } = req.params
  const {
    property_id,
    unit_label,
    bedrooms,
    bathrooms,
    square_feet,
    market_rent,
    current_rent,
    occupied,
  } = req.body

  try {
    const { rows } = await db.query(
      `UPDATE property_units SET
        property_id = $1, unit_label = $2, bedrooms = $3, bathrooms = $4, square_feet = $5,
        market_rent = $6, current_rent = $7, occupied = $8
      WHERE id = $9 RETURNING *`,
      [
        property_id,
        unit_label,
        bedrooms,
        bathrooms,
        square_feet,
        market_rent,
        current_rent,
        occupied,
        id,
      ]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Unit not found' })
    }
    res.status(200).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Delete a unit
exports.deleteUnit = async (req, res) => {
  const { id } = req.params
  try {
    const { rows } = await db.query(
      'DELETE FROM property_units WHERE id = $1 RETURNING *',
      [id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Unit not found' })
    }
    res.status(200).json({ message: 'Unit deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
