import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Menu, X } from "lucide-react";
import LogoMark from "./LogoMark";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) setUser(await base44.auth.me());
    });
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
      scrolled ? "bg-[#0B0B0B]/96 backdrop-blur-md border-b border-white/6" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/">
          <LogoMark height={44} />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          <a href="/#services" className="text-[#B5B5B5] hover:text-white text-sm font-medium transition-colors">Services</a>
          <Link to="/galerie" className="text-[#B5B5B5] hover:text-white text-sm font-medium transition-colors">Galerie</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-[#B5B5B5] hover:text-white text-sm font-medium transition-colors">Meine Buchungen</Link>
              {user.role === "Admin" && (
                <Link to="/admin" className="text-[#B5B5B5] hover:text-white text-sm font-medium transition-colors">Admin</Link>
              )}
              <button onClick={() => base44.auth.logout("/")} className="text-[#B5B5B5] hover:text-white text-sm font-medium transition-colors">Abmelden</button>
            </>
          ) : (
            <button onClick={() => base44.auth.redirectToLogin("/dashboard")} className="text-[#B5B5B5] hover:text-white text-sm font-medium transition-colors">
              Anmelden
            </button>
          )}
          <Link to="/booking" className="bg-[#E30613] text-white text-sm font-bold px-5 py-2 hover:bg-[#c0000f] transition-colors">
            Termin buchen
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#131313] border-t border-white/10 px-6 py-5 flex flex-col gap-4">
          <Link to="/" className="text-white text-sm font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/galerie" className="text-white text-sm font-medium" onClick={() => setMenuOpen(false)}>Galerie</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-white text-sm font-medium" onClick={() => setMenuOpen(false)}>Meine Buchungen</Link>
              {user.role === "Admin" && <Link to="/admin" className="text-white text-sm font-medium" onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button onClick={() => base44.auth.logout("/")} className="text-left text-white text-sm font-medium">Abmelden</button>
            </>
          ) : (
            <button onClick={() => base44.auth.redirectToLogin("/dashboard")} className="text-left text-white text-sm font-medium">Anmelden</button>
          )}
          <Link to="/booking" className="bg-[#E30613] text-white text-sm font-bold px-4 py-2.5 text-center" onClick={() => setMenuOpen(false)}>
            Termin buchen
          </Link>
        </div>
      )}
    </nav>
  );
}