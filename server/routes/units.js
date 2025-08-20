const express = require('express')

const router = express.Router()
const unitsController = require('../controllers/units')

// GET /api/units - List units (optional propertyId filter)
router.get('/', unitsController.getAllUnits)

// GET /api/units/:id - Get a single unit
router.get('/:id', unitsController.getUnitById)

// POST /api/units - Create a unit
router.post('/', unitsController.createUnit)

// PUT /api/units/:id - Update a unit
router.put('/:id', unitsController.updateUnit)

// DELETE /api/units/:id - Delete a unit
router.delete('/:id', unitsController.deleteUnit)

module.exports = router
