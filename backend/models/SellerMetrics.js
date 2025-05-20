const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SellerMetrics = sequelize.define('SellerMetrics', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sellerId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    totalViews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalInquiries: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    avgTimeToSale: {
        type: DataTypes.INTEGER, // in days
        defaultValue: 0
    },
    lastUpdated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = SellerMetrics; 