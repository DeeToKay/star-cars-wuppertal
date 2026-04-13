import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Calendar, Users, Clock, TrendingUp, ChevronDown, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import Navbar from "../components/Navbar";

const STATUSES = ["Pending", "Confirmed", "In Progress", "Ready for Pickup"];

const STATUS_CONFIG = {
  "Pending": { label: "Ausstehend", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
  "Confirmed": { label: "Bestätigt", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  "In Progress": { label: "In Bearbeitung", color: "text-orange-400 border-orange-400/30 bg-orange-400/10" },
  "Ready for Pickup": { label: "Abholbereit ✓", color: "text-green-400 border-green-400/30 bg-green-400/10" },
};

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);
  const [flashGreen, setFlashGreen] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) {
        base44.auth.redirectToLogin("/admin");
        return;
      }
      const me = await base44.auth.me();
      setUser(me);
      if (me.role !== "Admin") {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      const all = await base44.entities.Booking.list("-appointment_date");
      setBookings(all);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (bookingId, newStatus, userEmail) => {
    setUpdating(bookingId);
    await base44.entities.Booking.update(bookingId, { status: newStatus });
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    if (newStatus === "Ready for Pickup") {
      setFlashGreen(bookingId);
      setTimeout(() => setFlashGreen(null), 2000);
      // Email notification is handled by automation
    }
    setUpdating(null);
  };

  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter(b => b.appointment_date === today);
  const upcomingBookings = bookings.filter(b => b.appointment_date > today);
  const totalRevenue = bookings.filter(b => b.payment_status === "Paid").reduce((sum, b) => sum + Number(b.service_price || 0), 0);

  const filtered = filter === "all" ? bookings : filter === "today" ? todayBookings : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#E30613]" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-[#E30613] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Zugriff verweigert</h2>
          <p className="text-[#A1A1AA]">Sie benötigen Admin-Rechte für diesen Bereich.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-px bg-[#E30613]" />
            <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Command Center</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-10">Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Heute", value: todayBookings.length, icon: Calendar, sub: "Termine" },
              { label: "Bevorstehend", value: upcomingBookings.length, icon: Clock, sub: "Termine" },
              { label: "Gesamt", value: bookings.length, icon: Users, sub: "Buchungen" },
              { label: "Umsatz", value: `€${totalRevenue.toFixed(0)}`, icon: TrendingUp, sub: "Bezahlt" },
            ].map((s) => (
              <div key={s.label} className="bg-[#161618] border border-white/10 p-5">
                <div className="flex items-center justify-between mb-3">
                  <s.icon className="w-5 h-5 text-[#E30613]" />
                  <span className="text-[#A1A1AA] text-xs">{s.label}</span>
                </div>
                <div className="font-mono font-bold text-2xl text-white">{s.value}</div>
                <div className="text-[#A1A1AA] text-xs mt-1">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: "all", label: "Alle" },
              { key: "today", label: "Heute" },
              ...STATUSES.map(s => ({ key: s, label: STATUS_CONFIG[s].label })),
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 text-sm font-medium border transition-all font-mono ${
                  filter === f.key ? "border-[#E30613] text-[#E30613] bg-[#E30613]/10" : "border-white/10 text-[#A1A1AA] hover:border-white/30"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Booking Table */}
          <div className="bg-[#161618] border border-white/10 overflow-hidden">
            <div className="hidden lg:grid grid-cols-6 gap-4 px-6 py-3 border-b border-white/10 text-xs font-mono text-[#A1A1AA] uppercase tracking-widest">
              <div>Datum/Zeit</div>
              <div>Kunde</div>
              <div>Service</div>
              <div>Zahlung</div>
              <div>Status</div>
              <div>Aktion</div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-12 text-center text-[#A1A1AA]">Keine Buchungen gefunden.</div>
            ) : (
              filtered.map((b) => (
                <motion.div
                  key={b.id}
                  layout
                  className={`grid grid-cols-1 lg:grid-cols-6 gap-4 px-6 py-5 border-b border-white/5 transition-all duration-500 ${
                    flashGreen === b.id ? "bg-green-500/20" : "hover:bg-white/2"
                  }`}
                >
                  <div>
                    <div className="font-mono text-sm text-white">{b.appointment_date}</div>
                    <div className="font-mono text-xs text-[#A1A1AA]">{b.appointment_time} Uhr</div>
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{b.user_name || "—"}</div>
                    <div className="text-xs text-[#A1A1AA]">{b.user_email || "—"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white">{b.service_name || "—"}</div>
                    <div className="font-mono text-xs text-[#E30613]">€{Number(b.service_price || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <span className={`text-xs font-mono px-2 py-1 ${
                      b.payment_status === "Paid" ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"
                    }`}>
                      {b.payment_status === "Paid" ? "BEZAHLT" : "OFFEN"}
                    </span>
                  </div>
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 border font-mono ${STATUS_CONFIG[b.status]?.color}`}>
                      {STATUS_CONFIG[b.status]?.label || b.status}
                    </span>
                  </div>
                  <div>
                    <StatusDropdown
                      current={b.status}
                      loading={updating === b.id}
                      onChange={(newStatus) => handleStatusChange(b.id, newStatus, b.user_email)}
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatusDropdown({ current, loading, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-2 border border-white/20 bg-[#0A0A0B] px-3 py-2 text-xs text-white hover:border-[#E30613] transition-colors w-full"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
        <span className="truncate">Status ändern</span>
        <ChevronDown className="w-3 h-3 ml-auto shrink-0" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[#161618] border border-white/20 z-10 min-w-[160px] shadow-2xl">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-xs font-mono transition-colors hover:bg-white/10 ${
                current === s ? "text-[#E30613]" : "text-white"
              }`}
            >
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}