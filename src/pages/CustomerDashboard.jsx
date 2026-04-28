import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Calendar, Clock, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATUS_CONFIG = {
  "Pending": { label: "Ausstehend", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  "Confirmed": { label: "Bestätigt", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  "In Progress": { label: "In Bearbeitung", color: "text-orange-400 bg-orange-400/10 border-orange-400/30" },
  "Ready for Pickup": { label: "Abholbereit", color: "text-green-400 bg-green-400/10 border-green-400/30" },
};

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) {
        base44.auth.redirectToLogin("/dashboard");
        return;
      }
      const me = await base44.auth.me();
      setUser(me);
      const all = await base44.entities.Booking.filter({ user_id: me.id }, "-appointment_date");
      setBookings(all);
      setLoading(false);
    });
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter(b => b.appointment_date >= today);
  const past = bookings.filter(b => b.appointment_date < today);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#E30613]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-px bg-[#E30613]" />
            <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Kundenportal</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Willkommen, {user?.full_name?.split(" ")[0] || "Kunde"}
          </h1>
          <p className="text-[#A1A1AA] mb-10">Verwalten Sie Ihre Buchungen bei Star Cars Wuppertal.</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { label: "Gesamt Buchungen", value: bookings.length, icon: Calendar },
              { label: "Bevorstehend", value: upcoming.length, icon: Clock },
              { label: "Abgeschlossen", value: past.length, icon: CheckCircle },
            ].map((s) => (
              <div key={s.label} className="bg-[#161618] border border-white/10 p-5 flex items-center gap-4">
                <s.icon className="w-8 h-8 text-[#E30613]" />
                <div>
                  <div className="text-2xl font-mono font-bold text-white">{s.value}</div>
                  <div className="text-[#A1A1AA] text-xs">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Bevorstehende Termine</h2>
              <Link to="/booking" className="flex items-center gap-2 text-[#E30613] text-sm font-medium hover:gap-3 transition-all">
                Neuer Termin <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="bg-[#161618] border border-white/10 p-10 text-center">
                <Calendar className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-[#A1A1AA]">Keine bevorstehenden Buchungen.</p>
                <Link to="/booking" className="mt-4 inline-flex items-center gap-2 bg-[#E30613] text-white text-sm font-bold px-6 py-3 hover:bg-[#c0000f] transition-colors">
                  Jetzt buchen
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((b) => (
                  <BookingRow key={b.id} booking={b} />
                ))}
              </div>
            )}
          </section>

          {/* Past */}
          {past.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-6">Vergangene Buchungen</h2>
              <div className="space-y-4 opacity-70">
                {past.map((b) => (
                  <BookingRow key={b.id} booking={b} />
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

function BookingRow({ booking }) {
  const s = STATUS_CONFIG[booking.status] || STATUS_CONFIG["Pending"];
  return (
    <div className="bg-[#161618] border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="font-bold text-white text-lg">{booking.service_name}</div>
        <div className="flex items-center gap-4 mt-1 text-[#A1A1AA] text-sm">
          <span className="font-mono">{booking.appointment_date}</span>
          <span className="font-mono">{booking.appointment_time} Uhr</span>
          <span className="font-mono text-[#E30613]">€{Number(booking.service_price).toFixed(2)}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-bold px-3 py-1 border font-mono ${s.color}`}>
          {s.label}
        </span>
        <span className={`text-xs font-mono px-2 py-1 ${
          booking.payment_status === "Paid" ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"
        }`}>
          {booking.payment_status === "Paid" ? "BEZAHLT" : "AUSSTEHEND"}
        </span>
      </div>
    </div>
  );
}