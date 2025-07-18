const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Product.distinct('categories');
  
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get products by category
// @route   GET /api/categories/:category
// @access  Public
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const total = await Product.countDocuments({ categories: category });
  
  const products = await Product.find({ categories: category })
    .skip(startIndex)
    .limit(limit);
  
  // Pagination result
  const pagination = {};
  
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products
  });
});

// @desc    Create new category (Admin only)
// @route   POST /api/categories
// @access  Public
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  
  if (!name) {
    return next(new ErrorResponse('Please provide a category name', 400));
  }
  
  // In a real app, you might want to have a separate Category model
  // For now, we'll just return the new category
  const category = { name, slug: name.toLowerCase().replace(/\s+/g, '-') };
  
  res.status(201).json({
    success: true,
    data: category
  });
});

// @desc    Update category (Admin only)
// @route   PUT /api/categories/:id
// @access  Public
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  
  if (!name) {
    return next(new ErrorResponse('Please provide a category name', 400));
  }
  
  // In a real app, you would update the category in the database
  // For now, we'll just return the updated category
  const updatedCategory = {
    id: req.params.id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-')
  };
  
  res.status(200).json({
    success: true,
    data: updatedCategory
  });
});

// @desc    Delete category (Admin only)
// @route   DELETE /api/categories/:id
// @access  Public
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  // In a real app, you would delete the category from the database
  // and handle any associated products
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
