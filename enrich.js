const axios = require('axios');
require('dotenv').config();

// === Full Custom Field Key Mapping ===
const fieldKeys = {
  'n0L3N3kBJjaXNZFaTOQf': 'didShowUp',
  'KdV0Vl55I1wMv5kRJZTG': 'wasQualified',
  'eZY1z0acvAviqdUwJqeO': 'wasOffered',
  'WAvW4hEA1P8tAgnRbnoc': 'didClose',
  '86E9flOu2yRrG7he9l51': 'isFollowUp',
  'h0dSb955wgkSTLZzHz2d': 'runningAds',
  'H6GcT3uBQQFF6AcuiWlW': 'monthlyRevenue',
  '7vdG0ENmdmZN7bHRGlkB': 'closerName',
  'ay0M7SO6bC83bRzKj1yB': 'closerId',
  'SbxnoBc0jlhLQ2HtYUux': 'closeDate',
  '6wpa5IeV7Al2HeUMl4I3': 'bookingType',
  'x2BciJyYCWlQihp3Dn2m': 'calendarSource',
  'GOFmqyPzEoDP4loOdV7E': 'activationFee',
  'vTc2GI7zAY8ELSFdGmIO': 'monthlyFee',
  'Jqnu8LkCMMicSkUXM2WN': 'leadScore',
  'LqIkENXl5akUATAnCaJi': 'runningAdsStatus',
};

// === Contact IDs ===
const CONTACT_IDS = [
  'M3tWLwhZ21UGYMyn2sVu',
  'eBpnChGLjHMtIkfyj9Ls',
  'ujs9VYVHM8UiNyW2ee09',
  'AHeQstJltnQxnxp0l3kI',
  '4WIAzheGTLX3zl5RQPhV',
  'DoUNBOeLYSZXmc8ZTeaY',
  'Ql6iDHbeb7U9JY39kIIZ',
  '7osdzIKrVuBiyVs8cjO7',
  'VojWibHASVY5VVKdWjn6',
  'zvQRi1EjQRsIqcI6nYSF',
  'XX5pEHrbvM18whla7kFi',
  '1jBbaqJTONlzUwojb3lU',
  'YzgmCXctfgol4jlBhYWJ',
  'ivyS0Bu9F0t2tJ0E5AKY',
  'X74qK8tc0U0PlSVjgdeT',
  'ceWu03t0NDve9fm7C6fl',
  's5UwIA2nsDO8jwetq1aq',
  'ZjjO9tnMYvgJ2Y90Pkbs',
  'WJm452OvqpSFlb62vVCQ',
  'shBdogiSNXSpaerfRqsD',
  'ZGIyeckWY9KJF9rVw9wS',
  'IOvLrtdCwSUcAjPw4Y7B',
  'enWkwgJ4fLnctO7XghQH',
  'lBVBLIxaBNJTvQg0bew9',
  'epMzo2emWNLjOLNhxu3F',
  'LTanGAbYwpxuCnnci0W8',
  'DGDCm3ooJmnYv9sd3y91',
  'CSGKLryj6GN77inBMB0o',
  'yQm5dYJJQFrdD7xYd5A5',
  'q1vUvFsQ9m4elHFU2iK2',
  'TcfUBeBCKHq3zBLOVzeR',
  'KI9L97uwdn3rb9pqiEn9',
  'PXyOExY3QwXHuFuuzAM9',
  '80xvlg5rlCf4kHkGunnK',
  'gEcIIFOkfYkmSUYQe9qo',
  'xmD6y6wL3lGs0SXmZi0Z',
  'cSynEcfJJSRYjCNC1c0J',
  'XCCWYm3D8i72siE8wRl0',
  'Gyagzy7xkZ0Dex4txjKX',
  'O4yIpa64N5zc1VhSQPDw',
  'le6QdOmhw6fzeV8oPPTl',
  'GCkj3XOXk5OTC5QmyUYZ',
  'fb4uh0Cd1488IX8K93Sq',
  'hyFuL8KOUqgVcJxij9u6',
  'Jmx9OfPOlUTQPtXiqhj4',
  'lNeaJmhdtI3L0R3Hjn0J',
  'nkPdeam1f1t1pwUkMWTT',
  'gSV2lLNTkpcOPHNEwRIg',
  'OgF7TRr3ORdkEAQSNWuz',
  'ASqh73orbETnNNXoWC9d',
  'uDZsntURuIavOnUbpmOg',
  'LYYPQ2ZlZPbqAO3yVVVB',
  '0oNwC3kzuqUfylpjlHJc',
  'u1TEXb4xKukvi17qVIDR',
  'a5VybhnxHLOUVtyHQN4g',
  'igZSZP7iBAuEZ9A0HxtO',
  'LJWZ0JZWxFqXZ9qzW3Re',
  'ztmgmTbMaFQUecO3LNor',
  '1jKuqxqbcCczrAPKMpz5',
  'C9bl8doxtoxkNaSziRtg',
  'tYxUPtbiNX3gBwLH7sQt',
  'L3dP6VYy68uwbv3RE1ql',
  'Kd8Te7Fuqh7iaORBaOt3',
  'OWjJgZBIKh02ZatmUuLB',
  'hhRyGWD3RvEzfEFgw8kK',
  'xvwcGG02ixBnHA6HqU2z',
  'kAg1pPm4dzTi3miMkxy6',
  'blhlZguSKflZdl3TzfAE',
  'd8T9J73l8KBu2WrtrAqG',
  'yXZnpw2hkajTJttOGD1O',
  'qV1ju6g0gDPAMtuuJOwa',
  'ammqjlekYJUlbZ0RuVq7',
  'qkEDKSaQ7ce4UWfyow0y',
  't3oiJg8290BXsUg8LD7R',
  'oIqBdid2z88axikOxhYl',
  'Vu0OGzxQX2sOINWb5xr3',
  'bLV8BNcevZUqCfB2EzF6',
  'vCWXuheayYqlxyNKNVmm',
  'iCzKNlZCME344O8Vs1HG',
  'oBZPnKCmuhq8Kl0wripI',
  '9PkpzhJg8MiETMzfDqxT',
  'kiAccXpEPYxZKayBygkC',
  'YF82BADWHIH1WFxRfECw',
  'g9qby9PNjWVhOUoEREa2',
  'VaZHDybTDYsPcIJx1mvj',
  'xf04u4bZKnHs37L2TLZY',
  'FXPxeKK3hRep4oa6brPt',
  'vmnD5B3WvpOE4JJhWHSl',
  'w9OMbhivsBkG6q1rsHLU',
  '9sFL9DVMKsw5CbOkvUlt',
  'y5bvZ4GwcBcehtXBHagC',
  'J2Eoaq9PzkK9D1GMsAGH',
  'KAoAQg6q82axkqDEeSMY',
  '35rix39OkHZALJinC8q7',
  'mwSbVEWao6FPteBcHLIL',
  'QP2PMgLT0wom5NOPUnt7',
  'XD8B450GaY7UhllJ5tcj',
  'UxVjwtltPFMMMnmaVBxD',
  'wEzzRcI74Y1mfsHv2JP1',
  'qgNnTAASqS7iqwXLkYRH',
  'nq3LFBIT0O6yCyh8t6pc',
  'Bsi7TlYW7coTQfJFutgN'
];

// const CONTACT_IDS = ['XX5pEHrbvM18whla7kFi', 'uDZsntURuIavOnUbpmOg', '9PkpzhJg8MiETMzfDqxT', 'XCCWYm3D8i72siE8wRl0']

// === GHL Client ===
const ghl = axios.create({
  baseURL: 'https://services.leadconnectorhq.com/',
  headers: {
    Authorization: `Bearer ${process.env.GHL_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  },
});

async function fetchUserData(userId) {
  if (!userId) return { email: null, name: null };
  try {
    const res = await ghl.get(`/users/${userId}`);
    return {
      email: res.data.email || null,
      name: res.data.name || null,
    };
  } catch (err) {
    console.warn(`⚠️ Could not fetch user data for ID ${userId}`);
    return { email: null, name: null };
  }
}

async function fetchContact(contactId) {
  const res = await ghl.get(`/contacts/${contactId}`);
  return res.data.contact;
}

async function fetchAppointments(contactId) {
  const res = await ghl.get(`/contacts/${contactId}/appointments`);
  return res.data.events || [];
}

async function buildReport() {
  let totalActivation = 0;
  const closeTally = {};
  const revenueTally = {};

  for (const id of CONTACT_IDS) {
    try {
      const contact = await fetchContact(id);
      const appointments = await fetchAppointments(id);

      const fieldMap = {};
      for (const field of contact.customFields) {
        fieldMap[field.id] = field.value;
      }

      const labeledFields = {};
      for (const [id, key] of Object.entries(fieldKeys)) {
        labeledFields[key] = fieldMap[id] ?? null;
      }

      const closerName = labeledFields.closerName || labeledFields.closerId || 'Unknown';
      // const didClose = labeledFields.didClose?.toLowerCase().includes('yes');
      const activationFee = parseInt(labeledFields.activationFee) || 0;

      closeTally[closerName.toLowerCase()] = (closeTally[closerName.toLowerCase()] || 0) + 1;
      revenueTally[closerName.toLowerCase()] = (revenueTally[closerName.toLowerCase()] || 0) + activationFee;
      

      totalActivation += activationFee;

      // Filter + Enrich Appointments
      const filteredAppointments = appointments.filter(appt => appt.groupId === 'tUcWCEvhQpQHn7V2I28y');

      filteredAppointments.forEach((appt, i) => {
        console.log(`\n[#${i + 1}] Appointment for Contact ${contact.firstName} ${contact.lastName}`);
        console.log({
          contactId: contact.id,
          name: `${contact.firstName} ${contact.lastName}`,
          created: contact.dateAdded,
          email: contact.email,
          closerName: closerName,
          appointmentId: appt.id,
          calendarId: appt.calendarId,
          groupId: appt.groupId,
          startTime: appt.startTime,
          status: appt.status,
          ...labeledFields,
        });
      });

    } catch (err) {
      console.warn(`❌ Error fetching contact ${id}:`, err.response?.data || err.message);
    }
  }

  // Report
  console.log('\n\nSummary Report');
  console.log(`Total Activation Revenue: $${totalActivation}\n`);

  console.log('Revenue + Closes Per Closer:');
  for (const closer of Object.keys(closeTally)) {
    const revenue = revenueTally[closer] || 0;
    const closes = closeTally[closer];
    console.log(`- ${closer}: $${revenue} (${closes})`);
  }

  console.log('\nBooking Type Tally:');
  const bookingCounts = {};
  for (const key of Object.keys(fieldKeys)) {
    if (fieldKeys[key] === 'bookingType') {
      for (const id of CONTACT_IDS) {
        const field = (await fetchContact(id)).customFields.find(f => f.id === key);
        const val = field?.value || 'Unknown';
        bookingCounts[val] = (bookingCounts[val] || 0) + 1;
      }
    }
  }
  for (const [type, count] of Object.entries(bookingCounts)) {
    console.log(`- ${type}: ${count}`);
  }

  console.log('\nRunning Ads Status Tally:');
  const adsCounts = {};
  for (const key of Object.keys(fieldKeys)) {
    if (fieldKeys[key] === 'runningAdsStatus') {
      for (const id of CONTACT_IDS) {
        const field = (await fetchContact(id)).customFields.find(f => f.id === key);
        const val = field?.value || 'Unknown';
        adsCounts[val] = (adsCounts[val] || 0) + 1;
      }
    }
  }
  for (const [status, count] of Object.entries(adsCounts)) {
    console.log(`- ${status}: ${count}`);
  }

  console.log('\nFollow Up Tally:');
  const followUpCounts = {};
  for (const key of Object.keys(fieldKeys)) {
    if (fieldKeys[key] === 'isFollowUp') {
      for (const id of CONTACT_IDS) {
        const field = (await fetchContact(id)).customFields.find(f => f.id === key);
        const val = field?.value || 'Unknown';
        followUpCounts[val] = (followUpCounts[val] || 0) + 1;
      }
    }
  }
  for (const [type, count] of Object.entries(followUpCounts)) {
    console.log(`- ${type}: ${count}`);
  }

  console.log('\nLS Tally:');
  const leadScore = {};
  for (const key of Object.keys(fieldKeys)) {
    if (fieldKeys[key] === 'leadScore') {
      for (const id of CONTACT_IDS) {
        const field = (await fetchContact(id)).customFields.find(f => f.id === key);
        const val = field?.value || 'Unknown';
        leadScore[val] = (leadScore[val] || 0) + 1;
      }
    }
  }
  for (const [type, count] of Object.entries(leadScore)) {
    console.log(`- ${type}: ${count}`);
  }

}


buildReport();
