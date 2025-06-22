const { Log, User } = require('../models');

const logger = {
    async createLog(action, description, userId, req = null) {
        try {
            const logData = {
                action,
                description,
                userId,
                ipAddress: req?.ip,
                userAgent: req?.headers['user-agent']
            };

            const log = await Log.create(logData);
            return log;
        } catch (error) {
            console.error('Error creating log:', error);
            throw error;
        }
    },

    async getLogs(limit = 100) {
        try {
            return await Log.findAll({
                include: [{
                    model: User,
                    attributes: ['id', 'email', 'role']
                }],
                order: [['createdAt', 'DESC']],
                limit
            });
        } catch (error) {
            console.error('Error fetching logs:', error);
            throw error;
        }
    }
};

module.exports = logger; 