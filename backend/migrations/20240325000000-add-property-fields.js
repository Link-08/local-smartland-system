'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if columns already exist
    const tableDescription = await queryInterface.describeTable('Properties');
    
    if (!tableDescription.type) {
      await queryInterface.addColumn('Properties', 'type', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableDescription.topography) {
      await queryInterface.addColumn('Properties', 'topography', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableDescription.averageYield) {
      await queryInterface.addColumn('Properties', 'averageYield', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableDescription.amenities) {
      await queryInterface.addColumn('Properties', 'amenities', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!tableDescription.restrictionsText) {
      await queryInterface.addColumn('Properties', 'restrictionsText', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!tableDescription.remarks) {
      await queryInterface.addColumn('Properties', 'remarks', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!tableDescription.displayPrice) {
      await queryInterface.addColumn('Properties', 'displayPrice', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Properties');
    
    if (tableDescription.type) {
      await queryInterface.removeColumn('Properties', 'type');
    }
    if (tableDescription.topography) {
      await queryInterface.removeColumn('Properties', 'topography');
    }
    if (tableDescription.averageYield) {
      await queryInterface.removeColumn('Properties', 'averageYield');
    }
    if (tableDescription.amenities) {
      await queryInterface.removeColumn('Properties', 'amenities');
    }
    if (tableDescription.restrictionsText) {
      await queryInterface.removeColumn('Properties', 'restrictionsText');
    }
    if (tableDescription.remarks) {
      await queryInterface.removeColumn('Properties', 'remarks');
    }
    if (tableDescription.displayPrice) {
      await queryInterface.removeColumn('Properties', 'displayPrice');
    }
  }
}; 