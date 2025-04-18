const { Pool } = require('pg');

const pool = new Pool({
  host: 'dono-01.danbot.host',
  port: 8932,
  database: 'smartland-system',
  user: 'pterodactyl',
  password: 'VH0TOR9MC89UZAR8',
});

async function checkUsers() {
  try {
    const res = await pool.query('SELECT accountid, username, email, status, location, landarea, created_at FROM accounts');
    console.table(res.rows);
    console.log(`Total users: ${res.rowCount}`);
  } catch (err) {
    console.error('Error querying users:', err);
  } finally {
    await pool.end();
  }
}

checkUsers();
