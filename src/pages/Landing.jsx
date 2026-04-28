import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Clock, Shield, CreditCard, MapPin, CheckCircle, ChevronDown, Check } from "lucide-react";
import { SERVICE_PACKAGES, ADDON_POLISH_NOTE } from "@/lib/services";

const FAQ_ITEMS = [
  { q: "Wie buche ich einen Termin?", a: "Wählen Sie Ihr Paket auf dieser Seite, klicken Sie auf 'Jetzt buchen', wählen Sie Datum & Uhrzeit und geben Sie Ihre Kontaktdaten ein. Die Buchung dauert nur 2 Minuten – keine Anmeldung erforderlich." },
  { q: "Was kostet welches Paket?", a: "BASIC 79 € (ca. 1–1,5 Std.), STANDARD 159 € (ca. 2–3 Std.), DELUXE 269 € (ca. 4–5 Std.), EXCLUSIVE 999 € (individuell). Festpreise, keine versteckten Kosten. Zusätzliche Politurgänge werden mit jeweils 89,00 € berechnet." },
  { q: "Wie lange dauert eine Aufbereitung?", a: "Das hängt vom gewählten Paket ab: BASIC ca. 1–1,5 Std., STANDARD ca. 2–3 Std., DELUXE ca. 4–5 Std., EXCLUSIVE individuell nach Fahrzeugzustand. Wir benachrichtigen Sie per E-Mail, sobald Ihr Fahrzeug fertig ist." },
  { q: "Wie komme ich zur Werkstatt & wo parke ich?", a: "Sie finden uns direkt an der StarTankstelle, Ronsdorfer Str. 57, 42119 Wuppertal. Parkplätze sind direkt vor Ort vorhanden. Mit dem Bus: Haltestelle in der Nähe. Navigationsadresse: Ronsdorfer Str. 57, 42119 Wuppertal." },
  { q: "Wie kann ich stornieren?", a: "Stornierungen sind jederzeit kostenlos – per E-Mail an info@starcarswuppertal.com oder telefonisch unter 01726871641. Es fallen keine Gebühren an." },
  { q: "Wie bezahle ich?", a: "Die Zahlung erfolgt ausschließlich vor Ort bei Abholung Ihres Fahrzeugs – wahlweise bar oder per EC-/Kreditkarte. Es wird keine Vorkasse erhoben und keine Reservierungsgebühr berechnet." },
];

function FaqSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="py-20 bg-[#1A1A1A]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#E10600]" />
          <span className="text-[#E10600] text-sm font-mono tracking-[0.2em] uppercase">FAQ</span>
          <div className="w-8 h-px bg-[#E10600]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-center mb-10">Häufige Fragen</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border border-white/10 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors min-h-[52px]">
                <span className="font-bold text-white text-sm pr-4">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#E10600] shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}/>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-5 text-[#B5B5B5] text-sm leading-relaxed border-t border-white/5 pt-4">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GallerySection from "../components/GallerySection";

const SERVICES = SERVICE_PACKAGES;

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-inter">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&q=80&auto=format"
            srcSet="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=75&auto=format 900w, https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80&auto=format 1400w, https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&q=80&auto=format 1800w"
            sizes="100vw"
            alt="Premium Fahrzeug bei Star Cars Wuppertal"
            fetchPriority="high"
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
                Wuppertal · Ronsdorfer Str. 57
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
              { icon: Star, title: "Über 5.000 Premium-Aufbereitungen", desc: "Jahrelange Erfahrung in Wuppertal und Umgebung." },
              { icon: MapPin, title: "Direkt an der StarTankstelle", desc: "Ronsdorfer Str. 57, 42119 Wuppertal – mit Parkplatz." },
              { icon: CreditCard, title: "Zahlung vor Ort", desc: "Bar oder per Karte bei Abholung – keine Vorkasse." },
              { icon: CheckCircle, title: "Kostenlose Stornierung", desc: "Jederzeit kostenfrei stornieren – ohne Gebühren." },
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
              { num: "01", title: "Paket wählen", desc: "BASIC, STANDARD, DELUXE oder EXCLUSIVE – transparente Festpreise, keine Überraschungen." },
              { num: "02", title: "Termin buchen", desc: "Datum und Uhrzeit wählen – alles in 2 Minuten online. Zahlung bequem vor Ort." },
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
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Unsere Pakete</h2>
            <p className="text-[#C9C9D1] mt-3 max-w-2xl">Vier transparente Festpreis-Pakete – vom schnellen Glanz bis zum Showroom-Finish.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E10600]/10">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-[#131313] overflow-hidden flex flex-col relative"
              >
                {/* Red accent line top */}
                <div className="h-0.5 bg-[#E10600]" />
                {service.badge && (
                  <span className="absolute top-3 right-3 z-10 bg-[#E10600] text-white text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-1">
                    {service.badge}
                  </span>
                )}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-50 group-hover:brightness-60"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-white tracking-wide">{service.name}</h3>
                  <div className="flex items-baseline gap-2 mt-1 mb-3">
                    <span className="font-mono font-bold text-[#E10600] text-3xl">{service.price_eur} €</span>
                  </div>
                  {service.tagline && (
                    <p className="text-white font-semibold text-sm uppercase tracking-wide mb-2">{service.tagline}</p>
                  )}
                  <p className="text-[#C9C9D1] leading-relaxed text-sm mb-4">{service.description}</p>

                  <ul className="space-y-2 mb-5">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[#C9C9D1] text-xs leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-[#E10600] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[#C0C0C0] text-xs font-mono mb-4">
                      <Clock className="w-3 h-3" />
                      <span>{service.duration_label}</span>
                    </div>
                    <Link
                      to="/booking"
                      className="inline-flex w-full items-center justify-center gap-2 bg-[#E10600] text-white font-bold px-6 py-3 hover:bg-[#c00500] transition-colors text-sm"
                    >
                      Jetzt buchen <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-[#C9C9D1] text-xs font-mono uppercase tracking-widest text-center">
            {ADDON_POLISH_NOTE}
          </p>
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
          <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=70&auto=format" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-10" />
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

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── KARTE ── */}
      <section className="py-16 bg-[#0B0B0B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[#E10600] text-sm font-mono tracking-[0.2em] uppercase">Anfahrt</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-black mb-4">So finden Sie uns</h2>
              <p className="text-[#B5B5B5] mb-6 leading-relaxed">Wir befinden uns direkt an der StarTankstelle in Wuppertal-Elberfeld. Ausreichend Parkplätze vorhanden.</p>
              <div className="space-y-3">
                {[
                  ["📍", "Ronsdorfer Str. 57, 42119 Wuppertal"],
                  ["📞", "01726871641"],
                  ["🕐", "Mo–Sa: 10:00–20:00 Uhr"],
                  ["✉️", "info@starcarswuppertal.com"],
                ].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-3 text-[#B5B5B5] text-sm">
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-white/10 overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=Ronsdorfer+Str.+57,+42119+Wuppertal&hl=de&z=15&output=embed"
                width="100%" height="320" style={{ border: 0, filter: "grayscale(80%) invert(90%) contrast(90%)" }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Star Cars Wuppertal Standort"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}