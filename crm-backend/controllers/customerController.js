/**
 * Customer Controller
 * 
 * This controller contains all the business logic for customer-related operations.
 * It handles the CRUD operations for customers and implements the business rules.
 */

// Import the Customer model
const Customer = require('../models/Customer');

/**
 * @desc    Get all customers with pagination and filtering
 * @route   GET /api/v1/customers/list
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Paginated list of customers with metadata
 */
exports.getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const total = await Customer.countDocuments(filter);

    const customers = await Customer.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: customers.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: customers
    });
  } catch (err) {
    console.error('Error getting customers:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving customers',
      error: err.message 
    });
  }
};

/**
 * @desc    Get a single customer by ID
 * @route   GET /api/v1/customers/view/:customerId
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Customer details
 */
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer not found' 
      });
    }
    res.json({ 
      success: true,
      data: customer 
    });
  } catch (err) {
    console.error('Error getting customer:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving customer',
      error: err.message 
    });
  }
};

/**
 * @desc    Create a new customer
 * @route   POST /api/v1/customers/create
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} The created customer
 */
exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(400).json({
      success: false,
      message: 'Error creating customer',
      error: err.message
    });
  }
};

/**
 * @desc    Update an existing customer
 * @route   PUT /api/v1/customers/update/:customerId
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} The updated customer
 */
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.customerId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer not found' 
      });
    }
    res.json({ 
      success: true,
      data: customer 
    });
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(400).json({ 
      success: false,
      message: 'Error updating customer',
      error: err.message 
    });
  }
};

/**
 * @desc    Delete a customer
 * @route   DELETE /api/v1/customers/delete/:customerId
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Success message
 */
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'Customer deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting customer',
      error: err.message 
    });
  }
};
