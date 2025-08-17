const express = require('express');
const router = express.Router();
const tenantsController = require('../controllers/tenants');

// GET /api/tenants - Get all tenants
router.get('/', tenantsController.getAllTenants);

// GET /api/tenants/:id - Get a single tenant by ID
router.get('/:id', tenantsController.getTenantById);

// POST /api/tenants - Create a new tenant
router.post('/', tenantsController.createTenant);

// PUT /api/tenants/:id - Update a tenant
router.put('/:id', tenantsController.updateTenant);

// DELETE /api/tenants/:id - Delete a tenant
router.delete('/:id', tenantsController.deleteTenant);

module.exports = router;
