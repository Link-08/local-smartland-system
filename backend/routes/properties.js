const express = require('express');
const router = express.Router();
const { Property } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/auth');

// Get all properties for a seller
router.get('/seller/:sellerId', authMiddleware, async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { sellerId: req.params.sellerId },
      order: [['datePosted', 'DESC']]
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
});

// Create new property
router.post('/', authMiddleware, checkRole(['seller']), async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      sellerId: req.user.id
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: 'Error creating property', error: error.message });
  }
});

// Update property
router.put('/:id', authMiddleware, checkRole(['seller']), async (req, res) => {
  try {
    const property = await Property.findOne({
      where: { 
        id: req.params.id,
        sellerId: req.user.id
      }
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.update(req.body);
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: 'Error updating property', error: error.message });
  }
});

// Delete property
router.delete('/:id', authMiddleware, checkRole(['seller']), async (req, res) => {
  try {
    const property = await Property.findOne({
      where: { 
        id: req.params.id,
        sellerId: req.user.id
      }
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.destroy();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting property', error: error.message });
  }
});

// Record property view
router.post('/:id/view', async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.increment('viewCount');
    res.json({ message: 'View recorded successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error recording view', error: error.message });
  }
});

// Record property inquiry
router.post('/:id/inquiry', async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.increment('inquiries');
    res.json({ message: 'Inquiry recorded successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error recording inquiry', error: error.message });
  }
});

module.exports = router; 