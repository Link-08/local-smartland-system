const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sharp = require('sharp');
const sequelize = require('./config/database');
const User = require('./models/User');
const SellerMetrics = require('./models/SellerMetrics');
const Property = require('./models/Property');
const maintenanceMode = require('./middleware/maintenance');

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const elevationRoutes = require("./routes/elevation");
const sellerRoutes = require("./routes/seller");
const propertyRoutes = require("./routes/property");
const marketRoutes = require("./routes/market");
const systemRoutes = require("./routes/system");
const pool = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(maintenanceMode);

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
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

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "Database connected successfully!", time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ error: "Database connection failed", details: err.message });
    }
});

// Initialize database and create mock data
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // This will recreate tables on each restart
    
    // Create mock admin user
    await User.create({
      id: 'admin',
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create mock buyer
    await User.create({
      id: 'buyer',
      username: 'buyer',
      email: 'buyer@example.com',
      password: 'buyer123',
      role: 'buyer'
    });

    // Create mock seller
    const seller = await User.create({
      id: 'real-estate.ph',
      username: 'seller',
      email: 'seller@example.com',
      password: 'seller123',
      role: 'seller',
      firstName: 'Real',
      lastName: 'Estate PH',
      phone: '0917 111 1111',
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

    // Create some mock properties
    await Property.create({
      id: 'real-estate.ph-lot-1',
      sellerId: seller.id,
      title: 'Prime Rice Farm with Irrigation',
      location: 'Barangay Imelda, Cabanatuan, Nueva Ecija',
      price: 8750000,
      acres: 5.2,
      waterRights: 'NIA Irrigation',
      suitableCrops: 'Rice, Corn, Vegetables',
      status: 'active',
      viewCount: 0,
      inquiries: 0,
      datePosted: new Date()
    });

    console.log('Database initialized with mock data');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await initializeDatabase();
});
