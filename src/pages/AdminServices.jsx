import { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Loader2, AlertTriangle, Save, EyeOff, Eye, ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { SERVICE_PACKAGES, ADDON_POLISH_NOTE } from "@/lib/services";

const EMPTY_ITEM = {
  name: "",
  tagline: "",
  description: "",
  price_eur: 0,
  duration_minutes: 60,
  duration_label: "",
  features: [],
  badge: "",
  tier: 0,
  is_active: true,
  image_url: "",
};

function FeatureList({ features, onChange }) {
  const [draft, setDraft] = useState("");
  const id = useId();
  const add = () => {
    if (!draft.trim()) return;
    onChange([...(features || []), draft.trim()]);
    setDraft("");
  };
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-[#C9C9D1] mb-1">Enthaltene Leistungen</label>
      <ul className="space-y-1.5 mb-2">
        {(features || []).map((f, i) => (
          <li key={`${i}-${f}`} className="flex items-center gap-2 bg-[#0A0A0B] border border-white/10 px-3 py-1.5">
            <span className="flex-1 text-xs text-white">{f}</span>
            <button
              type="button"
              onClick={() => onChange(features.filter((_, j) => j !== i))}
              className="text-[#C9C9D1] hover:text-[#E30613] transition-colors"
              aria-label={`Eintrag "${f}" entfernen`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Neuer Bullet-Point …"
          className="flex-1 border border-white/10 bg-[#0A0A0B] text-white text-xs px-3 h-9 focus:outline-none focus:border-[#E30613]"
        />
        <button
          type="button"
          onClick={add}
          className="border border-white/20 hover:border-[#E30613] text-xs text-[#C9C9D1] hover:text-white px-3 h-9 transition-colors"
        >
          Hinzufügen
        </button>
      </div>
    </div>
  );
}

function ServiceForm({ value, onChange, onSave, onCancel, saving }) {
  const update = (field, v) => onChange({ ...value, [field]: v });
  const ids = useId();
  const fid = (suffix) => `${ids}-${suffix}`;

  const handleImageUpload = async (file) => {
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    update("image_url", file_url);
  };

  return (
    <div className="bg-[#161618] border border-white/10 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fid("name")} className="block text-xs text-[#C9C9D1] mb-1">Name <span className="text-[#E30613]">*</span></label>
          <input id={fid("name")} value={value.name} onChange={(e) => update("name", e.target.value)}
            placeholder="z.B. DELUXE"
            className="w-full border border-white/10 bg-[#0A0A0B] text-white text-sm px-3 h-9 focus:outline-none focus:border-[#E30613]" />
        </div>
        <div>
          <label htmlFor={fid("tagline")} className="block text-xs text-[#C9C9D1] mb-1">Untertitel / Claim</label>
          <input id={fid("tagline")} value={value.tagline || ""} onChange={(e) => update("tagline", e.target.value)}
            placeholder="z.B. Wenn Pflege zur Leidenschaft wird"
            className="w-full border border-white/10 bg-[#0A0A0B] text-white text-sm px-3 h-9 focus:outline-none focus:border-[#E30613]" />
        </div>
      </div>

      <div>
        <label htmlFor={fid("description")} className="block text-xs text-[#C9C9D1] mb-1">Beschreibung</label>
        <textarea id={fid("description")} value={value.description || ""} onChange={(e) => update("description", e.target.value)}
          rows={2}
          className="w-full border border-white/10 bg-[#0A0A0B] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#E30613]" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label htmlFor={fid("price")} className="block text-xs text-[#C9C9D1] mb-1">Preis (€) <span className="text-[#E30613]">*</span></label>
          <input id={fid("price")} type="number" min="1" step="1" value={value.price_eur}
            onChange={(e) => update("price_eur", Number(e.target.value))}
            className="w-full border border-white/10 bg-[#0A0A0B] text-white text-sm px-3 h-9 focus:outline-none focus:border-[#E30613] font-mono" />
        </div>
        <div>
          <label htmlFor={fid("duration")} className="block text-xs text-[#C9C9D1] mb-1">Dauer (Min.) <span className="text-[#E30613]">*</span></label>
          <input id={fid("duration")} type="number" min="15" step="15" value={value.duration_minutes}
            onChange={(e) => update("duration_minutes", Number(e.target.value))}
            className="w-full border border-white/10 bg-[#0A0A0B] text-white text-sm px-3 h-9 focus:outline-none focus:border-[#E30613] font-mono" />
        </div>
        <div>
          <label htmlFor={fid("duration_label")} className="block text-xs text-[#C9C9D1] mb-1">Dauer-Anzeige</label>
          <input id={fid("duration_label")} value={value.duration_label || ""} onChange={(e) => update("duration_label", e.target.value)}
            placeholder="ca. 4–5 Std."
            className="w-full border border-white/10 bg-[#0A0A0B] text-white text-sm px-3 h-9 focus:outline-none focus:border-[#E30613]" />
        </div>
        <div>
          <label htmlFor={fid("tier")} className="block text-xs text-[#C9C9D1] mb-1">Reihenfolge</label>
          <input id={fid("tier")} type="number" min="0" step="1" value={value.tier || 0}
            onChange={(e) => update("tier", Number(e.target.value))}
            className="w-full border border-white/10 bg-[#0A0A0B] text-white text-sm px-3 h-9 focus:outline-none focus:border-[#E30613] font-mono" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={fid("badge")} className="block text-xs text-[#C9C9D1] mb-1">Badge (optional)</label>
          <input id={fid("badge")} value={value.badge || ""} onChange={(e) => update("badge", e.target.value)}
            placeholder="z.B. Bestseller"
            className="w-full border border-white/10 bg-[#0A0A0B] text-white text-sm px-3 h-9 focus:outline-none focus:border-[#E30613]" />
        </div>
        <div>
          <label htmlFor={fid("image")} className="block text-xs text-[#C9C9D1] mb-1">Bild-URL</label>
          <div className="flex gap-2">
            <input id={fid("image")} value={value.image_url || ""} onChange={(e) => update("image_url", e.target.value)}
              placeholder="https://… oder hochladen →"
              className="flex-1 border border-white/10 bg-[#0A0A0B] text-white text-xs px-3 h-9 focus:outline-none focus:border-[#E30613]" />
            <label className="cursor-pointer flex items-center gap-1 border border-white/20 hover:border-[#E30613] text-xs text-[#C9C9D1] hover:text-white px-3 h-9 transition-colors shrink-0">
              <Upload className="w-3 h-3" />
              <span className="sr-only">Bild hochladen</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0])} />
            </label>
          </div>
          {value.image_url && (
            <img src={value.image_url} alt={`Vorschau ${value.name || "Paket"}`} className="mt-2 h-20 w-full object-cover border border-white/10" />
          )}
        </div>
      </div>

      <FeatureList features={value.features} onChange={(v) => update("features", v)} />

      <label className="flex items-center gap-2 text-xs text-[#C9C9D1]">
        <input type="checkbox" checked={!!value.is_active} onChange={(e) => update("is_active", e.target.checked)} />
        Buchbar (auf der Website sichtbar)
      </label>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button onClick={onCancel} className="text-[#C9C9D1] text-sm hover:text-white px-4 py-2">Abbrechen</button>
        )}
        <button onClick={onSave} disabled={saving || !value.name || !value.price_eur || !value.duration_minutes}
          className="flex items-center gap-2 bg-[#E30613] disabled:opacity-40 text-white text-sm font-bold px-6 py-2 hover:bg-[#c0000f] transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Speichern
        </button>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [saving, setSaving] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newItem, setNewItem] = useState(EMPTY_ITEM);
  const [editing, setEditing] = useState({}); // id -> draft

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) { base44.auth.redirectToLogin("/admin/services"); return; }
      const me = await base44.auth.me();
      if (me.role !== "Admin") { setUnauthorized(true); setLoading(false); return; }
      const data = await base44.entities.Service.list("tier");
      setItems(data);
      setLoading(false);
    });
  }, []);

  const seedDefaults = async () => {
    setSaving("seed");
    for (const pkg of SERVICE_PACKAGES) {
      await base44.entities.Service.create({
        name: pkg.name,
        tagline: pkg.tagline,
        description: pkg.description,
        price_eur: pkg.price_eur,
        duration_minutes: pkg.duration_minutes,
        duration_label: pkg.duration_label,
        features: pkg.features,
        badge: pkg.badge || "",
        tier: pkg.tier,
        is_active: true,
        image_url: pkg.image,
      });
    }
    const data = await base44.entities.Service.list("tier");
    setItems(data);
    setSaving(null);
  };

  const createItem = async () => {
    setSaving("new");
    const created = await base44.entities.Service.create(newItem);
    setItems((prev) => [...prev, created].sort((a, b) => (a.tier || 0) - (b.tier || 0)));
    setNewItem(EMPTY_ITEM);
    setShowNew(false);
    setSaving(null);
  };

  const startEdit = (item) => setEditing((prev) => ({ ...prev, [item.id]: { ...item } }));
  const updateDraft = (id, draft) => setEditing((prev) => ({ ...prev, [id]: draft }));
  const cancelEdit = (id) => setEditing((prev) => { const next = { ...prev }; delete next[id]; return next; });

  const saveEdit = async (id) => {
    const draft = editing[id];
    setSaving(id);
    await base44.entities.Service.update(id, {
      name: draft.name,
      tagline: draft.tagline || "",
      description: draft.description || "",
      price_eur: Number(draft.price_eur),
      duration_minutes: Number(draft.duration_minutes),
      duration_label: draft.duration_label || "",
      features: Array.isArray(draft.features) ? draft.features : [],
      badge: draft.badge || "",
      tier: Number(draft.tier || 0),
      is_active: !!draft.is_active,
      image_url: draft.image_url || "",
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...draft } : i)));
    cancelEdit(id);
    setSaving(null);
  };

  const toggleActive = async (item) => {
    setSaving(item.id);
    await base44.entities.Service.update(item.id, { is_active: !item.is_active });
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_active: !i.is_active } : i)));
    setSaving(null);
  };

  const deleteItem = async (id) => {
    if (!confirm("Paket wirklich löschen? Bestehende Buchungen bleiben unverändert, neue Buchungen sind danach nicht mehr möglich.")) return;
    setSaving(id);
    await base44.entities.Service.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSaving(null);
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#E30613]" /></div>;
  if (unauthorized) return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <div className="text-center"><AlertTriangle className="w-16 h-16 text-[#E30613] mx-auto mb-4" /><h2 className="text-2xl font-black text-white">Zugriff verweigert</h2></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />
      <div className="pt-20 max-w-5xl mx-auto px-6 py-12">
        <Link to="/admin" className="inline-flex items-center gap-2 text-[#C9C9D1] text-xs hover:text-white mb-4">
          <ArrowLeft className="w-3 h-3" /> Zurück zum Dashboard
        </Link>
        <div className="flex items-start justify-between mb-2 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-px bg-[#E30613]" />
              <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Pakete</span>
            </div>
            <h1 className="text-3xl font-black">Pakete verwalten</h1>
            <p className="text-[#C9C9D1] text-sm mt-1">Diese Pakete erscheinen im Buchungsformular und auf der Startseite.</p>
          </div>
          <div className="flex gap-3">
            {items.length === 0 && (
              <button onClick={seedDefaults} disabled={saving === "seed"}
                className="flex items-center gap-2 border border-[#C0C0C0]/30 text-[#C0C0C0] text-xs px-4 py-2 hover:border-white transition-colors">
                {saving === "seed" ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                Standard-Pakete importieren
              </button>
            )}
            <button onClick={() => setShowNew((v) => !v)}
              className="flex items-center gap-2 bg-[#E30613] text-white text-sm font-bold px-5 py-2 hover:bg-[#c0000f] transition-colors">
              <Plus className="w-4 h-4" /> Neues Paket
            </button>
          </div>
        </div>

        <p className="text-[#C9C9D1] text-xs font-mono uppercase tracking-widest mb-6">{ADDON_POLISH_NOTE}</p>

        {showNew && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <ServiceForm value={newItem} onChange={setNewItem} onSave={createItem} onCancel={() => { setShowNew(false); setNewItem(EMPTY_ITEM); }} saving={saving === "new"} />
          </motion.div>
        )}

        {items.length === 0 ? (
          <div className="py-20 text-center text-[#C9C9D1] bg-[#161618] border border-white/10">
            <p className="mb-3">Noch keine Pakete gepflegt.</p>
            <p className="text-xs">Klicken Sie "Standard-Pakete importieren" oder "Neues Paket".</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const isEditing = !!editing[item.id];
              if (isEditing) {
                return (
                  <motion.div key={item.id} layout>
                    <ServiceForm value={editing[item.id]} onChange={(v) => updateDraft(item.id, v)}
                      onSave={() => saveEdit(item.id)} onCancel={() => cancelEdit(item.id)}
                      saving={saving === item.id} />
                  </motion.div>
                );
              }
              return (
                <motion.div key={item.id} layout className="bg-[#161618] border border-white/10 p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-white tracking-wide">{item.name}</h3>
                        {item.badge && <span className="bg-[#E30613] text-white text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5">{item.badge}</span>}
                        {!item.is_active && <span className="text-[10px] font-mono text-[#C9C9D1] bg-white/5 px-2 py-0.5">Inaktiv</span>}
                      </div>
                      {item.tagline && <div className="text-white/80 text-xs uppercase tracking-wide font-semibold mt-1">{item.tagline}</div>}
                      {item.description && <p className="text-[#C9C9D1] text-sm mt-2">{item.description}</p>}
                      {Array.isArray(item.features) && item.features.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {item.features.map((f, i) => (
                            <li key={i} className="text-[#C9C9D1] text-xs">• {f}</li>
                          ))}
                        </ul>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs font-mono text-[#C9C9D1]">
                        <span>{item.duration_label || `${item.duration_minutes} Min.`}</span>
                        <span>· Reihenfolge {item.tier || 0}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-[#E30613] text-2xl">{Number(item.price_eur).toFixed(0)} €</div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => startEdit(item)} className="border border-white/20 text-xs px-3 py-1.5 hover:border-white text-[#C9C9D1]">
                      Bearbeiten
                    </button>
                    <button onClick={() => toggleActive(item)} disabled={saving === item.id}
                      className="flex items-center gap-1 border border-white/20 text-xs px-3 py-1.5 hover:border-white transition-colors text-[#C9C9D1]">
                      {item.is_active ? <><EyeOff className="w-3 h-3" /> Deaktivieren</> : <><Eye className="w-3 h-3" /> Aktivieren</>}
                    </button>
                    <button onClick={() => deleteItem(item.id)} disabled={saving === item.id}
                      className="flex items-center gap-1 border border-red-500/30 text-red-400 text-xs px-3 py-1.5 hover:border-red-400 transition-colors">
                      <Trash2 className="w-3 h-3" /> Löschen
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
