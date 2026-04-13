import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { ArrowRight, ArrowLeft, Check, Clock, Euro, Calendar, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function BookingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=service, 2=datetime, 3=details, 4=checkout
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [takenSlots, setTakenSlots] = useState([]);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) {
        base44.auth.redirectToLogin("/booking");
        return;
      }
      const me = await base44.auth.me();
      setUser(me);
      if (me.phone_number) setPhone(me.phone_number);
    });
    base44.entities.Service.list().then(setServices);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    base44.entities.Booking.filter({ appointment_date: selectedDate }).then((bookings) => {
      setTakenSlots(bookings.map((b) => b.appointment_time));
    });
  }, [selectedDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const adjustedFirstDay = (firstDay + 6) % 7; // Mon=0

  const formatDate = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const isDayDisabled = (day) => {
    const d = new Date(calYear, calMonth, day);
    return d < today || d.getDay() === 0; // No Sundays
  };

  const handleDateSelect = (day) => {
    if (isDayDisabled(day)) return;
    setSelectedDate(formatDate(calYear, calMonth, day));
    setSelectedTime(null);
  };

  const handleCheckout = async () => {
    if (!phone.trim() || !/^[\d\s\+\-\(\)]{6,}$/.test(phone)) {
      setError("Bitte eine gültige Telefonnummer eingeben.");
      return;
    }
    if (window.self !== window.top) {
      alert("Die Zahlung ist nur in der veröffentlichten App verfügbar.");
      return;
    }
    setCheckoutLoading(true);
    setError("");
    try {
      await base44.auth.updateMe({ phone_number: phone });
      const response = await base44.functions.invoke("createCheckoutSession", {
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_price: selectedService.price_eur,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        phone_number: phone,
        user_id: user.id,
        user_email: user.email,
        user_name: user.full_name,
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        setError("Fehler beim Erstellen der Zahlungssitzung.");
      }
    } catch (e) {
      setError("Fehler: " + (e.message || "Unbekannter Fehler."));
    }
    setCheckoutLoading(false);
  };

  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const dayNames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />
      <div className="pt-20 max-w-5xl mx-auto px-6 py-16">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-px bg-[#E30613]" />
            <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Buchungsprozess</span>
          </div>
          <div className="flex items-center gap-0">
            {["Service", "Datum & Zeit", "Details", "Bezahlung"].map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                  step === i + 1 ? "text-white" : step > i + 1 ? "text-[#E30613]" : "text-[#A1A1AA]"
                }`}>
                  <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold border transition-all ${
                    step > i + 1 ? "border-[#E30613] bg-[#E30613] text-white" :
                    step === i + 1 ? "border-white text-white" : "border-white/20 text-[#A1A1AA]"
                  }`}>
                    {step > i + 1 ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className="hidden sm:block">{label}</span>
                </div>
                {i < 3 && <div className="w-8 h-px bg-white/10" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Service */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black mb-8">Service wählen</h2>
                  {services.length === 0 ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin text-[#E30613]" />
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {services.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedService(s)}
                          className={`w-full text-left p-6 border transition-all duration-300 ${
                            selectedService?.id === s.id
                              ? "border-[#E30613] bg-[#E30613]/10"
                              : "border-white/10 bg-[#161618] hover:border-white/30"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-bold text-white text-lg">{s.name}</div>
                              <div className="text-[#A1A1AA] text-sm mt-1 leading-relaxed">{s.description}</div>
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1 text-[#A1A1AA] text-xs">
                                  <Clock className="w-3 h-3" />
                                  <span>{s.duration_minutes} Min.</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-mono font-bold text-[#E30613] text-xl">€{Number(s.price_eur).toFixed(2)}</div>
                              {selectedService?.id === s.id && (
                                <div className="mt-2">
                                  <Check className="w-5 h-5 text-[#E30613] ml-auto" />
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="mt-8 flex justify-end">
                    <button
                      disabled={!selectedService}
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 bg-[#E30613] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold px-8 py-3 hover:bg-[#c0000f] transition-colors"
                    >
                      Weiter <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black mb-8">Datum & Uhrzeit</h2>
                  <div className="bg-[#161618] border border-white/10 p-6 mb-6">
                    {/* Calendar header */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => {
                          if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                          else setCalMonth(m => m - 1);
                        }}
                        className="text-[#A1A1AA] hover:text-white transition-colors p-1"
                      >
                        ‹
                      </button>
                      <span className="font-bold text-white">{monthNames[calMonth]} {calYear}</span>
                      <button
                        onClick={() => {
                          if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                          else setCalMonth(m => m + 1);
                        }}
                        className="text-[#A1A1AA] hover:text-white transition-colors p-1"
                      >
                        ›
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map(d => (
                        <div key={d} className="text-center text-[#A1A1AA] text-xs font-mono py-1">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: adjustedFirstDay }).map((_, i) => <div key={`e${i}`} />)}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = formatDate(calYear, calMonth, day);
                        const disabled = isDayDisabled(day);
                        const selected = selectedDate === dateStr;
                        return (
                          <button
                            key={day}
                            onClick={() => handleDateSelect(day)}
                            disabled={disabled}
                            className={`aspect-square flex items-center justify-center text-sm font-medium transition-all ${
                              selected ? "bg-[#E30613] text-white" :
                              disabled ? "text-white/20 cursor-not-allowed" :
                              "text-white hover:bg-white/10"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedDate && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <h3 className="text-sm font-bold text-[#A1A1AA] uppercase tracking-widest mb-4 font-mono">
                        Verfügbare Zeiten
                      </h3>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {TIME_SLOTS.map((t) => {
                          const taken = takenSlots.includes(t);
                          return (
                            <button
                              key={t}
                              disabled={taken}
                              onClick={() => setSelectedTime(t)}
                              className={`py-2 text-sm font-mono font-medium border transition-all ${
                                selectedTime === t ? "border-[#E30613] bg-[#E30613] text-white" :
                                taken ? "border-white/5 text-white/20 cursor-not-allowed line-through" :
                                "border-white/20 text-white hover:border-[#E30613] hover:text-[#E30613]"
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-8 flex justify-between">
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Zurück
                    </button>
                    <button
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 bg-[#E30613] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold px-8 py-3 hover:bg-[#c0000f] transition-colors"
                    >
                      Weiter <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Details */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black mb-8">Ihre Kontaktdaten</h2>
                  <div className="bg-[#161618] border border-white/10 p-8">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Name</label>
                      <div className="border border-white/10 bg-[#0A0A0B] px-4 py-3 text-white text-sm">
                        {user?.full_name || "—"}
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-[#A1A1AA] mb-2">E-Mail</label>
                      <div className="border border-white/10 bg-[#0A0A0B] px-4 py-3 text-white text-sm">
                        {user?.email || "—"}
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                        Telefonnummer <span className="text-[#E30613]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+49 202 000 0000"
                        className="w-full border border-white/10 bg-[#0A0A0B] px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E30613] transition-colors"
                      />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-[#E30613] text-sm mt-4">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button onClick={() => setStep(2)} className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Zurück
                    </button>
                    <button
                      disabled={!phone.trim()}
                      onClick={() => { setError(""); setStep(4); }}
                      className="flex items-center gap-2 bg-[#E30613] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold px-8 py-3 hover:bg-[#c0000f] transition-colors"
                    >
                      Weiter zur Zahlung <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Checkout */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-black mb-8">Bestellung bestätigen</h2>
                  <div className="bg-[#161618] border border-white/10 p-8 mb-6">
                    <h3 className="text-[#A1A1AA] text-xs font-mono tracking-widest uppercase mb-6">Buchungsübersicht</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-[#A1A1AA] text-sm">Service</span>
                        <span className="text-white font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-[#A1A1AA] text-sm">Datum</span>
                        <span className="text-white font-mono">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-[#A1A1AA] text-sm">Uhrzeit</span>
                        <span className="text-white font-mono">{selectedTime} Uhr</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-[#A1A1AA] text-sm">Dauer</span>
                        <span className="text-white font-mono">{selectedService?.duration_minutes} Min.</span>
                      </div>
                      <div className="flex justify-between items-center py-4">
                        <span className="text-white font-bold text-lg">Gesamtbetrag</span>
                        <span className="text-[#E30613] font-mono font-bold text-2xl">
                          €{Number(selectedService?.price_eur).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-[#E30613] text-sm mb-6 bg-[#E30613]/10 border border-[#E30613]/30 p-4">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button onClick={() => setStep(3)} className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Zurück
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="flex items-center gap-3 bg-[#E30613] disabled:opacity-50 text-white font-bold px-8 py-4 hover:bg-[#c0000f] transition-colors text-lg"
                    >
                      {checkoutLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Wird verarbeitet...</>
                      ) : (
                        <>Jetzt bezahlen <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#161618] border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-px bg-[#E30613]" />
                <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Order Spec</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[#A1A1AA] text-xs uppercase tracking-wider mb-1">Service</div>
                  <div className="text-white font-medium">{selectedService?.name || "—"}</div>
                </div>
                <div>
                  <div className="text-[#A1A1AA] text-xs uppercase tracking-wider mb-1">Datum</div>
                  <div className="text-white font-mono text-sm">{selectedDate || "—"}</div>
                </div>
                <div>
                  <div className="text-[#A1A1AA] text-xs uppercase tracking-wider mb-1">Uhrzeit</div>
                  <div className="text-white font-mono text-sm">{selectedTime ? `${selectedTime} Uhr` : "—"}</div>
                </div>
                <div>
                  <div className="text-[#A1A1AA] text-xs uppercase tracking-wider mb-1">Dauer</div>
                  <div className="text-white font-mono text-sm">{selectedService ? `${selectedService.duration_minutes} Min.` : "—"}</div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[#A1A1AA] text-sm">Gesamt</span>
                    <span className="text-[#E30613] font-mono font-bold text-xl">
                      {selectedService ? `€${Number(selectedService.price_eur).toFixed(2)}` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}