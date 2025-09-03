require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Connect to MongoDB
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
const app = express();

// Apply CORS with options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Parse JSON bodies
app.use(express.json());

// Import routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authenticateToken = require('./middleware/authMiddleware');
const port = process.env.PORT || 3000;
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use product routes
app.use('/api/auth', authRoutes);
// Product routes
app.use('/api/products', authenticateToken, productRoutes);
// Customer routes
app.use('/api/customers', authenticateToken, customerRoutes);
// Order routes
app.use('/api/orders', authenticateToken, orderRoutes);

app.listen(port, () => {
  console.log(`CRM Backend listening at http://localhost:${port}`);
});
