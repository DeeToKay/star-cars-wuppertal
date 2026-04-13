import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoadingAuth } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
      }
    });
  }, []);

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#0A0A0B]/95 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#E30613]" />
          <span className="font-black text-white text-xl tracking-tight">STAR CARS</span>
          <span className="hidden sm:block text-[#A1A1AA] text-xs font-mono">WUPPERTAL</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/#services" className="text-[#A1A1AA] hover:text-white text-sm font-medium transition-colors">
            Services
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-[#A1A1AA] hover:text-white text-sm font-medium transition-colors">
                Meine Buchungen
              </Link>
              {user.role === "Admin" && (
                <Link to="/admin" className="text-[#A1A1AA] hover:text-white text-sm font-medium transition-colors">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="text-[#A1A1AA] hover:text-white text-sm font-medium transition-colors">
                Abmelden
              </button>
            </>
          ) : (
            <button
              onClick={() => base44.auth.redirectToLogin("/dashboard")}
              className="text-[#A1A1AA] hover:text-white text-sm font-medium transition-colors"
            >
              Anmelden
            </button>
          )}
          <Link
            to="/booking"
            className="bg-[#E30613] text-white text-sm font-bold px-5 py-2 hover:bg-[#c0000f] transition-colors"
          >
            Termin buchen
          </Link>
        </div>

        {/* Mobile */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#161618] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          <Link to="/" className="text-white text-sm font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-white text-sm font-medium" onClick={() => setMenuOpen(false)}>Meine Buchungen</Link>
              {user.role === "Admin" && (
                <Link to="/admin" className="text-white text-sm font-medium" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={handleLogout} className="text-left text-white text-sm font-medium">Abmelden</button>
            </>
          ) : (
            <button onClick={() => base44.auth.redirectToLogin("/dashboard")} className="text-left text-white text-sm font-medium">
              Anmelden
            </button>
          )}
          <Link to="/booking" className="bg-[#E30613] text-white text-sm font-bold px-4 py-2 text-center" onClick={() => setMenuOpen(false)}>
            Termin buchen
          </Link>
        </div>
      )}
    </nav>
  );
}