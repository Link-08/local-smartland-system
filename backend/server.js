const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sharp = require('sharp');
const maintenanceMode = require('./middleware/maintenance');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/database');

const adminRoutes = require("./routes/admin");
const elevationRoutes = require("./routes/elevation");
const sellerRoutes = require("./routes/seller");
const propertyRoutes = require("./routes/property");
const marketRoutes = require("./routes/market");
const systemRoutes = require("./routes/system");
const favoriteRoutes = require("./routes/favorites");
const userActivityRoutes = require("./routes/userActivities");
const marketInsightRoutes = require("./routes/marketInsights");
const authRoutes = require("./routes/auth");

const app = express();
const port = 26443;

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const profileDir = path.join(uploadsDir, 'profile');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir);
}

// Configure CORS
app.use(cors());

// Configure body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/elevations", elevationRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/user-activities", userActivityRoutes);
app.use("/api/market-insights", marketInsightRoutes);

// Apply maintenance mode middleware after routes
app.use(maintenanceMode);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({ 
      error: 'File upload error',
      details: err.message 
    });
  }
  
  // Handle other errors
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully');
    
    // Run migrations
    const { execSync } = require('child_process');
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
    console.log('Migrations completed successfully');
    
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
});
