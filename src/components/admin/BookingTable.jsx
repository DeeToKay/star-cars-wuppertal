import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ChevronDown } from "lucide-react";
import { STATUSES, STATUS_CONFIG } from "./AdminFilters";

function StatusDropdown({ current, loading, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-2 border border-white/20 bg-[#0A0A0B] px-3 py-2 text-xs text-white hover:border-[#E30613] transition-colors w-full"
      >
        {loading && <Loader2 className="w-3 h-3 animate-spin" />}
        <span className="truncate">Status ändern</span>
        <ChevronDown className="w-3 h-3 ml-auto shrink-0" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[#161618] border border-white/20 z-20 min-w-[180px] shadow-2xl">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-xs font-mono transition-colors hover:bg-white/10 ${current === s ? "text-[#E30613]" : "text-white"}`}
            >
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingTable({ bookings, updating, flashGreen, onStatusChange, viewMode }) {
  if (bookings.length === 0) {
    return <div className="p-12 text-center text-[#A1A1AA] bg-[#161618] border border-white/10">Keine Buchungen gefunden.</div>;
  }

  if (viewMode === "bay") {
    // Group by time slot, show bays side-by-side
    const slots = [...new Set(bookings.map(b => b.appointment_time))].sort();
    return (
      <div className="space-y-2">
        {slots.map(slot => {
          const slotBookings = bookings.filter(b => b.appointment_time === slot);
          return (
            <div key={slot} className="bg-[#161618] border border-white/10 p-4">
              <div className="font-mono text-[#E30613] text-sm font-bold mb-3">{slot} Uhr</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {slotBookings.map(b => (
                  <div key={b.id} className={`border p-3 transition-all ${flashGreen === b.id ? "border-green-500 bg-green-500/10" : "border-white/10"}`}>
                    <div className="font-medium text-white text-sm">{b.user_name || "—"}</div>
                    <div className="text-[#A1A1AA] text-xs">{b.service_name}</div>
                    <div className="mt-2">
                      <StatusDropdown current={b.status} loading={updating === b.id} onChange={(s) => onStatusChange(b.id, s)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-[#161618] border border-white/10 overflow-hidden">
      <div className="hidden lg:grid grid-cols-7 gap-2 px-5 py-3 border-b border-white/10 text-xs font-mono text-[#A1A1AA] uppercase tracking-widest">
        <div>Datum</div>
        <div>Zeit</div>
        <div>Kunde</div>
        <div>Service</div>
        <div>Zahlung</div>
        <div>Status</div>
        <div>Aktion</div>
      </div>
      {bookings.map((b) => (
        <motion.div
          key={b.id}
          layout
          className={`grid grid-cols-1 lg:grid-cols-7 gap-2 px-5 py-4 border-b border-white/5 transition-all duration-500 ${flashGreen === b.id ? "bg-green-500/10" : "hover:bg-white/[0.02]"}`}
        >
          <div className="font-mono text-sm text-white">{b.appointment_date}</div>
          <div className="font-mono text-sm text-[#A1A1AA]">{b.appointment_time}</div>
          <div>
            <div className="text-sm text-white font-medium">{b.user_name || "—"}</div>
            <div className="text-xs text-[#A1A1AA]">{b.phone_number || b.user_email || ""}</div>
          </div>
          <div>
            <div className="text-sm text-white">{b.service_name || "—"}</div>
            <div className="font-mono text-xs text-[#E30613]">€{Number(b.service_price || 0).toFixed(2)}</div>
          </div>
          <div>
            <span className={`text-xs font-mono px-2 py-1 ${b.payment_status === "Paid" ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
              {b.payment_status === "Paid" ? "BEZAHLT" : "OFFEN"}
            </span>
          </div>
          <div>
            <span className={`text-xs font-bold px-2 py-1 border font-mono ${STATUS_CONFIG[b.status]?.color}`}>
              {STATUS_CONFIG[b.status]?.label || b.status}
            </span>
          </div>
          <div>
            <StatusDropdown current={b.status} loading={updating === b.id} onChange={(s) => onStatusChange(b.id, s)} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}