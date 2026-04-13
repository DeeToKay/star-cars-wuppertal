import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

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
      subject: 'Dein Auto ist fertig!',
      body: `Hallo ${booking.user_name || 'Kunde'},

Ihr Fahrzeug steht bei Star Cars Wuppertal zur Abholung bereit.

📍 Star Cars Wuppertal
Ronsdorferstr 57
42349 Wuppertal

Service: ${booking.service_name}
Datum: ${booking.appointment_date}

Wir freuen uns auf Ihren Besuch!

Mit freundlichen Grüßen,
Ihr Star Cars Wuppertal Team`,
    });

    console.log(`Ready email sent to ${booking.user_email}`);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Email error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});