'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Properties', 'type', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Properties', 'topography', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Properties', 'averageYield', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Properties', 'amenities', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Properties', 'restrictionsText', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Properties', 'remarks', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Properties', 'displayPrice', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Properties', 'type');
    await queryInterface.removeColumn('Properties', 'topography');
    await queryInterface.removeColumn('Properties', 'averageYield');
    await queryInterface.removeColumn('Properties', 'amenities');
    await queryInterface.removeColumn('Properties', 'restrictionsText');
    await queryInterface.removeColumn('Properties', 'remarks');
    await queryInterface.removeColumn('Properties', 'displayPrice');
  }
}; 