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
        <div className="prose prose-invert prose-sm max-w-none text-[#A1A1AA] space-y-4 leading-relaxed">
          <p className="text-white font-bold">Star Cars Wuppertal</p>
          <p>Ronsdorferstr 57<br />42349 Wuppertal<br />Deutschland</p>
          <p>Tel: +49 202 000 0000<br />E-Mail: info@starcars-wuppertal.de</p>
          <p className="font-bold text-white mt-6">Verantwortlich für den Inhalt gemäß § 55 Abs. 2 RStV:</p>
          <p>Star Cars Wuppertal<br />Ronsdorferstr 57, 42349 Wuppertal</p>
          <p className="text-xs mt-8">Haftungshinweis: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}