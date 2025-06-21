const { sequelize } = require('./models');
const Property = require('./models/Property')(sequelize);

async function checkDatabase() {
  try {
    const properties = await Property.findAll();
    console.log('Total properties:', properties.length);
    
    if (properties.length > 0) {
      properties.forEach(p => {
        console.log(`ID: ${p.id}, Title: ${p.title}, Price: ${p.price}, Location: ${p.location}, Status: ${p.status}, Views: ${p.viewCount}`);
      });
    } else {
      console.log('No properties found in database');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase(); 