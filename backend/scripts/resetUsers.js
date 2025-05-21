const { sequelize, User, Log, Property, SellerMetrics } = require('../models');
const bcrypt = require('bcryptjs');

// Mock users from frontend data
const mockUsers = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    status: 'approved',
    phone: '+63 934 567 8901'
  },
  {
    username: 'buyer',
    email: 'buyer@example.com',
    password: 'buyer123',
    role: 'buyer',
    firstName: 'John',
    lastName: 'Smith',
    status: 'approved',
    phone: '+63 912 345 6789'
  },
  {
    username: 'seller',
    email: 'seller@example.com',
    password: 'seller123',
    role: 'seller',
    firstName: 'Virgilio',
    lastName: 'Diaz',
    status: 'approved',
    phone: '+63 923 456 7890'
  }
];

async function resetUsers() {
  try {
    // Initialize database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    // Drop all tables and recreate them
    await sequelize.sync({ force: true });
    console.log('Database tables recreated');

    // Create mock users
    console.log('Creating mock users...');
    for (const userData of mockUsers) {
      const user = await User.create(userData);
      console.log(`Created mock user: ${userData.email} with ID: ${user.id}`);
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error resetting users:', error);
    if (sequelize) {
      await sequelize.close();
    }
    process.exit(1);
  }
}

resetUsers(); 