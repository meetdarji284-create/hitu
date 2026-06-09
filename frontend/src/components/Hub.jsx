import { Heart, Sparkles, Flower2, Coffee, Camera, Trophy, HeartHandshake, Shirt, Mail, Cookie } from "lucide-react";
import { HITU_FACTS } from "../data/hituData";

const TILES = [
  { id: "comfort", title: "Period Comfort", emoji: "🌸", icon: HeartHandshake, sub: "warm hugs inside" },
  { id: "games", title: "Games Room", emoji: "🎮", icon: Flower2, sub: "mini games" },
  { id: "quiz", title: "Hitu Quiz", emoji: "❤️", icon: Sparkles, sub: "how well does HE know you" },
  { id: "dressup", title: "Dress Up Hitu", emoji: "👗", icon: Shirt, sub: "snap-style swap" },
  { id: "cafe", title: "Virtual Café", emoji: "☕", icon: Coffee, sub: "build your own treat" },
  { id: "openwhen", title: "Open When...", emoji: "💌", icon: Mail, sub: "letters for any mood" },
  { id: "love", title: "Love Meter", emoji: "❤️‍🔥", icon: Heart, sub: "press to measure" },
  { id: "memory", title: "Memory Wall", emoji: "📸", icon: Camera, sub: "upload & scrapbook" },
  { id: "rcb", title: "RCB & Virat", emoji: "🏏", icon: Trophy, sub: "ee sala cup namde" },
  { id: "surprise", title: "Surprise Me", emoji: "🎁", icon: Cookie, sub: "tap for a random kiss" },
];

export default function Hub({ onPick, onSurprise }) {
  return (
    <div className="min-h-screen px-4 pt-8 pb-32 relative z-10" data-testid="hub-screen">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-2 anim-fade-up">
          <p className="text-xs tracking-[0.3em] text-white/50 uppercase">Welcome to</p>
          <h1 className="handwritten text-5xl sunflower-text leading-none">Hitu's Little World</h1>
          <p className="handwritten text-2xl text-white/80 mt-1">made with love 🌻</p>
        </div>

        {/* fact ticker */}
        <div className="glass-yellow rounded-2xl px-4 py-2 my-5 overflow-hidden anim-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex gap-6 whitespace-nowrap animate-[shimmer_18s_linear_infinite]" style={{
            animation: "marquee 22s linear infinite",
          }}>
            {[...HITU_FACTS, ...HITU_FACTS].map((f, i) => (
              <span key={i} className="text-sm text-white/90 inline-block">{f}</span>
            ))}
          </div>
        </div>

        {/* grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {TILES.map((t, i) => {
            const Icon = t.icon;
            const action = t.id === "surprise" ? onSurprise : () => onPick(t.id);
            return (
              <button
                key={t.id}
                data-testid={`hub-tile-${t.id}`}
                onClick={action}
                className="glass rounded-2xl p-4 text-left hover:scale-[1.03] active:scale-95 transition-transform anim-fade-up relative overflow-hidden group"
                style={{ animationDelay: `${0.2 + i * 0.05}s` }}
              >
                <div className="absolute -top-4 -right-4 text-5xl opacity-30 group-hover:opacity-60 transition-opacity">{t.emoji}</div>
                <Icon className="w-5 h-5 text-[var(--sunflower)] mb-2" />
                <div className="handwritten text-2xl leading-none text-white">{t.title}</div>
                <div className="text-[11px] text-white/55 mt-1.5">{t.sub}</div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-white/40 mt-8 handwritten text-xl">
          tap any card, jaan ❤️
        </p>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
