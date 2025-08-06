const Customer = require('../models/Customer');

async function getAllCustomers(req, res) {
  try {
    console.log('Getting customers for user ID:', req.user?.id);
    // For storefront, return all customers; for admin, return user-specific customers
    const customers = req.headers['x-storefront'] === 'true' 
      ? await Customer.find({}) 
      : await Customer.find({ user: req.user.id });
    console.log('Found customers:', customers);
    res.json(customers);
  } catch (err) {
    console.error('Error getting customers:', err);
    res.status(500).json({ error: err.message });
  }
}


async function createCustomer(req, res) {
  try {
    console.log('Creating customer with data:', req.body);
    // Only set user if present and valid
    const customerData = req.user && req.user.id && req.user.id !== 'default-user'
      ? { ...req.body, user: req.user.id }
      : { ...req.body }; // do NOT set user for storefront/public

    console.log('User ID:', req.user?.id);
    console.log('Final customer data:', customerData);

    const customer = new Customer(customerData);
    const savedCustomer = await customer.save();
    console.log('Customer created successfully:', savedCustomer);
    res.json(savedCustomer);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: err.message });
  }
}


async function updateCustomer(req, res) {
  try {
    const updated = await Customer.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.id || 'default-user' },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function deleteCustomer(req, res) {
  try {
    const deleted = await Customer.findOneAndDelete({ _id: req.params.id, user: req.user?.id || 'default-user' });
    if (!deleted) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
