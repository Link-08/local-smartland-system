const express = require('express');
const router = express.Router();
const { Property, User, Log } = require('../models');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for property image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/property');
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
    cb(null, 'property-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for property images
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Property image upload endpoint - now supports multiple files
router.post('/image', auth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const imagePath = `/uploads/property/${file.filename}`;
      const fullImageUrl = `${req.protocol}://${req.get('host')}${imagePath}`;

      uploadedImages.push({
        imageUrl: fullImageUrl,
        imagePath: imagePath,
        filename: file.filename
      });
    }

    console.log('Uploading property images:', {
      count: req.files.length,
      images: uploadedImages
    });

    // Send response with image URLs
    const response = {
      success: true,
      images: uploadedImages,
      count: uploadedImages.length
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Property image upload error:', error);
    // If there was an error and files were uploaded, delete them
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ error: 'Error uploading property images: ' + error.message });
  }
});

// Get all properties
router.get('/', async (req, res) => {
    try {
        const { sellerId, barangay } = req.query;
        let whereClause = { status: 'active' };
        
        if (sellerId) {
            whereClause.sellerId = sellerId;
        }
        
        if (barangay) {
            whereClause.barangay = barangay;
        }
        
        const properties = await Property.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });
        
        // Format properties to hide prices from buyers when displayPrice is false
        const formattedProperties = properties.map(property => ({
            id: property.id,
            title: property.title,
            description: property.description,
            price: property.displayPrice ? property.price : null, // Hide price if displayPrice is false
            showPrice: property.displayPrice, // Add showPrice field for frontend compatibility
            location: property.location,
            acres: property.acres,
            waterRights: property.waterRights,
            suitableCrops: property.suitableCrops,
            type: property.type,
            topography: property.topography,
            averageYield: property.averageYield,
            amenities: property.amenities,
            restrictionsText: property.restrictionsText,
            remarks: property.remarks,
            image: property.image,
            images: property.images,
            barangay: property.barangay,
            barangayData: property.barangayData,
            viewCount: property.viewCount,
            inquiries: property.inquiries,
            status: property.status,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt,
            seller: property.seller
        }));
        
        res.json(formattedProperties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

// Get properties by barangay
router.get('/by-barangay/:barangay', async (req, res) => {
    try {
        const { barangay } = req.params;
        
        const properties = await Property.findAll({
            where: { 
                barangay: barangay,
                status: 'active' 
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });
        
        // Format the response to match the expected structure in MapView
        const formattedProperties = properties.map(property => ({
            id: property.id,
            title: property.title,
            area: `${property.acres} hectares`,
            price: property.displayPrice ? `₱${property.price.toLocaleString()}` : 'Price on Request', // Hide price if displayPrice is false
            showPrice: property.displayPrice, // Add showPrice field for frontend compatibility
            pricePerSqm: property.displayPrice ? `₱${(property.price / (property.acres * 10000)).toFixed(0)}/sqm` : 'N/A', // Hide price per sqm if displayPrice is false
            type: property.type || 'Agricultural',
            description: property.description || 'No description available',
            contact: property.seller?.phone || 'Contact not available',
            features: property.amenities || [],
            // Additional fields for enhanced functionality
            acres: property.acres,
            location: property.location,
            waterRights: property.waterRights,
            suitableCrops: property.suitableCrops,
            topography: property.topography,
            averageYield: property.averageYield,
            image: property.image,
            images: property.images,
            barangay: property.barangay,
            barangayData: property.barangayData,
            seller: property.seller,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));
        
        res.json(formattedProperties);
    } catch (error) {
        console.error('Error fetching properties by barangay:', error);
        res.status(500).json({ error: 'Failed to fetch properties by barangay' });
    }
});

// Create new property
router.post('/', auth, async (req, res) => {
    try {
        console.log('Creating new property:', req.body);
        
        const {
            title,
            description,
            price,
            location,
            acres,
            waterRights,
            suitableCrops,
            image,
            images,
            sellerId,
            type,
            topography,
            averageYield,
            amenities,
            restrictionsText,
            remarks,
            displayPrice,
            barangay,
            barangayData
        } = req.body;

        // Validate required fields
        if (!title || !price || !acres || !sellerId) {
            return res.status(400).json({ 
                error: 'Missing required fields: title, price, acres, and sellerId are required' 
            });
        }

        // Create the property with all available fields
        const propertyData = {
            title,
            description: description || '',
            price: parseFloat(price),
            location: location || 'Location not specified',
            acres: parseFloat(acres),
            waterRights: waterRights || 'Not specified',
            suitableCrops: suitableCrops || 'Not specified',
            type: type || 'Agricultural Land',
            topography: topography || 'Flat to rolling',
            averageYield: averageYield || 'Not specified',
            amenities: Array.isArray(amenities) ? amenities : [],
            restrictionsText: restrictionsText || '',
            remarks: remarks || '',
            displayPrice: displayPrice !== undefined ? displayPrice : true,
            image: image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
            images: Array.isArray(images) ? images : [],
            status: 'active',
            sellerId: parseInt(sellerId),
            barangay: barangay || 'Not specified',
            barangayData: barangayData || 'Not specified'
        };

        const property = await Property.create(propertyData);

        // Log the property creation activity
        await Log.create({
            action: 'property_created',
            description: `New property "${title}" created`,
            userId: parseInt(sellerId),
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Fetch the created property with seller information
        const createdProperty = await Property.findByPk(property.id, {
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });

        // Format the response to include showPrice field
        const formattedProperty = {
            id: createdProperty.id,
            title: createdProperty.title,
            description: createdProperty.description,
            price: createdProperty.price, // Always show price to seller (property owner)
            showPrice: true, // Always true for seller's own properties
            location: createdProperty.location,
            acres: createdProperty.acres,
            waterRights: createdProperty.waterRights,
            suitableCrops: createdProperty.suitableCrops,
            type: createdProperty.type,
            topography: createdProperty.topography,
            averageYield: createdProperty.averageYield,
            amenities: createdProperty.amenities,
            restrictionsText: createdProperty.restrictionsText,
            remarks: createdProperty.remarks,
            displayPrice: createdProperty.displayPrice,
            image: createdProperty.image,
            images: createdProperty.images,
            barangay: createdProperty.barangay,
            barangayData: createdProperty.barangayData,
            viewCount: createdProperty.viewCount,
            inquiries: createdProperty.inquiries,
            status: createdProperty.status,
            createdAt: createdProperty.createdAt,
            updatedAt: createdProperty.updatedAt,
            seller: createdProperty.seller
        };

        console.log('Property created successfully:', formattedProperty);
        res.status(201).json(formattedProperty);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Failed to create property' });
    }
});

// Update property
router.put('/:id', auth, async (req, res) => {
    try {
        const propertyId = req.params.id;
        const userId = req.user.id; // From auth middleware
        const updateData = req.body;

        // Find the property
        const property = await Property.findByPk(propertyId);
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if the user is the owner of the property
        if (property.sellerId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this property' });
        }

        // Update the property
        await property.update(updateData);
        
        // Log the property update activity
        await Log.create({
            action: 'property_updated',
            description: `Property "${property.title}" updated`,
            userId: userId,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        // Fetch the updated property with seller information
        const updatedProperty = await Property.findByPk(propertyId, {
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });

        // Format the response to include showPrice field
        const formattedProperty = {
            id: updatedProperty.id,
            title: updatedProperty.title,
            description: updatedProperty.description,
            price: updatedProperty.price, // Always show price to seller (property owner)
            showPrice: true, // Always true for seller's own properties
            location: updatedProperty.location,
            acres: updatedProperty.acres,
            waterRights: updatedProperty.waterRights,
            suitableCrops: updatedProperty.suitableCrops,
            type: updatedProperty.type,
            topography: updatedProperty.topography,
            averageYield: updatedProperty.averageYield,
            amenities: updatedProperty.amenities,
            restrictionsText: updatedProperty.restrictionsText,
            remarks: updatedProperty.remarks,
            displayPrice: updatedProperty.displayPrice,
            image: updatedProperty.image,
            images: updatedProperty.images,
            barangay: updatedProperty.barangay,
            barangayData: updatedProperty.barangayData,
            viewCount: updatedProperty.viewCount,
            inquiries: updatedProperty.inquiries,
            status: updatedProperty.status,
            createdAt: updatedProperty.createdAt,
            updatedAt: updatedProperty.updatedAt,
            seller: updatedProperty.seller
        };

        console.log(`Property ${propertyId} updated successfully by user ${userId}`);
        res.json(formattedProperty);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Failed to update property' });
    }
});

// Get properties by filters
router.get('/search', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Get single property by ID (public route for buyers)
router.get('/public/:id', async (req, res) => {
    try {
        const propertyId = req.params.id;

        // Find the property
        const property = await Property.findByPk(propertyId, {
            where: { status: 'active' }, // Only show active properties
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found or not available' });
        }

        // Format the response to hide prices from buyers when displayPrice is false
        const formattedProperty = {
            id: property.id,
            title: property.title,
            description: property.description,
            price: property.displayPrice ? property.price : null, // Hide price if displayPrice is false
            showPrice: property.displayPrice, // Add showPrice field for frontend compatibility
            location: property.location,
            acres: property.acres,
            waterRights: property.waterRights,
            suitableCrops: property.suitableCrops,
            image: property.image,
            images: property.images,
            viewCount: property.viewCount,
            inquiries: property.inquiries,
            status: property.status,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt,
            // Include all fields for consistency
            type: property.type,
            topography: property.topography,
            averageYield: property.averageYield,
            amenities: property.amenities,
            restrictionsText: property.restrictionsText,
            remarks: property.remarks,
            barangay: property.barangay,
            barangayData: property.barangayData,
            seller: {
                firstName: property.seller.firstName,
                lastName: property.seller.lastName,
                email: property.seller.email,
                phone: property.seller.phone,
                avatar: property.seller.avatar
            }
        };

        res.json(formattedProperty);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Failed to fetch property' });
    }
});

// Get single property by ID (authenticated route for sellers)
router.get('/:id', auth, async (req, res) => {
    try {
        const propertyId = req.params.id;
        const userId = req.user.id; // From auth middleware

        // Find the property
        const property = await Property.findByPk(propertyId, {
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if the user is the owner of the property
        const isOwner = property.sellerId === userId;

        // Format the response to include all necessary fields
        const formattedProperty = {
            id: property.id,
            title: property.title,
            description: property.description,
            // Show price to owner, hide from buyers if displayPrice is false
            price: (isOwner || property.displayPrice) ? property.price : null,
            showPrice: isOwner || property.displayPrice, // Add showPrice field for frontend compatibility
            location: property.location,
            acres: property.acres,
            waterRights: property.waterRights,
            suitableCrops: property.suitableCrops,
            image: property.image,
            images: property.images,
            viewCount: property.viewCount,
            inquiries: property.inquiries,
            status: property.status,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt,
            // Include all fields for consistency
            type: property.type,
            topography: property.topography,
            averageYield: property.averageYield,
            amenities: property.amenities,
            restrictionsText: property.restrictionsText,
            remarks: property.remarks,
            displayPrice: property.displayPrice,
            barangay: property.barangay,
            barangayData: property.barangayData,
            seller: {
                firstName: property.seller.firstName,
                lastName: property.seller.lastName,
                email: property.seller.email,
                phone: property.seller.phone,
                avatar: property.seller.avatar
            }
        };

        res.json(formattedProperty);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Failed to fetch property' });
    }
});

// Get properties by location
router.get('/location/:location', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Delete property
router.delete('/:id', auth, async (req, res) => {
    try {
        const propertyId = req.params.id;
        const userId = req.user.id; // From auth middleware

        // Find the property
        const property = await Property.findByPk(propertyId);
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if the user is the owner of the property
        if (property.sellerId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this property' });
        }

        // Log the property deletion activity before deleting
        await Log.create({
            action: 'property_deleted',
            description: `Property "${property.title}" deleted`,
            userId: userId,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Delete the property
        await property.destroy();
        
        console.log(`Property ${propertyId} deleted successfully by user ${userId}`);
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Failed to delete property' });
    }
});

module.exports = router; 