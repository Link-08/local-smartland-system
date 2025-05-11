const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require('./config/database');
const User = require('./models/User');

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const pool = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

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
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create mock buyer
    await User.create({
      username: 'buyer',
      email: 'buyer@example.com',
      password: 'buyer123',
      role: 'buyer'
    });

    // Create mock seller
    await User.create({
      username: 'seller',
      email: 'seller@example.com',
      password: 'seller123',
      role: 'seller'
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
