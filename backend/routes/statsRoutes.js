const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');

// GET /api/tasks/stats — Dashboard statistics
router.get('/', getStats);

module.exports = router;
