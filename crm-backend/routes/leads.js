/**
 * Leads Routes
 * 
 * This file defines all the API endpoints related to leads in the CRM system.
 * It handles routing for CRUD operations on leads.
 * The actual business logic is implemented in the leadController.
 */

// Import required modules
const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

/**
 * @route   GET /api/v1/leads/list
 * @desc    Get all leads with pagination and filters
 * @access  Public
 * @query   {number} [page=1] - Page number
 * @query   {number} [limit=10] - Items per page
 * @query   {string} [status] - Filter by status
 * @query   {string} [source] - Filter by lead source
 * @returns {Object} Paginated list of leads with metadata
 */
router.get('/list', leadController.getLeads);

/**
 * @route   POST /api/v1/leads/create
 * @desc    Create a new lead
 * @access  Public
 * @body    {Object} Lead data {
 *             name: {string, required: true},
 *             email: {string, required: true, unique: true},
 *             phone: {string, required: true},
 *             company: {string},
 *             status: {string, enum: ['new', 'contacted', 'qualified', 'lost'], default: 'new'},
 *             source: {string, enum: ['website', 'social', 'referral', 'other'], default: 'website'},
 *             notes: {string},
 *             assignedTo: {string} - User ID of the assigned team member
 *           }
 * @returns {Object} The created lead
 */
router.post('/create', leadController.createLead);

/**
 * @route   GET /api/v1/leads/view/:leadId
 * @desc    Get a single lead by ID
 * @access  Public
 * @param   {string} leadId - Lead ID (MongoDB ObjectId)
 * @returns {Object} Lead details
 */
router.get('/view/:leadId', leadController.getLead);

/**
 * @route   PUT /api/v1/leads/update/:leadId
 * @desc    Update an existing lead
 * @access  Public
 * @param   {string} leadId - Lead ID (MongoDB ObjectId)
 * @body    {Object} Updated lead data (same fields as create)
 * @returns {Object} The updated lead
 */
router.put('/update/:leadId', leadController.updateLead);

/**
 * @route   DELETE /api/v1/leads/delete/:leadId
 * @desc    Delete a lead
 * @access  Public
 * @param   {string} leadId - Lead ID to delete
 * @returns {Object} { success: boolean, message: string }
 */
router.delete('/delete/:leadId', leadController.deleteLead);

// Export the router to be used in the main application
module.exports = router;
