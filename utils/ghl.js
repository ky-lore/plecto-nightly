const axios = require('axios');
require('dotenv').config();

const GHL_BASE = 'https://services.leadconnectorhq.com';

const ghl = axios.create({
  baseURL: GHL_BASE,
  headers: {
    Authorization: `Bearer ${process.env.GHL_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

async function fetchContact(contactId) {
  const res = await ghl.get(`/contacts/${contactId}`);
  return res.data.contact;
}

module.exports = { fetchContact };
