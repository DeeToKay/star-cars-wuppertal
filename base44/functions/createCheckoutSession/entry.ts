import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const body = await req.json();
    const {
      service_id, service_name, service_price,
      appointment_date, appointment_time,
      phone_number, user_id, user_email, user_name
    } = body;

    if (!service_id || !appointment_date || !appointment_time) {
      return Response.json({ error: 'Fehlende Pflichtfelder' }, { status: 400 });
    }

    // Check for existing bookings at the same time slot
    const existingBookings = await base44.asServiceRole.entities.Booking.filter({
      appointment_date,
      appointment_time,
    });
    if (existingBookings.length > 0) {
      return Response.json({ error: 'Dieser Zeitslot ist bereits belegt. Bitte wählen Sie einen anderen.' }, { status: 409 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const appUrl = req.headers.get('origin') || 'https://app.base44.com';

    // Create a pending booking first
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
            name: service_name,
            description: `Termin: ${appointment_date} um ${appointment_time} Uhr`,
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${appUrl}/booking-success`,
      cancel_url: `${appUrl}/booking`,
      customer_email: user_email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        booking_id: booking.id,
        user_id,
      },
    });

    // Update booking with stripe session id
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