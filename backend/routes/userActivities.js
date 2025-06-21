const express = require('express');
const router = express.Router();
const { Log, User, Property } = require('../models');
const { auth } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get user activities
router.get('/:userId', async (req, res) => {
    try {
        // Ensure user can only access their own activities
        if (req.user.id !== parseInt(req.params.userId)) {
            return res.status(403).json({ error: 'Not authorized to access these activities' });
        }

        const activities = await Log.findAll({
            where: { userId: req.params.userId },
            order: [['createdAt', 'DESC']],
            limit: 20
        });

        res.json(activities);
    } catch (error) {
        console.error('Error fetching user activities:', error);
        res.status(500).json({ error: 'Failed to fetch user activities' });
    }
});

// Record user activity
router.post('/', async (req, res) => {
    try {
        const { action, description, userId } = req.body;
        
        if (!action || !userId) {
            return res.status(400).json({ error: 'Action and userId are required' });
        }

        // Ensure user can only record activities for themselves
        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Not authorized to record activities for this user' });
        }

        const activity = await Log.create({
            action,
            description,
            userId: parseInt(userId),
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(201).json(activity);
    } catch (error) {
        console.error('Error recording user activity:', error);
        res.status(500).json({ error: 'Failed to record user activity' });
    }
});

// Get recent activities for dashboard
router.get('/recent/:userId', async (req, res) => {
    try {
        // Ensure user can only access their own activities
        if (req.user.id !== parseInt(req.params.userId)) {
            return res.status(403).json({ error: 'Not authorized to access these activities' });
        }

        const activities = await Log.findAll({
            where: { userId: req.params.userId },
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        // If no activities exist, create some sample activities for demonstration
        if (activities.length === 0) {
            const sampleActivities = [
                {
                    action: 'property_created',
                    description: 'New property "Prime Rice Farm with Irrigation" created',
                    userId: parseInt(req.params.userId),
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent'),
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
                },
                {
                    action: 'profile_updated',
                    description: 'Profile updated for John Doe',
                    userId: parseInt(req.params.userId),
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent'),
                    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
                },
                {
                    action: 'property_view',
                    description: 'Property "Corn Farm in Nueva Ecija" received a view',
                    userId: parseInt(req.params.userId),
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent'),
                    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
                },
                {
                    action: 'property_inquiry',
                    description: 'Property "Mixed Crop Farm" received an inquiry',
                    userId: parseInt(req.params.userId),
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent'),
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
                }
            ];

            await Log.bulkCreate(sampleActivities);
            
            // Fetch the newly created activities
            const newActivities = await Log.findAll({
                where: { userId: req.params.userId },
                order: [['createdAt', 'DESC']],
                limit: 10
            });
            
            const formattedActivities = newActivities.map(activity => {
                const timeAgo = getTimeAgo(activity.createdAt);
                
                // Determine icon and colors based on action type
                let icon = 'FaBell';
                let bgColor = 'rgba(52, 152, 219, 0.1)';
                let iconColor = '#3498db';
                
                if (activity.action.includes('property_created')) {
                    icon = 'FaPlus';
                    bgColor = 'rgba(46, 204, 113, 0.1)';
                    iconColor = '#2ecc71';
                } else if (activity.action.includes('property_updated')) {
                    icon = 'FaEdit';
                    bgColor = 'rgba(243, 156, 18, 0.1)';
                    iconColor = '#f39c12';
                } else if (activity.action.includes('property_deleted')) {
                    icon = 'FaTrash';
                    bgColor = 'rgba(231, 76, 60, 0.1)';
                    iconColor = '#e74c3c';
                } else if (activity.action.includes('property_sold')) {
                    icon = 'FaCheck';
                    bgColor = 'rgba(46, 204, 113, 0.1)';
                    iconColor = '#2ecc71';
                } else if (activity.action.includes('profile_updated')) {
                    icon = 'FaUser';
                    bgColor = 'rgba(155, 89, 182, 0.1)';
                    iconColor = '#9b59b6';
                } else if (activity.action.includes('view')) {
                    icon = 'FaEye';
                    bgColor = 'rgba(52, 152, 219, 0.1)';
                    iconColor = '#3498db';
                } else if (activity.action.includes('inquiry')) {
                    icon = 'FaExclamationTriangle';
                    bgColor = 'rgba(241, 196, 15, 0.1)';
                    iconColor = '#f1c40f';
                }

                return {
                    id: activity.id,
                    title: activity.description || activity.action,
                    time: timeAgo,
                    icon: icon,
                    $bgColor: bgColor,
                    $iconColor: iconColor,
                    action: activity.action,
                    createdAt: activity.createdAt
                };
            });

            return res.json(formattedActivities);
        }

        // Format activities for dashboard display
        const formattedActivities = activities.map(activity => {
            const timeAgo = getTimeAgo(activity.createdAt);
            
            // Determine icon and colors based on action type
            let icon = 'FaBell';
            let bgColor = 'rgba(52, 152, 219, 0.1)';
            let iconColor = '#3498db';
            
            if (activity.action.includes('property_created')) {
                icon = 'FaPlus';
                bgColor = 'rgba(46, 204, 113, 0.1)';
                iconColor = '#2ecc71';
            } else if (activity.action.includes('property_updated')) {
                icon = 'FaEdit';
                bgColor = 'rgba(243, 156, 18, 0.1)';
                iconColor = '#f39c12';
            } else if (activity.action.includes('property_deleted')) {
                icon = 'FaTrash';
                bgColor = 'rgba(231, 76, 60, 0.1)';
                iconColor = '#e74c3c';
            } else if (activity.action.includes('property_sold')) {
                icon = 'FaCheck';
                bgColor = 'rgba(46, 204, 113, 0.1)';
                iconColor = '#2ecc71';
            } else if (activity.action.includes('profile_updated')) {
                icon = 'FaUser';
                bgColor = 'rgba(155, 89, 182, 0.1)';
                iconColor = '#9b59b6';
            } else if (activity.action.includes('view')) {
                icon = 'FaEye';
                bgColor = 'rgba(52, 152, 219, 0.1)';
                iconColor = '#3498db';
            } else if (activity.action.includes('inquiry')) {
                icon = 'FaExclamationTriangle';
                bgColor = 'rgba(241, 196, 15, 0.1)';
                iconColor = '#f1c40f';
            }

            return {
                id: activity.id,
                title: activity.description || activity.action,
                time: timeAgo,
                icon: icon,
                $bgColor: bgColor,
                $iconColor: iconColor,
                action: activity.action,
                createdAt: activity.createdAt
            };
        });

        res.json(formattedActivities);
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        res.status(500).json({ error: 'Failed to fetch recent activities' });
    }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}

module.exports = router; 