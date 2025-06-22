'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Properties', 'images', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'JSON array of image URLs for multiple property images'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Properties', 'images');
  }
}; 