import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CALENDAR_ID = 'primary';
const TIMEZONE = 'Europe/Berlin';

function addMinutes(dateStr, timeStr, minutes) {
  const dt = new Date(`${dateStr}T${timeStr}:00`);
  dt.setMinutes(dt.getMinutes() + minutes);
  return dt.toISOString();
}

function toRFC3339(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00`).toISOString();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Support both direct call and entity automation payload
    const booking = body.data || body;

    if (!booking || !booking.appointment_date || !booking.appointment_time) {
      return Response.json({ error: 'Missing booking data' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const duration = Number(booking.service_duration_minutes) || 60;
    const startDateTime = toRFC3339(booking.appointment_date, booking.appointment_time);
    const endDateTime = addMinutes(booking.appointment_date, booking.appointment_time, duration);

    const eventTitle = `🚗 ${booking.service_name || 'Aufbereitung'} – ${booking.license_plate || booking.user_name || 'Kunde'}`;

    const description = [
      `👤 Kunde: ${booking.user_name || '—'}`,
      `📧 E-Mail: ${booking.user_email || '—'}`,
      `📞 Telefon: ${booking.phone_number || '—'}`,
      booking.license_plate ? `🔢 Kennzeichen: ${booking.license_plate}` : null,
      ``,
      `🛠 Service: ${booking.service_name || '—'}`,
      `💶 Preis: €${Number(booking.service_price || 0).toFixed(2)}`,
      `⏱ Dauer: ${duration} Min.`,
      ``,
      `📋 Status: ${booking.status || 'Confirmed'}`,
      `💳 Zahlung: ${booking.payment_status === 'Paid' ? '✅ Bezahlt' : '⏳ Vor Ort'}`,
    ].filter(l => l !== null).join('\n');

    const event = {
      summary: eventTitle,
      description,
      start: { dateTime: startDateTime, timeZone: TIMEZONE },
      end: { dateTime: endDateTime, timeZone: TIMEZONE },
      colorId: '11', // Tomato red
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    // If booking already has a calendar event ID, update it; otherwise create
    const existingEventId = booking.google_calendar_event_id;

    let calendarEvent;
    if (existingEventId) {
      const updateRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events/${existingEventId}`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        }
      );
      if (!updateRes.ok) {
        const err = await updateRes.text();
        console.error('Calendar update failed:', err);
        return Response.json({ error: 'Calendar update failed', details: err }, { status: 500 });
      }
      calendarEvent = await updateRes.json();
      console.log(`Updated calendar event: ${calendarEvent.id}`);
    } else {
      const createRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        }
      );
      if (!createRes.ok) {
        const err = await createRes.text();
        console.error('Calendar create failed:', err);
        return Response.json({ error: 'Calendar create failed', details: err }, { status: 500 });
      }
      calendarEvent = await createRes.json();
      console.log(`Created calendar event: ${calendarEvent.id}`);

      // Save the event ID back to the booking (best-effort)
      if (booking.id) {
        try {
          await base44.asServiceRole.entities.Booking.update(booking.id, {
            google_calendar_event_id: calendarEvent.id,
          });
        } catch (e) {
          console.warn('Could not save calendar event ID to booking:', e.message);
        }
      }
    }

    return Response.json({ success: true, event_id: calendarEvent.id });
  } catch (error) {
    console.error('syncBookingToCalendar error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});