import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";

// Using high-quality Unsplash automotive images for before/after pairs
const GALLERY = [
  {
    label: "Premium Detailing – Mercedes S-Klasse",
    before: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1200&q=85",
    after: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=85",
  },
  {
    label: "Smart Repair – BMW M3 Stoßstange",
    before: "https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?w=1200&q=85",
    after: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=85",
  },
  {
    label: "VIP Komplettpaket – Porsche 911",
    before: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",
    after: "https://images.unsplash.com/photo-1612544409025-a69b7a36e3b3?w=1200&q=85",
  },
  {
    label: "Premium Detailing – Audi RS6 Weiß",
    before: "https://images.unsplash.com/photo-1541348263662-e068662d82af?w=1200&q=85",
    after: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=85",
  },
  {
    label: "Smart Repair – Range Rover Delle",
    before: "https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0?w=1200&q=85",
    after: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=85",
  },
  {
    label: "VIP Komplettpaket – Lamborghini Huracán",
    before: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=85",
    after: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=85",
  },
];

export default function GallerySection({ showAll = false }) {
  const items = showAll ? GALLERY : GALLERY.slice(0, 3);

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
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[#E10600] text-sm font-mono tracking-[0.2em] uppercase">Unsere Arbeit</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Vorher &amp; Nachher
          </h2>
          <p className="text-[#B5B5B5] mt-3 max-w-xl">Schieben Sie den Regler und sehen Sie den Unterschied. Professionelle Ergebnisse, die für sich sprechen.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="overflow-hidden border border-white/10 hover:border-[#C0C0C0]/30 transition-colors duration-300"
            >
              <BeforeAfterSlider before={item.before} after={item.after} label={item.label} />
            </motion.div>
          ))}
        </div>

        {!showAll && (
          <div className="mt-10 text-center">
            <Link to="/galerie" className="inline-flex items-center gap-2 border border-[#C0C0C0]/40 text-[#C0C0C0] hover:border-[#E10600] hover:text-white px-8 py-3 text-sm font-medium transition-all">
              Alle Projekte ansehen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}