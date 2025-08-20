const express = require('express')

const router = express.Router()
const dealsController = require('../controllers/deals')

// GET /api/deals - List deals with optional filters
router.get('/', dealsController.getAllDeals)

// GET /api/deals/:id - Get a single deal
router.get('/:id', dealsController.getDealById)

// POST /api/deals - Create a new deal
router.post('/', dealsController.createDeal)

// PUT /api/deals/:id - Update a deal
router.put('/:id', dealsController.updateDeal)

// PATCH /api/deals/:id/status - Update a deal's status
router.patch('/:id/status', dealsController.updateDealStatus)

// DELETE /api/deals/:id - Delete a deal
router.delete('/:id', dealsController.deleteDeal)

module.exports = router
