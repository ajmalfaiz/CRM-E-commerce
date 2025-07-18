/**
 * Analytics Controller
 * 
 * This controller contains all the business logic for analytics-related operations.
 * It handles generating various reports and statistics for the application.
 */

// Import required models
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    Get dashboard summary with key metrics
 * @route   GET /api/v1/analytics/dashboard/summary
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Dashboard statistics including leads, customers, and conversion rates
 */
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Get total leads count
    const totalLeads = await Lead.countDocuments();
    
    // Get leads by status
    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get leads by source
    const leadsBySource = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);
    
    // Get total customers count
    const totalCustomers = await Customer.countDocuments();
    
    // Get conversion rate (leads to customers)
    const conversionRate = totalLeads > 0 
      ? (totalCustomers / totalLeads * 100).toFixed(2)
      : 0;
    
    res.json({
      success: true,
      data: {
        metrics: {
          totalLeads,
          totalCustomers,
          conversionRate: parseFloat(conversionRate)
        },
        charts: {
          leadsByStatus,
          leadsBySource
        }
      }
    });
  } catch (err) {
    console.error('Error getting dashboard analytics:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving dashboard analytics',
      error: err.message 
    });
  }
};

/**
 * @desc    Get leads performance analytics
 * @route   GET /api/v1/analytics/leads/performance
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Leads performance analytics
 */
exports.getLeadsAnalytics = async (req, res) => {
  try {
    // Get date range from query params or default to last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Get leads by status
    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get leads by source
    const leadsBySource = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);
    
    // Get leads trend (last 30 days)
    const leadsTrend = await Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalLeads: await Lead.countDocuments(),
          newLeads: await Lead.countDocuments({ status: 'new' }),
          convertedLeads: await Lead.countDocuments({ status: 'converted' })
        },
        byStatus: leadsByStatus,
        bySource: leadsBySource,
        trend: leadsTrend
      }
    });
  } catch (err) {
    console.error('Error getting leads analytics:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving leads analytics',
      error: err.message 
    });
  }
};

/**
 * @desc    Get customers insights and segmentation
 * @route   GET /api/v1/analytics/customers/insights
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Customers insights and segmentation
 */
exports.getCustomersAnalytics = async (req, res) => {
  try {
    // Get total customers
    const totalCustomers = await Customer.countDocuments();
    
    // Get customers by creation date (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const customersByMonth = await Customer.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      { $group: { 
        _id: { 
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Format data for chart
    const formattedData = customersByMonth.map(item => ({
      date: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      count: item.count
    }));
    
    res.json({
      totalCustomers,
      customersByMonth: formattedData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get e-commerce slides data
 * @route   GET /api/v1/analytics/ecommerce/slides
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} E-commerce slides data including featured products and sales metrics
 */
exports.getEcommerceSlides = async (req, res) => {
  try {
    // Get featured products (example implementation)
    const featuredProducts = await Product.find({ isFeatured: true })
      .select('name price imageUrl rating')
      .limit(5)
      .lean();

    // Get top categories (example implementation)
    const topCategories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get sales trends (example implementation - last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const salesTrends = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { 
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Calculate metrics
    const totalRevenue = salesTrends.reduce((sum, item) => sum + (item.totalSales || 0), 0);
    const totalOrders = salesTrends.reduce((sum, item) => sum + (item.orderCount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      success: true,
      data: {
        featuredProducts,
        topCategories,
        salesTrends: salesTrends.map(item => ({
          _id: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          totalSales: item.totalSales,
          orderCount: item.orderCount
        })),
        metrics: {
          totalRevenue,
          totalOrders,
          averageOrderValue
        }
      }
    });
  } catch (error) {
    console.error('Error in getEcommerceSlides:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch e-commerce slides data'
    });
  }
};
