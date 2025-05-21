const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PropertySale = sequelize.define('PropertySale', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    propertyId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id'
      }
    },
    sellerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    buyerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    salePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    saleDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    daysToSale: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    }
  });

  PropertySale.associate = (models) => {
    PropertySale.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
    PropertySale.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller'
    });
    PropertySale.belongsTo(models.User, {
      foreignKey: 'buyerId',
      as: 'buyer'
    });
  };

  return PropertySale;
}; 