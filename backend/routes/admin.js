const express = require('express');
const { authenticateToken, authenticateAdmin } = require('../utils/middleware');
const { getUnverifiedLawyers, verifyLawyer } = require('../controllers/adminController');

const router = express.Router();

// Admin routes
router.get('/lawyers/unverified', authenticateToken, authenticateAdmin, getUnverifiedLawyers);
router.put('/verify-lawyer/:id', authenticateToken, authenticateAdmin, verifyLawyer);

module.exports = router;
