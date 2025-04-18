const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to map DB fields to frontend fields
function mapUserDbToFrontend(user) {
  return {
    id: user.accountid,
    name: user.username,
    email: user.email,
    location: user.location,
    landArea: user.landarea,
    registrationDate: user.datecreated || user.created_at,
    status: user.status,
    rejectionReason: user.rejectionreason,
    // Add other mappings as needed
  };
}

// Get all users by status
router.get("/users", authMiddleware, async (req, res) => {
    try {
        const pending = (await User.getUsersByStatus("pending")).map(mapUserDbToFrontend);
        const approved = (await User.getUsersByStatus("approved")).map(mapUserDbToFrontend);
        const rejected = (await User.getUsersByStatus("rejected")).map(mapUserDbToFrontend);
        res.json({ pending, approved, rejected });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Approve user
router.post("/users/:id/approve", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await User.updateUserStatus(id, "approved");
        res.json({ message: "User approved" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Reject user
router.post("/users/:id/reject", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        await User.updateUserStatus(id, "rejected", reason);
        res.json({ message: "User rejected" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get account creation logs (for admin)
router.get("/logs", authMiddleware, async (req, res) => {
    try {
        const logs = await User.getAccountLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
