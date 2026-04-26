import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Fetches logo URL from Settings entity; falls back to text placeholder
export default function LogoMark({ height = 56, footer = false }) {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    base44.entities.Settings.filter({ key: "logo_url" })
      .then(res => { if (res.length > 0 && res[0].value) setLogoUrl(res[0].value); })
      .catch(() => {});
  }, []);

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Star Cars Wuppertal"
        style={{ height: `${height}px`, width: "auto" }}
        className="object-contain"
      />
    );
  }

  // Text placeholder logo
  if (footer) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="w-1 h-8 bg-[#E10600]" />
          <span className="font-black text-white text-xl tracking-tight leading-none">STAR CARS</span>
        </div>
        <div className="border-b-2 border-[#E10600] mt-1 mb-1" />
        <span className="text-[#C0C0C0] text-[10px] font-mono tracking-widest uppercase ml-3">
          Autoaufbereitung &amp; Smart Repair
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-10 bg-[#E10600]" />
      <div>
        <div className="font-black text-white text-xl tracking-tight leading-none">STAR CARS</div>
        <div className="border-b border-[#E10600] mb-0.5" />
        <div className="text-[#C0C0C0] text-[9px] font-mono tracking-widest uppercase">
          AUTOAUFBEREITUNG &amp; SMART REPAIR
        </div>
      </div>
    </div>
  );
}