'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    const users = [
      // Admin users
      {
        id: 'USER-1710432000001',
        account_id: 'ADMIN-240315001',
        username: 'admin.john',
        email: 'admin.john@smartland.com',
        password: hashedPassword,
        role: 'admin',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+63 912 345 6789',
        avatar: 'JD',
        member_since: new Date('2023-01-01'),
        is_active: true,
        status: 'approved',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'USER-1710432000002',
        account_id: 'ADMIN-240315002',
        username: 'admin.jane',
        email: 'admin.jane@smartland.com',
        password: hashedPassword,
        role: 'admin',
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+63 923 456 7890',
        avatar: 'JS',
        member_since: new Date('2023-02-15'),
        is_active: true,
        status: 'approved',
        created_at: new Date(),
        updated_at: new Date()
      },

      // Seller users
      {
        id: 'USER-1710432000003',
        account_id: 'SELLER-240315001',
        username: 'seller.maria',
        email: 'maria.santos@example.com',
        password: hashedPassword,
        role: 'seller',
        first_name: 'Maria',
        last_name: 'Santos',
        phone: '+63 934 567 8901',
        avatar: 'MS',
        member_since: new Date('2023-03-01'),
        is_active: true,
        status: 'approved',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'USER-1710432000004',
        account_id: 'SELLER-240315002',
        username: 'seller.juan',
        email: 'juan.delacruz@example.com',
        password: hashedPassword,
        role: 'seller',
        first_name: 'Juan',
        last_name: 'Dela Cruz',
        phone: '+63 945 678 9012',
        avatar: 'JC',
        member_since: new Date('2023-04-15'),
        is_active: true,
        status: 'approved',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'USER-1710432000005',
        account_id: 'SELLER-240315003',
        username: 'seller.pending',
        email: 'pending.seller@example.com',
        password: hashedPassword,
        role: 'seller',
        first_name: 'Pending',
        last_name: 'Seller',
        phone: '+63 956 789 0123',
        avatar: 'PS',
        member_since: new Date(),
        is_active: true,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      },

      // Buyer users
      {
        id: 'USER-1710432000006',
        account_id: 'BUYER-240315001',
        username: 'buyer.pedro',
        email: 'pedro.garcia@example.com',
        password: hashedPassword,
        role: 'buyer',
        first_name: 'Pedro',
        last_name: 'Garcia',
        phone: '+63 967 890 1234',
        avatar: 'PG',
        member_since: new Date('2023-05-01'),
        is_active: true,
        status: 'approved',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'USER-1710432000007',
        account_id: 'BUYER-240315002',
        username: 'buyer.ana',
        email: 'ana.reyes@example.com',
        password: hashedPassword,
        role: 'buyer',
        first_name: 'Ana',
        last_name: 'Reyes',
        phone: '+63 978 901 2345',
        avatar: 'AR',
        member_since: new Date('2023-06-15'),
        is_active: true,
        status: 'approved',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'USER-1710432000008',
        account_id: 'BUYER-240315003',
        username: 'buyer.pending',
        email: 'pending.buyer@example.com',
        password: hashedPassword,
        role: 'buyer',
        first_name: 'Pending',
        last_name: 'Buyer',
        phone: '+63 989 012 3456',
        avatar: 'PB',
        member_since: new Date(),
        is_active: true,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
}; 