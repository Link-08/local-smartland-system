const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User } = require('../models/index');
const { auth } = require('../middleware/auth');
require('dotenv').config();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profile');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Get file extension
    const ext = path.extname(file.originalname);
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Validate role
    const allowedRoles = ['buyer', 'seller', 'user'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      role: userRole, // Use validated role
      isActive: true,
      firstName,
      lastName,
      phone: phoneNumber // Add phone number
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone // Include phone in response
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Profile image upload endpoint
router.post('/profile/image', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user.id; // Get user ID from JWT token
    const imagePath = `/uploads/profile/${req.file.filename}`;
    const fullImageUrl = `${req.protocol}://${req.get('host')}${imagePath}`;

    console.log('Uploading profile image:', {
      userId,
      imagePath,
      fullImageUrl,
      file: req.file
    });

    // Update user's avatar in database
    const [updated] = await User.update(
      { avatar: imagePath },
      { where: { id: userId } }
    );

    if (!updated) {
      throw new Error('Failed to update user avatar in database');
    }

    // Get updated user data
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found after update');
    }

    console.log('Updated user data:', {
      id: user.id,
      avatar: user.avatar,
      fullImageUrl
    });

    // Send response with full image URL
    const response = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: fullImageUrl // Send the full URL
      }
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Profile image upload error:', error);
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ error: 'Error uploading profile image: ' + error.message });
  }
});

module.exports = router; 