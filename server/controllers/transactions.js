const db = require('../db')

// Get all transactions, with optional filtering by property_id
exports.getAllTransactions = async (req, res) => {
  const { propertyId } = req.query
  let query = 'SELECT * FROM financial_transactions'
  const params = []

  if (propertyId) {
    query += ' WHERE property_id = $1'
    params.push(propertyId)
  }

  query += ' ORDER BY transaction_date DESC'

  try {
    const { rows } = await db.query(query, params)
    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  const { id } = req.params
  try {
    const { rows } = await db.query(
      'SELECT * FROM financial_transactions WHERE id = $1',
      [id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' })
    }
    res.status(200).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create a new transaction
exports.createTransaction = async (req, res) => {
  const {
    property_id,
    transaction_type,
    category,
    description,
    amount,
    transaction_date,
  } = req.body

  if (
    !property_id ||
    !transaction_type ||
    !category ||
    !amount ||
    !transaction_date
  ) {
    return res
      .status(400)
      .json({ error: 'Missing required fields for transaction creation.' })
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO financial_transactions (property_id, transaction_type, category, description, amount, transaction_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        property_id,
        transaction_type,
        category,
        description,
        amount,
        transaction_date,
      ]
    )
    res.status(201).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update a transaction
exports.updateTransaction = async (req, res) => {
  const { id } = req.params
  const {
    property_id,
    transaction_type,
    category,
    description,
    amount,
    transaction_date,
  } = req.body

  if (
    !property_id ||
    !transaction_type ||
    !category ||
    !amount ||
    !transaction_date
  ) {
    return res
      .status(400)
      .json({ error: 'Missing required fields for transaction update.' })
  }

  try {
    const { rows } = await db.query(
      'UPDATE financial_transactions SET property_id = $1, transaction_type = $2, category = $3, description = $4, amount = $5, transaction_date = $6 WHERE id = $7 RETURNING *',
      [
        property_id,
        transaction_type,
        category,
        description,
        amount,
        transaction_date,
        id,
      ]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' })
    }
    res.status(200).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params
  try {
    const { rows } = await db.query(
      'DELETE FROM financial_transactions WHERE id = $1 RETURNING *',
      [id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' })
    }
    res.status(200).json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
