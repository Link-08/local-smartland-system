const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PropertyInquiry = sequelize.define('PropertyInquiry', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => `INQ-${Date.now()}`
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    propertyId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Properties',
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  PropertyInquiry.associate = (models) => {
    PropertyInquiry.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    PropertyInquiry.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
  };

  return PropertyInquiry;
}; 