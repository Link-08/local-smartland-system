const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  sellerId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  acres: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  waterRights: {
    type: DataTypes.STRING,
    allowNull: false
  },
  suitableCrops: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'
  },
  status: {
    type: DataTypes.ENUM('active', 'pending', 'sold'),
    defaultValue: 'active'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  inquiries: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  datePosted: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

// Define association
Property.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
User.hasMany(Property, { foreignKey: 'sellerId' });

module.exports = Property; 