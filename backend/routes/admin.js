const express = require("express");
const { User, Log } = require("../models");
const { auth, checkRole } = require("../middleware/auth");

const router = express.Router();

// Helper function to map DB fields to frontend fields
function mapUserDbToFrontend(user) {
  return {
    id: user.id,
    name: user.username,
    email: user.email,
    location: user.location || '',
    landArea: user.landArea || '',
    registrationDate: user.createdAt,
    status: user.status,
    rejectionReason: user.rejectionReason,
    role: user.role,
    profileImage: user.avatar || 'https://picsum.photos/40/40'
  };
}

// Get all users by status
router.get("/users", auth, checkRole(['admin']), async (req, res) => {
    try {
        console.log('Fetching users by status...');
        const pending = (await User.getUsersByStatus("pending")).map(mapUserDbToFrontend);
        const approved = (await User.getUsersByStatus("approved")).map(mapUserDbToFrontend);
        const rejected = (await User.getUsersByStatus("rejected")).map(mapUserDbToFrontend);
        console.log(`Found ${pending.length} pending, ${approved.length} approved, ${rejected.length} rejected users`);
        res.json({ pending, approved, rejected });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Approve user
router.post("/users/:id/approve", auth, checkRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to approve user with ID: ${id}`);
        
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            console.log(`User not found with ID: ${id}`);
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await User.updateUserStatus(id, "approved");
        console.log(`Successfully approved user: ${id}`);
        
        res.json({ 
            message: "User approved successfully",
            user: mapUserDbToFrontend(updatedUser)
        });
    } catch (error) {
        console.error('Error approving user:', error);
        if (error.message === 'User not found') {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
});

// Reject user
router.post("/users/:id/reject", auth, checkRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        console.log(`Attempting to reject user with ID: ${id}, reason: ${reason}`);
        
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            console.log(`User not found with ID: ${id}`);
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await User.updateUserStatus(id, "rejected", reason);
        console.log(`Successfully rejected user: ${id}`);
        
        res.json({ 
            message: "User rejected successfully",
            user: mapUserDbToFrontend(updatedUser)
        });
    } catch (error) {
        console.error('Error rejecting user:', error);
        if (error.message === 'User not found') {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
});

// Get all logs
router.get('/logs', auth, checkRole(['admin']), async (req, res) => {
    try {
        console.log('Fetching logs...');
        const logs = await Log.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['username', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });
        console.log(`Found ${logs.length} logs`);
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
