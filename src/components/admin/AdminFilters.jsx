export const STATUSES = ["Confirmed", "In Progress", "Ready for Pickup", "Picked Up", "Cancelled", "No-Show"];

export const STATUS_CONFIG = {
  "Confirmed":        { label: "Bestätigt",         color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  "In Progress":      { label: "In Bearbeitung",     color: "text-orange-400 border-orange-400/30 bg-orange-400/10" },
  "Ready for Pickup": { label: "Abholbereit ✓",      color: "text-green-400 border-green-400/30 bg-green-400/10" },
  "Picked Up":        { label: "Abgeholt",           color: "text-[#C0C0C0] border-[#C0C0C0]/30 bg-[#C0C0C0]/10" },
  "Cancelled":        { label: "Storniert",          color: "text-red-400 border-red-400/30 bg-red-400/10" },
  "No-Show":          { label: "No-Show",            color: "text-red-600 border-red-600/30 bg-red-600/10" },
};

export default function AdminFilters({ filter, setFilter, dateFilter, setDateFilter, serviceFilter, setServiceFilter, services, searchQuery, setSearchQuery }) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return (
    <div className="flex flex-wrap gap-3 mb-6 items-center">
      {/* Search */}
      {setSearchQuery && (
        <input
          type="text"
          value={searchQuery || ""}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Name, Kennzeichen, Telefon…"
          className="border border-white/10 bg-[#0A0A0B] text-white text-xs px-3 py-1.5 font-mono focus:outline-none focus:border-[#E30613] w-52"
        />
      )}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "Alle" },
          { key: "today", label: "Heute" },
          { key: "tomorrow", label: "Morgen" },
          { key: "week", label: "Woche" },
          ...STATUSES.map(s => ({ key: s, label: STATUS_CONFIG[s].label })),
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setDateFilter(""); }}
            className={`px-3 py-1.5 text-xs font-medium border transition-all font-mono ${
              filter === f.key && !dateFilter
                ? "border-[#E30613] text-[#E30613] bg-[#E30613]/10"
                : "border-white/10 text-[#C9C9D1] hover:border-white/30"
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
        className="border border-white/10 bg-[#0A0A0B] text-[#C9C9D1] text-xs px-3 py-1.5 font-mono focus:outline-none focus:border-[#E30613]"
      >
        <option value="">Alle Services</option>
        {services.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}