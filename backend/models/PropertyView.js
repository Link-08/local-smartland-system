const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PropertyView = sequelize.define('PropertyView', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => `VIEW-${Date.now()}`
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
    viewedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  PropertyView.associate = (models) => {
    PropertyView.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    PropertyView.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
  };

  return PropertyView;
}; 