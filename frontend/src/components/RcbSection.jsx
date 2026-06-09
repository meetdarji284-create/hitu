import { useState } from "react";
import SectionShell from "./SectionShell";

const CHEERS = [
  "Ee sala cup namde 🏆",
  "Virat paglu ❤️",
  "RCB > everything else",
  "King Kohli forever 👑",
  "Bleed red, breathe gold ♥️💛",
  "Virat ke pagli detected 🚨",
];

export default function RcbSection({ onBack }) {
  const [cheer, setCheer] = useState(CHEERS[0]);

  return (
    <SectionShell title="RCB & Virat 🏏" subtitle="black + red aesthetic, just for you" onBack={onBack} testId="rcb-section">
      <div
        className="rounded-3xl p-6 border-2 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #2a0606 60%, #d40606 100%)",
          borderColor: "#d40606",
          boxShadow: "0 0 40px rgba(212, 6, 6, 0.4)",
        }}
      >
        <div className="absolute top-2 right-2 text-6xl opacity-20 rotate-12">🏏</div>
        <p className="text-xs uppercase tracking-[0.4em] text-red-300 mb-1">Royal Challengers</p>
        <p className="script text-5xl text-white drop-shadow-lg">Bangalore</p>
        <p className="handwritten text-3xl text-[var(--sunflower)] mt-3">Virat paglu ❤️</p>

        <div className="grid grid-cols-3 gap-2 mt-5">
          {["👑", "🐐", "🏏", "🇮🇳", "💪", "🔥"].map((e, i) => (
            <div key={i} className="bg-black/40 rounded-xl h-16 flex items-center justify-center text-3xl">{e}</div>
          ))}
        </div>

        <div className="bg-black/50 rounded-2xl p-4 mt-5 text-center">
          <p className="handwritten text-2xl text-white" data-testid="rcb-cheer">{cheer}</p>
        </div>

        <button
          onClick={() => setCheer(CHEERS[Math.floor(Math.random() * CHEERS.length)])}
          className="sticker-btn w-full mt-4"
          data-testid="rcb-cheer-btn"
        >
          🎉 give me a cheer
        </button>
      </div>

      <div className="glass rounded-3xl p-4 mt-4 text-center">
        <p className="handwritten text-2xl text-white/90">
          "every time RCB plays, I think of you smiling at the screen 📺❤️"
        </p>
      </div>
    </SectionShell>
  );
}
