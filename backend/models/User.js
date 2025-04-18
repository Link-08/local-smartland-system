const pool = require("../config/db");

const User = {
    async createUser(username, email, hashedPassword, userType) {
        const query = `
            INSERT INTO accounts (username, email, password, usertype) 
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [username, email, hashedPassword, userType];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async getUserByEmail(email) {
        const query = `SELECT * FROM accounts WHERE email = $1;`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    async getUserById(accountID) {
        const query = `SELECT * FROM accounts WHERE accountID = $1;`;
        const result = await pool.query(query, [accountID]);
        return result.rows[0];
    },

    // Get users by status
    async getUsersByStatus(status) {
        const query = `SELECT * FROM accounts WHERE status = $1;`;
        const result = await pool.query(query, [status]);
        return result.rows;
    },

    // Update user status
    async updateUserStatus(accountID, status, rejectionReason = null) {
        let query, values;
        if (status === 'rejected') {
            query = `UPDATE accounts SET status = $1, rejectionReason = $2 WHERE accountID = $3 RETURNING *;`;
            values = [status, rejectionReason, accountID];
        } else {
            query = `UPDATE accounts SET status = $1 WHERE accountID = $2 RETURNING *;`;
            values = [status, accountID];
        }
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Get account creation logs
    async getAccountLogs() {
        const query = `SELECT accountID, username, email, created_at FROM accounts ORDER BY created_at DESC;`;
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = User;