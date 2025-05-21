const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Property, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get market insights
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching market insights');
    
    // Get average prices by region
    const regions = await Property.findAll({
      attributes: [
        'location',
        [sequelize.fn('AVG', sequelize.col('price')), 'averagePrice'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'propertyCount']
      ],
      where: {
        status: 'active'
      },
      group: ['location']
    });

    // Get price trends (comparing last 3 months to previous 3 months)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentProperties = await Property.findAll({
      where: {
        createdAt: {
          [Op.gte]: threeMonthsAgo
        },
        status: 'active'
      }
    });

    const olderProperties = await Property.findAll({
      where: {
        createdAt: {
          [Op.gte]: sixMonthsAgo,
          [Op.lt]: threeMonthsAgo
        },
        status: 'active'
      }
    });

    const recentAvgPrice = recentProperties.reduce((sum, prop) => sum + prop.price, 0) / (recentProperties.length || 1);
    const olderAvgPrice = olderProperties.reduce((sum, prop) => sum + prop.price, 0) / (olderProperties.length || 1);
    const priceChange = ((recentAvgPrice - olderAvgPrice) / olderAvgPrice) * 100;

    // Generate insights
    const insights = [
      {
        id: 1,
        title: 'Regional Price Analysis',
        text: `Properties in ${regions[0]?.location || 'Nueva Ecija'} have the highest average price at ₱${Math.round(regions[0]?.averagePrice || 0).toLocaleString()}.`,
        accentColor: '#3498db'
      },
      {
        id: 2,
        title: 'Price Trends',
        text: `Average property prices have ${priceChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(Math.round(priceChange))}% in the last 3 months.`,
        accentColor: priceChange > 0 ? '#2ecc71' : '#e74c3c'
      },
      {
        id: 3,
        title: 'Market Activity',
        text: `There are currently ${regions.reduce((sum, region) => sum + region.propertyCount, 0)} active properties on the market.`,
        accentColor: '#f39c12'
      }
    ];

    console.log('Generated insights:', insights.length);
    res.json(insights);
  } catch (error) {
    console.error('Error fetching market insights:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 