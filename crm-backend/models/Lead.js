const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  company: String,
  title: String,
  leadSource: {
    type: String,
    enum: ['Meta', 'Inbound', 'Manual', 'Other'],
    default: 'Inbound'
  },
  status: {
    type: String,
    enum: ['Untouched', 'HPL', 'MPL', 'LPL', 'UL', 'Customer', 'Ticket'],
    default: 'Untouched'
  },
  priority: {
    type: String,
    enum: ['HPL', 'MPL', 'LPL', 'UL'],
    default: 'LPL'
  },
  called: {
    type: Boolean,
    default: false
  },
  aiSummary: String,
  whatsapp: String,
  invoiceNumber: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  value: {
    type: Number,
    default: 0
  },
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastContact: {
    type: Date,
    default: Date.now
  },
  nextFollowUp: Date,
  tags: [String],
  customFields: {}
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
