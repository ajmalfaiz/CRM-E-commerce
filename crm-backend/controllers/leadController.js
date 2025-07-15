/**
 * Lead Controller
 * 
 * This controller contains all the business logic for lead-related operations.
 * It handles the CRUD operations for leads and implements the business rules.
 */

// Import the Lead model
const Lead = require('../models/Lead');

/**
 * @desc    Get all leads with pagination and filtering
 * @route   GET /api/v1/leads/list
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Paginated list of leads with metadata
 */
exports.getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;

    // Get total count for pagination
    const total = await Lead.countDocuments(filter);

    // Get paginated leads
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: leads.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: leads
    });
  } catch (err) {
    console.error('Error getting leads:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving leads',
      error: err.message 
    });
  }
};

/**
 * @desc    Get a single lead by ID
 * @route   GET /api/v1/leads/view/:leadId
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Lead details
 */
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) {
      return res.status(404).json({ 
        success: false,
        message: 'Lead not found' 
      });
    }
    res.json({ 
      success: true,
      data: lead 
    });
  } catch (err) {
    console.error('Error getting lead:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving lead',
      error: err.message 
    });
  }
};

/**
 * @desc    Create a new lead
 * @route   POST /api/v1/leads/create
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} The created lead
 */
exports.createLead = async (req, res) => {
  try {
    const lead = new Lead({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      status: req.body.status || 'new',
      source: req.body.source || 'website',
      notes: req.body.notes
    });

    await lead.save();
    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (err) {
    console.error('Error creating lead:', err);
    res.status(400).json({
      success: false,
      message: 'Error creating lead',
      error: err.message
    });
  }
};

/**
 * @desc    Update an existing lead
 * @route   PUT /api/v1/leads/update/:leadId
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} The updated lead
 */
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.leadId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!lead) {
      return res.status(404).json({ 
        success: false,
        message: 'Lead not found' 
      });
    }
    
    res.json({ 
      success: true,
      data: lead 
    });
  } catch (err) {
    console.error('Error updating lead:', err);
    res.status(400).json({ 
      success: false,
      message: 'Error updating lead',
      error: err.message 
    });
  }
};

/**
 * @desc    Delete a lead
 * @route   DELETE /api/v1/leads/delete/:leadId
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Success message
 */
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.leadId);
    
    if (!lead) {
      return res.status(404).json({ 
        success: false,
        message: 'Lead not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Lead deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting lead:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting lead',
      error: err.message 
    });
  }
};
