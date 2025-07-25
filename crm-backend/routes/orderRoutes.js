const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders
router.get('/', orderController.getOrders);
// Create a new order
router.post('/', orderController.addOrder);

module.exports = router; 