const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
    } else {
        console.log("Connected to database");
        release();
    }
});

module.exports = pool;