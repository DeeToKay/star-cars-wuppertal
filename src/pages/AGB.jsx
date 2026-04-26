import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AGB() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />
      <div className="pt-20 max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-px bg-[#E30613]" />
          <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Rechtliches</span>
        </div>
        <h1 className="text-4xl font-black mb-2">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-[#A1A1AA] mb-10 text-sm">Stand: April 2026</p>

        <div className="text-[#A1A1AA] space-y-8 leading-relaxed text-sm">
          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 1 Geltungsbereich</h2>
            <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen Kilic Savas (Einzelunternehmen), Star Cars, Ronsdorferstr. 57, 42283 Wuppertal (nachfolgend „Anbieter") und dem Kunden (nachfolgend „Auftraggeber") über die Erbringung von Fahrzeugaufbereitungs- und Smart-Repair-Dienstleistungen.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 2 Vertragsschluss & Buchung</h2>
            <p>Die Buchung erfolgt online über die Website. Nach Auswahl des Services und Termins wird der Auftraggeber zur Zahlung via Stripe weitergeleitet. Der Vertrag kommt erst mit erfolgreicher Zahlung und Bestätigung per E-Mail zustande.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 3 Kein Widerrufsrecht nach Leistungsbeginn</h2>
            <p>Bei individuell vereinbarten Dienstleistungsterminen erlischt das gesetzliche Widerrufsrecht gemäß § 356 Abs. 4 BGB, sobald die Dienstleistung mit ausdrücklicher Zustimmung des Auftraggebers vor Ablauf der Widerrufsfrist vollständig erbracht wurde. Der Auftraggeber stimmt durch Abschluss der Buchung ausdrücklich zu, dass mit der Erbringung der Dienstleistung am gebuchten Termin begonnen werden darf.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 4 Stornierung & Rückvergütung</h2>
            <div className="space-y-2">
              <p className="font-medium text-white">Stornierungsfristen (gerechnet ab dem vereinbarten Termin):</p>
              <div className="border border-white/10 overflow-hidden mt-3">
                <div className="grid grid-cols-2 gap-0 border-b border-white/10">
                  <div className="px-4 py-3 bg-white/5 font-medium text-white text-xs uppercase tracking-wider">Stornierungszeitpunkt</div>
                  <div className="px-4 py-3 bg-white/5 font-medium text-white text-xs uppercase tracking-wider">Erstattung</div>
                </div>
                <div className="grid grid-cols-2 border-b border-white/10">
                  <div className="px-4 py-3">14 Tage oder mehr vor Termin</div>
                  <div className="px-4 py-3 text-green-400 font-bold">100 %</div>
                </div>
                <div className="grid grid-cols-2 border-b border-white/10">
                  <div className="px-4 py-3">7 bis 13 Tage vor Termin</div>
                  <div className="px-4 py-3 text-yellow-400 font-bold">50 %</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-3">Weniger als 7 Tage vor Termin / No-Show</div>
                  <div className="px-4 py-3 text-[#E30613] font-bold">0 %</div>
                </div>
              </div>
              <p className="mt-4">Stornierungen sind ausschließlich per E-Mail an <a href="mailto:info@starcarswuppertal.com" className="text-[#E30613]">info@starcarswuppertal.com</a> einzureichen. Maßgeblich ist das Eingangsdatum der E-Mail.</p>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 5 Preise & Zahlung</h2>
            <p>Alle Preise sind Endpreise in Euro (€) inkl. gesetzlicher Mehrwertsteuer (soweit anwendbar). Die Zahlung erfolgt als 100 % Vorkasse über den Zahlungsdienstleister Stripe. Eine Buchung gilt erst nach vollständigem Zahlungseingang als verbindlich bestätigt.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 6 Pflichten des Auftraggebers</h2>
            <p>Der Auftraggeber ist verpflichtet, das Fahrzeug zum vereinbarten Termin an der Betriebsstätte (Ronsdorferstr. 57, 42283 Wuppertal, an der StarTankstelle) zu übergeben. Fahrzeuge sollen zugänglich und frei von gefährlichen Materialien sein.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 7 Haftung</h2>
            <p>Der Anbieter haftet für Schäden am Fahrzeug nur bei nachgewiesenem Verschulden. Eine Haftung für Vorschäden, die nicht dokumentiert wurden, ist ausgeschlossen. Im Zweifelsfall wird der Zustand des Fahrzeugs bei Übergabe beidseitig dokumentiert.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 8 Streitbeilegung</h2>
            <p>Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[#E30613] underline">https://ec.europa.eu/consumers/odr/</a>. Wir sind bereit, an außergerichtlichen Schlichtungsverfahren teilzunehmen, sind hierzu aber nicht verpflichtet.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 9 Anwendbares Recht & Gerichtsstand</h2>
            <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Wuppertal, soweit gesetzlich zulässig.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}