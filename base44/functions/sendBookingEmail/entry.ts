import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const STORE_NAME = 'Star Cars Wuppertal';
const STORE_ADDRESS = 'Ronsdorfer Str. 57, 42119 Wuppertal';
const STORE_PHONE = '01726871641';
const STORE_EMAIL = 'info@starcarswuppertal.com';
const STORE_HOURS = 'Mo–Sa 10:00–20:00 Uhr';

function encodeBase64Url(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function buildMimeEmail({ to, subject, htmlBody, fromName }) {
  const encodedSubject = `=?UTF-8?B?${encodeBase64Url(subject)}?=`;
  const boundary = 'boundary_starcars_001';
  const raw = [
    `From: ${fromName} <${STORE_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    encodeBase64Url(htmlBody),
    ``,
    `--${boundary}--`,
  ].join('\r\n');

  return encodeBase64Url(raw);
}

function htmlTemplate(title, accentLine, rows, extraHtml = '') {
  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td style="padding:8px 12px;color:#999999;font-size:13px;font-family:Arial,sans-serif;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 12px;color:#ffffff;font-size:13px;font-family:Arial,sans-serif;font-weight:600;vertical-align:top;">${value}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#161616;border:1px solid #2a2a2a;border-top:3px solid #E30613;">
        <!-- Header -->
        <tr>
          <td style="padding:32px 36px 20px;border-bottom:1px solid #2a2a2a;">
            <p style="margin:0;font-size:11px;letter-spacing:3px;color:#E30613;font-family:Arial,sans-serif;text-transform:uppercase;font-weight:700;">Star Cars Wuppertal</p>
            <h1 style="margin:10px 0 0;font-size:22px;color:#ffffff;font-family:Arial,sans-serif;font-weight:700;line-height:1.3;">${title}</h1>
            <p style="margin:6px 0 0;font-size:13px;color:#888888;font-family:Arial,sans-serif;">${accentLine}</p>
          </td>
        </tr>
        <!-- Details Table -->
        <tr>
          <td style="padding:28px 36px 8px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e1e1e;border:1px solid #2a2a2a;">
              ${rowsHtml}
            </table>
          </td>
        </tr>
        ${extraHtml}
        <!-- Contact -->
        <tr>
          <td style="padding:24px 36px;border-top:1px solid #2a2a2a;margin-top:8px;">
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;color:#E30613;text-transform:uppercase;font-weight:700;font-family:Arial,sans-serif;">Kontakt &amp; Standort</p>
            <table cellpadding="0" cellspacing="0">
              <tr><td style="padding:3px 0;font-size:12px;color:#999999;font-family:Arial,sans-serif;">&#128205; ${STORE_ADDRESS} (an der StarTankstelle)</td></tr>
              <tr><td style="padding:3px 0;font-size:12px;color:#999999;font-family:Arial,sans-serif;">&#128222; ${STORE_PHONE}</td></tr>
              <tr><td style="padding:3px 0;font-size:12px;color:#999999;font-family:Arial,sans-serif;">&#9993; ${STORE_EMAIL}</td></tr>
              <tr><td style="padding:3px 0;font-size:12px;color:#999999;font-family:Arial,sans-serif;">&#128336; ${STORE_HOURS}</td></tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 36px;background-color:#111111;border-top:1px solid #2a2a2a;">
            <p style="margin:0;font-size:11px;color:#555555;font-family:Arial,sans-serif;">&#169; ${new Date().getFullYear()} Star Cars Wuppertal &mdash; Kilic Savas</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function getEmailContent(booking, eventType) {
  const name = booking.user_name || 'Kunde';
  const date = booking.appointment_date ? new Date(booking.appointment_date + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : '';
  const time = booking.appointment_time;
  const service = booking.service_name;
  const price = `${Number(booking.service_price || 0).toFixed(2)} &euro;`;
  const plate = booking.license_plate ? booking.license_plate : null;

  const baseRows = [
    ['Service', service],
    ['Datum', date],
    ['Uhrzeit', `${time} Uhr`],
    ['Preis', price],
    ...(plate ? [['Kennzeichen', plate]] : []),
  ];

  if (eventType === 'confirmed') {
    const paymentNote = `<tr><td style="padding:20px 36px 0;">
      <div style="background-color:#1a1a1a;border-left:3px solid #E30613;padding:14px 16px;">
        <p style="margin:0;font-size:12px;color:#cccccc;font-family:Arial,sans-serif;line-height:1.6;">
          <strong style="color:#ffffff;">Zahlung vor Ort</strong> &mdash; Bar oder per EC-/Kreditkarte bei Abholung. Keine Vorkasse erforderlich.<br>
          <strong style="color:#ffffff;">Stornierung</strong> &mdash; Jederzeit kostenlos per E-Mail oder Telefon m&ouml;glich.
        </p>
      </div>
    </td></tr>`;
    return {
      subject: `Buchungsbestaetigung – ${service} am ${booking.appointment_date}`,
      htmlBody: htmlTemplate(
        `Buchungsbest&auml;tigung`,
        `Hallo ${name}, vielen Dank f&uuml;r Ihre Buchung!`,
        baseRows,
        paymentNote
      ),
    };
  }

  if (eventType === 'ready') {
    const readyNote = `<tr><td style="padding:20px 36px 0;">
      <div style="background-color:#1a1a1a;border-left:3px solid #22c55e;padding:14px 16px;">
        <p style="margin:0;font-size:12px;color:#cccccc;font-family:Arial,sans-serif;line-height:1.6;">
          Ihr Fahrzeug ist fertig aufbereitet. Bitte holen Sie es zu unseren &Ouml;ffnungszeiten ab.<br>
          <strong style="color:#ffffff;">Zahlung bei Abholung</strong> &mdash; Bar oder per EC-/Kreditkarte.
        </p>
      </div>
    </td></tr>`;
    return {
      subject: `Ihr Fahrzeug ist abholbereit! – ${service}`,
      htmlBody: htmlTemplate(
        '&#10003; Ihr Fahrzeug ist abholbereit!',
        `Hallo ${name}, Ihre Aufbereitung ist abgeschlossen.`,
        baseRows,
        readyNote
      ),
    };
  }

  if (eventType === 'cancelled') {
    const cancelNote = `<tr><td style="padding:20px 36px 0;">
      <div style="background-color:#1a1a1a;border-left:3px solid #ef4444;padding:14px 16px;">
        <p style="margin:0;font-size:12px;color:#cccccc;font-family:Arial,sans-serif;line-height:1.6;">
          Sie k&ouml;nnen jederzeit einen neuen Termin online buchen:<br>
          <a href="https://starcarswuppertal.com/booking" style="color:#E30613;font-weight:700;">starcarswuppertal.com/booking</a>
        </p>
      </div>
    </td></tr>`;
    return {
      subject: `Buchung storniert – ${service} am ${booking.appointment_date}`,
      htmlBody: htmlTemplate(
        'Buchung storniert',
        `Hallo ${name}, Ihre Buchung wurde storniert.`,
        baseRows,
        cancelNote
      ),
    };
  }

  if (eventType === 'in_progress') {
    return {
      subject: `Aufbereitung gestartet – ${service}`,
      htmlBody: htmlTemplate(
        '&#128295; Aufbereitung hat begonnen',
        `Hallo ${name}, wir haben mit der Aufbereitung Ihres Fahrzeugs begonnen.`,
        baseRows
      ),
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
      htmlBody: emailContent.htmlBody,
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