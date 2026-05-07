import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const OPEN_HOUR = 10;
const CLOSE_HOUR = 20;
const MAX_BAYS = 3;

const STORE_ADDRESS = 'Ronsdorfer Str. 57, 42119 Wuppertal';
const STORE_PHONE = '01726871641';
const STORE_EMAIL = 'info@starcarswuppertal.com';
const STORE_HOURS = 'Mo–Sa 10:00–20:00 Uhr';

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function isValidSlot(time, durationMinutes) {
  const startMin = timeToMinutes(time);
  const endMin = startMin + durationMinutes;
  return startMin >= OPEN_HOUR * 60 && endMin <= CLOSE_HOUR * 60;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  return /^[\d\s\+\-\(\)]{7,20}$/.test(phone.trim());
}

function isValidDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

function isValidTime(timeStr) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(timeStr);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      service_id,
      appointment_date, appointment_time,
      phone_number, user_id, user_email, user_name,
      license_plate, agb_accepted,
    } = body;

    // Validation
    if (!service_id) {
      return Response.json({ success: false, error: 'Service-Informationen unvollständig.' }, { status: 400 });
    }
    if (!appointment_date || !isValidDate(appointment_date)) {
      return Response.json({ success: false, error: 'Bitte ein gültiges Datum wählen.' }, { status: 400 });
    }
    if (!appointment_time || !isValidTime(appointment_time)) {
      return Response.json({ success: false, error: 'Bitte eine gültige Uhrzeit wählen.' }, { status: 400 });
    }
    if (!user_email || !isValidEmail(user_email)) {
      return Response.json({ success: false, error: 'Bitte eine gültige E-Mail-Adresse angeben.' }, { status: 400 });
    }
    if (!user_name || !user_name.trim()) {
      return Response.json({ success: false, error: 'Bitte einen Namen angeben.' }, { status: 400 });
    }
    if (!phone_number || !isValidPhone(phone_number)) {
      return Response.json({ success: false, error: 'Bitte eine gültige Telefonnummer angeben.' }, { status: 400 });
    }
    if (!agb_accepted) {
      return Response.json({ success: false, error: 'Bitte AGB und Datenschutzerklärung akzeptieren.' }, { status: 400 });
    }

    // Validate day of week (Sunday = 0)
    const dayOfWeek = new Date(appointment_date + 'T12:00:00').getDay();
    if (dayOfWeek === 0) {
      return Response.json({ success: false, error: 'Sonntags sind wir geschlossen.' }, { status: 400 });
    }

    // Load service from DB
    let service = null;
    try {
      service = await base44.asServiceRole.entities.Service.get(service_id);
    } catch (_) { /* not found */ }
    if (!service || service.is_active === false) {
      return Response.json({ success: false, error: 'Service nicht verfügbar.' }, { status: 400 });
    }
    const canonicalName = String(service.name);
    const canonicalPrice = Number(service.price_eur) || 0;
    const duration = Number(service.duration_minutes) || 60;

    if (!isValidSlot(appointment_time, duration)) {
      return Response.json({ success: false, error: 'Der Service endet nach 20:00 Uhr. Bitte einen früheren Starttermin wählen.' }, { status: 400 });
    }

    // Capacity check
    let maxBays = MAX_BAYS;
    try {
      const settings = await base44.asServiceRole.entities.Settings.filter({ key: 'max_bays' });
      if (settings.length > 0) maxBays = parseInt(settings[0].value) || MAX_BAYS;
    } catch (_) { /* fallback */ }

    const sameDayBookings = await base44.asServiceRole.entities.Booking.filter({ appointment_date });
    const activeBookings = sameDayBookings.filter(b => b.status !== 'Cancelled' && b.status !== 'No-Show');

    let durById = {};
    try {
      const services = await base44.asServiceRole.entities.Service.list();
      durById = Object.fromEntries(services.map(s => [s.id, Number(s.duration_minutes) || 60]));
    } catch (_) { /* fallback */ }

    const newStart = timeToMinutes(appointment_time);
    const newEnd = newStart + duration;
    const overlapping = activeBookings.filter(b => {
      if (!b.appointment_time) return false;
      const bStart = timeToMinutes(b.appointment_time);
      const bDur = Number(b.service_duration_minutes) || durById[b.service_id] || 60;
      const bEnd = bStart + bDur;
      return newStart < bEnd && newEnd > bStart;
    });

    if (overlapping.length >= maxBays) {
      return Response.json({ success: false, error: 'Dieser Zeitslot ist ausgebucht. Bitte wählen Sie eine andere Uhrzeit.' }, { status: 409 });
    }

    // Create booking
    const booking = await base44.asServiceRole.entities.Booking.create({
      user_id: user_id || null,
      user_email: String(user_email).trim(),
      user_name: String(user_name).trim(),
      service_id,
      service_name: canonicalName,
      service_price: canonicalPrice,
      service_duration_minutes: duration,
      appointment_date,
      appointment_time,
      phone_number: String(phone_number).trim(),
      license_plate: license_plate ? String(license_plate).trim().toUpperCase() : '',
      agb_accepted: true,
      status: 'Confirmed',
      payment_status: 'Unpaid',
    });

    // Send confirmation email
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: booking.user_email,
        from_name: 'Star Cars Wuppertal',
        subject: `Reservierung bestätigt – ${booking.service_name} am ${booking.appointment_date}`,
        body: `Hallo ${booking.user_name || 'Kunde'},

Ihre Reservierung bei Star Cars Wuppertal ist bestätigt.

═══════════════════════════════
  RESERVIERUNGSDETAILS
═══════════════════════════════
Service:      ${booking.service_name}
Datum:        ${booking.appointment_date}
Uhrzeit:      ${booking.appointment_time} Uhr
Dauer:        ${duration} Min.
Preis:        €${Number(booking.service_price).toFixed(2)}
${booking.license_plate ? `Kennzeichen:  ${booking.license_plate}\n` : ''}
═══════════════════════════════
  ZAHLUNG
═══════════════════════════════
Die Zahlung erfolgt vor Ort bei Abholung – bar oder per EC-/Kreditkarte. Keine Vorkasse erforderlich.

═══════════════════════════════
  IHR TERMIN
═══════════════════════════════
📍 Star Cars Wuppertal
   ${STORE_ADDRESS}
   (an der StarTankstelle)

📞 ${STORE_PHONE}
✉️  ${STORE_EMAIL}
🕐 ${STORE_HOURS}

═══════════════════════════════
  STORNIERUNG
═══════════════════════════════
Eine Stornierung ist jederzeit kostenlos möglich – bitte
per E-Mail an ${STORE_EMAIL} oder telefonisch unter ${STORE_PHONE}.

Wir freuen uns auf Ihren Besuch!

Mit freundlichen Grüßen
Kilic Savas
Star Cars Wuppertal`,
      });
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError.message);
    }

    console.log(`Booking created: ${booking.id} for ${booking.user_email}`);
    return Response.json({ success: true, booking_id: booking.id });
  } catch (error) {
    console.error('createBooking error:', error.message);
    return Response.json({ success: false, error: 'Buchung konnte nicht erstellt werden. Bitte später erneut versuchen.' }, { status: 500 });
  }
});