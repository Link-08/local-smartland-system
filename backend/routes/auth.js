const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Log } = require("../models");
const { auth, refreshTokenAuth } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

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

        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                role: user.role
            }, 
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login request body:', req.body);
        console.log('Login attempt for:', req.body.email.email || email);

        const user = await User.findOne({ where: { email: req.body.email.email || email } });
        console.log('Found user:', user ? { id: user.id, email: user.email, role: user.role } : 'not found');
        
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await user.validatePassword(password);
        console.log('Password validation result:', isValidPassword);
        
        if (!isValidPassword) {
            console.log('Invalid password for:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.isActive) {
            console.log('Inactive account:', email);
            return res.status(401).json({ error: 'Account is deactivated' });
        }

        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                role: user.role
            }, 
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Create login log
        await Log.create({
            userId: user.id,
            action: 'LOGIN',
            details: `User logged in successfully`,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
        
        console.log('Login successful for:', email);
        res.json({
            user: {
                id: user.id,
                accountId: user.accountId,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                memberSince: user.memberSince,
                isActive: user.isActive,
                status: user.status
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ error: error.message });
    }
});

router.get("/me", auth, async (req, res) => {
    try {
        console.log('Fetching user data for:', req.user.email);
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            user: {
                id: user.id,
                accountId: user.accountId,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                memberSince: user.memberSince,
                isActive: user.isActive,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

// Update user profile
router.patch("/profile", auth, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, username } = req.body;
        const userId = req.user.id; // Get user ID from auth middleware

        // Find user by ID
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user fields
        await user.update({
            firstName,
            lastName,
            email,
            phone,
            username
        });

        // Return updated user data
        res.json({
            user: {
                id: user.id,
                accountId: user.accountId,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                memberSince: user.memberSince,
                isActive: user.isActive,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Password change endpoint
router.patch("/password", auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both current and new password are required' });
        }

        // Validate password length
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'New password must be at least 8 characters long' });
        }

        // Validate password complexity
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumbers = /\d/.test(newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            return res.status(400).json({ 
                error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            });
        }

        // Get user from database
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await user.update({ password: hashedPassword });

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// Upload profile image
router.post("/profile/image", auth, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.user.id;
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user's avatar field with the file path
        const avatarPath = `/uploads/avatars/${req.file.filename}`;
        await user.update({ avatar: avatarPath });

        res.json({
            user: {
                id: user.id,
                accountId: user.accountId,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                avatar: avatarPath,
                memberSince: user.memberSince,
                isActive: user.isActive,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Profile image upload error:', error);
        res.status(400).json({ error: error.message });
    }
});

router.post("/refresh-token", refreshTokenAuth, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(401).json({ error: 'Account is deactivated' });
        }

        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                role: user.role
            }, 
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                accountId: user.accountId,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                memberSince: user.memberSince,
                isActive: user.isActive,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
});

module.exports = router;
