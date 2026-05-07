import { useMemo } from "react";
import { motion } from "framer-motion";

const TIME_SLOTS = [
  "10:00","10:30","11:00","11:30","12:00","12:30",
  "13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00","17:30","18:00","18:30",
  "19:00","19:30",
];
const MAX_BAYS = 3;
const SLOT_HEIGHT = 48; // px per 30min slot

const STATUS_COLORS = {
  "Confirmed":        "bg-blue-500/20 border-blue-500/60 text-blue-200",
  "In Progress":      "bg-yellow-500/20 border-yellow-500/60 text-yellow-200",
  "Ready for Pickup": "bg-green-500/20 border-green-500/60 text-green-200",
  "Picked Up":        "bg-[#C0C0C0]/10 border-[#C0C0C0]/30 text-[#C0C0C0]",
  "Cancelled":        "bg-red-500/10 border-red-500/30 text-red-400 opacity-40",
  "No-Show":          "bg-red-800/10 border-red-800/30 text-red-600 opacity-40",
};

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function getWeekDates(referenceDate) {
  // Monday-based week
  const d = new Date(referenceDate);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date(d);
    date.setDate(d.getDate() + i);
    return date.toISOString().split("T")[0];
  });
}

const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export default function WeekView({ bookings, weekStart }) {
  const weekDates = useMemo(() => getWeekDates(weekStart || new Date().toISOString().split("T")[0]), [weekStart]);

  // Build a map: date -> array of bookings (sorted by time)
  const byDate = useMemo(() => {
    const map = {};
    weekDates.forEach(d => { map[d] = []; });
    bookings.forEach(b => {
      if (map[b.appointment_date]) {
        map[b.appointment_date].push(b);
      }
    });
    Object.values(map).forEach(arr => arr.sort((a, b) => a.appointment_time?.localeCompare(b.appointment_time)));
    return map;
  }, [bookings, weekDates]);

  const BASE_MIN = timeToMinutes("10:00");
  const TOTAL_SLOTS = TIME_SLOTS.length; // 20 slots × 30min

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Header row */}
        <div className="grid gap-px mb-1" style={{ gridTemplateColumns: `56px repeat(6, 1fr)` }}>
          <div />
          {weekDates.map((date, i) => {
            const isToday = date === new Date().toISOString().split("T")[0];
            const label = new Date(date + "T12:00:00").toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
            return (
              <div key={date} className={`text-center py-2 text-xs font-mono font-bold uppercase tracking-wider ${isToday ? "text-[#E30613]" : "text-[#C9C9D1]"}`}>
                <div>{DAY_LABELS[i]}</div>
                <div className={`text-[11px] font-normal mt-0.5 ${isToday ? "text-[#E30613]" : "text-[#A1A1AA]"}`}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* Grid body */}
        <div className="relative flex">
          {/* Time axis */}
          <div className="flex flex-col shrink-0 w-14">
            {TIME_SLOTS.map((t, i) => (
              <div key={t} className="flex items-start justify-end pr-2 text-[10px] font-mono text-[#A1A1AA]"
                style={{ height: SLOT_HEIGHT }}>
                {i % 2 === 0 ? t : ""}
              </div>
            ))}
          </div>

          {/* Day columns */}
          <div className="flex-1 grid gap-px" style={{ gridTemplateColumns: `repeat(6, 1fr)` }}>
            {weekDates.map((date) => {
              const dayBookings = byDate[date] || [];
              const activeBookings = dayBookings.filter(b => b.status !== "Cancelled" && b.status !== "No-Show");
              const totalHeight = SLOT_HEIGHT * TOTAL_SLOTS;

              return (
                <div key={date} className="relative border-l border-white/5" style={{ height: totalHeight }}>
                  {/* Background slot lines */}
                  {TIME_SLOTS.map((_, i) => (
                    <div key={i}
                      className={`absolute left-0 right-0 border-b ${i % 2 === 0 ? "border-white/8" : "border-white/4"}`}
                      style={{ top: i * SLOT_HEIGHT, height: SLOT_HEIGHT }}
                    />
                  ))}

                  {/* Bay capacity indicator */}
                  {TIME_SLOTS.map((slot) => {
                    const slotStart = timeToMinutes(slot);
                    const count = activeBookings.filter(b => {
                      if (!b.appointment_time) return false;
                      const bStart = timeToMinutes(b.appointment_time);
                      const bDur = Number(b.service_duration_minutes) || 60;
                      const bEnd = bStart + bDur;
                      return slotStart >= bStart && slotStart < bEnd;
                    }).length;
                    if (count === 0) return null;
                    const pct = Math.min(count / MAX_BAYS, 1);
                    const slotIdx = TIME_SLOTS.indexOf(slot);
                    return (
                      <div key={slot}
                        className="absolute left-0 w-1 transition-all"
                        style={{
                          top: slotIdx * SLOT_HEIGHT,
                          height: SLOT_HEIGHT,
                          background: pct >= 1 ? "#E30613" : pct >= 0.66 ? "#f97316" : "#eab308",
                          opacity: 0.7,
                        }}
                      />
                    );
                  })}

                  {/* Booking blocks */}
                  {dayBookings.map((b) => {
                    if (!b.appointment_time) return null;
                    const startMin = timeToMinutes(b.appointment_time);
                    const dur = Number(b.service_duration_minutes) || 60;
                    const topPx = ((startMin - BASE_MIN) / 30) * SLOT_HEIGHT;
                    const heightPx = Math.max((dur / 30) * SLOT_HEIGHT - 2, SLOT_HEIGHT - 2);
                    const colorClass = STATUS_COLORS[b.status] || "bg-white/5 border-white/10 text-white";

                    return (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`absolute left-1.5 right-1 border rounded-sm px-1.5 py-1 overflow-hidden cursor-default ${colorClass}`}
                        style={{ top: topPx + 1, height: heightPx }}
                        title={`${b.user_name || b.user_email} – ${b.service_name} (${b.appointment_time})`}
                      >
                        <div className="font-bold text-[10px] leading-tight truncate">{b.user_name || b.user_email}</div>
                        {heightPx > 34 && (
                          <div className="text-[9px] leading-tight truncate opacity-80 mt-0.5">{b.service_name}</div>
                        )}
                        {b.license_plate && heightPx > 52 && (
                          <div className="font-mono text-[9px] leading-tight opacity-60 mt-0.5">{b.license_plate}</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 px-14 pb-2">
          {[
            { color: "bg-blue-500/30 border-blue-500/60", label: "Bestätigt" },
            { color: "bg-yellow-500/30 border-yellow-500/60", label: "In Arbeit" },
            { color: "bg-green-500/30 border-green-500/60", label: "Abholbereit" },
            { color: "bg-[#C0C0C0]/15 border-[#C0C0C0]/30", label: "Abgeholt" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 border rounded-sm ${color}`} />
              <span className="text-[10px] text-[#A1A1AA] font-mono">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-3 rounded-sm bg-[#eab308]" />
            <span className="text-[10px] text-[#A1A1AA] font-mono">1 Bay belegt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-3 rounded-sm bg-[#f97316]" />
            <span className="text-[10px] text-[#A1A1AA] font-mono">2 Bays</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-3 rounded-sm bg-[#E30613]" />
            <span className="text-[10px] text-[#A1A1AA] font-mono">Ausgebucht</span>
          </div>
        </div>
      </div>
    </div>
  );
}