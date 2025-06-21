const express = require('express');
const router = express.Router();
const { Property, User, Log } = require('../models');
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
            attributes: ['id', 'email', 'firstName', 'lastName', 'phone', 'username', 'avatar', 'createdAt']
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
        
        // Log the profile update activity
        await Log.create({
            action: 'profile_updated',
            description: `Profile updated for ${firstName} ${lastName}`,
            userId: req.user.id,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
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
                username: seller.username,
                avatar: seller.avatar
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

        // Calculate metrics with trend analysis
        const totalViews = properties.reduce((sum, prop) => sum + (prop.viewCount || 0), 0);
        const totalInquiries = properties.reduce((sum, prop) => sum + (prop.inquiries || 0), 0);
        const activeProperties = properties.filter(p => p.status === 'active').length;
        const soldProperties = properties.filter(p => p.status === 'sold');
        
        // Calculate average time to sale (in days)
        let avgTimeToSale = 0;
        if (soldProperties.length > 0) {
            const totalDays = soldProperties.reduce((sum, prop) => {
                const createdAt = new Date(prop.createdAt);
                const updatedAt = new Date(prop.updatedAt);
                const daysDiff = Math.ceil((updatedAt - createdAt) / (1000 * 60 * 60 * 24));
                return sum + daysDiff;
            }, 0);
            avgTimeToSale = Math.round(totalDays / soldProperties.length);
        }

        // Calculate trends (simplified - in a real app, you'd compare with historical data)
        const trendViews = totalViews > 0 ? '+5%' : '0%';
        const trendInquiries = totalInquiries > 0 ? '+3%' : '0%';
        const trendAvgTimeToSale = avgTimeToSale > 0 ? '-2%' : '0%';

        const metrics = {
            totalProperties: properties.length,
            activeProperties: activeProperties,
            totalViews: totalViews,
            totalInquiries: totalInquiries,
            avgTimeToSale: avgTimeToSale,
            trendViews: trendViews,
            trendInquiries: trendInquiries,
            trendAvgTimeToSale: trendAvgTimeToSale,
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

// Record property view
router.post('/metrics/view', async (req, res) => {
    try {
        const { listingId } = req.body;
        
        if (!listingId) {
            return res.status(400).json({ error: 'Listing ID is required' });
        }

        // Find the property and ensure it belongs to the authenticated user
        const property = await Property.findOne({
            where: { 
                id: listingId,
                sellerId: req.user.id 
            }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found or not authorized' });
        }

        // Increment view count
        await property.update({
            viewCount: (property.viewCount || 0) + 1
        });

        // Log the property view activity
        await Log.create({
            action: 'property_view',
            description: `Property "${property.title}" received a view`,
            userId: req.user.id,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.json({ 
            message: 'View recorded successfully',
            newViewCount: property.viewCount + 1
        });
    } catch (error) {
        console.error('Error recording property view:', error);
        res.status(500).json({ error: 'Failed to record property view' });
    }
});

// Record property inquiry
router.post('/metrics/inquiry', async (req, res) => {
    try {
        const { listingId } = req.body;
        
        if (!listingId) {
            return res.status(400).json({ error: 'Listing ID is required' });
        }

        // Find the property and ensure it belongs to the authenticated user
        const property = await Property.findOne({
            where: { 
                id: listingId,
                sellerId: req.user.id 
            }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found or not authorized' });
        }

        // Increment inquiry count
        await property.update({
            inquiries: (property.inquiries || 0) + 1
        });

        // Log the property inquiry activity
        await Log.create({
            action: 'property_inquiry',
            description: `Property "${property.title}" received an inquiry`,
            userId: req.user.id,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.json({ 
            message: 'Inquiry recorded successfully',
            newInquiryCount: property.inquiries + 1
        });
    } catch (error) {
        console.error('Error recording property inquiry:', error);
        res.status(500).json({ error: 'Failed to record property inquiry' });
    }
});

// Record property sale
router.post('/metrics/sale', async (req, res) => {
    try {
        const { listingId, daysToSale } = req.body;
        
        if (!listingId) {
            return res.status(400).json({ error: 'Listing ID is required' });
        }

        // Find the property and ensure it belongs to the authenticated user
        const property = await Property.findOne({
            where: { 
                id: listingId,
                sellerId: req.user.id 
            }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found or not authorized' });
        }

        // Update property status to sold
        await property.update({
            status: 'sold'
        });

        // Log the property sale activity
        await Log.create({
            action: 'property_sold',
            description: `Property "${property.title}" marked as sold`,
            userId: req.user.id,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.json({ 
            message: 'Sale recorded successfully',
            propertyId: listingId,
            daysToSale: daysToSale || 0
        });
    } catch (error) {
        console.error('Error recording property sale:', error);
        res.status(500).json({ error: 'Failed to record property sale' });
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
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
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
                email: property.seller.email,
                phone: property.seller.phone,
                avatar: property.seller.avatar
            }
        }));

        res.json(formattedProperties);
    } catch (error) {
        console.error('Error fetching seller properties:', error);
        res.status(500).json({ error: 'Failed to fetch seller properties' });
    }
});

module.exports = router; 