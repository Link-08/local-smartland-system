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
    }
};

module.exports = User;