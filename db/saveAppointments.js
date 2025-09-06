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
      running_ads_status,
      backend_cash
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
      $21, $22, $23, $24, $25, $26, $27
    )
    ON CONFLICT (appointment_id) DO UPDATE SET
      contact_id         = COALESCE(EXCLUDED.contact_id, appointments.contact_id),
      name               = COALESCE(EXCLUDED.name, appointments.name),
      contact_created    = COALESCE(EXCLUDED.contact_created, appointments.contact_created),
      appointment_created= COALESCE(EXCLUDED.appointment_created, appointments.appointment_created),
      email              = COALESCE(EXCLUDED.email, appointments.email),
      closer_name        = COALESCE(EXCLUDED.closer_name, appointments.closer_name),
      calendar_id        = COALESCE(EXCLUDED.calendar_id, appointments.calendar_id),
      group_id           = COALESCE(EXCLUDED.group_id, appointments.group_id),
      start_time         = COALESCE(EXCLUDED.start_time, appointments.start_time),
      status             = COALESCE(EXCLUDED.status, appointments.status),
      did_show_up        = COALESCE(EXCLUDED.did_show_up, appointments.did_show_up),
      was_qualified      = COALESCE(EXCLUDED.was_qualified, appointments.was_qualified),
      was_offered        = COALESCE(EXCLUDED.was_offered, appointments.was_offered),
      did_close          = COALESCE(EXCLUDED.did_close, appointments.did_close),
      is_follow_up       = COALESCE(EXCLUDED.is_follow_up, appointments.is_follow_up),
      running_ads        = COALESCE(EXCLUDED.running_ads, appointments.running_ads),
      monthly_revenue    = COALESCE(EXCLUDED.monthly_revenue, appointments.monthly_revenue),
      closer_id          = COALESCE(EXCLUDED.closer_id, appointments.closer_id),
      close_date         = COALESCE(EXCLUDED.close_date, appointments.close_date),
      booking_type       = COALESCE(EXCLUDED.booking_type, appointments.booking_type),
      calendar_source    = COALESCE(EXCLUDED.calendar_source, appointments.calendar_source),
      activation_fee     = COALESCE(EXCLUDED.activation_fee, appointments.activation_fee),
      monthly_fee        = COALESCE(EXCLUDED.monthly_fee, appointments.monthly_fee),
      lead_score         = COALESCE(EXCLUDED.lead_score, appointments.lead_score),
      running_ads_status = COALESCE(EXCLUDED.running_ads_status, appointments.running_ads_status),
      backend_cash       = COALESCE(EXCLUDED.backend_cash, appointments.backend_cash)
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
    appt.backendCash
  ];

  try {
    await db.query(query, values);
  } catch (err) {
    console.error(`❌ Error saving appointment ${appt.appointmentId}:`, err.message);
  }
}

module.exports = { saveAppointment };