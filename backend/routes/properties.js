const express = require('express');
const router = express.Router();
const { Property } = require('../models');

// Get all properties
router.get('/', async (req, res) => {
    try {
        const { sellerId } = req.query;
        const whereClause = sellerId ? { sellerId } : {};
        
        const properties = await Property.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

// Get properties by filters
router.get('/search', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Get properties by location
router.get('/location/:location', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

module.exports = router; 