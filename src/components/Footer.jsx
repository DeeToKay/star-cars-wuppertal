import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import LogoMark from "./LogoMark";

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0B] border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand + Social */}
          <div>
            <div className="mb-5">
              <LogoMark height={40} footer />
            </div>
            <p className="text-[#B5B5B5] text-sm leading-relaxed mb-5">
              Premium Autoaufbereitung &amp; Smart Repair in Wuppertal. Professionelle Fahrzeugpflege auf höchstem Niveau.
            </p>
            <a
              href="https://www.instagram.com/star_cars_wuppertal/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#B5B5B5] hover:text-white text-sm transition-colors group"
            >
              <Instagram className="w-5 h-5 text-[#E10600] group-hover:scale-110 transition-transform" />
              @star_cars_wuppertal
            </a>
          </div>

          {/* Contact + Hours */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs tracking-widest uppercase">Kontakt &amp; Öffnungszeiten</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-[#B5B5B5] text-sm">
                <MapPin className="w-4 h-4 text-[#E10600] shrink-0 mt-0.5" />
                <span>Ronsdorferstr. 57, 42283 Wuppertal<br /><span className="text-xs text-[#B5B5B5]/60">(an der StarTankstelle)</span></span>
              </div>
              <div className="flex items-center gap-3 text-[#B5B5B5] text-sm">
                <Phone className="w-4 h-4 text-[#E10600] shrink-0" />
                <a href="tel:01726871641" className="hover:text-white transition-colors">01726871641</a>
              </div>
              <div className="flex items-center gap-3 text-[#B5B5B5] text-sm">
                <Mail className="w-4 h-4 text-[#E10600] shrink-0" />
                <a href="mailto:info@starcarswuppertal.com" className="hover:text-white transition-colors">info@starcarswuppertal.com</a>
              </div>
              <div className="flex items-center gap-3 text-[#B5B5B5] text-sm">
                <Clock className="w-4 h-4 text-[#E10600] shrink-0" />
                <span>Mo – Sa: 10:00 – 20:00 Uhr<br /><span className="text-xs text-[#B5B5B5]/60">Sonntag geschlossen</span></span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs tracking-widest uppercase">Rechtliches</h4>
            <div className="space-y-2.5">
              <Link to="/impressum" className="block text-[#B5B5B5] hover:text-white text-sm transition-colors">Impressum</Link>
              <Link to="/datenschutz" className="block text-[#B5B5B5] hover:text-white text-sm transition-colors">Datenschutzerklärung</Link>
              <Link to="/agb" className="block text-[#B5B5B5] hover:text-white text-sm transition-colors">AGB &amp; Stornierung</Link>
              <Link to="/galerie" className="block text-[#B5B5B5] hover:text-white text-sm transition-colors">Galerie</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#B5B5B5] text-xs">
            © {new Date().getFullYear()} Kilic Savas – Star Cars Wuppertal. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-[#E10600]" />
            <span className="text-[#C0C0C0] text-xs font-mono tracking-widest">PREMIUM AUTO CARE</span>
            <div className="w-6 h-px bg-[#E10600]" />
          </div>
        </div>
      </div>
    </footer>
  );
}