const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  status: String, // e.g., Lead, Contacted, Converted
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
