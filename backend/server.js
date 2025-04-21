const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const elevationRoutes = require("./routes/elevation");
const pool = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/api/elevations", elevationRoutes);

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "Database connected successfully!", time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ error: "Database connection failed", details: err.message });
    }
});


app.listen(port, () => console.log(`Server running on port ${port}`));
