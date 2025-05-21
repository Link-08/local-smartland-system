const express = require('express');
const router = express.Router();
const { SellerMetrics, Property, User, PropertyView, PropertyInquiry, PropertySale, sequelize } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

// Helper function to get seller ID
const getSellerId = async (identifier) => {
    try {
        console.log('=== Starting getSellerId ===');
        console.log('Looking up seller with identifier:', identifier);
        
        if (!identifier) {
            console.log('No identifier provided');
            return null;
        }
        
        // If it's a UUID format, return as is
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)) {
            console.log('Identifier is a UUID, returning as is');
            return identifier;
        }
        
        // Otherwise, look up the user by accountId
        console.log('Looking up user by accountId:', identifier);
        const user = await User.findOne({ 
            where: { accountId: identifier },
            attributes: ['id', 'accountId', 'role', 'status'] // Include more attributes for debugging
        });
        
        if (!user) {
            console.log('No user found with accountId:', identifier);
            return null;
        }
        
        console.log('Found user:', {
            id: user.id,
            accountId: user.accountId,
            role: user.role,
            status: user.status
        });

        // Check if user is active
        if (user.status !== 'active') {
            console.log('User is not active:', user.status);
            return null;
        }

        // Check if user is a seller
        if (user.role !== 'seller') {
            console.log('User is not a seller:', user.role);
            return null;
        }

        console.log('=== Completed getSellerId ===');
        return user.id;
    } catch (error) {
        console.error('=== Error in getSellerId ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.original) {
            console.error('Original error:', error.original);
        }
        return null;
    }
};

// Get seller metrics
router.get('/metrics/:sellerId', auth, async (req, res) => {
    try {
        console.log('Getting metrics for seller:', req.params.sellerId);
        const sellerId = await getSellerId(req.params.sellerId);
        if (!sellerId) {
            console.log('Seller not found:', req.params.sellerId);
            return res.status(404).json({ error: 'Seller not found' });
        }
        console.log('Found seller ID:', sellerId);

        const metrics = await SellerMetrics.findOne({
            where: { sellerId }
        });

        if (!metrics) {
            // If no metrics exist, create default metrics
            const defaultMetrics = await SellerMetrics.create({
                sellerId,
                totalViews: 0,
                totalInquiries: 0,
                avgTimeToSale: 0
            });
            return res.json({
                ...defaultMetrics.toJSON(),
                trendViews: '0%',
                trendInquiries: '0%',
                trendAvgTimeToSale: '0%'
            });
        }

        // Calculate trends based on last 30 days vs previous 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const recentViews = await PropertyView.count({
            where: {
                sellerId,
                createdAt: {
                    [Op.gte]: thirtyDaysAgo
                }
            }
        });

        const previousViews = await PropertyView.count({
            where: {
                sellerId,
                createdAt: {
                    [Op.gte]: sixtyDaysAgo,
                    [Op.lt]: thirtyDaysAgo
                }
            }
        });

        const recentInquiries = await PropertyInquiry.count({
            where: {
                sellerId,
                createdAt: {
                    [Op.gte]: thirtyDaysAgo
                }
            }
        });

        const previousInquiries = await PropertyInquiry.count({
            where: {
                sellerId,
                createdAt: {
                    [Op.gte]: sixtyDaysAgo,
                    [Op.lt]: thirtyDaysAgo
                }
            }
        });

        // Calculate percentage changes
        const calculateTrend = (recent, previous) => {
            if (previous === 0) return recent > 0 ? '100%' : '0%';
            const change = ((recent - previous) / previous) * 100;
            return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
        };

        const trendViews = calculateTrend(recentViews, previousViews);
        const trendInquiries = calculateTrend(recentInquiries, previousInquiries);

        // For avgTimeToSale trend, we'll use a simpler calculation
        const recentSales = await PropertySale.findAll({
            where: {
                sellerId,
                createdAt: {
                    [Op.gte]: thirtyDaysAgo
                }
            }
        });

        const previousSales = await PropertySale.findAll({
            where: {
                sellerId,
                createdAt: {
                    [Op.gte]: sixtyDaysAgo,
                    [Op.lt]: thirtyDaysAgo
                }
            }
        });

        const recentAvgTime = recentSales.length > 0 
            ? recentSales.reduce((sum, sale) => sum + sale.daysToSale, 0) / recentSales.length 
            : 0;
        const previousAvgTime = previousSales.length > 0 
            ? previousSales.reduce((sum, sale) => sum + sale.daysToSale, 0) / previousSales.length 
            : 0;

        const trendAvgTimeToSale = calculateTrend(previousAvgTime, recentAvgTime);

        res.json({
            ...metrics.toJSON(),
            trendViews,
            trendInquiries,
            trendAvgTimeToSale
        });
    } catch (error) {
        console.error('Error fetching seller metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update seller metrics
router.put('/metrics/:sellerId', auth, async (req, res) => {
    try {
        const sellerId = await getSellerId(req.params.sellerId);
        if (!sellerId) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        const { totalViews, totalInquiries, avgTimeToSale } = req.body;
        
        const [metrics, created] = await SellerMetrics.findOrCreate({
            where: { sellerId },
            defaults: {
                totalViews: 0,
                totalInquiries: 0,
                avgTimeToSale: 0
            }
        });

        if (!created) {
            await metrics.update({
                totalViews: totalViews || metrics.totalViews,
                totalInquiries: totalInquiries || metrics.totalInquiries,
                avgTimeToSale: avgTimeToSale || metrics.avgTimeToSale,
                lastUpdated: new Date()
            });
        }

        res.json(metrics);
    } catch (error) {
        console.error('Error updating seller metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Record a property view
router.post('/metrics/:sellerId/view', auth, async (req, res) => {
    try {
        const sellerId = await getSellerId(req.params.sellerId);
        if (!sellerId) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        const [metrics, created] = await SellerMetrics.findOrCreate({
            where: { sellerId },
            defaults: {
                totalViews: 1,
                totalInquiries: 0,
                avgTimeToSale: 0
            }
        });

        if (!created) {
            await metrics.increment('totalViews');
        }

        res.json(metrics);
    } catch (error) {
        console.error('Error recording property view:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Record a property inquiry
router.post('/metrics/:sellerId/inquiry', auth, async (req, res) => {
    try {
        const sellerId = await getSellerId(req.params.sellerId);
        if (!sellerId) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        const [metrics, created] = await SellerMetrics.findOrCreate({
            where: { sellerId },
            defaults: {
                totalViews: 0,
                totalInquiries: 1,
                avgTimeToSale: 0
            }
        });

        if (!created) {
            await metrics.increment('totalInquiries');
        }

        res.json(metrics);
    } catch (error) {
        console.error('Error recording property inquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Record a property sale and update average time to sale
router.post('/metrics/:sellerId/sale', auth, async (req, res) => {
    try {
        const sellerId = await getSellerId(req.params.sellerId);
        if (!sellerId) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        const { daysToSale } = req.body;
        
        const [metrics, created] = await SellerMetrics.findOrCreate({
            where: { sellerId },
            defaults: {
                totalViews: 0,
                totalInquiries: 0,
                avgTimeToSale: daysToSale
            }
        });

        if (!created) {
            // Calculate new average time to sale
            const newAvgTimeToSale = Math.round((metrics.avgTimeToSale + daysToSale) / 2);
            await metrics.update({
                avgTimeToSale: newAvgTimeToSale
            });
        }

        res.json(metrics);
    } catch (error) {
        console.error('Error recording property sale:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get recent activity for a seller
router.get('/:sellerId/activity', auth, async (req, res) => {
    try {
        const sellerId = await getSellerId(req.params.sellerId);
        if (!sellerId) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        // Get recent views
        const recentViews = await PropertyView.findAll({
            where: { sellerId },
            order: [['createdAt', 'DESC']],
            limit: 5,
            include: [{
                model: Property,
                attributes: ['title']
            }]
        });

        // Get recent inquiries
        const recentInquiries = await PropertyInquiry.findAll({
            where: { sellerId },
            order: [['createdAt', 'DESC']],
            limit: 5,
            include: [{
                model: Property,
                attributes: ['title']
            }]
        });

        // Get recent sales
        const recentSales = await PropertySale.findAll({
            where: { sellerId },
            order: [['createdAt', 'DESC']],
            limit: 5,
            include: [{
                model: Property,
                attributes: ['title']
            }]
        });

        // Combine and format activities
        const activities = [
            ...recentViews.map(view => ({
                id: `view-${view.id}`,
                type: 'view',
                title: `Your "${view.Property.title}" received a new view`,
                time: formatTimeAgo(view.createdAt),
                icon: 'FaEye',
                iconColor: '#2ecc71',
                bgColor: 'rgba(46, 204, 113, 0.1)'
            })),
            ...recentInquiries.map(inquiry => ({
                id: `inquiry-${inquiry.id}`,
                type: 'inquiry',
                title: `New inquiry received for "${inquiry.Property.title}"`,
                time: formatTimeAgo(inquiry.createdAt),
                icon: 'FaExclamationTriangle',
                iconColor: '#3498db',
                bgColor: 'rgba(52, 152, 219, 0.1)'
            })),
            ...recentSales.map(sale => ({
                id: `sale-${sale.id}`,
                type: 'sale',
                title: `Your "${sale.Property.title}" has been sold`,
                time: formatTimeAgo(sale.createdAt),
                icon: 'FaCheck',
                iconColor: '#27ae60',
                bgColor: 'rgba(39, 174, 96, 0.1)'
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time))
         .slice(0, 10); // Get the 10 most recent activities

        res.json(activities);
    } catch (error) {
        console.error('Error fetching seller activity:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get agricultural market insights for a seller
router.get('/:sellerId/insights', auth, async (req, res) => {
    try {
        console.log('=== Starting insights fetch ===');
        console.log('Request params:', req.params);
        console.log('User from auth:', req.user);
        
        console.log('Fetching insights for seller:', req.params.sellerId);
        const sellerId = await getSellerId(req.params.sellerId);
        if (!sellerId) {
            console.log('Seller not found:', req.params.sellerId);
            return res.status(404).json({ error: 'Seller not found' });
        }
        console.log('Found seller ID:', sellerId);

        // Get seller's properties with validation
        console.log('Fetching seller properties...');
        const sellerProperties = await Property.findAll({
            where: { sellerId },
            attributes: [
                'id',
                'location',
                'suitableCrops',
                'price',
                'acres',
                'images',
                'title',
                'status'
            ]
        });
        console.log('Found properties:', sellerProperties?.length || 0);

        if (!sellerProperties || sellerProperties.length === 0) {
            console.log('No properties found for seller');
            return res.json([]);
        }

        // Validate and filter properties
        const validProperties = sellerProperties.filter(property => {
            const isValid = property && 
                property.location && 
                property.location.trim().length > 0 &&
                property.price && 
                property.acres && 
                property.acres > 0;
            
            if (!isValid) {
                console.log('Invalid property data:', {
                    id: property?.id,
                    hasLocation: !!property?.location,
                    hasPrice: !!property?.price,
                    hasAcres: !!property?.acres,
                    acresValue: property?.acres
                });
            }
            
            return isValid;
        });

        console.log('Valid properties for insights:', validProperties.length);

        if (validProperties.length === 0) {
            console.log('No valid properties found for insights');
            return res.json([]);
        }

        // Get recent sales in the same areas
        const locations = [...new Set(validProperties
            .map(p => p.location)
            .filter(Boolean))];
        console.log('Looking for sales in locations:', locations);

        if (!locations || locations.length === 0) {
            console.log('No valid locations found');
            return res.json([]);
        }

        console.log('Fetching recent sales...');
        const recentSales = await PropertySale.findAll({
            include: [{
                model: Property,
                as: 'property',
                where: {
                    location: locations,
                    status: 'sold'
                },
                attributes: ['location', 'price', 'acres', 'suitableCrops']
            }],
            attributes: ['createdAt'],
            order: [['createdAt', 'DESC']],
            limit: 100
        });
        console.log('Found recent sales:', recentSales?.length || 0);

        // Calculate market insights
        const insights = [];

        // Price trends by location
        console.log('Calculating price trends...');
        const priceTrends = {};
        locations.forEach(location => {
            const locationSales = recentSales.filter(sale => 
                sale?.property && 
                sale.property.location === location && 
                sale.property.price && 
                sale.property.acres
            );
            if (locationSales.length > 0) {
                const avgPricePerAcre = locationSales.reduce((sum, sale) => 
                    sum + (sale.property.price / sale.property.acres), 0) / locationSales.length;
                const trend = calculatePriceTrend(locationSales);
                priceTrends[location] = { avgPricePerAcre, trend };
            }
        });

        // Add price trend insights
        Object.entries(priceTrends).forEach(([location, data]) => {
            insights.push({
                id: `price-${location}`,
                title: `Price Trends for ${location}`,
                text: `Average price per hectare in ${location} is ₱${Math.round(data.avgPricePerAcre).toLocaleString()}. ${data.trend > 0 ? 'Prices have increased' : 'Prices have decreased'} by ${Math.abs(data.trend)}% in the last quarter.`,
                accentColor: data.trend > 0 ? '#2ecc71' : '#e74c3c'
            });
        });

        // Most sought-after areas
        console.log('Fetching area inquiries...');
        const areaInquiries = await PropertyInquiry.findAll({
            include: [{
                model: Property,
                as: 'property',
                where: {
                    location: locations
                },
                attributes: ['location']
            }]
        });
        console.log('Found area inquiries:', areaInquiries?.length || 0);

        // Group inquiries by location and sort by count
        console.log('Processing area inquiries...');
        const locationCounts = areaInquiries.reduce((acc, inquiry) => {
            if (inquiry?.property?.location) {
                const location = inquiry.property.location;
                acc[location] = (acc[location] || 0) + 1;
            }
            return acc;
        }, {});

        const topAreas = Object.entries(locationCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([location]) => location);

        if (topAreas.length > 0) {
            insights.push({
                id: 'areas',
                title: 'Most Sought-After Areas',
                text: `Properties in ${topAreas.join(', ')} are receiving the most inquiries, with an average time-to-sale of ${calculateAverageTimeToSale(areaInquiries)} days.`,
                accentColor: '#e67e22'
            });
        }

        // Listing optimization tips based on seller's properties
        console.log('Generating optimization tips...');
        const optimizationTips = generateOptimizationTips(validProperties);
        insights.push({
            id: 'optimization',
            title: 'Listing Optimization Tips',
            text: optimizationTips,
            accentColor: '#3498db'
        });

        console.log('=== Completed insights fetch ===');
        console.log('Sending insights response:', insights.length, 'insights');
        res.json(insights);
    } catch (error) {
        console.error('=== Error in insights route ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.original) {
            console.error('Original error:', error.original);
        }
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message,
            name: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Get seller listings
router.get('/:sellerId/listings', auth, async (req, res) => {
    try {
        console.log('Getting listings for seller:', req.params.sellerId);
        const sellerId = await getSellerId(req.params.sellerId);
        if (!sellerId) {
            console.log('Seller not found:', req.params.sellerId);
            return res.status(404).json({ error: 'Seller not found' });
        }
        console.log('Found seller ID:', sellerId);

        const properties = await Property.findAll({
            where: { 
                sellerId,
                status: 'active'
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(properties);
    } catch (error) {
        console.error('Error fetching seller listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get seller properties
router.get('/properties/:sellerId', auth, async (req, res) => {
    try {
        console.log('Getting properties for seller:', req.params.sellerId);
        const sellerId = await getSellerId(req.params.sellerId);
        if (!sellerId) {
            console.log('Seller not found:', req.params.sellerId);
            return res.status(404).json({ error: 'Seller not found' });
        }
        console.log('Found seller ID:', sellerId);

        const properties = await Property.findAll({
            where: { 
                sellerId,
                status: 'active'
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(properties);
    } catch (error) {
        console.error('Error fetching seller properties:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to format time ago
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return '1 year ago';
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return '1 month ago';
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return '1 day ago';
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return '1 hour ago';
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    if (interval === 1) return `1 minute ago`;
    
    return 'just now';
}

// Helper function to calculate price trend
function calculatePriceTrend(sales) {
    try {
        console.log('=== Starting price trend calculation ===');
        console.log('Number of sales to process:', sales?.length || 0);
        
        if (!sales || sales.length < 2) {
            console.log('Not enough sales data to calculate trend');
            return 0;
        }
        
        const validSales = sales.filter(sale => {
            const isValid = sale && 
                sale.property && 
                sale.property.price && 
                sale.property.acres && 
                sale.property.acres > 0 &&
                sale.createdAt; // Add check for createdAt
            
            if (!isValid) {
                console.log('Invalid sale data:', {
                    hasProperty: !!sale?.property,
                    hasPrice: !!sale?.property?.price,
                    hasAcres: !!sale?.property?.acres,
                    hasCreatedAt: !!sale?.createdAt,
                    acresValue: sale?.property?.acres,
                    createdAt: sale?.createdAt
                });
            }
            
            return isValid;
        });

        console.log('Valid sales for trend calculation:', validSales.length);

        if (validSales.length < 2) {
            console.log('Not enough valid sales data to calculate trend');
            return 0;
        }
        
        // Sort by creation date
        const sortedSales = validSales.sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
        );
        
        // Calculate price per acre for first and last sale
        const firstSale = sortedSales[0];
        const lastSale = sortedSales[sortedSales.length - 1];
        
        console.log('First sale:', {
            date: firstSale.createdAt,
            price: firstSale.property.price,
            acres: firstSale.property.acres
        });
        
        console.log('Last sale:', {
            date: lastSale.createdAt,
            price: lastSale.property.price,
            acres: lastSale.property.acres
        });
        
        const firstPricePerAcre = firstSale.property.price / firstSale.property.acres;
        const lastPricePerAcre = lastSale.property.price / lastSale.property.acres;
        
        console.log('Price per acre comparison:', {
            first: firstPricePerAcre,
            last: lastPricePerAcre
        });
        
        if (firstPricePerAcre === 0) {
            console.log('First price per acre is zero, cannot calculate trend');
            return 0;
        }
        
        const change = ((lastPricePerAcre - firstPricePerAcre) / firstPricePerAcre) * 100;
        const roundedChange = Math.round(change);
        
        console.log('Calculated price trend:', roundedChange + '%');
        console.log('=== Completed price trend calculation ===');
        return roundedChange;
    } catch (error) {
        console.error('=== Error in price trend calculation ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.original) {
            console.error('Original error:', error.original);
        }
        return 0;
    }
}

// Helper function to calculate average time to sale
function calculateAverageTimeToSale(inquiries) {
    try {
        console.log('Calculating average time to sale for inquiries:', inquiries?.length || 0);
        
        if (!inquiries || inquiries.length === 0) {
            console.log('No inquiries to calculate average time');
            return 0;
        }
        
        // Get all sales for these inquiries
        const validInquiries = inquiries.filter(inquiry => {
            const isValid = inquiry && 
                inquiry.createdAt && 
                inquiry.property && 
                inquiry.property.location;
            
            if (!isValid) {
                console.log('Invalid inquiry data:', {
                    hasCreatedAt: !!inquiry?.createdAt,
                    hasProperty: !!inquiry?.property,
                    hasLocation: !!inquiry?.property?.location
                });
            }
            
            return isValid;
        });

        console.log('Valid inquiries for time calculation:', validInquiries.length);

        if (validInquiries.length === 0) {
            console.log('No valid inquiries to calculate average time');
            return 0;
        }

        // Get the current date for calculations
        const now = new Date();
        
        // Calculate days for each inquiry
        const daysArray = validInquiries.map(inquiry => {
            try {
                const createdAt = new Date(inquiry.createdAt);
                const days = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
                console.log('Days since inquiry:', days, 'for inquiry created at:', createdAt);
                return days;
            } catch (error) {
                console.error('Error calculating days for inquiry:', error);
                return 0;
            }
        }).filter(days => !isNaN(days) && days >= 0);

        console.log('Valid days array:', daysArray);

        if (daysArray.length === 0) {
            console.log('No valid days to calculate average');
            return 0;
        }

        // Calculate average
        const totalDays = daysArray.reduce((sum, days) => sum + days, 0);
        const averageDays = Math.round(totalDays / daysArray.length);
        
        console.log('Calculated average time to sale:', averageDays, 'days');
        return averageDays;
    } catch (error) {
        console.error('Error calculating average time to sale:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        return 0;
    }
}

// Helper function to generate optimization tips
function generateOptimizationTips(properties) {
    try {
        console.log('=== Starting optimization tips generation ===');
        console.log('Number of properties to process:', properties?.length || 0);
        
        if (!properties || properties.length === 0) {
            console.log('No properties to generate tips for');
            return 'Add your first property to get personalized optimization tips.';
        }
        
        const tips = [];
        
        // Check for missing images
        const propertiesWithoutImages = properties.filter(p => !p?.images || !Array.isArray(p.images) || p.images.length === 0);
        if (propertiesWithoutImages.length > 0) {
            console.log('Found properties without images:', propertiesWithoutImages.length);
            tips.push('Add high-quality photos to your listings. Properties with professional photos receive 2x more views.');
        }
        
        // Check for short titles
        const propertiesWithShortTitles = properties.filter(p => !p?.title || p.title.length < 20);
        if (propertiesWithShortTitles.length > 0) {
            console.log('Found properties with short titles:', propertiesWithShortTitles.length);
            tips.push('Enhance your property titles with more descriptive information about location and key features.');
        }
        
        // Check pricing strategy
        const propertiesWithHighPrices = properties.filter(p => p?.price && p.price > 10000000); // Example threshold
        if (propertiesWithHighPrices.length > 0) {
            console.log('Found properties with high prices:', propertiesWithHighPrices.length);
            tips.push('Consider adjusting your pricing strategy. Properties priced within 5% of market value sell 30% faster.');
        }
        
        // Check for missing location
        const propertiesWithoutLocation = properties.filter(p => !p?.location || p.location.trim().length === 0);
        if (propertiesWithoutLocation.length > 0) {
            console.log('Found properties without location:', propertiesWithoutLocation.length);
            tips.push('Add detailed location information to help potential buyers find your properties more easily.');
        }
        
        // Check for missing or empty suitableCrops
        const propertiesWithoutCrops = properties.filter(p => !p?.suitableCrops || !Array.isArray(p.suitableCrops) || p.suitableCrops.length === 0);
        if (propertiesWithoutCrops.length > 0) {
            console.log('Found properties without suitable crops:', propertiesWithoutCrops.length);
            tips.push('Add information about suitable crops for your properties to attract more potential buyers.');
        }
        
        if (tips.length === 0) {
            console.log('No optimization tips needed - properties are well optimized');
            return 'Your listings are well-optimized! Keep up the good work.';
        }
        
        console.log('Generated tips:', tips);
        console.log('=== Completed optimization tips generation ===');
        return tips.join(' ');
    } catch (error) {
        console.error('=== Error in optimization tips generation ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.original) {
            console.error('Original error:', error.original);
        }
        return 'Unable to generate optimization tips at this time.';
    }
}

module.exports = router; 