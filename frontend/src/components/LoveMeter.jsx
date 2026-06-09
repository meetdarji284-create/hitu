import { useState } from "react";
import SectionShell from "./SectionShell";

const MESSAGES = [
  { min: 0, text: "press the button, pagli 💔" },
  { min: 1, text: "barely registered — try harder 🥺" },
  { min: 25, text: "okay we're getting somewhere ❤️" },
  { min: 50, text: "this is a healthy amount of love 💛" },
  { min: 75, text: "you have my whole heart, Hitu 🌻" },
  { min: 95, text: "machine overheating from too much love 🔥" },
  { min: 100, text: "INFINITE LOVE DETECTED. system loves you forever ♾️❤️" },
];

export default function LoveMeter({ onBack }) {
  const [val, setVal] = useState(Number(localStorage.getItem("hitu_love") || 0));
  const [pressed, setPressed] = useState(false);

  const start = () => {
    setPressed(true);
    const target = 100;
    let cur = val;
    const id = setInterval(() => {
      cur += 1.5 + Math.random() * 3;
      if (cur >= target) { cur = target; clearInterval(id); }
      setVal(Math.floor(cur));
      localStorage.setItem("hitu_love", String(Math.floor(cur)));
    }, 60);
  };

  const reset = () => {
    setVal(0);
    setPressed(false);
    localStorage.setItem("hitu_love", "0");
  };

  const msg = MESSAGES.slice().reverse().find((m) => val >= m.min)?.text;

  return (
    <SectionShell title="Love Meter ❤️‍🔥" subtitle="how much do i love you? press to find out" onBack={onBack} testId="lovemeter-section">
      <div className="glass-yellow rounded-3xl p-6 text-center">
        <div className="text-7xl mb-4 anim-heartbeat">❤️</div>

        <div className="relative h-8 bg-black/40 rounded-full overflow-hidden border border-white/10 mb-2">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-100"
            style={{
              width: `${val}%`,
              background: "linear-gradient(90deg, #ff6b9d 0%, #ff4444 50%, #ffd60a 100%)",
            }}
            data-testid="love-bar"
          />
          <div className="absolute inset-0 flex items-center justify-center handwritten text-2xl text-white drop-shadow">
            {val}%
          </div>
        </div>

        <p className="handwritten text-2xl text-white/95 mt-4 min-h-[2em]" data-testid="love-message">{msg}</p>

        {!pressed ? (
          <button onClick={start} className="sticker-btn mt-4 anim-pulse-glow" data-testid="love-press">
            PRESS ME ❤️
          </button>
        ) : (
          <button onClick={reset} className="sticker-btn mt-4" data-testid="love-reset">
            press again 🔁
          </button>
        )}
      </div>
    </SectionShell>
  );
}
