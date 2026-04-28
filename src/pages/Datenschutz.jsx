import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />
      <div className="pt-20 max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-px bg-[#E30613]" />
          <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Rechtliches</span>
        </div>
        <h1 className="text-4xl font-black mb-2">Datenschutzerklärung</h1>
        <p className="text-[#A1A1AA] mb-10 text-sm">Stand: April 2026 · DSGVO-konform</p>

        <div className="text-[#A1A1AA] space-y-8 leading-relaxed text-sm">
          <section>
            <h2 className="text-white font-bold text-base mb-3">1. Verantwortlicher</h2>
            <p>Kilic Savas (Einzelunternehmen), Star Cars, Ronsdorfer Str. 57, 42119 Wuppertal<br />
            E-Mail: <a href="mailto:info@starcarswuppertal.com" className="text-[#E30613]">info@starcarswuppertal.com</a><br />
            Tel: 01726871641</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">2. Erhobene Daten & Zweck</h2>
            <p>Wir verarbeiten folgende personenbezogene Daten:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong className="text-white">Name, E-Mail, Telefonnummer</strong> – zur Buchungsabwicklung und Kommunikation (Art. 6 Abs. 1 lit. b DSGVO)</li>
              <li><strong className="text-white">Buchungsdaten</strong> (Datum, Uhrzeit, Service, optional Kfz-Kennzeichen) – zur Vertragserfüllung</li>
              <li><strong className="text-white">Technische Daten</strong> (IP-Adresse, Browser) – aus berechtigtem Interesse zur IT-Sicherheit (Art. 6 Abs. 1 lit. f DSGVO)</li>
            </ul>
            <p className="mt-3 text-xs">Hinweis: Es findet keine Online-Zahlungsabwicklung statt. Die Zahlung erfolgt ausschließlich vor Ort bei Abholung des Fahrzeugs. Es werden keine Kreditkarten- oder Bankdaten von uns erhoben.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">3. Hosting – Base44</h2>
            <p>Diese Website wird auf der Plattform Base44 (base44.com) gehostet. Base44 verarbeitet technische Zugriffsdaten zur Bereitstellung des Dienstes. Mit Base44 besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO. Näheres unter base44.com/privacy.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">4. Cookies</h2>
            <p><strong className="text-white">Notwendige Cookies:</strong> Session-Cookies für Authentifizierung und das Buchungsformular. Rechtsgrundlage: Art. 6 Abs. 1 lit. b + f DSGVO. Keine Einwilligung erforderlich.</p>
            <p className="mt-2"><strong className="text-white">Analytische Cookies (opt-in):</strong> Nur nach ausdrücklicher Einwilligung. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO. Einwilligung kann jederzeit widerrufen werden (Cookie-Banner).</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">5. Speicherdauer</h2>
            <p>Buchungsdaten werden für 10 Jahre gespeichert (steuerrechtliche Aufbewahrungspflichten gemäß §§ 147 AO, 257 HGB). Darüber hinausgehende Daten werden nach Wegfall des Verarbeitungszwecks gelöscht.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">6. Ihre Rechte (Art. 15–22 DSGVO)</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Recht auf Auskunft (Art. 15)</li>
              <li>Recht auf Berichtigung (Art. 16)</li>
              <li>Recht auf Löschung (Art. 17)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20)</li>
              <li>Widerspruchsrecht (Art. 21)</li>
            </ul>
            <p className="mt-3">Anfragen richten Sie an: <a href="mailto:info@starcarswuppertal.com" className="text-[#E30613]">info@starcarswuppertal.com</a></p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">8. Beschwerderecht</h2>
            <p>Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren. Für NRW: Landesbeauftragte für Datenschutz und Informationsfreiheit NRW, <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener noreferrer" className="text-[#E30613] underline">www.ldi.nrw.de</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}