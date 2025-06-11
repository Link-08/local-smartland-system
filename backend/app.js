const express = require('express');
const cors = require('cors');
const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');
const favoriteRoutes = require('./routes/favorites');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const sellerRoutes = require('./routes/seller');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 