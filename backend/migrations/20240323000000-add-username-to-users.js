'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First add the column without unique constraint
    await queryInterface.addColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Update existing users with a default username
    await queryInterface.sequelize.query(`
      UPDATE Users 
      SET username = LOWER(CONCAT(role, '_', COALESCE(firstName, ''), '_', COALESCE(lastName, '')))
      WHERE username IS NULL
    `);

    // Then add the unique constraint
    await queryInterface.addIndex('Users', ['username'], {
      unique: true,
      where: {
        username: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'username');
  }
}; 