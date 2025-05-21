const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sharp = require('sharp');
const { sequelize, User, SellerMetrics, Property } = require('./models');
const maintenanceMode = require('./middleware/maintenance');
const path = require('path');
const fs = require('fs');

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const elevationRoutes = require("./routes/elevation");
const sellerRoutes = require("./routes/seller");
const propertyRoutes = require("./routes/property");
const marketRoutes = require("./routes/market");
const systemRoutes = require("./routes/system");

const app = express();
const port = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir);
}

app.use(cors());
app.use(express.json());
app.use(maintenanceMode);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/elevations", elevationRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/system", systemRoutes);

// Placeholder image endpoint
app.get("/api/placeholder/:width/:height", async (req, res) => {
  try {
    const width = parseInt(req.params.width);
    const height = parseInt(req.params.height);
    
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      return res.status(400).json({ error: "Invalid dimensions" });
    }

    const image = await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 200, g: 200, b: 200, alpha: 1 }
      }
    })
    .png()
    .toBuffer();

    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    console.error('Error generating placeholder:', error);
    res.status(500).json({ error: "Failed to generate placeholder image" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Initialize database and create mock data
const initializeDatabase = async () => {
  try {
    // Sync all models with the database without creating backup tables
    await sequelize.sync({ force: false, logging: false });
    
    // Check if admin user exists before creating
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      // Create mock admin user
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
    }

    // Check if buyer exists before creating
    const buyerExists = await User.findOne({ where: { email: 'buyer@example.com' } });
    if (!buyerExists) {
      // Create mock buyer
      await User.create({
        username: 'buyer',
        email: 'buyer@example.com',
        password: 'buyer123',
        role: 'buyer',
        firstName: 'John',
        lastName: 'Smith',
        phone: '0912 345 6789',
        avatar: 'JS',
        memberSince: '2024-03-15'
      });
    }

    // Check if seller exists before creating
    const sellerExists = await User.findOne({ where: { email: 'seller@example.com' } });
    if (!sellerExists) {
      // Create mock seller
      const seller = await User.create({
        username: 'seller',
        email: 'seller@example.com',
        password: 'seller123',
        role: 'seller',
        firstName: 'Real',
        lastName: 'Estate PH',
        phone: '0923 456 7890',
        avatar: 'RE',
        memberSince: '2018-01-01'
      });

      // Create default metrics for the mock seller
      await SellerMetrics.create({
        sellerId: seller.id,
        totalViews: 0,
        totalInquiries: 0,
        avgTimeToSale: 0
      });

      // Create some sample properties for the mock seller
      await Property.create({
        id: 'PROP-001',
        sellerId: seller.id,
        title: 'Prime Rice Farm with Irrigation',
        location: 'Nueva Ecija',
        price: 2500000.00,
        acres: 5.5,
        waterRights: 'NIA Irrigation',
        suitableCrops: 'Rice, Corn',
        status: 'active'
      });

      await Property.create({
        id: 'PROP-002',
        sellerId: seller.id,
        title: 'Fertile Farmland for Root Crops',
        location: 'Benguet',
        price: 1800000.00,
        acres: 3.2,
        waterRights: 'Natural Spring',
        suitableCrops: 'Potatoes, Carrots',
        status: 'active'
      });
    }

    console.log('Database initialized with mock data');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't throw the error, just log it and continue
  }
};

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await initializeDatabase();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});
