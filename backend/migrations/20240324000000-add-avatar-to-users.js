'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if avatar column already exists
    const tableDescription = await queryInterface.describeTable('Users');
    
    if (!tableDescription.avatar) {
      await queryInterface.addColumn('Users', 'avatar', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Users');
    
    if (tableDescription.avatar) {
      await queryInterface.removeColumn('Users', 'avatar');
    }
  }
}; 