const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const { PropertyView, PropertyInquiry, Favorite } = require('../models');

// Get user's recent activities
router.get('/', auth, checkRole(['buyer', 'admin']), async (req, res) => {
  try {
    console.log('Fetching activities for user:', req.user.id);
    
    // Get recent views
    const views = await PropertyView.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Property,
        as: 'property',
        attributes: ['id', 'title']
      }],
      order: [['viewedAt', 'DESC']],
      limit: 5
    });

    // Get recent inquiries
    const inquiries = await PropertyInquiry.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Property,
        as: 'property',
        attributes: ['id', 'title']
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get recent favorites
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Property,
        as: 'property',
        attributes: ['id', 'title']
      }],
      order: [['dateAdded', 'DESC']],
      limit: 5
    });

    // Combine and sort all activities
    const activities = [
      ...views.map(view => ({
        id: `view-${view.id}`,
        type: 'view',
        message: `Viewed property "${view.property.title}"`,
        timestamp: view.viewedAt
      })),
      ...inquiries.map(inquiry => ({
        id: `inquiry-${inquiry.id}`,
        type: 'inquiry',
        message: `Inquired about "${inquiry.property.title}"`,
        timestamp: inquiry.createdAt
      })),
      ...favorites.map(favorite => ({
        id: `favorite-${favorite.id}`,
        type: 'favorite',
        message: `Saved property "${favorite.property.title}"`,
        timestamp: favorite.dateAdded
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
     .slice(0, 10); // Get only the 10 most recent activities

    console.log('Found activities:', activities.length);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 