const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');
const aiController = require('../controllers/aiLeadController');
const authenticateToken = require('../middleware/authMiddleware');

// Apply authentication to all routes
router.use(authenticateToken);

// Regular customer routes
router.get('/', controller.getAllCustomers);
router.post('/', controller.createCustomer);
router.put('/:id', controller.updateCustomer);
router.delete('/:id', controller.deleteCustomer);

// AI Lead Generation route - protected by auth middleware
router.post('/ai-generate', aiController.generateLeads);

// Test route for debugging lead saving
router.post('/test-save', aiController.testSaveLead);

module.exports = router;
