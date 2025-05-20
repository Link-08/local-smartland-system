const maintenanceMode = (req, res, next) => {
    // Skip maintenance check for system status endpoint
    if (req.path === '/api/system/status') {
        return next();
    }

    // Check if maintenance mode is enabled
    if (process.env.MAINTENANCE_MODE === 'true') {
        // Allow read-only operations during maintenance
        if (req.method === 'GET') {
            return next();
        }

        // Block write operations
        return res.status(503).json({
            error: 'Service Unavailable',
            message: 'The system is currently under maintenance. Write operations are temporarily disabled.',
            estimatedTime: process.env.MAINTENANCE_ESTIMATED_TIME || 'Unknown'
        });
    }

    next();
};

module.exports = maintenanceMode; 