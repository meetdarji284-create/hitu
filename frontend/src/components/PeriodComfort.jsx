import { useState } from "react";
import SectionShell from "./SectionShell";
import { COMFORT_MESSAGES, CRAVINGS, PHOTOS } from "../data/hituData";

export default function PeriodComfort({ onBack }) {
  const [msg, setMsg] = useState(COMFORT_MESSAGES[0]);
  const [craving, setCraving] = useState(CRAVINGS[0]);
  const [heatLevel, setHeatLevel] = useState(2);

  const refresh = () => {
    setMsg(COMFORT_MESSAGES[Math.floor(Math.random() * COMFORT_MESSAGES.length)]);
    setCraving(CRAVINGS[Math.floor(Math.random() * CRAVINGS.length)]);
  };

  return (
    <SectionShell title="Period Comfort 🌸" subtitle="curl up, queen. i got you." onBack={onBack} testId="period-comfort-section">
      {/* Heating pad */}
      <div className="glass rounded-3xl p-5 mb-4">
        <p className="handwritten text-2xl text-white/90 mb-3">Virtual Heating Pad 🔥</p>
        <div
          className="relative h-32 rounded-2xl flex items-center justify-center overflow-hidden border border-orange-300/30"
          style={{
            background: `radial-gradient(circle at center, rgba(255, ${120 + heatLevel * 20}, 60, ${0.25 + heatLevel * 0.1}) 0%, rgba(255, 80, 40, 0.1) 50%, transparent 80%)`,
            animation: "heatPulse 2.5s ease-in-out infinite",
          }}
          data-testid="heating-pad"
        >
          <span className="text-6xl anim-float">🔥</span>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl opacity-70"
              style={{
                left: `${20 + i * 15}%`,
                bottom: 0,
                animation: `steam ${2 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              💨
            </span>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              data-testid={`heat-level-${lvl}`}
              onClick={() => setHeatLevel(lvl)}
              className={`flex-1 py-2 rounded-xl handwritten text-xl transition-all ${
                heatLevel === lvl ? "bg-[var(--sunflower)] text-black" : "glass text-white/70"
              }`}
            >
              {lvl === 1 ? "warm" : lvl === 2 ? "cozy" : "toasty"}
            </button>
          ))}
        </div>
      </div>

      {/* Today's comfort */}
      <div className="glass-yellow rounded-3xl p-5 mb-4">
        <p className="text-xs uppercase tracking-widest text-white/60 mb-2">Today's comfort suggestion</p>
        <p className="handwritten text-3xl text-white leading-tight">{msg}</p>
      </div>

      {/* Cravings */}
      <div className="glass rounded-3xl p-5 mb-4">
        <p className="text-xs uppercase tracking-widest text-white/60 mb-2">Craving radar 📡</p>
        <div className="flex items-center gap-4">
          <div className="text-5xl anim-wiggle">{craving.emoji}</div>
          <div>
            <p className="handwritten text-2xl text-[var(--sunflower)]">{craving.name}</p>
            <p className="text-xs text-white/60 italic">"{craving.note}"</p>
          </div>
        </div>
      </div>

      {/* photo memory */}
      <div className="flex justify-center my-6">
        <div className="polaroid" style={{ transform: "rotate(-3deg)", width: 200 }}>
          <img src={PHOTOS.sunflowerHug} alt="hitu with sunflower" />
          <p className="polaroid-caption">my sunshine 🌻</p>
        </div>
      </div>

      <button onClick={refresh} data-testid="refresh-comfort" className="sticker-btn w-full">
        🔄 new comfort, please
      </button>
    </SectionShell>
  );
}
