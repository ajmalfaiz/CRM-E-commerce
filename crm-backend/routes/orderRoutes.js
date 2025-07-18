/**
 * @fileoverview Order Routes
 * @description This file defines all the API endpoints related to orders in the CRM system.
 * It handles routing for order management operations.
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus
} = require('../controllers/orderController');

/**
 * @route   POST /api/v1/orders
 * @desc    Create a new order
 * @access  Public
 */
router.post('/', createOrder);

/**
 * @route   GET /api/v1/orders
 * @desc    Get all orders
 * @access  Public
 */
router.get('/', getOrders);

/**
 * @route   GET /api/v1/orders/myorders
 * @desc    Get orders for the current user
 * @access  Public
 */
router.get('/myorders', getMyOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get order by ID
 * @access  Public
 */
router.get('/:id', getOrderById);

/**
 * @route   PUT /api/v1/orders/:id/pay
 * @desc    Update order to paid
 * @access  Public
 */
router.put('/:id/pay', updateOrderToPaid);

/**
 * @route   PUT /api/v1/orders/:id/deliver
 * @desc    Update order to delivered
 * @access  Public
 */
router.put('/:id/deliver', updateOrderToDelivered);

/**
 * @route   PUT /api/v1/orders/:id/status
 * @desc    Update order status
 * @access  Public
 */
router.put('/:id/status', updateOrderStatus);

module.exports = router;
