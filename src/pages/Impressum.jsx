import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />
      <div className="pt-20 max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-px bg-[#E30613]" />
          <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Rechtliches</span>
        </div>
        <h1 className="text-4xl font-black mb-8">Impressum</h1>
        <div className="text-[#A1A1AA] space-y-5 leading-relaxed text-sm">
          <div>
            <p className="text-white font-bold text-base">Kilic Savas (Einzelunternehmen)</p>
            <p className="text-white font-semibold">Star Cars</p>
          </div>
          <div>
            <p>Ronsdorferstr. 57</p>
            <p>42283 Wuppertal</p>
            <p className="text-[#A1A1AA] text-xs">(an der StarTankstelle)</p>
          </div>
          <div>
            <p>Telefon: <a href="tel:01726871641" className="text-[#E30613]">01726871641</a></p>
            <p>E-Mail: <a href="mailto:info@starcarswuppertal.com" className="text-[#E30613]">info@starcarswuppertal.com</a></p>
          </div>
          <div>
            <p className="text-white font-bold">Steuernummer:</p>
            <p>[PLATZHALTER – wird nachgetragen]</p>
          </div>
          <div className="pt-4 border-t border-white/10">
            <p className="text-white font-bold mb-2">EU-Streitbeilegung</p>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[#E30613] underline">
                https://ec.europa.eu/consumers/odr/
              </a>.
            </p>
            <p className="mt-2">Wir sind nicht zur Teilnahme an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle verpflichtet, sind jedoch grundsätzlich bereit dazu.</p>
          </div>
          <div className="pt-4 border-t border-white/10">
            <p className="text-white font-bold mb-2">Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV:</p>
            <p>Kilic Savas, Ronsdorferstr. 57, 42283 Wuppertal</p>
          </div>
          <div className="pt-4 border-t border-white/10 text-xs">
            <p>Haftungshinweis: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}