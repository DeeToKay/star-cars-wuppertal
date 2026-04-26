import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event;
    if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    console.log(`Stripe event: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;

      if (bookingId) {
        const base44 = createClientFromRequest(req);
        await base44.asServiceRole.entities.Booking.update(bookingId, {
          payment_status: 'Paid',
          status: 'Confirmed',
          stripe_payment_id: session.payment_intent || session.id,
        });

        // Fetch booking for confirmation email
        const booking = await base44.asServiceRole.entities.Booking.get(bookingId);
        if (booking && booking.user_email) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: booking.user_email,
            from_name: 'Star Cars Wuppertal',
            subject: `✅ Buchungsbestätigung – ${booking.service_name} am ${booking.appointment_date}`,
            body: `Hallo ${booking.user_name || 'Kunde'},

Ihre Buchung bei Star Cars Wuppertal ist bestätigt! 🎉

═══════════════════════════════
  BUCHUNGSDETAILS
═══════════════════════════════
Service:  ${booking.service_name}
Datum:    ${booking.appointment_date}
Uhrzeit:  ${booking.appointment_time} Uhr
Preis:    €${Number(booking.service_price).toFixed(2)} (vollständig bezahlt)

═══════════════════════════════
  IHR TERMIN
═══════════════════════════════
📍 Star Cars Wuppertal
   Ronsdorferstr. 57, 42283 Wuppertal
   (an der StarTankstelle)

📞 01726871641
✉️ info@starcarswuppertal.com
🕐 Mo–Sa 10:00–20:00 Uhr

═══════════════════════════════
  STORNOREGELN
═══════════════════════════════
• 14+ Tage vor Termin: 100% Erstattung
• 7–13 Tage vor Termin: 50% Erstattung
• < 7 Tage / No-Show: keine Erstattung

Stornierungen nur per E-Mail: info@starcarswuppertal.com
AGB: https://starcarswuppertal.com/agb

Wir freuen uns auf Ihren Besuch!

Mit freundlichen Grüßen,
Kilic Savas
Star Cars Wuppertal`,
          });
          console.log(`Confirmation email sent to ${booking.user_email}`);
        }

        console.log(`Booking ${bookingId} marked as Paid & Confirmed`);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 400 });
  }
});