import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Eye, EyeOff, Upload, Loader2, AlertTriangle, GripVertical, Save } from "lucide-react";
import Navbar from "../components/Navbar";

// Galerie-Verwaltung: Inhaber lädt Aufnahmen aus der eigenen Werkstatt
// hoch. Die öffentliche Galerie zeigt das Hauptbild (Nachher); das
// Detail-/Vorher-Bild ist optional und wird derzeit nur in der
// Admin-Vorschau angezeigt.

function ImageUpload({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-xs text-[#C9C9D1] mb-1">{label}</label>
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <input type="text" value={value || ""} onChange={e => onChange(e.target.value)}
            placeholder="https://… oder hochladen →"
            className="w-full border border-white/10 bg-[#0A0A0B] text-white text-xs px-3 h-9 focus:outline-none focus:border-[#E30613] transition-colors"/>
        </div>
        <label className="cursor-pointer flex items-center gap-1 border border-white/20 hover:border-[#E30613] text-xs text-[#C9C9D1] hover:text-white px-3 h-9 transition-colors shrink-0">
          {uploading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Upload className="w-3 h-3"/>}
          <input type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} disabled={uploading}/>
        </label>
      </div>
      {value && <img src={value} alt={label} className="mt-2 h-20 w-full object-cover border border-white/10"/>}
    </div>
  );
}

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [saving, setSaving] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", service_type: "", before_image_url: "", after_image_url: "", sort_order: 0, is_published: true });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) { base44.auth.redirectToLogin("/admin/gallery"); return; }
      const me = await base44.auth.me();
      if (me.role !== "Admin") { setUnauthorized(true); setLoading(false); return; }
      const data = await base44.entities.GalleryItem.list("sort_order");
      setItems(data);
      setLoading(false);
    });
  }, []);

  const togglePublish = async (item) => {
    setSaving(item.id);
    await base44.entities.GalleryItem.update(item.id, { is_published: !item.is_published });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_published: !i.is_published } : i));
    setSaving(null);
  };

  const deleteItem = async (id) => {
    if (!confirm("Galerie-Eintrag wirklich löschen?")) return;
    setSaving(id);
    await base44.entities.GalleryItem.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
    setSaving(null);
  };

  const updateField = async (id, field, value) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const saveItem = async (item) => {
    setSaving(item.id);
    await base44.entities.GalleryItem.update(item.id, {
      title: item.title,
      service_type: item.service_type,
      before_image_url: item.before_image_url,
      after_image_url: item.after_image_url,
      sort_order: item.sort_order,
      is_published: item.is_published,
    });
    setSaving(null);
  };

  const createItem = async () => {
    if (!newItem.title || !newItem.after_image_url) return;
    setCreating(true);
    const created = await base44.entities.GalleryItem.create({ ...newItem, sort_order: items.length });
    setItems(prev => [...prev, created]);
    setNewItem({ title: "", service_type: "", before_image_url: "", after_image_url: "", sort_order: 0, is_published: true });
    setShowNew(false);
    setCreating(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#E30613]"/></div>;
  if (unauthorized) return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <div className="text-center"><AlertTriangle className="w-16 h-16 text-[#E30613] mx-auto mb-4"/><h2 className="text-2xl font-black text-white">Zugriff verweigert</h2></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar/>
      <div className="pt-20 max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-px bg-[#E30613]"/>
              <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Medien</span>
            </div>
            <h1 className="text-3xl font-black">Galerie verwalten</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowNew(v => !v)}
              className="flex items-center gap-2 bg-[#E30613] text-white text-sm font-bold px-5 py-2 hover:bg-[#c0000f] transition-colors">
              <Plus className="w-4 h-4"/> Neues Bild
            </button>
          </div>
        </div>

        {/* New item form */}
        {showNew && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#161618] border border-[#E30613]/40 p-5 mb-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Neues Galerie-Bild</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#C9C9D1] mb-1">Titel <span className="text-[#E30613]">*</span></label>
                <input value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
                  placeholder="z.B. DELUXE – BMW 5er"
                  className="w-full border border-white/10 bg-[#0A0A0B] text-white text-xs px-3 h-9 focus:outline-none focus:border-[#E30613]"/>
              </div>
              <div>
                <label className="block text-xs text-[#C9C9D1] mb-1">Service-Kategorie</label>
                <input value={newItem.service_type} onChange={e => setNewItem(p => ({ ...p, service_type: e.target.value }))}
                  placeholder="BASIC, STANDARD, DELUXE oder EXCLUSIVE"
                  className="w-full border border-white/10 bg-[#0A0A0B] text-white text-xs px-3 h-9 focus:outline-none focus:border-[#E30613]"/>
              </div>
            </div>
            <ImageUpload label="Hauptbild (Nachher) *" value={newItem.after_image_url} onChange={v => setNewItem(p => ({ ...p, after_image_url: v }))}/>
            <ImageUpload label="Detail-/Vorher-Bild (optional)" value={newItem.before_image_url} onChange={v => setNewItem(p => ({ ...p, before_image_url: v }))}/>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowNew(false)} className="text-[#C9C9D1] text-sm hover:text-white px-4 py-2">Abbrechen</button>
              <button onClick={createItem} disabled={creating || !newItem.title || !newItem.after_image_url}
                className="flex items-center gap-2 bg-[#E30613] disabled:opacity-40 text-white text-sm font-bold px-6 py-2 hover:bg-[#c0000f] transition-colors">
                {creating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Speichern
              </button>
            </div>
          </motion.div>
        )}

        {items.length === 0 ? (
          <div className="py-20 text-center text-[#C9C9D1] bg-[#161618] border border-white/10">
            <p className="mb-3">Noch keine Galerie-Einträge.</p>
            <p className="text-xs">Klicken Sie oben rechts auf <strong>"Neues Bild"</strong>, um Ihre erste Aufnahme hochzuladen.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div key={item.id} layout
                className="bg-[#161618] border border-white/10 p-4">
                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-4 items-start">
                  {/* Drag handle placeholder */}
                  <GripVertical className="w-4 h-4 text-[#C9C9D1] mt-2 hidden lg:block cursor-grab"/>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[#C9C9D1] mb-1">Titel</label>
                        <input value={item.title} onChange={e => updateField(item.id, "title", e.target.value)}
                          className="w-full border border-white/10 bg-[#0A0A0B] text-white text-xs px-3 h-9 focus:outline-none focus:border-[#E30613]"/>
                      </div>
                      <div>
                        <label className="block text-xs text-[#C9C9D1] mb-1">Service-Kategorie</label>
                        <input value={item.service_type || ""} onChange={e => updateField(item.id, "service_type", e.target.value)}
                          className="w-full border border-white/10 bg-[#0A0A0B] text-white text-xs px-3 h-9 focus:outline-none focus:border-[#E30613]"/>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ImageUpload label="Hauptbild (Nachher)" value={item.after_image_url} onChange={v => updateField(item.id, "after_image_url", v)}/>
                      <ImageUpload label="Detail-/Vorher-Bild (optional)" value={item.before_image_url} onChange={v => updateField(item.id, "before_image_url", v)}/>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 items-center lg:items-end">
                    <button onClick={() => saveItem(item)} disabled={saving === item.id}
                      className="flex items-center gap-1 bg-[#E30613] text-white text-xs font-bold px-3 py-1.5 hover:bg-[#c0000f] transition-colors">
                      {saving === item.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Save className="w-3 h-3"/>} Speichern
                    </button>
                    <button onClick={() => togglePublish(item)} disabled={saving === item.id}
                      className="flex items-center gap-1 border border-white/20 text-xs px-3 py-1.5 hover:border-white transition-colors text-[#C9C9D1]">
                      {item.is_published ? <><EyeOff className="w-3 h-3"/> Ausblenden</> : <><Eye className="w-3 h-3"/> Anzeigen</>}
                    </button>
                    <button onClick={() => deleteItem(item.id)} disabled={saving === item.id}
                      className="flex items-center gap-1 border border-red-500/30 text-red-400 text-xs px-3 py-1.5 hover:border-red-400 transition-colors">
                      <Trash2 className="w-3 h-3"/> Löschen
                    </button>
                    <span className={`text-xs px-2 py-1 font-mono ${item.is_published ? "text-green-400 bg-green-400/10" : "text-[#C9C9D1] bg-white/5"}`}>
                      {item.is_published ? "● Aktiv" : "○ Versteckt"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
