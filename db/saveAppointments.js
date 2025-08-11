// db/saveAppointments.js
const db = require('./index'); // your db/index.js file
const { randomUUID } = require('crypto');

// Convert empty strings to null
function sanitizeValue(val) {
  if (val === '' || val === ' ') return null;
  return val;
}

// Convert to JS Date if valid, else null
function parseDate(val) {
  const parsed = Date.parse(val);
  return isNaN(parsed) ? null : new Date(parsed);
}

async function saveAppointment(apptRaw) {
  // Sanitize and parse input values
  const appt = {};
  for (const key in apptRaw) {
    appt[key] = sanitizeValue(apptRaw[key]);
  }

  // Parse known timestamp fields
  appt.contactCreated = parseDate(appt.contactCreated);
  appt.appointmentCreated = parseDate(appt.appointmentCreated);
  appt.startTime = parseDate(appt.startTime);
  appt.closeDate = parseDate(appt.closeDate);

  const query = `
    INSERT INTO appointments (
      contact_id,
      name,
      contact_created,
      appointment_created,
      email,
      closer_name,
      appointment_id,
      calendar_id,
      group_id,
      start_time,
      status,
      did_show_up,
      was_qualified,
      was_offered,
      did_close,
      is_follow_up,
      running_ads,
      monthly_revenue,
      closer_id,
      close_date,
      booking_type,
      calendar_source,
      activation_fee,
      monthly_fee,
      lead_score,
      running_ads_status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
      $21, $22, $23, $24, $25, $26
    )
  `;

  appt.appointmentId = appt.appointmentId || randomUUID();

  const values = [
    appt.contactId,
    appt.name,
    appt.contactCreated,
    appt.appointmentCreated,
    appt.email,
    appt.closerName,
    appt.appointmentId,
    appt.calendarId,
    appt.groupId,
    appt.startTime,
    appt.status,
    appt.didShowUp,
    appt.wasQualified,
    appt.wasOffered,
    appt.didClose,
    appt.isFollowUp,
    appt.runningAds,
    appt.monthlyRevenue ? parseInt(appt.monthlyRevenue) : null,
    appt.closerId,
    appt.closeDate,
    appt.bookingType,
    appt.calendarSource,
    appt.activationFee ? parseInt(appt.activationFee) : 0,
    appt.monthlyFee ? parseInt(appt.monthlyFee) : 0,
    appt.leadScore,
    appt.runningAdsStatus,
  ];

  try {
    await db.query(query, values);
  } catch (err) {
    console.error(`❌ Error saving appointment ${appt.appointmentId}:`, err.message);
  }
}

module.exports = { saveAppointment };
