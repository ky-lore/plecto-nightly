const db = require('./index');

console.log(process.env.DATABASE_URL);

async function fx() {
  try {
    const res = await db.query('SELECT 1 AS test_value');
    console.log('✅ DB Test Value:', res.rows[0].test_value);
    return res.rows[0].test_value;
  } catch (err) {
    console.error('❌ Error testing DB connection:', err.message);
    return null;
  }
}

fx();

module.exports = { fx };
