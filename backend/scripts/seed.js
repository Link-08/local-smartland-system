const { sequelize } = require('../models');
const seeder = require('../seeders/20240315000000-demo-users');

async function runSeeder() {
  try {
    console.log('Running seeder...');
    await seeder.up(sequelize.getQueryInterface(), sequelize);
    console.log('Seeder completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeder:', error);
    process.exit(1);
  }
}

runSeeder(); 