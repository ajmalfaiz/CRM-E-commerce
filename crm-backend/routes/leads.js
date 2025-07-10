const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

// @route   GET api/leads
// @desc    Get all leads
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/leads
// @desc    Add new lead
// @access  Private
router.post('/', auth, async (req, res) => {
  const {
    name,
    email,
    phone,
    company,
    title,
    leadSource,
    status,
    value,
    tags
  } = req.body;

  try {
    const newLead = new Lead({
      name,
      email,
      phone,
      company,
      title,
      leadSource: leadSource || 'Website',
      status: status || 'New',
      value: value || 0,
      tags: tags || [],
      owner: req.user.id
    });

    const lead = await newLead.save();
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/leads/:id
// @desc    Update lead
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    name,
    email,
    phone,
    company,
    title,
    leadSource,
    status,
    value,
    tags
  } = req.body;

  // Build lead object
  const leadFields = {};
  if (name) leadFields.name = name;
  if (email) leadFields.email = email;
  if (phone) leadFields.phone = phone;
  if (company) leadFields.company = company;
  if (title) leadFields.title = title;
  if (leadSource) leadFields.leadSource = leadSource;
  if (status) leadFields.status = status;
  if (value) leadFields.value = value;
  if (tags) leadFields.tags = tags;

  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ msg: 'Lead not found' });

    // Make sure user owns lead
    if (lead.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: leadFields },
      { new: true }
    );

    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/leads/:id
// @desc    Delete lead
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ msg: 'Lead not found' });

    // Make sure user owns lead
    if (lead.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Lead.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Lead removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
