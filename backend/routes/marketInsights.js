const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const Property = require('../models/Property')(sequelize);
const { Op } = require('sequelize');

// Get market insights
router.get('/', async (req, res) => {
    try {
        const properties = await Property.findAll({
            where: {
                status: 'active'
            },
            order: [['createdAt', 'DESC']]
        });

        if (properties.length === 0) {
            return res.json({
                totalListings: 0,
                activeListings: 0,
                averagePrice: 0,
                priceRange: { min: 0, max: 0 },
                averageAcres: 0,
                topLocations: [],
                cropDistribution: {},
                optimizationTips: [
                    {
                        title: "Start Your Journey",
                        text: "Add your first property listing to begin receiving personalized market insights and recommendations.",
                        type: "welcome"
                    }
                ]
            });
        }

        // Calculate market statistics
        const totalListings = properties.length;
        const activeListings = properties.filter(p => p.status === 'active').length;
        const soldListings = properties.filter(p => p.status === 'sold').length;
        
        const prices = properties.map(p => parseFloat(p.price)).filter(price => !isNaN(price));
        const averagePrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        const acres = properties.map(p => parseFloat(p.acres)).filter(acre => !isNaN(acre));
        const averageAcres = acres.length > 0 ? acres.reduce((sum, acre) => sum + acre, 0) / acres.length : 0;

        // Get location distribution
        const locationCount = {};
        properties.forEach(p => {
            const location = p.location || 'Unknown';
            locationCount[location] = (locationCount[location] || 0) + 1;
        });
        const topLocations = Object.entries(locationCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([location, count]) => ({ location, count }));

        // Get crop distribution
        const cropCount = {};
        properties.forEach(p => {
            if (p.suitableCrops) {
                const crops = p.suitableCrops.split(',').map(crop => crop.trim());
                crops.forEach(crop => {
                    cropCount[crop] = (cropCount[crop] || 0) + 1;
                });
            }
        });

        // Generate optimization tips based on data
        const optimizationTips = [];
        
        if (averagePrice > 0) {
            optimizationTips.push({
                title: "Market Pricing Insights",
                text: `The average property price in your area is ₱${averagePrice.toLocaleString()}. Consider pricing your property competitively within the ₱${minPrice.toLocaleString()} - ₱${maxPrice.toLocaleString()} range.`,
                type: "pricing"
            });
        }

        if (topLocations.length > 0) {
            const topLocation = topLocations[0];
            optimizationTips.push({
                title: "High-Demand Locations",
                text: `${topLocation.location} has the highest number of listings (${topLocation.count}). Properties in this area may attract more buyers.`,
                type: "location"
            });
        }

        if (Object.keys(cropCount).length > 0) {
            const topCrop = Object.entries(cropCount).sort(([,a], [,b]) => b - a)[0];
            optimizationTips.push({
                title: "Popular Crop Types",
                text: `${topCrop[0]} is the most common crop type with ${topCrop[1]} properties. Highlighting this crop type may increase buyer interest.`,
                type: "crops"
            });
        }

        if (averageAcres > 0) {
            optimizationTips.push({
                title: "Property Size Trends",
                text: `The average property size is ${averageAcres.toFixed(1)} acres. Consider how your property size compares to market preferences.`,
                type: "size"
            });
        }

        // Add general tips if we have enough data
        if (totalListings >= 3) {
            optimizationTips.push({
                title: "Market Activity",
                text: `There are ${activeListings} active listings and ${soldListings} recently sold properties. This indicates ${activeListings > soldListings ? 'a buyer\'s market' : 'a seller\'s market'}.`,
                type: "activity"
            });
        }

        res.json({
            totalListings,
            activeListings,
            soldListings,
            averagePrice: Math.round(averagePrice),
            priceRange: { min: Math.round(minPrice), max: Math.round(maxPrice) },
            averageAcres: Math.round(averageAcres * 10) / 10,
            topLocations,
            cropDistribution: cropCount,
            optimizationTips
        });
    } catch (error) {
        console.error('Error fetching market insights:', error);
        res.status(500).json({ error: 'Failed to fetch market insights' });
    }
});

module.exports = router; 