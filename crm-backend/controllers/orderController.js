const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new ErrorResponse('No order items', 400));
  }

  // Check if products exist and update their stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${item.product}`, 404));
    }
    
    if (product.stock < item.quantity) {
      return next(
        new ErrorResponse(
          `Not enough stock for ${product.name}. Only ${product.stock} available`,
          400
        )
      );
    }
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  
  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // No authentication check

  res.json(order);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Public
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  };

  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Public/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'delivered';

  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Public
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse('Invalid status', 400));
  }
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }
  
  order.status = status;
  
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  
  if (status === 'cancelled' && order.paymentResult) {
    // Implement refund logic here if needed
  }
  
  const updatedOrder = await order.save();
  
  res.json(updatedOrder);
});
