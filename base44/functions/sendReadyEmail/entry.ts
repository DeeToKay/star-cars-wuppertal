import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const STORE_ADDRESS = 'Ronsdorfer Str. 57, 42119 Wuppertal';
const STORE_PHONE = '01726871641';
const STORE_EMAIL = 'info@starcarswuppertal.com';
const STORE_HOURS = 'Mo–Sa 10:00–20:00 Uhr';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Support both direct call (booking_id) and entity automation payload (event.entity_id)
    const bookingId = body.booking_id || body.event?.entity_id;
    const bookingData = body.data; // entity automation provides current data directly

    if (!bookingId && !bookingData) {
      return Response.json({ error: 'booking_id fehlt' }, { status: 400 });
    }

    const booking = bookingData || await base44.asServiceRole.entities.Booking.get(bookingId);
    if (!booking || !booking.user_email) {
      console.log('Buchung oder E-Mail nicht gefunden:', bookingId);
      return Response.json({ error: 'Buchung nicht gefunden' }, { status: 404 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: booking.user_email,
      from_name: 'Star Cars Wuppertal',
      subject: '🚗 Ihr Auto ist abholbereit!',
      body: `Hallo ${booking.user_name || 'Kunde'},

Ihr Fahrzeug ist fertig und steht bei Star Cars Wuppertal zur Abholung bereit.

📍 Star Cars Wuppertal
${STORE_ADDRESS}
(an der StarTankstelle)

📞 ${STORE_PHONE}
✉️  ${STORE_EMAIL}
🕐 ${STORE_HOURS}

Service: ${booking.service_name}
Datum: ${booking.appointment_date}
Preis: €${Number(booking.service_price).toFixed(2)}

Die Zahlung erfolgt vor Ort – bar oder per EC-/Kreditkarte.

Wir freuen uns auf Ihren Besuch!

Mit freundlichen Grüßen,
Ihr Star Cars Wuppertal Team`,
    });

    console.log(`Ready email sent to ${booking.user_email}`);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Email error:', (error as Error).message);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});
