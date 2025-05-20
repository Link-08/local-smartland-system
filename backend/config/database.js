const { Sequelize } = require('sequelize');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

let sequelize;

if (isProduction) {
  // PostgreSQL configuration for production
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // SQLite configuration for development and testing
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: isTest 
      ? ':memory:' 
      : path.join(__dirname, '../database.sqlite'),
    logging: false
  });
}

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize; 