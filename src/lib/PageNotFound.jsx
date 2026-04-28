import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="font-mono font-black text-[8rem] leading-none text-[#E30613]/20 mb-4">404</div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#E30613]" />
          <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Seite nicht gefunden</span>
          <div className="w-8 h-px bg-[#E30613]" />
        </div>
        <h1 className="text-3xl font-black mb-4">Diese Seite existiert nicht.</h1>
        <p className="text-[#C9C9D1] mb-8 leading-relaxed">
          Die angeforderte Seite konnte nicht gefunden werden. Bitte überprüfen Sie die URL oder kehren Sie zur Startseite zurück.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-[#E30613] text-white font-bold px-8 py-3 hover:bg-[#c0000f] transition-colors">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}