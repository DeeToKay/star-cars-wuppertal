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
        <h1 className="text-4xl font-black mb-8">Datenschutzerklärung</h1>
        <div className="text-[#A1A1AA] space-y-6 leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-2">1. Datenschutz auf einen Blick</h2>
            <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">2. Erhobene Daten</h2>
            <p>Wir erheben folgende personenbezogene Daten: Name, E-Mail-Adresse, Telefonnummer sowie Buchungsdaten (Datum, Uhrzeit, gebuchter Service).</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">3. Zweck der Datenverarbeitung</h2>
            <p>Ihre Daten werden ausschließlich zur Abwicklung von Buchungen und zur Kommunikation bezüglich Ihrer Termine verwendet.</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">4. Zahlungsabwicklung</h2>
            <p>Zahlungen werden über Stripe abgewickelt. Wir speichern keine Kreditkartendaten. Es gelten die Datenschutzbestimmungen von Stripe (stripe.com/privacy).</p>
          </section>
          <section>
            <h2 className="text-white font-bold text-lg mb-2">5. Ihre Rechte</h2>
            <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Kontakt: info@starcars-wuppertal.de</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}