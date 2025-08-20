const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis');

router.post('/rental', analysisController.analyzeRental);

module.exports = router;
