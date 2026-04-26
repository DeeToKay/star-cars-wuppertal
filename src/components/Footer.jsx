import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#161618] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[#E30613]" />
              <div>
                <div className="font-black text-white text-lg tracking-tight leading-none">STAR CARS</div>
                <div className="text-[#A1A1AA] text-xs font-mono">WUPPERTAL</div>
              </div>
            </div>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">
              Premium Autoaufbereitung &amp; Smart Repair. Professionelle Fahrzeugpflege auf höchstem Niveau.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs tracking-widest uppercase">Kontakt</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-[#A1A1AA] text-sm">
                <MapPin className="w-4 h-4 text-[#E30613] shrink-0 mt-0.5" />
                <span>Ronsdorferstr. 57, 42283 Wuppertal<br /><span className="text-xs text-[#A1A1AA]/70">(an der StarTankstelle)</span></span>
              </div>
              <div className="flex items-center gap-3 text-[#A1A1AA] text-sm">
                <Phone className="w-4 h-4 text-[#E30613] shrink-0" />
                <a href="tel:01726871641" className="hover:text-white transition-colors">01726871641</a>
              </div>
              <div className="flex items-center gap-3 text-[#A1A1AA] text-sm">
                <Mail className="w-4 h-4 text-[#E30613] shrink-0" />
                <a href="mailto:info@starcarswuppertal.com" className="hover:text-white transition-colors">info@starcarswuppertal.com</a>
              </div>
            </div>
          </div>

          {/* Opening hours */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs tracking-widest uppercase">Öffnungszeiten</h4>
            <div className="space-y-1 text-sm text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-[#E30613]" />
                <span>Mo – Sa: 10:00 – 20:00 Uhr</span>
              </div>
              <div className="text-[#A1A1AA]/60 text-xs ml-5">Sonntag geschlossen</div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs tracking-widest uppercase">Rechtliches</h4>
            <div className="space-y-2">
              <Link to="/impressum" className="block text-[#A1A1AA] hover:text-white text-sm transition-colors">Impressum</Link>
              <Link to="/datenschutz" className="block text-[#A1A1AA] hover:text-white text-sm transition-colors">Datenschutzerklärung</Link>
              <Link to="/agb" className="block text-[#A1A1AA] hover:text-white text-sm transition-colors">AGB & Stornierung</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#A1A1AA] text-xs">
            © {new Date().getFullYear()} Kilic Savas – Star Cars Wuppertal. Alle Rechte vorbehalten.
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