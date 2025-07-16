const axios = require('axios');
require('dotenv').config();

// === Custom Field Label Mapping ===
const fieldLabels = {
  'n0L3N3kBJjaXNZFaTOQf': 'Did the person show up?',
  'KdV0Vl55I1wMv5kRJZTG': 'Was the person qualified?',
  'eZY1z0acvAviqdUwJqeO': 'Was an offer made?',
  'WAvW4hEA1P8tAgnRbnoc': 'Did they close?',
  '86E9flOu2yRrG7he9l51': 'Is this a follow-up?',
  'h0dSb955wgkSTLZzHz2d': 'Running Ads?',
  'H6GcT3uBQQFF6AcuiWlW': 'Monthly Revenue',
  '7vdG0ENmdmZN7bHRGlkB': 'Closer Name',
  'ay0M7SO6bC83bRzKj1yB': 'Closer ID',
  'SbxnoBc0jlhLQ2HtYUux': 'Close Date',
  '6wpa5IeV7Al2HeUMl4I3': 'Booking Type',
  'x2BciJyYCWlQihp3Dn2m': 'Calendar Source',
  'GOFmqyPzEoDP4loOdV7E': 'Activation Fee',
  'vTc2GI7zAY8ELSFdGmIO': 'Monthly Fee',
  'Jqnu8LkCMMicSkUXM2WN': 'Lead Score',
  'LqIkENXl5akUATAnCaJi': 'Running Ads Status'

}

// === CONFIG ===
const GHL_BASE = 'https://rest.gohighlevel.com/v1';
const CONTACT_ID = '1jBbaqJTONlzUwojb3lU'; // 👈 Replace with real ID

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

async function fetchAppointments(contactId) {
  const res = await ghl.get(`/contacts/${contactId}/appointments`);
  return res.data.events || [];
}

async function run() {
  try {
    console.log(`🔍 Fetching contact ${CONTACT_ID}...`);
    const contact = await fetchContact(CONTACT_ID);
    console.log(contact)

    // Filter and label relevant custom fields
    const labeledFields = {};
    contact.customField.forEach(field => {
      if (fieldLabels[field.id]) {
        labeledFields[fieldLabels[field.id]] = field.value;
      }
    });

    console.log('🔹 Contact Info:');
    console.log({
      id: contact.id,
      name: `${contact.firstName} ${contact.lastName}`,
      customFields: labeledFields,
    });

    console.log('\n📅 Fetching appointments...');
    const appointments = await fetchAppointments(CONTACT_ID);
    console.log(`🔹 Found ${appointments.length} appointment(s):`);
    appointments.forEach((appt, i) => {
      console.log(`\n[#${i + 1}]`);
      console.log(appt);
    });
  } catch (err) {
    console.error('❌ Error fetching GHL data:', err.response?.data || err.message);
  }
}

run();
