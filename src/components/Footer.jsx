import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#161618] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[#E30613]" />
              <span className="font-black text-white text-xl tracking-tight">STAR CARS</span>
            </div>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">
              Premium Autowäsche und Smart Repair in Wuppertal. Professionelle Pflege für Ihr Fahrzeug.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Kontakt</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#A1A1AA] text-sm">
                <MapPin className="w-4 h-4 text-[#E30613] shrink-0" />
                <span>Ronsdorferstr 57, Wuppertal</span>
              </div>
              <div className="flex items-center gap-3 text-[#A1A1AA] text-sm">
                <Phone className="w-4 h-4 text-[#E30613] shrink-0" />
                <span>+49 202 000 0000</span>
              </div>
              <div className="flex items-center gap-3 text-[#A1A1AA] text-sm">
                <Mail className="w-4 h-4 text-[#E30613] shrink-0" />
                <span>info@starcars-wuppertal.de</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Rechtliches</h4>
            <div className="space-y-2">
              <Link to="/impressum" className="block text-[#A1A1AA] hover:text-white text-sm transition-colors">
                Impressum
              </Link>
              <Link to="/datenschutz" className="block text-[#A1A1AA] hover:text-white text-sm transition-colors">
                Datenschutzerklärung
              </Link>
              <Link to="/agb" className="block text-[#A1A1AA] hover:text-white text-sm transition-colors">
                AGB
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#A1A1AA] text-xs">
            © {new Date().getFullYear()} Star Cars Wuppertal. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-px bg-[#E30613]" />
            <span className="text-[#A1A1AA] text-xs font-mono">PREMIUM AUTO CARE</span>
            <div className="w-4 h-px bg-[#E30613]" />
          </div>
        </div>
      </div>
    </footer>
  );
}