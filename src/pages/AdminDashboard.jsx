import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Calendar, Users, Clock, TrendingUp, Loader2, AlertTriangle, Download, LayoutGrid, List, Upload } from "lucide-react";
import Navbar from "../components/Navbar";
import AdminFilters, { STATUSES } from "../components/admin/AdminFilters";
import BookingTable from "../components/admin/BookingTable";

function exportCSV(bookings) {
  const headers = ["Datum", "Uhrzeit", "Kundenname", "E-Mail", "Telefon", "Kennzeichen", "Service", "Preis (EUR)", "Status", "Zahlung"];
  const rows = bookings.map(b => [
    b.appointment_date, b.appointment_time, b.user_name, b.user_email,
    b.phone_number, b.license_plate || "", b.service_name, Number(b.service_price || 0).toFixed(2),
    b.status, b.payment_status
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
  const [searchQuery, setSearchQuery] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    base44.entities.Settings.filter({ key: "logo_url" })
      .then(res => { if (res.length > 0) setLogoUrl(res[0].value || ""); })
      .catch(() => {});
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    // Upsert logo_url setting
    const existing = await base44.entities.Settings.filter({ key: "logo_url" });
    if (existing.length > 0) {
      await base44.entities.Settings.update(existing[0].id, { value: file_url, image_url: file_url });
    } else {
      await base44.entities.Settings.create({ key: "logo_url", value: file_url, image_url: file_url, description: "Logo URL für Header und Footer" });
    }
    setLogoUrl(file_url);
    setLogoUploading(false);
  };

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
    const booking = bookings.find(b => b.id === bookingId);
    // Confirm before sending notification
    if (newStatus === "Ready for Pickup" && booking?.user_email) {
      const ok = confirm(`E-Mail "Fahrzeug abholbereit" an ${booking.user_name || booking.user_email} senden?`);
      if (!ok) return;
    }
    setUpdating(bookingId);
    await base44.entities.Booking.update(bookingId, { status: newStatus });
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    if (newStatus === "Ready for Pickup") {
      setFlashGreen(bookingId);
      setTimeout(() => setFlashGreen(null), 2500);
      // Send notification email
      base44.functions.invoke("sendNotification", { type: "ready", booking_id: bookingId }).catch(console.error);
    }
    if (newStatus === "Cancelled") {
      base44.functions.invoke("sendNotification", { type: "cancelled", booking_id: bookingId }).catch(console.error);
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
  }).filter(b => !serviceFilter || b.service_name === serviceFilter)
    .filter(b => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (b.user_name || "").toLowerCase().includes(q) ||
             (b.license_plate || "").toLowerCase().includes(q) ||
             (b.phone_number || "").toLowerCase().includes(q) ||
             (b.user_email || "").toLowerCase().includes(q);
    });

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
        <p className="text-[#C9C9D1]">Sie benötigen Admin-Rechte für diesen Bereich.</p>
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
            <div className="flex gap-3">
              <a href="/admin/services" className="flex items-center gap-2 border border-white/20 text-white text-sm font-medium px-4 py-2 hover:border-[#E30613] hover:text-[#E30613] transition-colors">
                📦 Pakete
              </a>
              <a href="/admin/gallery" className="flex items-center gap-2 border border-white/20 text-white text-sm font-medium px-4 py-2 hover:border-[#E30613] hover:text-[#E30613] transition-colors">
                🖼 Galerie
              </a>
              <button
                onClick={() => exportCSV(filtered)}
                className="flex items-center gap-2 border border-white/20 text-white text-sm font-medium px-4 py-2 hover:border-[#E30613] hover:text-[#E30613] transition-colors"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
            </div>
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
                  <span className="text-[#C9C9D1] text-xs">{s.label}</span>
                </div>
                <div className="font-mono font-bold text-2xl text-white">{s.value}</div>
                <div className="text-[#C9C9D1] text-xs mt-1">{s.sub}</div>
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
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              />
            </div>
            <div className="flex border border-white/10 overflow-hidden shrink-0">
              <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 text-xs transition-all ${viewMode === "list" ? "bg-[#E30613] text-white" : "text-[#C9C9D1] hover:text-white"}`}>
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("bay")} className={`px-3 py-1.5 text-xs transition-all ${viewMode === "bay" ? "bg-[#E30613] text-white" : "text-[#C9C9D1] hover:text-white"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="mb-8 p-5 bg-[#161618] border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-px bg-[#E30613]" />
              <span className="text-xs font-mono text-[#E30613] uppercase tracking-widest">Logo-Einstellung</span>
            </div>
            <div className="flex items-center gap-5 flex-wrap">
              {logoUrl && <img src={logoUrl} alt="Logo" className="h-12 object-contain border border-white/10 p-1" />}
              <label className="flex items-center gap-2 cursor-pointer border border-white/20 hover:border-[#E30613] text-sm text-[#B5B5B5] hover:text-white px-4 py-2 transition-colors">
                {logoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {logoUploading ? "Wird hochgeladen..." : "Logo hochladen"}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={logoUploading} />
              </label>
              <span className="text-[#B5B5B5] text-xs">Empfohlen: schwarzer Hintergrund, min. 400px Breite</span>
            </div>
          </div>

          <div className="text-[#C9C9D1] text-xs font-mono mb-4">{filtered.length} Buchungen</div>

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