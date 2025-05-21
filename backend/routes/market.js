const express = require('express');
const { Property, PropertySale } = require('../models');
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

    console.log('Fetching market analysis for location:', location);

    // Get recent properties in this location
    let recentProperties;
    try {
      recentProperties = await Property.findAll({ 
        where: { location },
        order: [['datePosted', 'DESC']],
        limit: 20
      });
      console.log('Found properties:', recentProperties.length);
    } catch (err) {
      console.error('Error fetching properties:', err);
      throw err;
    }

    // Get recent sales for trend analysis
    let recentSales;
    try {
      recentSales = await PropertySale.findAll({
        include: [{
          model: Property,
          as: 'property',
          where: { location },
          attributes: ['location', 'price', 'acres', 'datePosted']
        }],
        where: {
          saleDate: {
            [Op.gte]: new Date(new Date() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
          },
          status: 'completed'
        },
        order: [['saleDate', 'DESC']]
      });
      console.log('Found sales:', recentSales.length);
    } catch (err) {
      console.error('Error fetching sales:', err);
      throw err;
    }

    // Calculate price trends
    const calculatePriceTrend = (sales) => {
      if (sales.length < 2) return 0;
      try {
        const sortedSales = sales.sort((a, b) => new Date(a.saleDate) - new Date(b.saleDate));
        const firstPrice = sortedSales[0].salePrice / sortedSales[0].property.acres;
        const lastPrice = sortedSales[sales.length - 1].salePrice / sortedSales[sales.length - 1].property.acres;
        return Math.round(((lastPrice - firstPrice) / firstPrice) * 100);
      } catch (err) {
        console.error('Error calculating price trend:', err);
        return 0;
      }
    };

    // Calculate average time to sale
    const calculateAvgTimeToSale = (sales) => {
      if (!sales.length) return 0;
      try {
        const timesToSale = sales.map(sale => {
          const posted = new Date(sale.property.datePosted);
          const sold = new Date(sale.saleDate);
          return Math.round((sold - posted) / (1000 * 60 * 60 * 24)); // Convert to days
        });
        return Math.round(timesToSale.reduce((a, b) => a + b, 0) / timesToSale.length);
      } catch (err) {
        console.error('Error calculating average time to sale:', err);
        return 0;
      }
    };

    // Calculate price per hectare statistics
    let avgPrice = 0, minPrice = 0, maxPrice = 0;
    try {
      const prices = recentProperties.map(p => p.price / p.acres);
      avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
      minPrice = prices.length ? Math.min(...prices) : 0;
      maxPrice = prices.length ? Math.max(...prices) : 0;
    } catch (err) {
      console.error('Error calculating price statistics:', err);
    }

    // Calculate demand metrics
    let avgViewsPerProperty = 0, avgInquiriesPerProperty = 0;
    try {
      const totalViews = recentProperties.reduce((sum, p) => sum + (p.viewCount || 0), 0);
      const totalInquiries = recentProperties.reduce((sum, p) => sum + (p.inquiries || 0), 0);
      avgViewsPerProperty = recentProperties.length ? Math.round(totalViews / recentProperties.length) : 0;
      avgInquiriesPerProperty = recentProperties.length ? Math.round(totalInquiries / recentProperties.length) : 0;
    } catch (err) {
      console.error('Error calculating demand metrics:', err);
    }

    // Generate market insights
    const insights = [];
    
    // Price trend insight
    const priceTrend = calculatePriceTrend(recentSales);
    insights.push({
      type: 'price_trend',
      title: 'Price Trend Analysis',
      text: recentSales.length >= 2 
        ? `Property prices have ${priceTrend > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceTrend)}% in the last 90 days.`
        : 'Insufficient sales data to determine price trends in the last 90 days.',
      accentColor: recentSales.length >= 2 ? (priceTrend > 0 ? '#2ecc71' : '#e74c3c') : '#95a5a6'
    });

    // Time to sale insight
    const avgTimeToSale = calculateAvgTimeToSale(recentSales);
    insights.push({
      type: 'time_to_sale',
      title: 'Market Activity',
      text: recentSales.length > 0
        ? `Properties in this area sell in an average of ${avgTimeToSale} days.`
        : 'No recent sales data available to calculate average time to sale.',
      accentColor: recentSales.length > 0 ? (avgTimeToSale < 45 ? '#2ecc71' : '#e67e22') : '#95a5a6'
    });

    // Demand insight
    insights.push({
      type: 'demand',
      title: 'Market Demand',
      text: recentProperties.length > 0
        ? `Properties receive an average of ${avgViewsPerProperty} views and ${avgInquiriesPerProperty} inquiries.`
        : 'No properties available in this location to analyze demand.',
      accentColor: '#3498db'
    });

    // Return comprehensive analysis
    const response = {
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
        inquiryCount: p.inquiries || 0
      }))
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (err) {
    console.error('Market analysis error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router; 