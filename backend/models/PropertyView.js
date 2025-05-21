const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PropertyView = sequelize.define('PropertyView', {
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
    viewerId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  PropertyView.associate = (models) => {
    PropertyView.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
    PropertyView.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller'
    });
    PropertyView.belongsTo(models.User, {
      foreignKey: 'viewerId',
      as: 'viewer'
    });
  };

  return PropertyView;
}; 