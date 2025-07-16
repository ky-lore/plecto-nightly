const express = require('express');
const router = express.Router();
const db = require('../db');
const { fetchContact } = require('../utils/ghl');

// POST /webhooks/ghl-appointment
router.post('/ghl-appointment', async (req, res) => {
  const appt = req.body;

  if (!appt || !appt.id || !appt.contactId) {
    return res.status(400).json({ error: 'Missing appointment or contact data' });
  }

  try {
    // Step 1: Insert base appointment record
    await db.query(
      `
      INSERT INTO appointments (
        id, contact_id, user_id, calendar_id, start_time, status, tags
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      )
      ON CONFLICT (id) DO UPDATE SET
        contact_id = EXCLUDED.contact_id,
        user_id = EXCLUDED.user_id,
        calendar_id = EXCLUDED.calendar_id,
        start_time = EXCLUDED.start_time,
        status = EXCLUDED.status,
        tags = EXCLUDED.tags,
        updated_at = NOW()
      `,
      [
        appt.id,
        appt.contactId,
        appt.userId || null,
        appt.calendarId || null,
        appt.startTime ? new Date(appt.startTime) : null,
        appt.status || null,
        appt.tags || [],
      ]
    );

    // Step 2: Fetch contact from GHL and enrich
    const contact = await fetchContact(appt.contactId);
    const customFields = contact.customField || {};

    const enriched = {
      is_show: customFields['n0L3N3kBJjaXNZFaTOQf'] === 'Yes',
      is_offer: customFields['eZY1z0acvAviqdUwJqeO'] === 'Yes',
      is_close: customFields['WAvW4hEA1P8tAgnRbnoc'] === 'Yes',
      revenue: parseFloat(customFields['revenue_field_id'] || 0),
      running_ads: customFields['LqIkENXl5akUATAnCaJi'] || null,
    };

    await db.query(
      `
      UPDATE appointments
      SET
        is_show = $1,
        is_offer = $2,
        is_close = $3,
        revenue = $4,
        running_ads = $5,
        updated_at = NOW()
      WHERE id = $6
      `,
      [
        enriched.is_show,
        enriched.is_offer,
        enriched.is_close,
        enriched.revenue,
        enriched.running_ads,
        appt.id,
      ]
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
