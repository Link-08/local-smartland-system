const express = require('express');
const router = express.Router();

// Get elevation data
router.get('/:location', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

// Get elevation map
router.get('/map/:location', (req, res) => {
    res.json({ message: 'This endpoint will be implemented with the new database schema' });
});

module.exports = router;
