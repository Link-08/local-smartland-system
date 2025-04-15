const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password, userType } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.createUser(username, email, hashedPassword, userType);

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.getUserByEmail(email);
        if (!user) return res.status(400).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ accountID: user.accountid, userType: user.usertype }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    console.log("Received Auth Header:", authHeader); // Log token on backend

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ message: "Invalid Token" });
    }

    const token = authHeader.split(" ")[1]; // Extract actual token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query("SELECT userName, email FROM accounts WHERE accountID = $1", [decoded.userID]);

        if (user.rows.length === 0) return res.status(404).json({ message: "User not found" });

        res.json(user.rows[0]);
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
});



module.exports = router;
