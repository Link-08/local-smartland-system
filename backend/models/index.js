const { Sequelize } = require('sequelize');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: isTest ? ':memory:' : path.join(__dirname, '../database.sqlite'),
    logging: false
});

// Import models
const User = require('./User')(sequelize);
const Log = require('./Log')(sequelize);
const SellerMetrics = require('./SellerMetrics')(sequelize);
const Property = require('./Property')(sequelize);
const PropertyView = require('./PropertyView')(sequelize);
const PropertyInquiry = require('./PropertyInquiry')(sequelize);
const PropertySale = require('./PropertySale')(sequelize);

// Set up associations
const models = {
  User,
  Log,
  SellerMetrics,
  Property,
  PropertyView,
  PropertyInquiry,
  PropertySale
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {
  sequelize,
  ...models
}; 