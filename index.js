const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./db');

app.use(express.json());

app.get('/health', (req, res) => {
  res.send('OK');
});

// routeshere

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});