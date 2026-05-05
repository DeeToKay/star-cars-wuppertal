import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = (analytics) => {
    localStorage.setItem("cookie_consent", JSON.stringify({ necessary: true, analytics }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#161618] border-t border-white/10 shadow-2xl">
      <div className="max-w-5xl mx-auto px-6 py-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <p className="text-sm text-[#C9C9D1] leading-relaxed">
            Wir verwenden Cookies. <strong className="text-white">Notwendige Cookies</strong> sind immer aktiv.{" "}
            <button onClick={() => setShowDetails(!showDetails)} className="text-[#E30613] underline text-xs">
              {showDetails ? "Weniger" : "Details anzeigen"}
            </button>
          </p>
          <button onClick={() => accept(false)} className="text-[#C9C9D1] hover:text-white shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {showDetails && (
          <div className="mb-4 text-xs text-[#C9C9D1] space-y-2 border border-white/10 p-4 bg-[#0A0A0B]">
            <div className="flex justify-between">
              <div>
                <strong className="text-white">Notwendige Cookies</strong>
                <p>Session und Authentifizierung. Können nicht deaktiviert werden.</p>
              </div>
              <span className="text-green-400 font-mono text-xs font-bold shrink-0 ml-4">AKTIV</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <div>
                <strong className="text-white">Analytische Cookies</strong>
                <p>Helfen uns, die Nutzung der Website zu verstehen. Keine personenbezogenen Daten.</p>
              </div>
              <span className="text-[#C9C9D1] font-mono text-xs shrink-0 ml-4">OPT-IN</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => accept(false)}
            className="flex-1 border border-white/20 text-white text-sm font-medium py-2 px-5 hover:border-white/50 transition-colors"
          >
            Nur notwendige
          </button>
          <button
            onClick={() => accept(true)}
            className="flex-1 bg-[#E30613] text-white text-sm font-bold py-2 px-5 hover:bg-[#c0000f] transition-colors"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}