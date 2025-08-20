const express = require('express')

const router = express.Router()
const transactionsController = require('../controllers/transactions')

// GET /api/transactions - Get all transactions (can be filtered by property_id)
router.get('/', transactionsController.getAllTransactions)

// GET /api/transactions/:id - Get a single transaction by ID
router.get('/:id', transactionsController.getTransactionById)

// POST /api/transactions - Create a new transaction
router.post('/', transactionsController.createTransaction)

// PUT /api/transactions/:id - Update a transaction
router.put('/:id', transactionsController.updateTransaction)

// DELETE /api/transactions/:id - Delete a transaction
router.delete('/:id', transactionsController.deleteTransaction)

module.exports = router
