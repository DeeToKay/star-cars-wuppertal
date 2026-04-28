import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const STORE_ADDRESS = 'Ronsdorfer Str. 57, 42119 Wuppertal';
const STORE_PHONE = '01726871641';
const STORE_EMAIL = 'info@starcarswuppertal.com';
const STORE_HOURS = 'Mo–Sa 10:00–20:00 Uhr';

type NotificationType = 'ready' | 'cancelled';

function buildEmail(type: NotificationType, booking: any): { subject: string; body: string } {
  const name = booking.user_name || 'Kunde';

  if (type === 'ready') {
    return {
      subject: '🚗 Ihr Auto ist abholbereit!',
      body: `Hallo ${name},

Ihr Fahrzeug ist fertig und steht bei Star Cars Wuppertal zur Abholung bereit.

═══════════════════════════════
  ABHOLUNG
═══════════════════════════════
📍 Star Cars Wuppertal
   ${STORE_ADDRESS}
   (an der StarTankstelle)

📞 ${STORE_PHONE}
✉️  ${STORE_EMAIL}
🕐 ${STORE_HOURS}

═══════════════════════════════
  ZAHLUNG
═══════════════════════════════
Service:  ${booking.service_name}
Preis:    €${Number(booking.service_price).toFixed(2)}

Die Zahlung erfolgt vor Ort – bar oder per EC-/Kreditkarte.

Wir freuen uns auf Sie!

Mit freundlichen Grüßen
Kilic Savas
Star Cars Wuppertal`,
    };
  }

  // cancelled
  return {
    subject: 'Stornierung Ihrer Reservierung – Star Cars Wuppertal',
    body: `Hallo ${name},

Ihre Reservierung bei Star Cars Wuppertal wurde storniert.

═══════════════════════════════
  STORNIERTE RESERVIERUNG
═══════════════════════════════
Service:  ${booking.service_name}
Datum:    ${booking.appointment_date}
Uhrzeit:  ${booking.appointment_time} Uhr

Eine Stornierung ist und bleibt für Sie kostenlos. Es entstehen keinerlei Gebühren.

Sie möchten einen neuen Termin? Buchen Sie jederzeit auf https://starcarswuppertal.com oder kontaktieren Sie uns:

📞 ${STORE_PHONE}
✉️  ${STORE_EMAIL}

Mit freundlichen Grüßen
Kilic Savas
Star Cars Wuppertal`,
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const type: NotificationType = body.type;
    const bookingId: string | undefined = body.booking_id || body.event?.entity_id;

    if (!type || !['ready', 'cancelled'].includes(type)) {
      return Response.json({ success: false, error: 'Ungültiger Notification-Typ.' }, { status: 400 });
    }
    if (!bookingId) {
      return Response.json({ success: false, error: 'booking_id fehlt.' }, { status: 400 });
    }

    const booking = body.data || await base44.asServiceRole.entities.Booking.get(bookingId);
    if (!booking || !booking.user_email) {
      console.log('Booking or email not found:', bookingId);
      return Response.json({ success: false, error: 'Buchung oder E-Mail nicht gefunden.' }, { status: 404 });
    }

    const { subject, body: emailBody } = buildEmail(type, booking);

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: booking.user_email,
      from_name: 'Star Cars Wuppertal',
      subject,
      body: emailBody,
    });

    console.log(`Notification (${type}) sent to ${booking.user_email}`);
    return Response.json({ success: true });
  } catch (error) {
    console.error('sendNotification error:', (error as Error).message);
    return Response.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
});
