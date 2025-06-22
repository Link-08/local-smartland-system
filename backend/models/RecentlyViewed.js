const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RecentlyViewed = sequelize.define('RecentlyViewed', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id'
      }
    },
    viewedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'recently_viewed',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'propertyId']
      },
      {
        fields: ['userId', 'viewedAt']
      }
    ]
  });

  RecentlyViewed.associate = (models) => {
    RecentlyViewed.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    RecentlyViewed.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
  };

  return RecentlyViewed;
}; 