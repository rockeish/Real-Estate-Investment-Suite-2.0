const express = require('express')

const router = express.Router()
const loansController = require('../controllers/loans')

// GET /api/loans - List loans (filter by propertyId)
router.get('/', loansController.getAllLoans)

// GET /api/loans/:id - Get a single loan
router.get('/:id', loansController.getLoanById)

// POST /api/loans - Create a new loan
router.post('/', loansController.createLoan)

// PUT /api/loans/:id - Update a loan
router.put('/:id', loansController.updateLoan)

// DELETE /api/loans/:id - Delete a loan
router.delete('/:id', loansController.deleteLoan)

module.exports = router
