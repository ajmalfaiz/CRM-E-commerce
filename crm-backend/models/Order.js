const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // New fields for direct product order
  orderId: {
    type: String,
  },
  productTitle: {
    type: String,
  },
  price: {
    type: Number,
  },
  customer: {
    type: String,
  },
  date: {
    type: Date,
  },
  type: {
    type: String,
    enum: ['Online', 'In-Store'],
  },
});

module.exports = mongoose.model('Order', orderSchema); 