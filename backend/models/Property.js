const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
      type: DataTypes.FLOAT,
      allowNull: false
    },
    waterRights: {
      type: DataTypes.STRING,
      allowNull: true
    },
    suitableCrops: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'
    },
    status: {
      type: DataTypes.ENUM('active', 'sold', 'pending'),
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
  });

  Property.associate = (models) => {
    Property.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller'
    });
  };

  return Property;
}; 