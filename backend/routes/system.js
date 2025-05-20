const express = require('express');
const router = express.Router();

// System status endpoint
router.get('/status', (req, res) => {
    // This could be expanded to check actual database connectivity
    // For now, we'll use an environment variable to control maintenance mode
    const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
    
    res.json({
        isMaintenance,
        timestamp: new Date().toISOString(),
        message: isMaintenance ? 'System is under maintenance' : 'System is operational'
    });
});

module.exports = router; 