const express = require('express');
const router = express.Router();
const { Property, User } = require('../models');
const { auth } = require('../middleware/auth');

// Get all properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.findAll({
            where: { status: 'active' }, // Only show active properties
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

// Get properties by seller ID
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const { sellerId } = req.params;
        const properties = await Property.findAll({
            where: { 
                sellerId: sellerId,
                status: 'active' // Only show active properties
            },
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
        console.error('Error fetching seller properties:', error);
        res.status(500).json({ error: 'Failed to fetch seller properties' });
    }
});

// Get single property by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findOne({
            where: { 
                id: id,
                status: 'active' // Only show active properties
            },
            include: [{
                model: User,
                as: 'seller',
                attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar']
            }]
        });
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found or not available' });
        }
        
        // Format property to hide price from buyers when displayPrice is false
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
        };
        
        res.json(formattedProperty);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Failed to fetch property' });
    }
});

// Create new property
router.post('/', (req, res) => {
    res.status(201).json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Update property
router.put('/:id', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Delete property
router.delete('/:id', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Record property view
router.post('/:id/view', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Record property inquiry
router.post('/:id/inquiry', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

module.exports = router; 