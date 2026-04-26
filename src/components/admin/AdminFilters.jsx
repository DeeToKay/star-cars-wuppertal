export const STATUSES = ["Pending", "Confirmed", "In Progress", "Ready for Pickup"];

export const STATUS_CONFIG = {
  "Pending": { label: "Ausstehend", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
  "Confirmed": { label: "Bestätigt", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  "In Progress": { label: "In Bearbeitung", color: "text-orange-400 border-orange-400/30 bg-orange-400/10" },
  "Ready for Pickup": { label: "Abholbereit ✓", color: "text-green-400 border-green-400/30 bg-green-400/10" },
};

export default function AdminFilters({ filter, setFilter, dateFilter, setDateFilter, serviceFilter, setServiceFilter, services }) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return (
    <div className="flex flex-wrap gap-3 mb-6 items-center">
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "Alle" },
          { key: "today", label: "Heute" },
          { key: "tomorrow", label: "Morgen" },
          { key: "week", label: "Diese Woche" },
          ...STATUSES.map(s => ({ key: s, label: STATUS_CONFIG[s].label })),
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setDateFilter(""); }}
            className={`px-3 py-1.5 text-xs font-medium border transition-all font-mono ${
              filter === f.key && !dateFilter
                ? "border-[#E30613] text-[#E30613] bg-[#E30613]/10"
                : "border-white/10 text-[#A1A1AA] hover:border-white/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <input
        type="date"
        value={dateFilter}
        onChange={e => { setDateFilter(e.target.value); setFilter(""); }}
        className="border border-white/10 bg-[#0A0A0B] text-white text-xs px-3 py-1.5 font-mono focus:outline-none focus:border-[#E30613]"
      />
      <select
        value={serviceFilter}
        onChange={e => setServiceFilter(e.target.value)}
        className="border border-white/10 bg-[#0A0A0B] text-[#A1A1AA] text-xs px-3 py-1.5 font-mono focus:outline-none focus:border-[#E30613]"
      >
        <option value="">Alle Services</option>
        {services.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}