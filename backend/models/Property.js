const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Property = sequelize.define('Property', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    acres: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    waterRights: {
      type: DataTypes.STRING
    },
    suitableCrops: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    inquiries: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'pending', 'sold'),
      defaultValue: 'active'
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true
  });

  Property.associate = (models) => {
    Property.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller'
    });
  };

  return Property;
}; 