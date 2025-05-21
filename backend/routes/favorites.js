const express = require('express');
const router = express.Router();
const { Favorite, Property, User } = require('../models');
const { auth, checkRole } = require('../middleware/auth');

// Get user's favorite properties
router.get('/', auth, checkRole(['buyer', 'admin']), async (req, res) => {
  try {
    console.log('Fetching favorites for user:', req.user.id);
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Property,
        as: 'property',
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }]
      }],
      order: [['dateAdded', 'DESC']]
    });
    console.log('Found favorites:', favorites.length);
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add property to favorites
router.post('/:propertyId', auth, checkRole(['buyer', 'admin']), async (req, res) => {
  try {
    const { propertyId } = req.params;
    console.log('Adding property to favorites:', { propertyId, userId: req.user.id });
    
    // Check if property exists
    const property = await Property.findByPk(propertyId);
    if (!property) {
      console.log('Property not found:', propertyId);
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      where: {
        userId: req.user.id,
        propertyId
      }
    });

    if (existingFavorite) {
      console.log('Property already in favorites:', propertyId);
      return res.status(400).json({ error: 'Property already in favorites' });
    }

    // Create new favorite
    const favorite = await Favorite.create({
      userId: req.user.id,
      propertyId
    });
    console.log('Created new favorite:', favorite.id);

    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove property from favorites
router.delete('/:propertyId', auth, checkRole(['buyer', 'admin']), async (req, res) => {
  try {
    const { propertyId } = req.params;
    console.log('Removing property from favorites:', { propertyId, userId: req.user.id });
    
    const favorite = await Favorite.findOne({
      where: {
        userId: req.user.id,
        propertyId
      }
    });

    if (!favorite) {
      console.log('Favorite not found:', propertyId);
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await favorite.destroy();
    console.log('Removed favorite:', favorite.id);
    res.json({ message: 'Property removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 