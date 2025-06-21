const { Property, User } = require('./models');
const sequelize = require('./config/database');

async function testMetrics() {
    try {
        console.log('Testing Seller Dashboard Performance Metrics...\n');

        // Test 1: Check if we have any properties in the database
        const properties = await Property.findAll();
        console.log(`1. Total properties in database: ${properties.length}`);

        if (properties.length === 0) {
            console.log('   No properties found. Creating test data...');
            
            // Create a test user if none exists
            let testUser = await User.findOne({ where: { role: 'seller' } });
            if (!testUser) {
                testUser = await User.create({
                    firstName: 'Test',
                    lastName: 'Seller',
                    email: 'test.seller@example.com',
                    password: 'password123',
                    role: 'seller',
                    phone: '1234567890',
                    username: 'test_seller'
                });
                console.log('   Created test seller user');
            }

            // Create test properties
            const testProperties = [
                {
                    title: 'Test Property 1',
                    description: 'A test agricultural property',
                    price: 500000,
                    location: 'Test Location 1',
                    acres: 10.5,
                    waterRights: 'Available',
                    suitableCrops: 'Rice, Corn',
                    sellerId: testUser.id,
                    viewCount: 15,
                    inquiries: 3,
                    status: 'active'
                },
                {
                    title: 'Test Property 2',
                    description: 'Another test agricultural property',
                    price: 750000,
                    location: 'Test Location 2',
                    acres: 15.0,
                    waterRights: 'Limited',
                    suitableCrops: 'Vegetables, Sugarcane',
                    sellerId: testUser.id,
                    viewCount: 8,
                    inquiries: 1,
                    status: 'sold'
                }
            ];

            for (const propData of testProperties) {
                await Property.create(propData);
            }
            console.log('   Created 2 test properties');
        }

        // Test 2: Check metrics calculation
        const allProperties = await Property.findAll();
        const sellerProperties = allProperties.filter(p => p.sellerId);
        
        if (sellerProperties.length > 0) {
            const sellerId = sellerProperties[0].sellerId;
            console.log(`2. Testing metrics for seller ID: ${sellerId}`);

            const totalViews = sellerProperties.reduce((sum, prop) => sum + (prop.viewCount || 0), 0);
            const totalInquiries = sellerProperties.reduce((sum, prop) => sum + (prop.inquiries || 0), 0);
            const activeProperties = sellerProperties.filter(p => p.status === 'active').length;
            const soldProperties = sellerProperties.filter(p => p.status === 'sold');

            console.log(`   Total Views: ${totalViews}`);
            console.log(`   Total Inquiries: ${totalInquiries}`);
            console.log(`   Active Properties: ${activeProperties}`);
            console.log(`   Sold Properties: ${soldProperties.length}`);

            // Calculate average time to sale
            if (soldProperties.length > 0) {
                const totalDays = soldProperties.reduce((sum, prop) => {
                    const createdAt = new Date(prop.createdAt);
                    const updatedAt = new Date(prop.updatedAt);
                    const daysDiff = Math.ceil((updatedAt - createdAt) / (1000 * 60 * 60 * 24));
                    return sum + daysDiff;
                }, 0);
                const avgTimeToSale = Math.round(totalDays / soldProperties.length);
                console.log(`   Average Time to Sale: ${avgTimeToSale} days`);
            } else {
                console.log(`   Average Time to Sale: No sold properties`);
            }
        }

        // Test 3: Check individual property metrics
        console.log('\n3. Individual Property Metrics:');
        for (const property of sellerProperties.slice(0, 3)) {
            console.log(`   Property: ${property.title}`);
            console.log(`     Views: ${property.viewCount || 0}`);
            console.log(`     Inquiries: ${property.inquiries || 0}`);
            console.log(`     Status: ${property.status}`);
            console.log(`     Price: $${property.price}`);
            console.log(`     Acres: ${property.acres}`);
        }

        console.log('\n✅ Metrics test completed successfully!');
        console.log('\nTo test the full functionality:');
        console.log('1. Start the backend server: npm start');
        console.log('2. Start the frontend: npm run dev');
        console.log('3. Log in as a seller and check the dashboard metrics');
        console.log('4. Try marking a property as sold to see metrics update');

    } catch (error) {
        console.error('❌ Error testing metrics:', error);
    } finally {
        await sequelize.close();
    }
}

testMetrics(); 