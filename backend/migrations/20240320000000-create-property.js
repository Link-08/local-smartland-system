'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Properties', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      acres: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      waterRights: {
        type: Sequelize.STRING
      },
      suitableCrops: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      viewCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      inquiries: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('active', 'pending', 'sold'),
        defaultValue: 'active'
      },
      sellerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('Properties', ['sellerId']);
    await queryInterface.addIndex('Properties', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Properties');
  }
}; 