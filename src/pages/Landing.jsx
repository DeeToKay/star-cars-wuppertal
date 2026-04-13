import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, Shield, Zap, MapPin, Phone, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SERVICES = [
  {
    name: "Express-Reinigung",
    description: "Professionelle Außenwäsche, Felgenreinigung, Trocknung und Basis-Innenreinigung. Schnell, präzise, makellos.",
    price: "39.99",
    duration: "45 Min.",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
  },
  {
    name: "Premium Detailing",
    description: "Vollständige Innen- und Außenreinigung, Lederbehandlung, Lackpolitur und Versiegelung.",
    price: "149.99",
    duration: "180 Min.",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
  },
  {
    name: "Smart Repair",
    description: "Professionelle Beseitigung von Kratzern, Dellen und Lackschäden. Restauration auf Werksstandard.",
    price: "199.99",
    duration: "240 Min.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    name: "VIP Komplettpaket",
    description: "Das Ultimative: Detailing, Smart Repair, Scheibenreinigung, Ozonbehandlung und Langzeit-Versiegelung.",
    price: "349.99",
    duration: "360 Min.",
    image: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/85 to-[#0A0A0B]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#E30613]" />
              <span className="text-[#E30613] text-sm font-mono tracking-[0.2em] uppercase">
                Wuppertal · Ronsdorferstr 57
              </span>
            </div>

            <h1 className="font-inter font-black leading-none tracking-tighter mb-2">
              <span className="block text-6xl md:text-8xl lg:text-[7rem] text-white">STAR CARS</span>
              <div className="w-full max-w-xl h-px bg-[#E30613] my-4" />
              <span className="block text-4xl md:text-5xl lg:text-6xl text-white/90">WUPPERTAL</span>
            </h1>

            <p className="mt-6 text-xl text-[#A1A1AA] max-w-lg leading-relaxed">
              VIP Autowäsche &amp; Smart Repair — Perfektion im Detail. Professionelle Pflege für Ihr Fahrzeug auf höchstem Niveau.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="group relative inline-flex items-center gap-3 bg-[#E30613] text-white font-bold text-lg px-8 py-4 overflow-hidden transition-all duration-300 hover:bg-[#c0000f]"
              >
                <span className="relative z-10">Termin buchen</span>
                <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center gap-3 border border-white/20 text-white font-semibold text-lg px-8 py-4 hover:border-[#E30613] hover:text-[#E30613] transition-all duration-300"
              >
                Unsere Services
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-md"
          >
            {[
              { val: "500+", label: "Fahrzeuge" },
              { val: "4.9★", label: "Bewertung" },
              { val: "5J", label: "Erfahrung" },
            ].map((s) => (
              <div key={s.label} className="border-l-2 border-[#E30613] pl-4">
                <div className="font-mono font-bold text-2xl text-white">{s.val}</div>
                <div className="text-[#A1A1AA] text-sm">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#E30613]" />
              <span className="text-[#E30613] text-sm font-mono tracking-[0.2em] uppercase">Leistungen</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Unsere Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E30613]/20">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative bg-[#161618] overflow-hidden"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-50 group-hover:brightness-60"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                    <div className="text-right">
                      <div className="font-mono font-bold text-[#E30613] text-xl">€{service.price}</div>
                      <div className="font-mono text-[#A1A1AA] text-xs">{service.duration}</div>
                    </div>
                  </div>
                  <p className="text-[#A1A1AA] leading-relaxed text-sm">{service.description}</p>
                  <Link
                    to="/booking"
                    className="mt-6 inline-flex items-center gap-2 text-[#E30613] text-sm font-semibold hover:gap-3 transition-all"
                  >
                    Jetzt buchen <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-[#161618]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#E30613]" />
              <span className="text-[#E30613] text-sm font-mono tracking-[0.2em] uppercase">Warum wir</span>
              <div className="w-8 h-px bg-[#E30613]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Premium Standard</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Star, title: "Premium Qualität", desc: "Nur die besten Produkte und Techniken für Ihr Fahrzeug." },
              { icon: Clock, title: "Pünktlichkeit", desc: "Wir halten Ihre Zeit in Ehren. Termine werden eingehalten." },
              { icon: Shield, title: "Garantie", desc: "Unsere Arbeit steht für sich. 100% Zufriedenheitsgarantie." },
              { icon: Zap, title: "Express-Option", desc: "Keine Zeit? Unser Express-Service macht Ihr Auto in 45 Min. fit." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 border border-white/10 hover:border-[#E30613]/50 transition-all duration-300"
              >
                <item.icon className="w-8 h-8 text-[#E30613] mb-4" />
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#E30613] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-px bg-black" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-black" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Ihr Auto verdient das Beste.
            </h2>
            <p className="text-white/80 text-xl mb-10">
              Jetzt online buchen und noch heute einen Termin sichern.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-3 bg-black text-white font-bold text-xl px-10 py-5 hover:bg-[#0A0A0B] transition-all duration-300"
            >
              Termin buchen <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}