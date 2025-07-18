/**
 * @fileoverview Category Routes
 * @description This file defines all the API endpoints related to categories in the CRM system.
 * It handles routing for category management operations.
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const {
  getCategories,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', getCategories);

/**
 * @route   GET /api/v1/categories/:category
 * @desc    Get products by category
 * @access  Public
 */
router.get('/:category', getProductsByCategory);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Public
 */
router.post('/', createCategory);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update a category
 * @access  Public
 */
router.put('/:id', updateCategory);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category
 * @access  Public
 */
router.delete('/:id', deleteCategory);

module.exports = router;
