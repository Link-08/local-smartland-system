const express = require('express');
const Property = require('../models/Property');
const router = express.Router();

// Price Estimate Endpoint
router.get('/price-estimate', async (req, res) => {
  try {
    const { location, size, waterSource, quality, classification } = req.query;
    if (!location || !size) {
      return res.status(400).json({ error: 'Location and size are required.' });
    }
    // Find comparable properties (same location, similar size +/- 20%, same water source if provided)
    const sizeNum = parseFloat(size);
    const minSize = sizeNum * 0.8;
    const maxSize = sizeNum * 1.2;
    const where = {
      location,
      acres: { $gte: minSize, $lte: maxSize },
    };
    if (waterSource) where.waterRights = waterSource;
    // Add more filters as needed
    const comparables = await Property.findAll({ where });
    if (!comparables.length) {
      return res.json({ min: 0, max: 0, count: 0 });
    }
    const prices = comparables.map(p => p.price / p.acres);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    res.json({ min, max, count: comparables.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Market Analysis Endpoint
router.get('/analysis', async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.status(400).json({ error: 'Location is required.' });
    // Get recent properties in this location
    const recent = await Property.findAll({ where: { location }, order: [['datePosted', 'DESC']], limit: 10 });
    // Calculate average price per hectare
    const prices = recent.map(p => p.price / p.acres);
    const avgPrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    // Return comparable sales and average price
    res.json({
      recent: recent.map(p => ({
        title: p.title,
        price: p.price,
        acres: p.acres,
        datePosted: p.datePosted,
        waterRights: p.waterRights,
        suitableCrops: p.suitableCrops,
      })),
      avgPrice,
      count: recent.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 