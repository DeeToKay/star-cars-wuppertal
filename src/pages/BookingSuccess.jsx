import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, MapPin, Phone, Clock, CreditCard } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BookingSuccess() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />
      <div className="pt-20 flex items-center justify-center min-h-screen px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-lg w-full"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#E30613]" />
            <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Buchung bestätigt</span>
            <div className="w-8 h-px bg-[#E30613]" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Reservierung erfolgreich!</h1>
          <p className="text-[#A1A1AA] text-lg leading-relaxed mb-8">
            Ihre Reservierung bei Star Cars Wuppertal wurde bestätigt. Sie erhalten gleich eine Bestätigungs-E-Mail.
          </p>

          <div className="bg-[#161618] border border-white/10 p-6 mb-6 text-left space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#E30613] mt-0.5 shrink-0"/>
              <div>
                <div className="text-white font-bold text-sm">Star Cars Wuppertal</div>
                <div className="text-[#A1A1AA] text-sm">Ronsdorfer Str. 57, 42119 Wuppertal</div>
                <div className="text-[#A1A1AA] text-xs">(an der StarTankstelle)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-[#E30613] shrink-0"/>
              <div className="text-[#A1A1AA] text-sm"><span className="text-white font-bold">Zahlung vor Ort</span> – bar oder per Karte bei Abholung</div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#E30613] shrink-0"/>
              <div className="text-[#A1A1AA] text-sm">Stornierung jederzeit kostenfrei – per E-Mail oder Telefon</div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#E30613] shrink-0"/>
              <a href="tel:01726871641" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">01726871641</a>
            </div>
          </div>

          <p className="text-[#A1A1AA] text-sm mb-8">Wir benachrichtigen Sie per E-Mail, sobald Ihr Fahrzeug fertig ist.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="flex items-center justify-center gap-2 bg-[#E30613] text-white font-bold px-8 py-3 hover:bg-[#c0000f] transition-colors min-h-[48px]">
              Meine Buchungen <ArrowRight className="w-4 h-4"/>
            </Link>
            <Link to="/" className="flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-3 hover:border-white/50 transition-colors min-h-[48px]">
              Zur Startseite
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer/>
    </div>
  );
}