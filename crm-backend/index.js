const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb+srv://manikant2123:n4971K1h9FeDSwQ2@cluster0.bppu43r.mongodb.net/commers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
const app = express();
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authenticateToken = require('./middleware/authMiddleware');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use product routes
app.use('/api/auth', authRoutes);
// Product routes
app.use('/api/products', authenticateToken, productRoutes);
// Order routes
app.use('/api/orders', authenticateToken, orderRoutes);

app.listen(port, () => {
  console.log(`CRM Backend listening at http://localhost:${port}`);
});
