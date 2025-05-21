const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ActivityLog = sequelize.define('ActivityLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    targetUserId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['targetUserId']
        },
        {
            fields: ['action']
        },
        {
            fields: ['createdAt']
        }
    ]
});

// Define associations
ActivityLog.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

ActivityLog.belongsTo(User, {
    foreignKey: 'targetUserId',
    as: 'targetUser'
});

module.exports = ActivityLog; 