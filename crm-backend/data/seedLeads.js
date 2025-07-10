const mongoose = require('mongoose');
const Lead = require('../models/Lead');
require('dotenv').config();

// Sample data for leads
const leadSources = ['Meta', 'Inbound', 'Manual', 'Other'];
const statuses = ['Untouched', 'HPL', 'MPL', 'LPL', 'UL', 'Customer', 'Ticket'];
const priorities = ['HPL', 'MPL', 'LPL', 'UL'];
const companies = [
  'TechCorp', 'InnovateX', 'Digital Solutions', 'Global Tech', 'Future Systems',
  'NexGen', 'Alpha Corp', 'Omega Systems', 'Pinnacle Tech', 'Summit Solutions'
];
const firstNames = [
  'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa',
  'William', 'Emma', 'James', 'Olivia', 'Daniel', 'Ava', 'Matthew', 'Sophia'
];
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'
];

// Get database connection from mongoose
const db = mongoose.connection;

// Generate random date within the last 30 days
function getRandomDate() {
  const now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - 30);
  return new Date(pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime()));
}

// Generate a random lead
function generateLead() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`;
  const phone = `+1${Math.floor(2000000000 + Math.random() * 8000000000)}`;
  const leadSource = leadSources[Math.floor(Math.random() * leadSources.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const called = Math.random() > 0.5;
  const value = Math.floor(Math.random() * 10000) + 500;
  
  return {
    name: `${firstName} ${lastName}`,
    email,
    phone,
    company,
    title: `${['CEO', 'CTO', 'CMO', 'CFO', 'Manager', 'Director'][Math.floor(Math.random() * 6)]}`,
    leadSource,
    status,
    priority,
    called,
    aiSummary: `Interested in our ${['enterprise', 'business', 'premium', 'basic', 'custom'][Math.floor(Math.random() * 5)]} plan. ${called ? 'Already had a call.' : 'Needs to be called.'}`,
    whatsapp: Math.random() > 0.3 ? phone : undefined,
    invoiceNumber: Math.random() > 0.6 ? `INV-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
    value,
    notes: [
      {
        content: `Initial contact made on ${new Date().toLocaleDateString()}. ${['Very interested', 'Interested', 'Needs more info', 'Will get back to us'][Math.floor(Math.random() * 4)]}.`,
        createdBy: new mongoose.Types.ObjectId() // Using a dummy ObjectId
      }
    ],
    createdAt: getRandomDate(),
    updatedAt: new Date()
  };
}

// Seed function that can be imported and used elsewhere
const seedLeads = async () => {
  try {
    if (db.readyState !== 1) {
      console.log('Waiting for MongoDB connection...');
      await new Promise(resolve => db.once('open', resolve));
    }
    
    console.log('Connected to MongoDB');
    
    // Clear existing leads
    await Lead.deleteMany({});
    console.log('Cleared existing leads');
    
    // Generate and insert new leads
    const leads = [];
    const numLeads = 50; // Number of dummy leads to generate
    
    for (let i = 0; i < numLeads; i++) {
      leads.push(generateLead());
    }
    
    await Lead.insertMany(leads);
    console.log(`Successfully inserted ${numLeads} leads`);
    
    return leads;
  } catch (error) {
    console.error('Error seeding leads:', error);
    throw error;
  }
};

// If this file is run directly (not imported), execute the seed
if (require.main === module) {
  // Connect to MongoDB if not already connected
  if (mongoose.connection.readyState === 0) { // 0 = disconnected
    mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecom-crm', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', async () => {
      try {
        await seedLeads();
        mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
      } catch (error) {
        console.error('Error:', error);
        process.exit(1);
      }
    });
  } else {
    // Already connected, just run the seed
    seedLeads()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Error:', error);
        process.exit(1);
      });
  }
}

module.exports = seedLeads;
