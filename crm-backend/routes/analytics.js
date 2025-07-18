/**
 * @fileoverview Analytics Routes
 * @description This file defines all the API endpoints related to analytics in the CRM system.
 * It provides insights and statistics about different aspects of the business.
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

/**
 * @route   GET /api/v1/analytics/dashboard/summary
 * @desc    Get dashboard summary with key business metrics
 * @access  Public
 * @query   {string} [startDate] - Start date for filtering (YYYY-MM-DD)
 * @query   {string} [endDate] - End date for filtering (YYYY-MM-DD)
 * @returns {Object} {
 *   metrics: {
 *     totalLeads: number,
 *     totalCustomers: number,
 *     conversionRate: number
 *   },
 *   charts: {
 *     leadsByStatus: Array<{_id: string, count: number}>,
 *     leadsBySource: Array<{_id: string, count: number}>
 *   }
 * }
 */
router.get('/dashboard/summary', analyticsController.getDashboardAnalytics);

/**
 * @route   GET /api/v1/analytics/leads/performance
 * @desc    Get leads performance analytics
 * @access  Public
 * @query   {string} [startDate] - Start date for filtering (YYYY-MM-DD)
 * @query   {string} [endDate] - End date for filtering (YYYY-MM-DD)
 * @returns {Object} {
 *   overview: {
 *     totalLeads: number,
 *     newLeads: number,
 *     convertedLeads: number
 *   },
 *   byStatus: Array<{_id: string, count: number}>,
 *   bySource: Array<{_id: string, count: number}>,
 *   trend: Array<{_id: string, count: number}>
 * }
 */
router.get('/leads/performance', analyticsController.getLeadsAnalytics);

/**
 * @route   GET /api/v1/analytics/customers/insights
 * @desc    Get customers insights and segmentation
 * @access  Public
 * @query   {string} [startDate] - Start date for filtering (YYYY-MM-DD)
 * @query   {string} [endDate] - End date for filtering (YYYY-MM-DD)
 * @returns {Object} {
 *   customerCount: number,
 *   activeCustomers: number,
 *   retentionRate: number,
 *   byStatus: Array<{_id: string, count: number}>,
 *   trend: Array<{_id: string, count: number}>
 * }
 */
router.get('/customers/insights', analyticsController.getCustomersAnalytics);

// Export the router to be used in the main application
/**
 * @route   GET /api/v1/analytics/ecommerce/slides
 * @desc    Get e-commerce slides data including featured products, top categories, and sales metrics
 * @access  Public
 * @returns {Object} {
 *   featuredProducts: Array<{_id: string, name: string, price: number, imageUrl: string, rating: number}>,
 *   topCategories: Array<{_id: string, count: number}>,
 *   salesTrends: Array<{_id: string, totalSales: number, orderCount: number}>,
 *   metrics: {
 *     totalRevenue: number,
 *     totalOrders: number,
 *     averageOrderValue: number
 *   }
 * }
 */
router.get('/ecommerce/slides', analyticsController.getEcommerceSlides);

module.exports = router;
