const express = require('express');
const router = express.Router();
const { Property, User } = require('../models');
const { auth } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get user favorites
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        
        // For now, we'll return an empty array since we don't have a Favorites model yet
        // In a real implementation, you would have a Favorites table that links users to properties
        // For demonstration, we'll return some sample properties that the user might have favorited
        
        const sampleProperties = await Property.findAll({
            where: { status: 'active' },
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'avatar']
            }]
        });
        
        // Transform the data to match the expected format
        const favorites = sampleProperties.map(property => ({
            id: property.id,
            property: {
                id: property.id,
                title: property.title,
                location: property.location,
                price: property.price,
                acres: property.acres,
                waterRights: property.waterRights,
                suitableCrops: property.suitableCrops,
                image: property.image,
                seller: property.seller
            }
        }));
        
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// Add to favorites
router.post('/:propertyId', async (req, res) => {
    try {
        const userId = req.user.id;
        const propertyId = req.params.propertyId;
        
        // Check if property exists and is active
        const property = await Property.findOne({
            where: { 
                id: propertyId,
                status: 'active'
            },
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'avatar']
            }]
        });
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found or not available' });
        }
        
        // In a real implementation, you would add this to a Favorites table
        // For now, we'll just return success
        res.status(201).json({ 
            message: 'Property added to favorites',
            property: {
                id: property.id,
                title: property.title,
                seller: property.seller
            }
        });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Failed to add to favorites' });
    }
});

// Remove from favorites
router.delete('/:propertyId', async (req, res) => {
    try {
        const userId = req.user.id;
        const propertyId = req.params.propertyId;
        
        // In a real implementation, you would remove this from a Favorites table
        // For now, we'll just return success
        res.json({ message: 'Property removed from favorites' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ error: 'Failed to remove from favorites' });
    }
});

module.exports = router; 