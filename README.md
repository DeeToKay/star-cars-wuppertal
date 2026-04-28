# Star Cars Wuppertal

Online-Buchungssystem für **Star Cars Wuppertal** – Premium Autoaufbereitung
& Smart Repair an der Ronsdorfer Str. 57, 42119 Wuppertal.

Single-Page-React-App auf [Base44](https://base44.com) (Backend-as-a-Service):
Kunden buchen einen Service + Termin online, Inhaber verwaltet alle Buchungen
über ein Admin-Dashboard. **Zahlung erfolgt vor Ort**, keine Online-Zahlung,
keine Reservierungs- oder Stornogebühren.

---

## Tech-Stack

| Bereich        | Wahl                                                                    |
|----------------|-------------------------------------------------------------------------|
| Frontend       | React 18 · Vite 6 · React Router 6 · Tailwind 3 · Radix UI · Framer Motion |
| Validierung    | Zod (Schema in `src/lib/booking-schema.js`)                             |
| Backend        | Base44 SDK (`@base44/sdk`) – Auth, Entities, Functions, E-Mail          |
| Functions      | Deno (TypeScript) in `base44/functions/`                                |
| State          | React Context (Auth) + lokaler State                                    |

---

## Projektstruktur

```
src/
  api/base44Client.js     Base44-SDK-Instanz (liest appId/token aus app-params)
  components/             Geteilte UI-Komponenten (Navbar, Footer, ErrorBoundary, …)
    admin/                Nur fürs Admin-Dashboard (Filters, BookingTable)
    ui/                   shadcn/ui-Primitives (Button, Dialog, Toast, …)
  hooks/                  Custom Hooks (z.B. use-mobile)
  lib/                    AuthContext, app-params, booking-schema, query-client
  pages/                  Routen (Landing, BookingFlow, Admin*, Customer*, Legal-Seiten)
  App.jsx                 Router + AuthProvider + ErrorBoundary + lazy routes
  main.jsx                Einstiegspunkt

base44/
  entities/               JSON-Schemas der Base44-Entities (Booking, Service, …)
  functions/              Deno-Serverless-Functions
    createBooking/        Erstellt Buchung + sendet Bestätigungs-E-Mail
    sendNotification/     Versendet "abholbereit" / "storniert"-E-Mails
    sendReadyEmail/       Legacy: nur "abholbereit" (Entity-Automation-Hook)

public/                   Statische Assets (favicon.svg, og-image.svg, robots.txt, sitemap.xml)
index.html                HTML-Template inkl. SEO-Meta-Tags + LocalBusiness JSON-LD
```

---

## Lokale Entwicklung

**Voraussetzungen:** Node.js ≥ 18, npm.

```bash
git clone <repo-url>
cd star-cars-wuppertal
npm install
cp .env.example .env.local        # dann Werte eintragen (siehe unten)
npm run dev                       # http://localhost:5173
```

### Verfügbare Scripts

| Script              | Zweck                                       |
|---------------------|---------------------------------------------|
| `npm run dev`       | Vite-Dev-Server mit HMR                     |
| `npm run build`     | Produktions-Build nach `dist/`              |
| `npm run preview`   | Preview des Produktions-Builds              |
| `npm run lint`      | ESLint (nur Errors)                         |
| `npm run lint:fix`  | ESLint mit Autofix                          |
| `npm run typecheck` | TypeScript-Check via `jsconfig.json`        |

---

## Environment-Variablen

Alle erwarteten Variablen siehe [`.env.example`](./.env.example). Kurzfassung:

| Variable                          | Erforderlich | Beschreibung                                            |
|-----------------------------------|:---:|---------------------------------------------------------|
| `VITE_BASE44_APP_ID`              | ✅ | Base44 App-ID (gehört zur konkreten Base44-App)          |
| `VITE_BASE44_APP_BASE_URL`        | ✅ | Backend-URL der Base44-App (`https://*.base44.app`)      |
| `VITE_BASE44_FUNCTIONS_VERSION`   | ❌ | Default `v1`. Setzen, falls Functions versioniert sind. |

Im Browser ist der Auth-Token nach erstem Login im `localStorage`.

---

## Buchungsablauf (End-to-End)

1. Kunde wählt Service auf `/`, klickt "Jetzt buchen" → `/booking`
2. `BookingFlow` lädt verfügbare `Service`-Entities + Slot-Auslastung des
   gewählten Tages aus Base44.
3. Bei Submit: `validateContact()` (`booking-schema.js`) prüft die
   Eingaben, dann ruft das Frontend `base44.functions.invoke("createBooking")`.
4. `createBooking/entry.ts` validiert serverseitig, prüft Öffnungszeiten +
   freie Bays, erstellt die Buchung als `Confirmed/Unpaid` und versendet
   eine Bestätigungs-E-Mail über `base44.integrations.Core.SendEmail`.
5. Kunde wird zu `/booking-success` geleitet.
6. Im Admin-Dashboard kann der Inhaber den Status auf
   `Ready for Pickup` setzen → Frontend ruft
   `sendNotification` auf → "Auto abholbereit"-Mail.
7. Bei `Cancelled` wird ebenfalls `sendNotification` aufgerufen → kostenfreie
   Stornobestätigung per Mail.

Bezahlung passiert ausschließlich vor Ort (Bar/EC).

---

## Deployment

Das Repository ist mit Base44 verknüpft. Änderungen auf `main` werden in
Base44 sichtbar; Veröffentlichung läuft über **Publish** im Base44-Builder.
Das gilt sowohl für Frontend-Build als auch für die Deno-Functions in
`base44/functions/`.

---

## Rechtliches

- Impressum, Datenschutz und AGB liegen unter `/impressum`, `/datenschutz`,
  `/agb` und werden von `src/pages/*.jsx` gerendert.
- **Wichtig:** Im Impressum steht aktuell `[PLATZHALTER – wird nachgetragen]`
  als Steuernummer. Vor Auslieferung an den Kunden hier den korrekten
  Wert eintragen.

---

## Support

Base44-Doku: <https://docs.base44.com/Integrations/Using-GitHub>
