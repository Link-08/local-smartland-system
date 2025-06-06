const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SellerMetrics = sequelize.define('SellerMetrics', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sellerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    totalViews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalInquiries: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    avgTimeToSale: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  SellerMetrics.associate = (models) => {
    SellerMetrics.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller'
    });
  };

  return SellerMetrics;
}; 