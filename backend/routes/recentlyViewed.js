const express = require('express');
const router = express.Router();
const { RecentlyViewed, Property, User } = require('../models');
const { auth } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Record a property view
router.post('/record', async (req, res) => {
    try {
        const { propertyId } = req.body;
        const userId = req.user.id;

        if (!propertyId) {
            return res.status(400).json({ error: 'Property ID is required' });
        }

        // Check if property exists
        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if already viewed by this user
        const existingView = await RecentlyViewed.findOne({
            where: { userId, propertyId }
        });

        if (existingView) {
            // Update the viewedAt timestamp
            await existingView.update({ viewedAt: new Date() });
        } else {
            // Create new record
            await RecentlyViewed.create({
                userId,
                propertyId,
                viewedAt: new Date()
            });
            
            // Increment the property's viewCount for seller metrics
            await property.update({
                viewCount: (property.viewCount || 0) + 1
            });
        }

        res.json({ message: 'Property view recorded successfully' });
    } catch (error) {
        console.error('Error recording property view:', error);
        res.status(500).json({ error: 'Failed to record property view' });
    }
});

// Get user's recently viewed properties
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 10;

        const recentlyViewed = await RecentlyViewed.findAll({
            where: { userId },
            include: [
                {
                    model: Property,
                    as: 'property',
                    include: [
                        {
                            model: User,
                            as: 'seller',
                            attributes: ['id', 'username', 'email', 'avatar', 'firstName', 'lastName', 'phone']
                        }
                    ]
                }
            ],
            order: [['viewedAt', 'DESC']],
            limit: limit
        });

        // Transform the data to match frontend expectations
        const transformedProperties = recentlyViewed.map(view => ({
            id: view.property.id,
            title: view.property.title,
            description: view.property.description,
            price: view.property.price,
            location: view.property.location,
            acres: view.property.acres,
            waterRights: view.property.waterRights,
            suitableCrops: view.property.suitableCrops,
            type: view.property.type,
            topography: view.property.topography,
            averageYield: view.property.averageYield,
            amenities: view.property.amenities,
            restrictionsText: view.property.restrictionsText,
            remarks: view.property.remarks,
            image: view.property.image,
            images: view.property.images,
            barangay: view.property.barangay,
            barangayData: view.property.barangayData,
            seller: view.property.seller,
            createdAt: view.property.createdAt,
            updatedAt: view.property.updatedAt,
            viewedAt: view.viewedAt
        }));

        res.json(transformedProperties);
    } catch (error) {
        console.error('Error fetching recently viewed properties:', error);
        res.status(500).json({ error: 'Failed to fetch recently viewed properties' });
    }
});

// Clear user's recently viewed history
router.delete('/clear', async (req, res) => {
    try {
        const userId = req.user.id;

        await RecentlyViewed.destroy({
            where: { userId }
        });

        res.json({ message: 'Recently viewed history cleared successfully' });
    } catch (error) {
        console.error('Error clearing recently viewed history:', error);
        res.status(500).json({ error: 'Failed to clear recently viewed history' });
    }
});

// Remove a specific property from recently viewed
router.delete('/:propertyId', async (req, res) => {
    try {
        const userId = req.user.id;
        const propertyId = req.params.propertyId;

        await RecentlyViewed.destroy({
            where: { userId, propertyId }
        });

        res.json({ message: 'Property removed from recently viewed' });
    } catch (error) {
        console.error('Error removing property from recently viewed:', error);
        res.status(500).json({ error: 'Failed to remove property from recently viewed' });
    }
});

module.exports = router; 