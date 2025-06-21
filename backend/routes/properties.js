const express = require('express');
const router = express.Router();
const { Property, User, Log } = require('../models');
const { auth } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all properties
router.get('/', async (req, res) => {
    try {
        const { sellerId } = req.query;
        const whereClause = sellerId ? { sellerId, status: 'active' } : { status: 'active' };
        
        const properties = await Property.findAll({
            where: whereClause,
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

// Create new property
router.post('/', async (req, res) => {
    try {
        console.log('Creating new property:', req.body);
        
        const {
            title,
            description,
            price,
            location,
            acres,
            waterRights,
            suitableCrops,
            image,
            sellerId,
            type,
            topography,
            averageYield,
            amenities,
            restrictionsText,
            remarks,
            displayPrice
        } = req.body;

        // Validate required fields
        if (!title || !price || !acres || !sellerId) {
            return res.status(400).json({ 
                error: 'Missing required fields: title, price, acres, and sellerId are required' 
            });
        }

        // Create the property with all available fields
        const propertyData = {
            title,
            description: description || '',
            price: parseFloat(price),
            location: location || 'Location not specified',
            acres: parseFloat(acres),
            waterRights: waterRights || 'Not specified',
            suitableCrops: suitableCrops || 'Not specified',
            type: type || 'Agricultural Land',
            topography: topography || 'Flat to rolling',
            averageYield: averageYield || 'Not specified',
            amenities: Array.isArray(amenities) ? amenities : [],
            restrictionsText: restrictionsText || '',
            remarks: remarks || '',
            displayPrice: displayPrice !== undefined ? displayPrice : true,
            image: image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
            status: 'active',
            sellerId: parseInt(sellerId)
        };

        const property = await Property.create(propertyData);

        // Log the property creation activity
        await Log.create({
            action: 'property_created',
            description: `New property "${title}" created`,
            userId: parseInt(sellerId),
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Fetch the created property with seller information
        const createdProperty = await Property.findByPk(property.id, {
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });

        console.log('Property created successfully:', createdProperty);
        res.status(201).json(createdProperty);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Failed to create property' });
    }
});

// Update property
router.put('/:id', async (req, res) => {
    try {
        const propertyId = req.params.id;
        const userId = req.user.id; // From auth middleware
        const updateData = req.body;

        // Find the property
        const property = await Property.findByPk(propertyId);
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if the user is the owner of the property
        if (property.sellerId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this property' });
        }

        // Update the property
        await property.update(updateData);
        
        // Log the property update activity
        await Log.create({
            action: 'property_updated',
            description: `Property "${property.title}" updated`,
            userId: userId,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        // Fetch the updated property with seller information
        const updatedProperty = await Property.findByPk(propertyId, {
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });

        console.log(`Property ${propertyId} updated successfully by user ${userId}`);
        res.json(updatedProperty);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Failed to update property' });
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

// Delete property
router.delete('/:id', async (req, res) => {
    try {
        const propertyId = req.params.id;
        const userId = req.user.id; // From auth middleware

        // Find the property
        const property = await Property.findByPk(propertyId);
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if the user is the owner of the property
        if (property.sellerId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this property' });
        }

        // Log the property deletion activity before deleting
        await Log.create({
            action: 'property_deleted',
            description: `Property "${property.title}" deleted`,
            userId: userId,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Delete the property
        await property.destroy();
        
        console.log(`Property ${propertyId} deleted successfully by user ${userId}`);
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Failed to delete property' });
    }
});

module.exports = router; 