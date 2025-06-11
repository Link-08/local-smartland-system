const express = require('express');
const router = express.Router();
const { Property, User } = require('../models');
const { Op } = require('sequelize');
const { auth } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get seller profile
router.get('/profile/:id', async (req, res) => {
    try {
        // Ensure user can only access their own profile
        if (req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ error: 'Not authorized to access this profile' });
        }

        const seller = await User.findByPk(req.params.id, {
            attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'username', 'createdAt']
        });
        
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }
        
        console.log('Sending seller profile data:', {
            id: seller.id,
            email: seller.email,
            firstName: seller.firstName,
            lastName: seller.lastName,
            phone: seller.phone,
            username: seller.username
        });
        
        res.json(seller);
    } catch (error) {
        console.error('Error fetching seller profile:', error);
        res.status(500).json({ error: 'Failed to fetch seller profile' });
    }
});

// Update seller profile
router.put('/profile/:id', async (req, res) => {
    try {
        console.log('Profile update request received:', {
            userId: req.user.id,
            requestedId: req.params.id,
            body: req.body
        });

        // Ensure user can only update their own profile
        if (req.user.id !== parseInt(req.params.id)) {
            console.error('Unauthorized profile update attempt:', {
                userId: req.user.id,
                requestedId: req.params.id
            });
            return res.status(403).json({ error: 'Not authorized to update this profile' });
        }

        const { firstName, lastName, phone, username } = req.body;
        
        // Validate input
        if (!firstName || !lastName) {
            console.error('Invalid profile update data:', req.body);
            return res.status(400).json({ error: 'First name and last name are required' });
        }

        // Check if username is already taken by another user
        if (username) {
            const existingUser = await User.findOne({
                where: {
                    username,
                    id: { [Op.ne]: req.params.id }
                }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Username is already taken' });
            }
        }

        console.log('Finding seller with ID:', req.params.id);
        const seller = await User.findByPk(req.params.id);
        
        if (!seller) {
            console.error('Seller not found:', req.params.id);
            return res.status(404).json({ error: 'Seller not found' });
        }
        
        console.log('Current seller data:', {
            id: seller.id,
            firstName: seller.firstName,
            lastName: seller.lastName,
            phone: seller.phone,
            username: seller.username
        });
        
        console.log('Updating seller profile:', {
            id: seller.id,
            updates: { firstName, lastName, phone, username }
        });

        await seller.update({
            firstName,
            lastName,
            phone,
            username
        });
        
        // Reload the seller data to ensure we have the latest values
        await seller.reload();
        
        console.log('Profile update successful:', {
            id: seller.id,
            firstName: seller.firstName,
            lastName: seller.lastName,
            phone: seller.phone,
            username: seller.username
        });

        res.json({ 
            message: 'Profile updated successfully',
            profile: {
                id: seller.id,
                email: seller.email,
                firstName: seller.firstName,
                lastName: seller.lastName,
                phone: seller.phone,
                username: seller.username
            }
        });
    } catch (error) {
        console.error('Error updating seller profile:', error);
        res.status(500).json({ error: 'Failed to update seller profile' });
    }
});

// Get seller metrics
router.get('/metrics/:id', async (req, res) => {
    try {
        // Ensure user can only access their own metrics
        if (req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ error: 'Not authorized to access these metrics' });
        }

        const properties = await Property.findAll({
            where: { sellerId: req.params.id }
        });

        const metrics = {
            totalProperties: properties.length,
            activeProperties: properties.filter(p => p.status === 'active').length,
            totalViews: properties.reduce((sum, prop) => sum + (prop.viewCount || 0), 0),
            totalInquiries: properties.reduce((sum, prop) => sum + (prop.inquiries || 0), 0),
            averagePrice: properties.length > 0 
                ? properties.reduce((sum, prop) => sum + parseFloat(prop.price), 0) / properties.length 
                : 0,
            totalAcres: properties.reduce((sum, prop) => sum + parseFloat(prop.acres || 0), 0),
            recentActivity: properties
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .slice(0, 5)
                .map(p => ({
                    id: p.id,
                    title: p.title,
                    lastUpdated: p.updatedAt,
                    status: p.status
                }))
        };

        res.json(metrics);
    } catch (error) {
        console.error('Error fetching seller metrics:', error);
        res.status(500).json({ error: 'Failed to fetch seller metrics' });
    }
});

// Get seller properties
router.get('/properties/:id', async (req, res) => {
    try {
        // Ensure user can only access their own properties
        if (req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ error: 'Not authorized to access these properties' });
        }

        const properties = await Property.findAll({
            where: { sellerId: req.params.id },
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email']
            }]
        });

        // Format the response
        const formattedProperties = properties.map(property => ({
            id: property.id,
            title: property.title,
            description: property.description,
            price: property.price,
            location: property.location,
            acres: property.acres,
            waterRights: property.waterRights,
            suitableCrops: property.suitableCrops,
            image: property.image,
            viewCount: property.viewCount,
            inquiries: property.inquiries,
            status: property.status,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt,
            seller: {
                firstName: property.seller.firstName,
                lastName: property.seller.lastName,
                email: property.seller.email
            }
        }));

        res.json(formattedProperties);
    } catch (error) {
        console.error('Error fetching seller properties:', error);
        res.status(500).json({ error: 'Failed to fetch seller properties' });
    }
});

module.exports = router; 