const express = require('express');
const router = express.Router();
const { User } = require('../models');
const adminAuth = require('../middleware/adminAuth');
const logger = require('../services/logger');

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Get admin dashboard data
router.get('/dashboard', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Get user management data
router.get('/users', async (req, res) => {
    try {
        const { status, role, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause based on filters
        const whereClause = {};
        if (status) {
            if (status === 'pending') {
                whereClause.isActive = false;
            } else if (status === 'active') {
                whereClause.isActive = true;
            }
        }
        if (role) {
            whereClause.role = role;
        }

        // Fetch users with pagination
        const users = await User.findAndCountAll({
            where: whereClause,
            attributes: ['id', 'email', 'role', 'isActive', 'createdAt', 'updatedAt', 'firstName', 'lastName'],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Log the admin action
        await logger.createLog(
            'VIEW_USERS',
            `Admin viewed users list with filters: status=${status}, role=${role}`,
            req.user.id,
            req
        );

        res.json({
            users: users.rows,
            total: users.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(users.count / limit)
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get property management data
router.get('/properties', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Get admin logs
router.get('/logs', async (req, res) => {
    try {
        console.log('Fetching logs...');
        const logs = await logger.getLogs();
        console.log(`Found ${logs.length} logs`);
        res.json(logs);
    } catch (error) {
        console.error('Error in /api/admin/logs:', error);
        res.status(500).json({ 
            message: 'Error fetching logs',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Approve user
router.post('/users/:userId/approve', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isActive = true;
        await user.save();

        // Log the admin action
        await logger.createLog(
            'APPROVE_USER',
            `Admin approved user ${user.email}`,
            req.user.id,
            req
        );

        res.json({ 
            message: 'User approved successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ error: 'Failed to approve user' });
    }
});

// Reject/Deactivate user
router.post('/users/:userId/reject', async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isActive = false;
        await user.save();

        // Log the admin action
        await logger.createLog(
            'REJECT_USER',
            `Admin deactivated user ${user.email}. Reason: ${reason || 'No reason provided'}`,
            req.user.id,
            req
        );

        res.json({ 
            message: 'User deactivated successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Error deactivating user:', error);
        res.status(500).json({ error: 'Failed to deactivate user' });
    }
});

// User summary counts for admin dashboard
router.get('/users/summary', async (req, res) => {
    try {
        // Exclude admin users
        const pending = await User.count({ where: { isActive: false, role: { [require('sequelize').Op.ne]: 'admin' } } });
        const active = await User.count({ where: { isActive: true, role: { [require('sequelize').Op.ne]: 'admin' } } });
        // For inactive, you may want to track deactivated users separately; for now, treat as isActive: false
        const inactive = pending; // If you have a separate flag for rejected/deactivated, use that
        res.json({ pending, active, inactive });
    } catch (error) {
        console.error('Error fetching user summary:', error);
        res.status(500).json({ error: 'Failed to fetch user summary' });
    }
});

module.exports = router;
