const express = require('express');
const router = express.Router();
const { Favorite, Property, User } = require('../models');
const { auth: authMiddleware } = require('../middleware/auth');

// Get user's favorite properties
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Property,
          as: 'property',
          include: [
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'username', 'email', 'avatar', 'firstName', 'lastName', 'phone']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transform the data to match frontend expectations
    const transformedFavorites = favorites.map(fav => ({
      id: fav.property.id,
      title: fav.property.title,
      description: fav.property.description,
      price: fav.property.price,
      location: fav.property.location,
      acres: fav.property.acres,
      waterRights: fav.property.waterRights,
      suitableCrops: fav.property.suitableCrops,
      type: fav.property.type,
      topography: fav.property.topography,
      averageYield: fav.property.averageYield,
      amenities: fav.property.amenities,
      restrictionsText: fav.property.restrictionsText,
      remarks: fav.property.remarks,
      image: fav.property.image,
      images: fav.property.images,
      barangay: fav.property.barangay,
      barangayData: fav.property.barangayData,
      seller: fav.property.seller,
      createdAt: fav.property.createdAt,
      updatedAt: fav.property.updatedAt
    }));

    res.json(transformedFavorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add property to favorites
router.post('/:propertyId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyId = parseInt(req.params.propertyId);

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    // Check if property exists
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      where: { userId, propertyId }
    });

    if (existingFavorite) {
      return res.status(409).json({ error: 'Property is already in favorites' });
    }

    // Add to favorites
    await Favorite.create({
      userId,
      propertyId
    });

    res.status(201).json({ message: 'Property added to favorites' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Property is already in favorites' });
    }
    
    res.status(500).json({ error: 'Failed to add property to favorites' });
  }
});

// Remove property from favorites
router.delete('/:propertyId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyId = parseInt(req.params.propertyId);

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const deleted = await Favorite.destroy({
      where: { userId, propertyId }
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Property removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Failed to remove property from favorites' });
  }
});

// Check if property is in user's favorites
router.get('/check/:propertyId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyId = parseInt(req.params.propertyId);

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const favorite = await Favorite.findOne({
      where: { userId, propertyId }
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});

module.exports = router; 