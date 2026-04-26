import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, Shield, CreditCard, MapPin, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GallerySection from "../components/GallerySection";

const SERVICES = [
  {
    name: "Express-Reinigung",
    description: "Professionelle Außenwäsche, Felgenreinigung, Trocknung und Basis-Innenreinigung. Schnell, präzise, makellos.",
    price: "39.99",
    duration: "45 Min.",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=900&q=85",
  },
  {
    name: "Premium Detailing",
    description: "Vollständige Innen- und Außenreinigung, Lederbehandlung, Lackpolitur und Versiegelung.",
    price: "149.99",
    duration: "180 Min.",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&q=85",
  },
  {
    name: "Smart Repair",
    description: "Professionelle Beseitigung von Kratzern, Dellen und Lackschäden. Restauration auf Werksstandard.",
    price: "199.99",
    duration: "240 Min.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85",
  },
  {
    name: "VIP Komplettpaket",
    description: "Das Ultimative: Detailing, Smart Repair, Scheibenreinigung, Ozonbehandlung und Langzeit-Versiegelung.",
    price: "349.99",
    duration: "360 Min.",
    image: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=900&q=85",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-inter">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&q=90"
            alt="Premium Fahrzeug"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/88 to-[#0B0B0B]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-[#E10600]" />
              <span className="text-[#E10600] text-sm font-mono tracking-[0.25em] uppercase">
                Wuppertal · Ronsdorferstr. 57
              </span>
            </div>

            <h1 className="font-black leading-[0.9] tracking-tight mb-6">
              <span className="block text-5xl md:text-7xl lg:text-[6.5rem] text-white">Autoaufbereitung</span>
              <span className="block text-5xl md:text-7xl lg:text-[6.5rem] text-white">&amp; Smart Repair</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl text-[#C0C0C0] mt-2">in Wuppertal</span>
            </h1>

            <div className="w-32 h-0.5 bg-[#E10600] mb-6" />

            <p className="text-xl text-[#B5B5B5] max-w-lg leading-relaxed mb-10">
              Festpreis. Fester Termin. Vorab buchen. — Professionelle Fahrzeugpflege auf höchstem Niveau.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="group inline-flex items-center gap-3 bg-[#E10600] text-white font-bold text-lg px-9 py-4 hover:bg-[#c00500] transition-all duration-200"
              >
                Jetzt Termin buchen
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center gap-3 border border-[#C0C0C0]/40 text-[#C0C0C0] font-semibold text-lg px-9 py-4 hover:border-white hover:text-white transition-all duration-200"
              >
                Services ansehen
              </a>
            </div>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-20 flex flex-wrap gap-8"
          >
            {[
              { val: "5.000+", label: "Premium-Aufbereitungen" },
              { val: "4.9 ★", label: "Kundenbewertung" },
              { val: "Mo–Sa", label: "10:00–20:00 Uhr" },
            ].map((s) => (
              <div key={s.label} className="border-l-2 border-[#E10600] pl-4">
                <div className="font-mono font-bold text-2xl text-white">{s.val}</div>
                <div className="text-[#B5B5B5] text-sm">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── VERTRAUEN ── */}
      <section className="py-14 bg-[#1A1A1A] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Star, title: "Über 5.000 Premium-Aufbereitungen", desc: "Platzhalter – wird durch echte Zahl ersetzt" },
              { icon: MapPin, title: "An der StarTankstelle", desc: "Ronsdorferstr. 57, Wuppertal – leicht erreichbar" },
              { icon: CreditCard, title: "Stripe-gesicherte Zahlung", desc: "100% Vorkasse, verschlüsselt & sicher" },
              { icon: CheckCircle, title: "Festpreis & fester Termin", desc: "Keine versteckten Kosten, termingerecht" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 border border-white/8 hover:border-[#E10600]/40 transition-colors">
                <item.icon className="w-6 h-6 text-[#E10600] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm mb-1">{item.title}</div>
                  <div className="text-[#B5B5B5] text-xs leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WIE ES FUNKTIONIERT ── */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[#E10600] text-sm font-mono tracking-[0.2em] uppercase">In 3 Schritten</span>
            <div className="w-8 h-px bg-[#E10600]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-14">So einfach geht's</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Service wählen", desc: "Express, Detailing, Smart Repair oder VIP Paket – Festpreis, keine Überraschungen." },
              { num: "02", title: "Termin buchen", desc: "Datum und Uhrzeit wählen, Zahlung via Stripe – alles in 2 Minuten online." },
              { num: "03", title: "Auto bringen", desc: "Einfach vorbeikommen, wir kümmern uns um alles. Sie erhalten eine Benachrichtigung wenn fertig." },
            ].map((step) => (
              <div key={step.num} className="relative p-6 border border-white/10 hover:border-[#E10600]/40 transition-colors text-left">
                <div className="font-mono text-5xl font-black text-[#E10600]/20 mb-4 leading-none">{step.num}</div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-[#B5B5B5] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 bg-[#0B0B0B]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#E10600]" />
              <span className="text-[#E10600] text-sm font-mono tracking-[0.2em] uppercase">Leistungen</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Unsere Services</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E10600]/10">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-[#131313] overflow-hidden flex flex-col"
              >
                {/* Red accent line top */}
                <div className="h-0.5 bg-[#E10600]" />
                <div className="aspect-video overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-50 group-hover:brightness-60"
                  />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                    <div className="text-right ml-4">
                      <div className="font-mono font-bold text-[#E10600] text-2xl">€{service.price}</div>
                      <div className="font-mono text-[#C0C0C0] text-xs">{service.duration}</div>
                    </div>
                  </div>
                  <p className="text-[#B5B5B5] leading-relaxed text-sm flex-1">{service.description}</p>
                  <Link
                    to="/booking"
                    className="mt-6 inline-flex items-center justify-center gap-2 bg-[#E10600] text-white font-bold px-6 py-3 hover:bg-[#c00500] transition-colors text-sm self-start"
                  >
                    Jetzt buchen <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERIE ── */}
      <GallerySection />

      {/* ── WARUM WIR ── */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#E10600]" />
              <span className="text-[#E10600] text-sm font-mono tracking-[0.2em] uppercase">Warum Star Cars</span>
              <div className="w-8 h-px bg-[#E10600]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Premium Standard</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Star, title: "Premium Qualität", desc: "Nur die besten Produkte und Techniken für Ihr Fahrzeug." },
              { icon: Clock, title: "Pünktlichkeit", desc: "Wir halten Ihre Zeit in Ehren. Termine werden eingehalten." },
              { icon: Shield, title: "Garantie", desc: "Unsere Arbeit steht für sich. 100% Zufriedenheitsgarantie." },
              { icon: CheckCircle, title: "Transparenz", desc: "Festpreise ohne versteckte Kosten. Was Sie buchen, zahlen Sie." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 border border-white/10 hover:border-[#E10600]/50 transition-all duration-300"
              >
                <item.icon className="w-8 h-8 text-[#E10600] mb-4" />
                <div className="w-8 h-px bg-[#C0C0C0]/30 mb-4" />
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-[#B5B5B5] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden bg-[#E10600]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80" alt="" className="w-full h-full object-cover opacity-10" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-5">
              Ihr Auto verdient das Beste.
            </h2>
            <p className="text-white/85 text-xl mb-10">
              Jetzt online buchen und noch heute einen Termin sichern.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-3 bg-black text-white font-bold text-xl px-10 py-5 hover:bg-[#0B0B0B] transition-all duration-200"
            >
              Jetzt Termin buchen <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}