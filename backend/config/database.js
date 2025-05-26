const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'dono-01.danbot.host',
    port: process.env.DB_PORT || 8932,
    database: process.env.DB_NAME || 'smartland-system',
    username: process.env.DB_USER || 'pterodactyl',
    password: process.env.DB_PASSWORD || 'VH0TOR9MC89UZAR8',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize; 