const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./db');
const webhookRoutes = require('./routes/webhook');

app.use(express.json());

app.get('/health', (req, res) => {
  res.send('OK');
});

// routeshere

app.get('/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

app.use('/webhooks', webhookRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});