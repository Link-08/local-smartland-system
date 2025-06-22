'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Properties', 'barangay', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Properties', 'barangayData', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Properties', 'barangay');
    await queryInterface.removeColumn('Properties', 'barangayData');
  }
}; 