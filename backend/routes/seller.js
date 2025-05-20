const express = require('express');
const router = express.Router();
const SellerMetrics = require('../models/SellerMetrics');
const { auth } = require('../middleware/auth');

// Get seller metrics
router.get('/metrics/:sellerId', auth, async (req, res) => {
    try {
        const metrics = await SellerMetrics.findOne({
            where: { sellerId: req.params.sellerId }
        });

        if (!metrics) {
            // If no metrics exist, create default metrics
            const defaultMetrics = await SellerMetrics.create({
                sellerId: req.params.sellerId,
                totalViews: 0,
                totalInquiries: 0,
                avgTimeToSale: 0
            });
            // Add trend fields (mocked as '0%')
            return res.json({
                ...defaultMetrics.toJSON(),
                trendViews: '0%',
                trendInquiries: '0%',
                trendAvgTimeToSale: '0%'
            });
        }

        // Add trend fields (mocked as '0%')
        res.json({
            ...metrics.toJSON(),
            trendViews: '0%',
            trendInquiries: '0%',
            trendAvgTimeToSale: '0%'
        });
    } catch (error) {
        console.error('Error fetching seller metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update seller metrics
router.put('/metrics/:sellerId', auth, async (req, res) => {
    try {
        const { totalViews, totalInquiries, avgTimeToSale } = req.body;
        
        const [metrics, created] = await SellerMetrics.findOrCreate({
            where: { sellerId: req.params.sellerId },
            defaults: {
                totalViews: 0,
                totalInquiries: 0,
                avgTimeToSale: 0
            }
        });

        if (!created) {
            await metrics.update({
                totalViews: totalViews || metrics.totalViews,
                totalInquiries: totalInquiries || metrics.totalInquiries,
                avgTimeToSale: avgTimeToSale || metrics.avgTimeToSale,
                lastUpdated: new Date()
            });
        }

        res.json(metrics);
    } catch (error) {
        console.error('Error updating seller metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Record a property view
router.post('/metrics/:sellerId/view', auth, async (req, res) => {
    try {
        const [metrics, created] = await SellerMetrics.findOrCreate({
            where: { sellerId: req.params.sellerId },
            defaults: {
                totalViews: 1,
                totalInquiries: 0,
                avgTimeToSale: 0
            }
        });

        if (!created) {
            await metrics.increment('totalViews');
        }

        res.json(metrics);
    } catch (error) {
        console.error('Error recording property view:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Record a property inquiry
router.post('/metrics/:sellerId/inquiry', auth, async (req, res) => {
    try {
        const [metrics, created] = await SellerMetrics.findOrCreate({
            where: { sellerId: req.params.sellerId },
            defaults: {
                totalViews: 0,
                totalInquiries: 1,
                avgTimeToSale: 0
            }
        });

        if (!created) {
            await metrics.increment('totalInquiries');
        }

        res.json(metrics);
    } catch (error) {
        console.error('Error recording property inquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Record a property sale and update average time to sale
router.post('/metrics/:sellerId/sale', auth, async (req, res) => {
    try {
        const { daysToSale } = req.body;
        
        const [metrics, created] = await SellerMetrics.findOrCreate({
            where: { sellerId: req.params.sellerId },
            defaults: {
                totalViews: 0,
                totalInquiries: 0,
                avgTimeToSale: daysToSale
            }
        });

        if (!created) {
            // Calculate new average time to sale
            const newAvgTimeToSale = Math.round((metrics.avgTimeToSale + daysToSale) / 2);
            await metrics.update({
                avgTimeToSale: newAvgTimeToSale
            });
        }

        res.json(metrics);
    } catch (error) {
        console.error('Error recording property sale:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get recent activity for a seller
router.get('/:sellerId/activity', auth, async (req, res) => {
    // TODO: Replace with DB fetch if needed
    res.json([
        {
            id: 1,
            type: 'inquiry',
            title: 'New inquiry received for "Prime Rice Farm with Irrigation"',
            time: '2 hours ago',
            icon: 'FaExclamationTriangle',
            iconColor: '#3498db',
            bgColor: 'rgba(52, 152, 219, 0.1)'
        },
        {
            id: 2,
            type: 'view',
            title: 'Your "Fertile Farmland for Root Crops" received 28 new views',
            time: '1 day ago',
            icon: 'FaEye',
            iconColor: '#2ecc71',
            bgColor: 'rgba(46, 204, 113, 0.1)'
        },
        {
            id: 3,
            type: 'update',
            title: 'Your "Orchard Land" listing has been approved',
            time: '2 days ago',
            icon: 'FaCheck',
            iconColor: '#27ae60',
            bgColor: 'rgba(39, 174, 96, 0.1)'
        }
    ]);
});

// Get agricultural market insights for a seller
router.get('/:sellerId/insights', auth, async (req, res) => {
    // TODO: Replace with DB fetch if needed
    res.json([
        {
            id: 1,
            title: 'Price Trends for Rice Farms',
            text: 'Rice farm prices in Nueva Ecija have increased by 8% in the last quarter. Properties with NIA Irrigation command 15% premium.',
            accentColor: '#3498db'
        },
        {
            id: 2,
            title: 'Most Sought-After Areas',
            text: 'Farms in Barangay Imelda and Bantug are receiving the most inquiries, with an average time-to-sale of 45 days.',
            accentColor: '#e67e22'
        },
        {
            id: 3,
            title: 'Listing Optimization Tips',
            text: 'Listings with detailed soil analysis and crop history receive 40% more inquiries. Consider adding these details to boost interest.',
            accentColor: '#2ecc71'
        }
    ]);
});

module.exports = router; 