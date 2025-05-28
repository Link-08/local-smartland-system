const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    account_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'buyer', 'seller'),
      defaultValue: 'buyer'
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    member_since: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    rejection_reason: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'users',
    freezeTableName: true,
    underscored: true,
    hooks: {
      beforeValidate: async (user) => {
        if (!user.id) {
          const timestamp = Date.now().toString();
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          user.id = `USER-${timestamp}${random}`;
        }

        if (!user.account_id) {
          const prefix = (user.role || 'buyer').toUpperCase();
          const accountTimestamp = Date.now().toString().slice(-6);
          const accountRandom = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          user.account_id = `${prefix}-${accountTimestamp}${accountRandom}`;
        }

        if (user.password) {
          if (user.isNewRecord || user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      }
    }
  });

  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.changePassword = async function(currentPassword, newPassword) {
    const isValid = await this.validatePassword(currentPassword);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(newPassword, salt);
    await this.save();
  };

  User.getUsersByStatus = async function(status) {
    return this.findAll({
      where: { status },
      order: [['createdAt', 'DESC']]
    });
  };

  User.updateUserStatus = async function(userId, status, rejectionReason = null) {
    const updateData = { status };
    if (rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }
    
    const [updatedCount] = await this.update(updateData, {
      where: { id: userId }
    });

    if (updatedCount === 0) {
      throw new Error('User not found');
    }

    return this.findByPk(userId);
  };

  User.getAccountLogs = async function() {
    return this.findAll({
      attributes: ['id', 'username', 'email', 'role', 'status', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });
  };

  User.associate = (models) => {
    User.hasMany(models.Log, {
      foreignKey: 'userId',
      as: 'logs'
    });
    User.hasMany(models.Property, {
      foreignKey: 'sellerId',
      as: 'properties'
    });
    User.hasMany(models.PropertyView, {
      foreignKey: 'userId',
      as: 'propertyViews'
    });
    User.hasMany(models.PropertyInquiry, {
      foreignKey: 'userId',
      as: 'propertyInquiries'
    });
    User.hasMany(models.Favorite, {
      foreignKey: 'userId',
      as: 'favorites'
    });
    User.hasOne(models.SellerMetrics, {
      foreignKey: 'sellerId',
      as: 'sellerMetrics'
    });
  };

  return User;
};