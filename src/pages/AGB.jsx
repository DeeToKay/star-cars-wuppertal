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
        <p className="text-[#C9C9D1] mb-10 text-sm">Stand: April 2026</p>

        <div className="text-[#C9C9D1] space-y-8 leading-relaxed text-sm">
          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 1 Geltungsbereich</h2>
            <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen Kilic Savas (Einzelunternehmen), Star Cars, Ronsdorfer Str. 57, 42119 Wuppertal (nachfolgend „Anbieter") und dem Kunden (nachfolgend „Auftraggeber") über die Erbringung von Fahrzeugaufbereitungs- und Smart-Repair-Dienstleistungen.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 2 Vertragsschluss & Buchung</h2>
            <p>Die Buchung erfolgt online über die Website. Mit Auswahl des Services, des Termins und Absenden des Buchungsformulars gibt der Auftraggeber eine Reservierungsanfrage ab. Der Vertrag kommt mit der Buchungsbestätigung per E-Mail zustande. Eine Vorkasse oder Reservierungsgebühr wird nicht erhoben.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 3 Zahlung</h2>
            <p>Die Zahlung erfolgt ausschließlich vor Ort bei Abholung des Fahrzeugs – wahlweise bar oder per EC-/Kreditkarte. Es wird keine Vorkasse erhoben. Alle Preise sind Endpreise in Euro (€) inkl. gesetzlicher Mehrwertsteuer (soweit anwendbar).</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 4 Stornierung</h2>
            <p>Stornierungen sind <strong className="text-white">jederzeit kostenfrei</strong> möglich. Es entstehen weder Stornogebühren noch sonstige Kosten – auch nicht bei kurzfristiger Absage oder Nichterscheinen.</p>
            <p className="mt-3">Eine Stornierung kann per E-Mail an <a href="mailto:info@starcarswuppertal.com" className="text-[#E30613]">info@starcarswuppertal.com</a> oder telefonisch unter <a href="tel:01726871641" className="text-[#E30613]">01726871641</a> erfolgen. Der Anbieter bittet im Sinne einer fairen Terminplanung um eine möglichst rechtzeitige Mitteilung, damit der Termin neu vergeben werden kann.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 5 Kein Widerrufsrecht nach Leistungsbeginn</h2>
            <p>Bei individuell vereinbarten Dienstleistungsterminen erlischt das gesetzliche Widerrufsrecht gemäß § 356 Abs. 4 BGB, sobald die Dienstleistung mit ausdrücklicher Zustimmung des Auftraggebers vor Ablauf der Widerrufsfrist vollständig erbracht wurde. Der Auftraggeber stimmt durch Abschluss der Buchung ausdrücklich zu, dass mit der Erbringung der Dienstleistung am gebuchten Termin begonnen werden darf.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">§ 6 Pflichten des Auftraggebers</h2>
            <p>Der Auftraggeber ist verpflichtet, das Fahrzeug zum vereinbarten Termin an der Betriebsstätte (Ronsdorfer Str. 57, 42119 Wuppertal, an der StarTankstelle) zu übergeben. Fahrzeuge sollen zugänglich und frei von gefährlichen Materialien sein.</p>
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
