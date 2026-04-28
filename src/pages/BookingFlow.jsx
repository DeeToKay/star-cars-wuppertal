import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { ArrowRight, ArrowLeft, Check, Clock, AlertCircle, Loader2, Car } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ALL_TIME_SLOTS = [
  "10:00","10:30","11:00","11:30","12:00","12:30",
  "13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00","17:30","18:00","18:30",
  "19:00","19:30",
];

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function getAvailableSlots(durationMinutes) {
  return ALL_TIME_SLOTS.filter(t => timeToMinutes(t) + durationMinutes <= 20 * 60);
}

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

function validatePhone(phone) {
  return /^[\d\s\+\-\(\)]{7,20}$/.test(phone.trim());
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const STEPS = ["Service", "Datum & Zeit", "Kontaktdaten", "Bestätigen"];
const MAX_BAYS = 3;

const monthNames = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const dayNames = ["Mo","Di","Mi","Do","Fr","Sa","So"];

export default function BookingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slotCounts, setSlotCounts] = useState({});
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  // Contact details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [agbAccepted, setAgbAccepted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const honeypotRef = useRef(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
        setName(me.full_name || "");
        setEmail(me.email || "");
      }
    });
    base44.entities.Service.list().then(setServices);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    base44.entities.Booking.filter({ appointment_date: selectedDate }).then((bookings) => {
      const counts = {};
      bookings.forEach(b => {
        if (b.status !== "Cancelled" && b.status !== "No-Show") {
          counts[b.appointment_time] = (counts[b.appointment_time] || 0) + 1;
        }
      });
      setSlotCounts(counts);
    });
  }, [selectedDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const adjustedFirstDay = (firstDay + 6) % 7;

  const fmtDate = (y, m, d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const isDayDisabled = (day) => { const d = new Date(calYear, calMonth, day); return d < today || d.getDay() === 0; };
  const handleDateSelect = (day) => { if (isDayDisabled(day)) return; setSelectedDate(fmtDate(calYear, calMonth, day)); setSelectedTime(null); };

  const handleSubmit = async () => {
    // Honeypot check
    if (honeypotRef.current?.value) return;

    if (!name.trim()) { setError("Bitte geben Sie Ihren Namen ein."); return; }
    if (!validateEmail(email)) { setError("Bitte eine gültige E-Mail-Adresse eingeben."); return; }
    if (!validatePhone(phone)) { setError("Bitte eine gültige Telefonnummer eingeben (z.B. +49 202 123456)."); return; }
    if (!agbAccepted) { setError("Bitte akzeptieren Sie die AGB und Datenschutzerklärung."); return; }

    setSubmitting(true);
    setError("");
    try {
      const response = await base44.functions.invoke("createBooking", {
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_price: selectedService.price_eur,
        service_duration: selectedService.duration_minutes,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        phone_number: phone.trim(),
        user_id: user?.id || null,
        user_email: email.trim(),
        user_name: name.trim(),
        license_plate: licensePlate.trim().toUpperCase(),
        agb_accepted: true,
      });
      const data = response?.data ?? response;
      if (data?.success) {
        navigate("/booking-success");
      } else {
        setError(data?.error || "Fehler beim Erstellen der Buchung. Bitte später erneut versuchen.");
      }
    } catch (e) {
      const apiMsg = e?.response?.data?.error || e?.data?.error;
      setError(apiMsg || e?.message || "Unbekannter Fehler. Bitte versuchen Sie es erneut.");
    }
    setSubmitting(false);
  };

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter">
      <Navbar />
      <div className="pt-20 max-w-5xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-px bg-[#E30613]" />
            <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Buchungsprozess</span>
          </div>
          <div className="flex items-center gap-0 flex-wrap gap-y-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all ${step===i+1?"text-white":step>i+1?"text-[#E30613]":"text-[#A1A1AA]"}`}>
                  <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold border transition-all ${step>i+1?"border-[#E30613] bg-[#E30613] text-white":step===i+1?"border-white text-white":"border-white/20 text-[#A1A1AA]"}`}>
                    {step>i+1?<Check className="w-3 h-3"/>:i+1}
                  </div>
                  <span className="hidden sm:block">{label}</span>
                </div>
                {i<3&&<div className="w-6 h-px bg-white/10"/>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* STEP 1: Service */}
              {step===1 && (
                <motion.div key="s1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                  <h2 className="text-2xl font-black mb-6">Service wählen</h2>
                  {services.length===0 ? (
                    <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#E30613]"/></div>
                  ) : (
                    <div className="grid gap-4">
                      {services.map(s => (
                        <button key={s.id} onClick={()=>setSelectedService(s)}
                          className={`w-full text-left p-5 border transition-all min-h-[44px] ${selectedService?.id===s.id?"border-[#E30613] bg-[#E30613]/10":"border-white/10 bg-[#161618] hover:border-white/30"}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-bold text-white text-lg">{s.name}</div>
                              <div className="text-[#A1A1AA] text-sm mt-1">{s.description}</div>
                              <div className="flex items-center gap-1 text-[#A1A1AA] text-xs mt-2">
                                <Clock className="w-3 h-3"/><span>{s.duration_minutes} Min.</span>
                              </div>
                            </div>
                            <div className="text-right ml-4 shrink-0">
                              <div className="font-mono font-bold text-[#E30613] text-xl">€{Number(s.price_eur).toFixed(2)}</div>
                              {selectedService?.id===s.id && <Check className="w-5 h-5 text-[#E30613] ml-auto mt-2"/>}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <button disabled={!selectedService} onClick={()=>setStep(2)}
                      className="flex items-center gap-2 bg-[#E30613] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold px-8 py-3 hover:bg-[#c0000f] transition-colors min-h-[48px]">
                      Weiter <ArrowRight className="w-4 h-4"/>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Date & Time */}
              {step===2 && (
                <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                  <h2 className="text-2xl font-black mb-6">Datum & Uhrzeit</h2>
                  <div className="bg-[#161618] border border-white/10 p-5 mb-5">
                    <div className="flex items-center justify-between mb-5">
                      <button onClick={prevMonth} className="text-[#A1A1AA] hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">‹</button>
                      <span className="font-bold text-white">{monthNames[calMonth]} {calYear}</span>
                      <button onClick={nextMonth} className="text-[#A1A1AA] hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">›</button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map(d => <div key={d} className="text-center text-[#A1A1AA] text-xs font-mono py-1">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({length:adjustedFirstDay}).map((_,i)=><div key={`e${i}`}/>)}
                      {Array.from({length:daysInMonth}).map((_,i)=>{
                        const day=i+1, dateStr=fmtDate(calYear,calMonth,day), disabled=isDayDisabled(day), selected=selectedDate===dateStr;
                        return (
                          <button key={day} onClick={()=>handleDateSelect(day)} disabled={disabled}
                            className={`aspect-square flex items-center justify-center text-sm font-medium transition-all min-h-[36px] ${selected?"bg-[#E30613] text-white":disabled?"text-white/20 cursor-not-allowed":"text-white hover:bg-white/10"}`}>
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedDate && (
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                      <h3 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest mb-3 font-mono">Verfügbare Zeiten</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {getAvailableSlots(selectedService?.duration_minutes||60).map(t=>{
                          const count=slotCounts[t]||0, full=count>=MAX_BAYS;
                          return (
                            <button key={t} disabled={full} onClick={()=>setSelectedTime(t)}
                              className={`py-3 text-sm font-mono border transition-all min-h-[44px] ${selectedTime===t?"border-[#E30613] bg-[#E30613] text-white":full?"border-white/5 text-white/20 cursor-not-allowed line-through":count>0?"border-yellow-500/40 text-yellow-300 hover:border-[#E30613]":"border-white/20 text-white hover:border-[#E30613] hover:text-[#E30613]"}`}>
                              {t}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-[#A1A1AA]">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 border border-white/20 inline-block"/> Frei</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 border border-yellow-500/40 inline-block"/> Teilweise belegt</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 border border-white/5 opacity-30 inline-block"/> Ausgebucht</span>
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <button onClick={()=>setStep(1)} className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors min-h-[44px] px-2">
                      <ArrowLeft className="w-4 h-4"/> Zurück
                    </button>
                    <button disabled={!selectedDate||!selectedTime} onClick={()=>setStep(3)}
                      className="flex items-center gap-2 bg-[#E30613] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold px-8 py-3 hover:bg-[#c0000f] transition-colors min-h-[48px]">
                      Weiter <ArrowRight className="w-4 h-4"/>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Kontaktdaten */}
              {step===3 && (
                <motion.div key="s3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                  <h2 className="text-2xl font-black mb-6">Kontaktdaten</h2>
                  <div className="bg-[#161618] border border-white/10 p-6 space-y-5">
                    {/* Honeypot */}
                    <input ref={honeypotRef} type="text" name="website" autoComplete="off" className="hidden" tabIndex={-1}/>

                    <div>
                      <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Name <span className="text-[#E30613]">*</span></label>
                      <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Max Mustermann"
                        className="w-full border border-white/10 bg-[#0A0A0B] px-4 text-white text-sm focus:outline-none focus:border-[#E30613] transition-colors h-12"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#A1A1AA] mb-2">E-Mail <span className="text-[#E30613]">*</span></label>
                      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="max@beispiel.de"
                        readOnly={!!user?.email}
                        className={`w-full border border-white/10 bg-[#0A0A0B] px-4 text-white text-sm focus:outline-none focus:border-[#E30613] transition-colors h-12 ${user?.email?"opacity-60 cursor-not-allowed":""}`}/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Telefon <span className="text-[#E30613]">*</span></label>
                      <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+49 202 123456"
                        className="w-full border border-white/10 bg-[#0A0A0B] px-4 text-white text-sm focus:outline-none focus:border-[#E30613] transition-colors h-12"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                        <Car className="w-3 h-3 inline mr-1"/>Kennzeichen <span className="text-[#A1A1AA] font-normal">(optional)</span>
                      </label>
                      <input type="text" value={licensePlate} onChange={e=>setLicensePlate(e.target.value.toUpperCase())} placeholder="WU AB 1234" maxLength={12}
                        className="w-full border border-white/10 bg-[#0A0A0B] px-4 text-white text-sm focus:outline-none focus:border-[#E30613] transition-colors h-12 font-mono"/>
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 text-[#E30613] text-sm bg-[#E30613]/10 border border-[#E30613]/30 p-3">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/><span>{error}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button onClick={()=>setStep(2)} className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors min-h-[44px] px-2">
                      <ArrowLeft className="w-4 h-4"/> Zurück
                    </button>
                    <button disabled={!name.trim()||!email.trim()||!phone.trim()} onClick={()=>{setError("");setStep(4);}}
                      className="flex items-center gap-2 bg-[#E30613] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold px-8 py-3 hover:bg-[#c0000f] transition-colors min-h-[48px]">
                      Weiter <ArrowRight className="w-4 h-4"/>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Bestätigen */}
              {step===4 && (
                <motion.div key="s4" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                  <h2 className="text-2xl font-black mb-6">Buchung bestätigen</h2>
                  <div className="bg-[#161618] border border-white/10 p-6 mb-5">
                    <h3 className="text-[#A1A1AA] text-xs font-mono tracking-widest uppercase mb-5">Übersicht</h3>
                    <div className="space-y-3">
                      {[
                        ["Service", selectedService?.name],
                        ["Datum", selectedDate],
                        ["Uhrzeit", `${selectedTime} Uhr`],
                        ["Dauer", `${selectedService?.duration_minutes} Min.`],
                        ["Name", name],
                        ["E-Mail", email],
                        ["Telefon", phone],
                        ...(licensePlate ? [["Kennzeichen", licensePlate]] : []),
                      ].map(([k,v]) => (
                        <div key={k} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                          <span className="text-[#A1A1AA] text-sm">{k}</span>
                          <span className="text-white font-mono text-sm">{v}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-3">
                        <span className="text-white font-bold">Preis</span>
                        <span className="text-[#E30613] font-mono font-bold text-xl">€{Number(selectedService?.price_eur).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment notice */}
                  <div className="bg-[#1A1A1A] border border-[#C0C0C0]/20 p-4 mb-5 flex items-start gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <div className="text-white font-bold text-sm">Zahlung vor Ort</div>
                      <div className="text-[#A1A1AA] text-xs mt-1">Bar oder per Karte bei Abholung Ihres Fahrzeugs. Keine Vorkasse erforderlich.</div>
                    </div>
                  </div>

                  {/* AGB Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer mb-5 group">
                    <div className={`mt-0.5 w-5 h-5 border flex items-center justify-center shrink-0 transition-all ${agbAccepted?"border-[#E30613] bg-[#E30613]":"border-white/30 group-hover:border-white/60"}`}
                      onClick={()=>setAgbAccepted(v=>!v)}>
                      {agbAccepted && <Check className="w-3 h-3 text-white"/>}
                    </div>
                    <span className="text-sm text-[#A1A1AA] leading-relaxed">
                      Ich akzeptiere die <Link to="/agb" target="_blank" className="text-[#E30613] hover:underline">AGB</Link> und habe die <Link to="/datenschutz" target="_blank" className="text-[#E30613] hover:underline">Datenschutzerklärung</Link> zur Kenntnis genommen.
                    </span>
                  </label>

                  {error && (
                    <div className="flex items-start gap-2 text-[#E30613] text-sm mb-4 bg-[#E30613]/10 border border-[#E30613]/30 p-3">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/><span>{error}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button onClick={()=>setStep(3)} className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors min-h-[44px] px-2">
                      <ArrowLeft className="w-4 h-4"/> Zurück
                    </button>
                    <button onClick={handleSubmit} disabled={submitting||!agbAccepted}
                      className="flex items-center gap-3 bg-[#E30613] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-4 hover:bg-[#c0000f] transition-colors text-base min-h-[48px]">
                      {submitting ? <><Loader2 className="w-5 h-5 animate-spin"/> Wird reserviert…</> : <>Termin verbindlich reservieren <ArrowRight className="w-5 h-5"/></>}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Sidebar summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#161618] border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-4 h-px bg-[#E30613]"/>
                <span className="text-[#E30613] text-xs font-mono tracking-widest uppercase">Ihre Buchung</span>
              </div>
              <div className="space-y-4">
                {[
                  {l:"Service", v:selectedService?.name||"—"},
                  {l:"Datum", v:selectedDate||"—"},
                  {l:"Uhrzeit", v:selectedTime?`${selectedTime} Uhr`:"—"},
                  {l:"Dauer", v:selectedService?`${selectedService.duration_minutes} Min.`:"—"},
                ].map(({l,v})=>(
                  <div key={l}>
                    <div className="text-[#A1A1AA] text-xs uppercase tracking-wider mb-1">{l}</div>
                    <div className="text-white font-mono text-sm">{v}</div>
                  </div>
                ))}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[#A1A1AA] text-sm">Gesamt</span>
                    <span className="text-[#E30613] font-mono font-bold text-xl">
                      {selectedService?`€${Number(selectedService.price_eur).toFixed(2)}`:"—"}
                    </span>
                  </div>
                  <div className="text-[#A1A1AA] text-xs mt-2">💳 Zahlung vor Ort</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}