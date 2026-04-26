import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

// Opening hours: Mo-Sa 10:00-20:00, closed Sunday
const OPEN_HOUR = 10;
const CLOSE_HOUR = 20;
const MAX_BAYS = 3;

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isValidSlot(time, durationMinutes, closingHour = CLOSE_HOUR) {
  const startMin = timeToMinutes(time);
  const endMin = startMin + durationMinutes;
  const closeMin = closingHour * 60;
  const openMin = OPEN_HOUR * 60;
  return startMin >= openMin && endMin <= closeMin;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const body = await req.json();
    const {
      service_id, service_name, service_price, service_duration,
      appointment_date, appointment_time,
      phone_number, user_id, user_email, user_name
    } = body;

    if (!service_id || !appointment_date || !appointment_time) {
      return Response.json({ error: 'Fehlende Pflichtfelder' }, { status: 400 });
    }

    // Validate day of week (Sunday = 0)
    const dayOfWeek = new Date(appointment_date + "T12:00:00").getDay();
    if (dayOfWeek === 0) {
      return Response.json({ error: 'Sonntags sind wir geschlossen.' }, { status: 400 });
    }

    // Validate slot fits before closing time
    const duration = service_duration || 60;
    if (!isValidSlot(appointment_time, duration)) {
      return Response.json({ error: `Der Service endet nach 20:00 Uhr. Bitte einen früheren Starttermin wählen.` }, { status: 400 });
    }

    // Check settings for max bays (with fallback)
    let maxBays = MAX_BAYS;
    try {
      const settings = await base44.asServiceRole.entities.Settings.filter({ key: "max_bays" });
      if (settings.length > 0) maxBays = parseInt(settings[0].value) || MAX_BAYS;
    } catch (_) {}

    // Count confirmed bookings in this time slot (conflict check: overlapping bays)
    const existingBookings = await base44.asServiceRole.entities.Booking.filter({
      appointment_date,
      appointment_time,
    });
    // Only count active bookings (not cancelled/unpaid ghost bookings older than 30min)
    const activeBookings = existingBookings.filter(b =>
      b.payment_status === "Paid" || b.status === "Confirmed" ||
      (b.status === "Pending" && b.payment_status === "Unpaid" &&
       new Date() - new Date(b.created_date) < 30 * 60 * 1000)
    );

    if (activeBookings.length >= maxBays) {
      return Response.json({ error: 'Dieser Zeitslot ist ausgebucht. Bitte wählen Sie eine andere Uhrzeit.' }, { status: 409 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const appUrl = req.headers.get('origin') || 'https://starcarswuppertal.com';

    // Create pending booking first
    const booking = await base44.asServiceRole.entities.Booking.create({
      user_id,
      user_email,
      user_name,
      service_id,
      service_name,
      service_price: Number(service_price),
      appointment_date,
      appointment_time,
      phone_number,
      status: 'Pending',
      payment_status: 'Unpaid',
    });

    const priceInCents = Math.round(Number(service_price) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Star Cars Wuppertal – ${service_name}`,
            description: `Termin: ${appointment_date} um ${appointment_time} Uhr | Dauer: ${duration} Min.`,
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${appUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/booking`,
      customer_email: user_email,
      locale: 'de',
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        booking_id: booking.id,
        user_id,
      },
    });

    await base44.asServiceRole.entities.Booking.update(booking.id, {
      stripe_payment_id: session.id,
    });

    console.log(`Checkout session created: ${session.id} for booking: ${booking.id}`);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});