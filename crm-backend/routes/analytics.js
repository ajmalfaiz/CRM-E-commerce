const express = require('express');
const router = express.Router();

// Dummy analytics data
const analyticsData = {
    sales: {
        totalRevenue: 500000,
        monthlyRevenue: [
            { month: 'Jan', revenue: 45000 },
            { month: 'Feb', revenue: 52000 },
            { month: 'Mar', revenue: 60000 },
            { month: 'Apr', revenue: 58000 },
            { month: 'May', revenue: 65000 },
            { month: 'Jun', revenue: 70000 }
        ],
        topProducts: [
            { name: 'Product A', revenue: 150000, units: 1200 },
            { name: 'Product B', revenue: 120000, units: 800 },
            { name: 'Product C', revenue: 90000, units: 600 },
            { name: 'Product D', revenue: 70000, units: 400 },
            { name: 'Product E', revenue: 40000, units: 300 }
        ]
    },
    customers: {
        totalCustomers: 2500,
        newCustomers: 350,
        activeCustomers: 1800,
        customerRetention: 85,
        customerSegments: [
            { segment: 'High Value', count: 250 },
            { segment: 'Regular', count: 1200 },
            { segment: 'Occasional', count: 800 },
            { segment: 'New', count: 350 }
        ]
    },
    orders: {
        totalOrders: 4500,
        averageOrderValue: 111.11,
        orderStatus: {
            completed: 3800,
            pending: 450,
            cancelled: 250
        },
        deliveryTime: {
            avgDays: 3.2,
            onTimeDelivery: 92
        }
    }
};

// Get analytics data
router.get('/', (req, res) => {
    console.log('Analytics endpoint hit');
    try {
        if (!analyticsData) {
            throw new Error('Analytics data not available');
        }
        console.log('Sending analytics data');
        res.setHeader('Content-Type', 'application/json');
        res.json(analyticsData);
    } catch (error) {
        console.error('Error in analytics endpoint:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data', details: error.message });
    }
});

// Test endpoint
router.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ status: 'API is working', timestamp: new Date().toISOString() });
});

module.exports = router;
