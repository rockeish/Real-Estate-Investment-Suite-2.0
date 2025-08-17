const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments');

// GET /api/payments - List payments (filters: propertyId, tenantId, status)
router.get('/', paymentsController.getAllPayments);

// GET /api/payments/:id - Get a single payment
router.get('/:id', paymentsController.getPaymentById);

// POST /api/payments - Create a payment record
router.post('/', paymentsController.createPayment);

// PUT /api/payments/:id - Update a payment record
router.put('/:id', paymentsController.updatePayment);

// DELETE /api/payments/:id - Delete a payment record
router.delete('/:id', paymentsController.deletePayment);

module.exports = router;