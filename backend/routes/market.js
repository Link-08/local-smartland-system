const express = require('express');
const { Property } = require('../models');
const router = express.Router();
const { Op } = require('sequelize');

// Price Estimate Endpoint
router.get('/price-estimate', async (req, res) => {
  try {
    const { location, size, waterSource, quality, classification } = req.query;
    if (!location || !size) {
      return res.status(400).json({ error: 'Location and size are required.' });
    }

    // Find comparable properties with more sophisticated matching
    const sizeNum = parseFloat(size);
    const minSize = sizeNum * 0.8;
    const maxSize = sizeNum * 1.2;
    
    const where = {
      location,
      acres: { $gte: minSize, $lte: maxSize },
      status: 'sold' // Only consider sold properties for more accurate pricing
    };

    // Add optional filters
    if (waterSource) where.waterRights = waterSource;
    if (quality) where.soilQuality = quality;
    if (classification) where.classification = classification;

    // Get comparables with additional sorting by date
    const comparables = await Property.findAll({ 
      where,
      order: [['dateSold', 'DESC']], // Most recent sales first
      limit: 20 // Limit to most recent 20 sales for better accuracy
    });

    if (!comparables.length) {
      return res.json({ 
        min: 0, 
        max: 0, 
        count: 0,
        message: 'No comparable properties found. Try adjusting your search criteria.'
      });
    }

    // Calculate price per hectare with weighted average based on recency
    const prices = comparables.map((p, index) => {
      const pricePerHectare = p.price / p.acres;
      const weight = 1 / (index + 1); // More recent sales have higher weight
      return { price: pricePerHectare, weight };
    });

    const totalWeight = prices.reduce((sum, p) => sum + p.weight, 0);
    const weightedAvg = prices.reduce((sum, p) => sum + (p.price * p.weight), 0) / totalWeight;
    
    // Calculate min/max with outlier removal (removing top and bottom 10%)
    const sortedPrices = prices.map(p => p.price).sort((a, b) => a - b);
    const removeOutliers = (arr) => {
      const start = Math.floor(arr.length * 0.1);
      const end = Math.floor(arr.length * 0.9);
      return arr.slice(start, end);
    };
    
    const filteredPrices = removeOutliers(sortedPrices);
    const min = Math.min(...filteredPrices);
    const max = Math.max(...filteredPrices);

    res.json({ 
      min: Math.round(min), 
      max: Math.round(max), 
      count: comparables.length,
      weightedAverage: Math.round(weightedAvg),
      message: `Based on ${comparables.length} recent comparable sales in ${location}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Market Analysis Endpoint
router.get('/analysis', async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.status(400).json({ error: 'Location is required.' });

    // Get recent properties and sales in this location
    const recentProperties = await Property.findAll({ 
      where: { location },
      order: [['datePosted', 'DESC']],
      limit: 20
    });

    // Get recent sales for trend analysis
    const recentSales = await Property.findAll({
      where: { 
        location,
        status: 'sold',
        dateSold: {
          [Op.gte]: new Date(new Date() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
        }
      },
      order: [['dateSold', 'DESC']]
    });

    // Calculate price trends
    const calculatePriceTrend = (sales) => {
      if (sales.length < 2) return 0;
      const sortedSales = sales.sort((a, b) => new Date(a.dateSold) - new Date(b.dateSold));
      const firstPrice = sortedSales[0].price / sortedSales[0].acres;
      const lastPrice = sortedSales[sales.length - 1].price / sortedSales[sales.length - 1].acres;
      return Math.round(((lastPrice - firstPrice) / firstPrice) * 100);
    };

    // Calculate average time to sale
    const calculateAvgTimeToSale = (sales) => {
      if (!sales.length) return 0;
      const timesToSale = sales.map(sale => {
        const posted = new Date(sale.datePosted);
        const sold = new Date(sale.dateSold);
        return Math.round((sold - posted) / (1000 * 60 * 60 * 24)); // Convert to days
      });
      return Math.round(timesToSale.reduce((a, b) => a + b, 0) / timesToSale.length);
    };

    // Calculate price per hectare statistics
    const prices = recentProperties.map(p => p.price / p.acres);
    const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    // Calculate demand metrics
    const totalViews = recentProperties.reduce((sum, p) => sum + (p.viewCount || 0), 0);
    const totalInquiries = recentProperties.reduce((sum, p) => sum + (p.inquiryCount || 0), 0);
    const avgViewsPerProperty = Math.round(totalViews / recentProperties.length);
    const avgInquiriesPerProperty = Math.round(totalInquiries / recentProperties.length);

    // Generate market insights
    const insights = [];
    
    // Price trend insight
    const priceTrend = calculatePriceTrend(recentSales);
    insights.push({
      type: 'price_trend',
      title: 'Price Trend Analysis',
      text: `Property prices have ${priceTrend > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceTrend)}% in the last 90 days.`,
      accentColor: priceTrend > 0 ? '#2ecc71' : '#e74c3c'
    });

    // Time to sale insight
    const avgTimeToSale = calculateAvgTimeToSale(recentSales);
    insights.push({
      type: 'time_to_sale',
      title: 'Market Activity',
      text: `Properties in this area sell in an average of ${avgTimeToSale} days.`,
      accentColor: avgTimeToSale < 45 ? '#2ecc71' : '#e67e22'
    });

    // Demand insight
    insights.push({
      type: 'demand',
      title: 'Market Demand',
      text: `Properties receive an average of ${avgViewsPerProperty} views and ${avgInquiriesPerProperty} inquiries.`,
      accentColor: '#3498db'
    });

    // Return comprehensive analysis
    res.json({
      overview: {
        avgPrice,
        minPrice,
        maxPrice,
        totalListings: recentProperties.length,
        activeListings: recentProperties.filter(p => p.status === 'active').length,
        soldListings: recentSales.length
      },
      trends: {
        priceTrend,
        avgTimeToSale,
        avgViewsPerProperty,
        avgInquiriesPerProperty
      },
      insights,
      recent: recentProperties.map(p => ({
        title: p.title,
        price: p.price,
        acres: p.acres,
        datePosted: p.datePosted,
        waterRights: p.waterRights,
        suitableCrops: p.suitableCrops,
        status: p.status,
        viewCount: p.viewCount || 0,
        inquiryCount: p.inquiryCount || 0
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 