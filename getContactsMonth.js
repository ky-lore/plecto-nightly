const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const ghl = axios.create({
  baseURL: 'https://services.leadconnectorhq.com',
  headers: {
    Authorization: `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  },
});

const fetchContactsThisMonth = async () => {
  const locationId = process.env.GHL_LOCATION_ID;
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString();

  let page = 1;
  let allContacts = [];
  let hasMore = true;

  while (hasMore) {
    const body = {
      locationId,
      page,
      pageLimit: 100,
      filters: [
        {
          field: 'dateAdded',
          operator: 'range',
          value: {
            gte: startOfMonth,
            lt: endOfMonth
          }
        }
      ],
      sort: [
        {
          field: 'dateAdded',
          direction: 'asc'
        }
      ]
    };

    const res = await ghl.post('/contacts/search', body);
    const contacts = res.data.contacts || res.data.data || [];

    allContacts.push(...contacts);
    console.log(`📦 Page ${page} - Fetched ${contacts.length} contacts`);

    hasMore = contacts.length === 100;
    page++;
  }

  const contactIds = allContacts.map(c => c.id);
  const filePath = './contact_ids.json';

  fs.writeFileSync(filePath, JSON.stringify(contactIds, null, 2));
  console.log(`✅ Wrote ${contactIds.length} contact IDs to ${filePath}`);
};

fetchContactsThisMonth().catch(console.error);
