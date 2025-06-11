'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    return queryInterface.bulkInsert('Users', [
      {
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        firstName: 'Admin',
        lastName: 'User',
        phone: '09171234567',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        firstName: 'Regular',
        lastName: 'User',
        phone: '09181234567',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'seller@example.com',
        password: hashedPassword,
        role: 'seller',
        isActive: true,
        firstName: 'Seller',
        lastName: 'User',
        phone: '09191234567',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
}; 