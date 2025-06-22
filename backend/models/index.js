const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User');
const Log = require('./Log');
const Property = require('./Property')(sequelize);
const Favorite = require('./Favorite')(sequelize);
const RecentlyViewed = require('./RecentlyViewed')(sequelize);

// Define associations
Log.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Log, { foreignKey: 'userId' });

User.hasMany(Property, { foreignKey: 'sellerId' });
Property.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

// Favorite associations
User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Property.hasMany(Favorite, { foreignKey: 'propertyId' });
Favorite.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Recently Viewed associations
User.hasMany(RecentlyViewed, { foreignKey: 'userId' });
RecentlyViewed.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Property.hasMany(RecentlyViewed, { foreignKey: 'propertyId' });
RecentlyViewed.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

module.exports = {
  sequelize,
  User,
  Log,
  Property,
  Favorite,
  RecentlyViewed
}; 