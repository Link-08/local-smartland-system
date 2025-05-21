const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PropertyInquiry = sequelize.define('PropertyInquiry', {
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'responded', 'closed'),
      defaultValue: 'pending'
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  PropertyInquiry.associate = (models) => {
    PropertyInquiry.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
    PropertyInquiry.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller'
    });
    PropertyInquiry.belongsTo(models.User, {
      foreignKey: 'buyerId',
      as: 'buyer'
    });
  };

  return PropertyInquiry;
}; 