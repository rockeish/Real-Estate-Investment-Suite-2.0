const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/properties');

// GET /api/properties - Get all properties
router.get('/', propertiesController.getAllProperties);

// GET /api/properties/:id - Get a single property by ID
router.get('/:id', propertiesController.getPropertyById);

// POST /api/properties - Create a new property
router.post('/', propertiesController.createProperty);

// PUT /api/properties/:id - Update a property
router.put('/:id', propertiesController.updateProperty);

// DELETE /api/properties/:id - Delete a property
router.delete('/:id', propertiesController.deleteProperty);

module.exports = router;
