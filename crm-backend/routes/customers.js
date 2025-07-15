/**
 * Customers Routes
 * 
 * This file defines all the API endpoints related to customers in the CRM system.
 * It handles routing for CRUD operations on customers.
 * The actual business logic is implemented in the customerController.
 */

// Import required modules
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

/**
 * @route   GET /api/v1/customers/list
 * @desc    Get all customers with pagination and filters
 * @access  Public
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=10] - Items per page
 * @query   {string} [status] - Filter by status (active, inactive, lead, etc.)
 * @returns {Object} Paginated list of customers with metadata
 */
router.get('/list', customerController.getCustomers);

/**
 * @route   POST /api/v1/customers/create
 * @desc    Create a new customer
 * @access  Public
 * @body    {Object} Customer data {
 *             name: {string, required: true},
 *             email: {string, required: true, unique: true},
 *             phone: {string, required: true},
 *             address: {Object} {
 *               street: {string},
 *               city: {string},
 *               state: {string},
 *               zipCode: {string},
 *               country: {string}
 *             },
 *             status: {string, enum: ['active', 'inactive', 'lead'], default: 'active'},
 *             notes: {string}
 *           }
 * @returns {Object} The created customer
 */
router.post('/create', customerController.createCustomer);

/**
 * @route   GET /api/v1/customers/view/:customerId
 * @desc    Get a single customer by ID
 * @access  Public
 * @param   {string} customerId - Customer ID (MongoDB ObjectId)
 * @returns {Object} Customer details
 */
router.get('/view/:customerId', customerController.getCustomer);

/**
 * @route   PUT /api/v1/customers/update/:customerId
 * @desc    Update an existing customer
 * @access  Public
 * @param   {string} customerId - Customer ID (MongoDB ObjectId)
 * @body    {Object} Updated customer data (same fields as create)
 * @returns {Object} The updated customer
 */
router.put('/update/:customerId', customerController.updateCustomer);

/**
 * @route   DELETE /api/v1/customers/delete/:customerId
 * @desc    Delete a customer
 * @access  Public
 * @param   {string} customerId - Customer ID to delete
 * @returns {Object} { success: boolean, message: string }
 */
router.delete('/delete/:customerId', customerController.deleteCustomer);

// Export the router to be used in the main application
module.exports = router;
