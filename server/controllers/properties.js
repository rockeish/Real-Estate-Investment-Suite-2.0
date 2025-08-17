const db = require('../db');

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM properties');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single property by ID
exports.getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM properties WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new property
exports.createProperty = async (req, res) => {
  const {
    address,
    property_type,
    purchase_price,
    bedrooms,
    bathrooms,
    square_feet,
    year_built,
    lot_size,
    units,
    down_payment_percent,
    interest_rate,
    loan_term,
    rental_income,
    other_income,
    closing_costs,
    repair_costs,
    appreciation_rate,
    rent_increase_rate,
    property_tax,
    insurance,
    hoa_fees,
    maintenance_rate,
    vacancy_rate,
    management_rate,
    utilities,
    capex_rate,
    other_expenses,
  } = req.body;

  try {
    const { rows } = await db.query(
      `INSERT INTO properties (
        address, property_type, purchase_price, bedrooms, bathrooms, square_feet, year_built, lot_size, units,
        down_payment_percent, interest_rate, loan_term, rental_income, other_income, closing_costs, repair_costs,
        appreciation_rate, rent_increase_rate, property_tax, insurance, hoa_fees, maintenance_rate, vacancy_rate,
        management_rate, utilities, capex_rate, other_expenses
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
      ) RETURNING *`,
      [
        address, property_type, purchase_price, bedrooms, bathrooms, square_feet, year_built, lot_size, units,
        down_payment_percent, interest_rate, loan_term, rental_income, other_income, closing_costs, repair_costs,
        appreciation_rate, rent_increase_rate, property_tax, insurance, hoa_fees, maintenance_rate, vacancy_rate,
        management_rate, utilities, capex_rate, other_expenses
      ]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const {
    address,
    property_type,
    purchase_price,
    bedrooms,
    bathrooms,
    square_feet,
    year_built,
    lot_size,
    units,
    down_payment_percent,
    interest_rate,
    loan_term,
    rental_income,
    other_income,
    closing_costs,
    repair_costs,
    appreciation_rate,
    rent_increase_rate,
    property_tax,
    insurance,
    hoa_fees,
    maintenance_rate,
    vacancy_rate,
    management_rate,
    utilities,
    capex_rate,
    other_expenses,
  } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE properties SET
        address = $1, property_type = $2, purchase_price = $3, bedrooms = $4, bathrooms = $5, square_feet = $6,
        year_built = $7, lot_size = $8, units = $9, down_payment_percent = $10, interest_rate = $11, loan_term = $12,
        rental_income = $13, other_income = $14, closing_costs = $15, repair_costs = $16, appreciation_rate = $17,
        rent_increase_rate = $18, property_tax = $19, insurance = $20, hoa_fees = $21, maintenance_rate = $22,
        vacancy_rate = $23, management_rate = $24, utilities = $25, capex_rate = $26, other_expenses = $27
      WHERE id = $28 RETURNING *`,
      [
        address, property_type, purchase_price, bedrooms, bathrooms, square_feet, year_built, lot_size, units,
        down_payment_percent, interest_rate, loan_term, rental_income, other_income, closing_costs, repair_costs,
        appreciation_rate, rent_increase_rate, property_tax, insurance, hoa_fees, maintenance_rate, vacancy_rate,
        management_rate, utilities, capex_rate, other_expenses, id
      ]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
