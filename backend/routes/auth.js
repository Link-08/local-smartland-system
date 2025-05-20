const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth, JWT_SECRET } = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        // Validate role
        if (role && !['buyer', 'seller'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await User.create({
            username: email, // Use email as username if not provided
            email,
            password,
            role: role || 'buyer'
        });

        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(401).json({ error: 'Account is deactivated' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        
        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/me", auth, async (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Update user profile
router.patch("/profile", auth, async (req, res) => {
    try {
        const { username, email, firstName, lastName, phone } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Optionally, validate email format, phone, etc.
        if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
        await user.save();

        res.json({ message: "Profile updated successfully", user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone
        }});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Change password
router.patch("/password", auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both current and new password are required" });
        }
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        const isMatch = await user.validatePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }
        // Optionally, validate new password strength
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "New password must be at least 6 characters" });
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
