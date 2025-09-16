const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./db');
const webhookRoutes = require('./routes/webhook');
const appointmentsRoutes = require('./routes/appointments');

// ✅ MUST come first to parse JSON correctly
app.use(express.json());

// ✅ Route logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/webhooks', appointmentsRoutes);
app.use('/webhooks', webhookRoutes);

app.get('/health', (req, res) => {
  res.send('OK');
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
