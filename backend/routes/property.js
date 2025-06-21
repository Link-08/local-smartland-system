const express = require('express');
const router = express.Router();
const { Property, User } = require('../models');

// Get all properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.findAll({
            where: { status: 'active' }, // Only show active properties
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });
        
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

// Get properties by seller ID
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const { sellerId } = req.params;
        const properties = await Property.findAll({
            where: { 
                sellerId: sellerId,
                status: 'active' // Only show active properties
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });
        
        res.json(properties);
    } catch (error) {
        console.error('Error fetching seller properties:', error);
        res.status(500).json({ error: 'Failed to fetch seller properties' });
    }
});

// Get single property by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findOne({
            where: { 
                id: id,
                status: 'active' // Only show active properties
            },
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found or not available' });
        }
        
        res.json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Failed to fetch property' });
    }
});

// Create new property
router.post('/', (req, res) => {
    res.status(201).json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Update property
router.put('/:id', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Delete property
router.delete('/:id', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Record property view
router.post('/:id/view', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Record property inquiry
router.post('/:id/inquiry', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

module.exports = router; 