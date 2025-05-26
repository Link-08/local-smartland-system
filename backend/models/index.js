const sequelize = require('../config/database');

// Import models
const User = require('./User')(sequelize);
const Log = require('./Log')(sequelize);
const SellerMetrics = require('./SellerMetrics')(sequelize);
const Property = require('./Property')(sequelize);
const PropertyView = require('./PropertyView')(sequelize);
const PropertyInquiry = require('./PropertyInquiry')(sequelize);
const PropertySale = require('./PropertySale')(sequelize);
const Favorite = require('./Favorite')(sequelize);

// Set up associations
const models = {
    User,
    Log,
    SellerMetrics,
    Property,
    PropertyView,
    PropertyInquiry,
    PropertySale,
    Favorite
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

// Initialize data function
const initializeData = async () => {
    try {
        // Create mock admin user
        await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        // Create mock buyer
        await User.create({
            username: 'buyer',
            email: 'buyer@example.com',
            password: 'buyer123',
            role: 'buyer',
            firstName: 'John',
            lastName: 'Smith',
            phone: '0912 345 6789',
            avatar: 'JS',
            memberSince: '2024-03-15'
        });

        // Create mock seller
        const seller = await User.create({
            username: 'seller',
            email: 'seller@example.com',
            password: 'seller123',
            role: 'seller',
            firstName: 'Real',
            lastName: 'Estate PH',
            phone: '0923 456 7890',
            avatar: 'RE',
            memberSince: '2018-01-01'
        });

        // Create default metrics for the mock seller
        await SellerMetrics.create({
            sellerId: seller.id,
            totalViews: 0,
            totalInquiries: 0,
            avgTimeToSale: 0
        });

        // Create some sample properties for the mock seller
        await Property.create({
            id: 'PROP-001',
            sellerId: seller.id,
            title: 'Prime Rice Farm with Irrigation',
            location: 'Nueva Ecija',
            price: 2500000.00,
            acres: 5.5,
            waterRights: 'NIA Irrigation',
            suitableCrops: 'Rice, Corn',
            status: 'active'
        });

        await Property.create({
            id: 'PROP-002',
            sellerId: seller.id,
            title: 'Fertile Farmland for Root Crops',
            location: 'Benguet',
            price: 1800000.00,
            acres: 3.2,
            waterRights: 'Natural Spring',
            suitableCrops: 'Potatoes, Carrots',
            status: 'active'
        });

        console.log('Initial data created successfully');
    } catch (error) {
        console.error('Error initializing data:', error);
    }
};

// Sync database
const syncDatabase = async () => {
    try {
        // Force sync to ensure all tables are created
        await sequelize.sync({ force: true });
        console.log('Database tables created successfully');
        
        // Initialize data after tables are created
        await initializeData();
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
};

// Start the sync process
syncDatabase();

module.exports = {
    sequelize,
    ...models
}; 