const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => `FAV-${Date.now()}`
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
    dateAdded: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Favorite.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
  };

  return Favorite;
}; 