const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
orderSchema.pre('save', async function(next) {
  if (this.isModified('orderItems') || this.isNew) {
    const itemsPrice = this.orderItems.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
    
    // Example tax calculation (10% of items price)
    const taxPrice = Math.round((itemsPrice * 0.1) * 100) / 100;
    
    // Example shipping price
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    
    this.itemsPrice = itemsPrice;
    this.taxPrice = taxPrice;
    this.shippingPrice = shippingPrice;
    this.totalAmount = itemsPrice + taxPrice + shippingPrice;
  }
  next();
});

// Update product stock when order is placed
orderSchema.post('save', async function(doc) {
  if (doc.isModified('orderItems') && !doc.isModified('isPaid')) {
    for (const item of doc.orderItems) {
      await mongoose.model('Product').updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity } }
      );
    }
  }
});

// Restore product stock when order is cancelled
orderSchema.post('findOneAndUpdate', async function(doc) {
  if (doc.status === 'cancelled' && this._update.status !== 'cancelled') {
    for (const item of doc.orderItems) {
      await mongoose.model('Product').updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } }
      );
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);
