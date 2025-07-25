const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Create a new order
exports.addOrder = async (req, res) => {
  try {
    const {
      products, total, // original
      orderId, productTitle, price, customer, date, type, status // new
    } = req.body;
    const userId = req.user?.id; // Always try to get user from token
    let order;
    if (orderId && productTitle && price && customer && date && type && status) {
      // Direct product order
      order = new Order({
        user: userId, // associate user if available
        orderId,
        productTitle,
        price,
        customer,
        date,
        type,
        status
      });
    } else {
      // Original cart order
      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Products are required.' });
      }
      order = new Order({
        user: userId,
        products,
        total,
      });
    }
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'email')
      .populate('products.product', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
}; 