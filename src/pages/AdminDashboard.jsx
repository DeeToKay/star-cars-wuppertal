import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Calendar, Users, Clock, TrendingUp, Loader2, AlertTriangle, Download, LayoutGrid, List } from "lucide-react";
import Navbar from "../components/Navbar";
import AdminFilters, { STATUS_CONFIG, STATUSES } from "../components/admin/AdminFilters";
import BookingTable from "../components/admin/BookingTable";

function exportCSV(bookings) {
  const headers = ["Datum", "Uhrzeit", "Kundenname", "E-Mail", "Telefon", "Service", "Preis (EUR)", "Status", "Zahlung", "Stripe ID"];
  const rows = bookings.map(b => [
    b.appointment_date, b.appointment_time, b.user_name, b.user_email,
    b.phone_number, b.service_name, Number(b.service_price || 0).toFixed(2),
    b.status, b.payment_status, b.stripe_payment_id || ""
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `starcars-buchungen-${new Date().toISOString().split("T")[0]}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [updating, setUpdating] = useState(null);
  const [flashGreen, setFlashGreen] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" | "bay"

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) { base44.auth.redirectToLogin("/admin"); return; }
      const me = await base44.auth.me();
      setUser(me);
      if (me.role !== "Admin") { setUnauthorized(true); setLoading(false); return; }
      const all = await base44.entities.Booking.list("-appointment_date");
      setBookings(all);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    await base44.entities.Booking.update(bookingId, { status: newStatus });
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    if (newStatus === "Ready for Pickup") {
      setFlashGreen(bookingId);
      setTimeout(() => setFlashGreen(null), 2500);
    }
    setUpdating(null);
  };

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const todayBookings = bookings.filter(b => b.appointment_date === today);
  const upcomingBookings = bookings.filter(b => b.appointment_date > today);
  const totalRevenue = bookings.filter(b => b.payment_status === "Paid").reduce((sum, b) => sum + Number(b.service_price || 0), 0);

  const allServiceNames = [...new Set(bookings.map(b => b.service_name).filter(Boolean))];

  const filtered = bookings.filter(b => {
    if (dateFilter) return b.appointment_date === dateFilter;
    if (filter === "today") return b.appointment_date === today;
    if (filter === "tomorrow") return b.appointment_date === tomorrow;
    if (filter === "week") return b.appointment_date >= today && b.appointment_date <= weekEnd;
    if (STATUSES.includes(filter)) return b.status === filter;
    return true;
  }).filter(b => !serviceFilter || b.service_name === serviceFilter);

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-[#E30613]" />
    </div>
  );

  if (unauthorized) return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-[#E30613] mx-auto mb-4" />
        <h2 className="text-2xl font-black text-white mb-2">Zugriff verweigert</h2>
        <p className="text-[#A1A1AA]">Sie benötigen Admin-Rechte für diesen Bereich.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-px bg-[#E30613]" />
                <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Command Center</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight">Admin Dashboard</h1>
            </div>
            <button
              onClick={() => exportCSV(filtered)}
              className="flex items-center gap-2 border border-white/20 text-white text-sm font-medium px-4 py-2 hover:border-[#E30613] hover:text-[#E30613] transition-colors"
            >
              <Download className="w-4 h-4" /> CSV Export
            </button>
          </div>

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

          {/* Filters + View Toggle */}
          <div className="flex flex-wrap items-start gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <AdminFilters
                filter={filter} setFilter={setFilter}
                dateFilter={dateFilter} setDateFilter={setDateFilter}
                serviceFilter={serviceFilter} setServiceFilter={setServiceFilter}
                services={allServiceNames}
              />
            </div>
            <div className="flex border border-white/10 overflow-hidden shrink-0">
              <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 text-xs transition-all ${viewMode === "list" ? "bg-[#E30613] text-white" : "text-[#A1A1AA] hover:text-white"}`}>
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("bay")} className={`px-3 py-1.5 text-xs transition-all ${viewMode === "bay" ? "bg-[#E30613] text-white" : "text-[#A1A1AA] hover:text-white"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-[#A1A1AA] text-xs font-mono mb-4">{filtered.length} Buchungen</div>

          <BookingTable
            bookings={filtered}
            updating={updating}
            flashGreen={flashGreen}
            onStatusChange={handleStatusChange}
            viewMode={viewMode}
          />
        </motion.div>
      </div>
    </div>
  );
}