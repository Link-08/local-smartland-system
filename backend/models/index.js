const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User');
const Log = require('./Log');
const Property = require('./Property')(sequelize);

// Define associations
Log.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Log, { foreignKey: 'userId' });

User.hasMany(Property, { foreignKey: 'sellerId' });
Property.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

module.exports = {
  sequelize,
  User,
  Log,
  Property
}; 