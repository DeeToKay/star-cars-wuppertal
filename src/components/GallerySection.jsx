import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Showcase-Galerie: zeigt das Nachher-Bild jedes veröffentlichten
// GalleryItem als Grid. Solange noch keine echten Aufnahmen hochgeladen
// sind, bleibt die Sektion bewusst leer mit einem dezenten Hinweis – ein
// Stock-Slider mit Fake-Vorher-Bildern wirkt unauthentisch.

export default function GallerySection({ showAll = false }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    base44.entities.GalleryItem.list("sort_order")
      .then((data) => setItems(data.filter((i) => i.is_published)))
      .catch(() => setItems([]));
  }, []);

  const all = items || [];
  const display = showAll ? all : all.slice(0, 3);
  const isEmpty = items !== null && all.length === 0;

  return (
    <section id="galerie" className="py-24 bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#E30613]" />
            <span className="text-[#E30613] text-sm font-mono tracking-[0.2em] uppercase">
              Unsere Arbeit
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Showroom-Finish bis ins Detail
          </h2>
          <p className="text-[#C9C9D1] mt-3 max-w-xl">
            Echte Ergebnisse aus unserer Werkstatt in Wuppertal. Premium-Aufbereitung
            und Smart Repair, die für sich sprechen.
          </p>
        </motion.div>

        {isEmpty ? (
          <div className="border border-white/10 bg-[#161618] py-16 px-6 text-center">
            <p className="text-[#C9C9D1] text-sm">
              Bilder unserer aktuellen Arbeiten folgen in Kürze.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {display.map((item, i) => {
              const src = item.after_image_url || item.before_image_url;
              if (!src) return null;
              return (
                <motion.figure
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group relative overflow-hidden border border-white/10 hover:border-[#C0C0C0]/40 transition-colors duration-300 bg-[#0A0A0B]"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={src}
                      alt={item.title || "Star Cars Aufbereitung"}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {(item.title || item.service_type) && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pt-10 pb-3">
                      {item.service_type && (
                        <span className="block text-[#E30613] text-[11px] font-mono tracking-widest uppercase mb-0.5">
                          {item.service_type}
                        </span>
                      )}
                      {item.title && (
                        <span className="text-white text-sm font-medium">
                          {item.title}
                        </span>
                      )}
                    </figcaption>
                  )}
                </motion.figure>
              );
            })}
          </div>
        )}

        {!showAll && all.length > 3 && (
          <div className="mt-10 text-center">
            <Link
              to="/galerie"
              className="inline-flex items-center gap-2 border border-[#C0C0C0]/40 text-[#C0C0C0] hover:border-[#E30613] hover:text-white px-8 py-3 text-sm font-medium transition-all"
            >
              Alle Projekte ansehen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
