import { useEffect, useState } from "react";
import { SURPRISES } from "../data/hituData";

export default function SurprisePopup({ trigger }) {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (trigger == null) return;
    setMsg(SURPRISES[Math.floor(Math.random() * SURPRISES.length)]);
    const t = setTimeout(() => setMsg(null), 3500);
    return () => clearTimeout(t);
  }, [trigger]);

  // also random auto-surprises every 75-120s
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.5) {
        setMsg(SURPRISES[Math.floor(Math.random() * SURPRISES.length)]);
        setTimeout(() => setMsg(null), 3500);
      }
    }, 85000);
    return () => clearInterval(id);
  }, []);

  if (!msg) return null;

  return (
    <div
      className="fixed inset-x-4 top-20 z-50 flex justify-center pointer-events-none"
      data-testid="surprise-popup"
    >
      <div className="glass-yellow rounded-2xl px-5 py-3 max-w-sm anim-fade-up pointer-events-auto anim-pulse-glow">
        <p className="handwritten text-2xl text-white text-center leading-tight">{msg}</p>
      </div>
    </div>
  );
}
