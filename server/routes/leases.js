const express = require('express')

const router = express.Router()
const leasesController = require('../controllers/leases')

// GET /api/leases - Get all leases
router.get('/', leasesController.getAllLeases)

// GET /api/leases/:id - Get a single lease by ID
router.get('/:id', leasesController.getLeaseById)

// POST /api/leases - Create a new lease
router.post('/', leasesController.createLease)

// PUT /api/leases/:id - Update a lease
router.put('/:id', leasesController.updateLease)

// DELETE /api/leases/:id - Delete a lease
router.delete('/:id', leasesController.deleteLease)

module.exports = router
