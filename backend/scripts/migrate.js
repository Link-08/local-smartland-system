const { execSync } = require('child_process');
const path = require('path');

try {
  // Run the migration
  execSync('npx sequelize-cli db:migrate', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  console.log('Migrations completed successfully');
} catch (error) {
  console.error('Error running migrations:', error);
  process.exit(1);
} 