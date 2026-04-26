import { useState, useRef, useCallback } from "react";

export default function BeforeAfterSlider({ before, after, label }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  const onMouseDown = (e) => { dragging.current = true; updatePos(e.clientX); };
  const onMouseMove = (e) => { if (dragging.current) updatePos(e.clientX); };
  const onMouseUp = () => { dragging.current = false; };
  const onTouchMove = (e) => { updatePos(e.touches[0].clientX); };

  return (
    <div className="relative w-full overflow-hidden select-none rounded-sm" style={{ aspectRatio: "16/10" }}
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      {/* After (full) */}
      <img src={after} alt="Nach der Aufbereitung" className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="Vor der Aufbereitung" className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: "100vw", maxWidth: "none" }} draggable={false} />
      </div>

      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xl cursor-ew-resize">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 10L2 7v6l4-3zm8 0l4-3v6l-4-3z" fill="#0B0B0B" />
            <line x1="10" y1="3" x2="10" y2="17" stroke="#0B0B0B" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-bold px-2 py-1 font-mono uppercase tracking-wider">Vorher</div>
      <div className="absolute top-3 right-3 bg-[#E10600]/80 text-white text-xs font-bold px-2 py-1 font-mono uppercase tracking-wider">Nachher</div>

      {/* Service label */}
      {label && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
          <span className="text-white text-sm font-semibold">{label}</span>
        </div>
      )}
    </div>
  );
}