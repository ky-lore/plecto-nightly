const express = require('express');
const router = express.Router();
const { saveAppointment } = require('../db/saveAppointments');

router.post('/appointments', async (req, res) => {
  try {
    const payload = req.body;
    console.log('📦 Received payload:', payload);

    if (!payload) {
      return res.status(400).send('Missing payload');
    }

    await saveAppointment(payload);

    console.log(`✅ Appointment saved for ID: ${payload.appointmentId}`);
    res.status(200).send('Appointment saved');
  } catch (err) {
    console.error('❌ Error saving appointment:', err.message);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
