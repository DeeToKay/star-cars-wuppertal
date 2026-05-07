import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const STORE_NAME = 'Star Cars Wuppertal';
const STORE_ADDRESS = 'Ronsdorfer Str. 57, 42119 Wuppertal';
const STORE_PHONE = '01726871641';
const STORE_EMAIL = 'info@starcarswuppertal.com';
const STORE_HOURS = 'Mo–Sa 10:00–20:00 Uhr';

function buildMimeEmail({ to, subject, body, fromName }) {
  const encodeBase64Url = (str) =>
    btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const encodedSubject = `=?UTF-8?B?${encodeBase64Url(subject)}?=`;
  const raw = [
    `From: ${fromName} <${STORE_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    encodeBase64Url(body),
  ].join('\r\n');

  return encodeBase64Url(raw);
}

function getEmailContent(booking, eventType) {
  const name = booking.user_name || 'Kunde';
  const date = booking.appointment_date;
  const time = booking.appointment_time;
  const service = booking.service_name;
  const price = `€${Number(booking.service_price || 0).toFixed(2)}`;

  const footer = `\n\n📍 ${STORE_NAME}\n${STORE_ADDRESS} (an der StarTankstelle)\n📞 ${STORE_PHONE}\n✉️  ${STORE_EMAIL}\n🕐 ${STORE_HOURS}`;

  if (eventType === 'confirmed') {
    return {
      subject: `✅ Buchungsbestätigung – ${service} am ${date}`,
      body: `Hallo ${name},\n\nvielen Dank für Ihre Buchung! Hier sind Ihre Termindetails:\n\n📅 Datum: ${date}\n⏰ Uhrzeit: ${time} Uhr\n🚗 Service: ${service}\n💶 Preis: ${price}\n\nBitte bringen Sie Ihr Fahrzeug pünktlich zu unserem Standort. Die Zahlung erfolgt vor Ort – bar oder per EC-/Kreditkarte.\n\nWir freuen uns auf Ihren Besuch!${footer}\n\nMit freundlichen Grüßen,\nIhr ${STORE_NAME} Team`,
    };
  }

  if (eventType === 'ready') {
    return {
      subject: `🚗 Ihr Fahrzeug ist abholbereit! – ${service}`,
      body: `Hallo ${name},\n\nIhr Fahrzeug ist fertig aufbereitet und steht zur Abholung bereit.\n\n🚗 Service: ${service}\n📅 Datum: ${date}\n💶 Preis: ${price}\n\nDie Zahlung erfolgt bei Abholung – bar oder per EC-/Kreditkarte.${footer}\n\nMit freundlichen Grüßen,\nIhr ${STORE_NAME} Team`,
    };
  }

  if (eventType === 'cancelled') {
    return {
      subject: `❌ Buchung storniert – ${service} am ${date}`,
      body: `Hallo ${name},\n\nIhre Buchung wurde storniert.\n\n📅 Datum: ${date}\n⏰ Uhrzeit: ${time} Uhr\n🚗 Service: ${service}\n\nSie können jederzeit einen neuen Termin unter https://starcarswuppertal.com/booking buchen.${footer}\n\nMit freundlichen Grüßen,\nIhr ${STORE_NAME} Team`,
    };
  }

  if (eventType === 'in_progress') {
    return {
      subject: `🔧 Aufbereitung gestartet – ${service}`,
      body: `Hallo ${name},\n\ndie Aufbereitung Ihres Fahrzeugs hat begonnen. Wir melden uns, sobald alles fertig ist.\n\n🚗 Service: ${service}\n📅 Datum: ${date}${footer}\n\nMit freundlichen Grüßen,\nIhr ${STORE_NAME} Team`,
    };
  }

  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Support direct call: { booking_id, event_type }
    // Support entity automation payload: { event, data, old_data }
    const bookingId = body.booking_id || body.event?.entity_id;
    const booking = body.data || (bookingId ? await base44.asServiceRole.entities.Booking.get(bookingId) : null);

    if (!booking || !booking.user_email) {
      return Response.json({ error: 'Buchung oder E-Mail nicht gefunden' }, { status: 404 });
    }

    // Determine event type
    let eventType = body.event_type;
    if (!eventType) {
      const eventKind = body.event?.type;
      const newStatus = booking.status;
      const oldStatus = body.old_data?.status;

      if (eventKind === 'create') {
        eventType = 'confirmed';
      } else if (eventKind === 'update' && newStatus !== oldStatus) {
        if (newStatus === 'Ready for Pickup') eventType = 'ready';
        else if (newStatus === 'Cancelled') eventType = 'cancelled';
        else if (newStatus === 'In Progress') eventType = 'in_progress';
      }
    }

    if (!eventType) {
      return Response.json({ skipped: true, reason: 'Kein relevanter Event-Typ' });
    }

    const emailContent = getEmailContent(booking, eventType);
    if (!emailContent) {
      return Response.json({ skipped: true, reason: 'Kein E-Mail-Template für diesen Status' });
    }

    // Send via Gmail connector
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const rawEmail = buildMimeEmail({
      to: booking.user_email,
      subject: emailContent.subject,
      body: emailContent.body,
      fromName: STORE_NAME,
    });

    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: rawEmail }),
    });

    if (!gmailRes.ok) {
      const err = await gmailRes.text();
      console.error('Gmail API error:', err);
      return Response.json({ error: 'Gmail-Fehler', detail: err }, { status: 500 });
    }

    console.log(`Email [${eventType}] sent to ${booking.user_email}`);
    return Response.json({ success: true, event_type: eventType });
  } catch (error) {
    console.error('sendBookingEmail error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});