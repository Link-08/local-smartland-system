const express = require('express');
const router = express.Router();
const { Property } = require('../models/Property');
const { SellerMetrics } = require('../models/SellerMetrics');

// Get all properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.findAll();
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get properties by seller ID
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const properties = await Property.findAll({
            where: { sellerId: req.params.sellerId }
        });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single property by ID
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.json(property);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new property
router.post('/', async (req, res) => {
    try {
        const property = await Property.create(req.body);
        res.status(201).json(property);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update property
router.put('/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        await property.update(req.body);
        res.json(property);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete property
router.delete('/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        await property.destroy();
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Record property view
router.post('/:id/view', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        
        // Increment view count
        await property.increment('viewCount');
        
        // Update seller metrics
        const sellerMetrics = await SellerMetrics.findOne({
            where: { sellerId: property.sellerId }
        });
        
        if (sellerMetrics) {
            await sellerMetrics.increment('totalViews');
        }
        
        res.json({ message: 'View recorded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Record property inquiry
router.post('/:id/inquiry', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        
        // Increment inquiry count
        await property.increment('inquiries');
        
        // Update seller metrics
        const sellerMetrics = await SellerMetrics.findOne({
            where: { sellerId: property.sellerId }
        });
        
        if (sellerMetrics) {
            await sellerMetrics.increment('totalInquiries');
        }
        
        res.json({ message: 'Inquiry recorded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 