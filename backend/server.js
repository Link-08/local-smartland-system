const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sharp = require('sharp');
const sequelize = require("./config/database");
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
const favoriteRoutes = require("./routes/favorites");
const userActivityRoutes = require("./routes/userActivities");
const marketInsightRoutes = require("./routes/marketInsights");

const app = express();
const port = 26443;

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
app.use("/api/favorites", favoriteRoutes);
app.use("/api/user-activities", userActivityRoutes);
app.use("/api/market-insights", marketInsightRoutes);

app.get("/", async (req, res) => {
  try {
    const [result] = await sequelize.query("SELECT NOW()");
    res.json({ message: "Database Connected", time: result[0].now });
  } catch (error) {
    console.error("Database Connection Error:", error);
    res.status(500).json({ error: "Database Connection Failed" });
  }
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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});
