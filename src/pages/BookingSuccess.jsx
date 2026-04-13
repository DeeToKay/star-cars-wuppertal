import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

export default function BookingSuccess() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />
      <div className="pt-20 flex items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-lg"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#E30613]" />
            <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Buchung bestätigt</span>
            <div className="w-8 h-px bg-[#E30613]" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Zahlung erfolgreich!</h1>
          <p className="text-[#A1A1AA] text-lg leading-relaxed mb-10">
            Ihre Buchung bei Star Cars Wuppertal wurde erfolgreich bestätigt. Wir freuen uns auf Sie!
          </p>
          <div className="bg-[#161618] border border-white/10 p-6 mb-8">
            <p className="text-[#A1A1AA] text-sm">
              📍 <strong className="text-white">Star Cars Wuppertal</strong> — Ronsdorferstr 57<br />
              Sie erhalten eine Benachrichtigung, sobald Ihr Fahrzeug fertig ist.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 bg-[#E30613] text-white font-bold px-8 py-3 hover:bg-[#c0000f] transition-colors"
            >
              Meine Buchungen <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-3 hover:border-white/50 transition-colors"
            >
              Zurück zur Startseite
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}