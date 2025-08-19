const express = require('express')

const router = express.Router()
const reportsController = require('../controllers/reports')

// P&L
router.get('/pl', reportsController.getProfitAndLoss)

// Rent Roll
router.get('/rent-roll', reportsController.getRentRoll)

// Tax Summary
router.get('/tax-summary', reportsController.getTaxSummary)

// Dashboard Summary
router.get('/summary', reportsController.getSummaryReport)

module.exports = router
