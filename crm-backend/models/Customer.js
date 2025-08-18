const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Untouched',
    enum: ['Untouched', 'HPL', 'MPL', 'LPL']
  },
  notes: String,
  company: {
    type: String,
    default: ''
  },
  leadSource: {
    type: String,
    default: 'Manual Entry'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);