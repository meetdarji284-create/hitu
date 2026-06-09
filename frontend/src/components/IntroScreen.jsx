import { Heart } from "lucide-react";

export default function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative z-10" data-testid="intro-screen">
      <div className="text-center max-w-md mx-auto">
        <div className="anim-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="text-7xl mb-4 anim-float inline-block">🌻</div>
        </div>

        <h1 className="handwritten text-6xl md:text-7xl mb-3 sunflower-text anim-fade-up" style={{ animationDelay: "0.3s", lineHeight: 1 }}>
          Hii Hitu <Heart className="inline w-10 h-10 fill-pink-400 stroke-pink-400 anim-heartbeat" />
        </h1>

        <p className="text-base md:text-lg silver-text font-medium mb-2 anim-fade-up" style={{ animationDelay: "0.5s" }}>
          Welcome to your tiny comfort world
        </p>
        <p className="handwritten text-3xl text-white/90 mb-10 anim-fade-up" style={{ animationDelay: "0.7s" }}>
          made with love 🌻
        </p>

        <div className="glass rounded-3xl p-6 mb-8 anim-fade-up" style={{ animationDelay: "0.9s" }}>
          <p className="handwritten text-2xl text-white/90 leading-snug">
            "A little corner of the internet that exists only for you, pagli.
            Whenever the world feels too loud — come here. I'll be right here. ❤️"
          </p>
          <p className="text-xs text-white/50 mt-3 tracking-widest uppercase">— your Batak</p>
        </div>

        <button
          data-testid="start-button"
          onClick={onStart}
          className="sticker-btn anim-pulse-glow text-lg anim-fade-up"
          style={{ animationDelay: "1.1s" }}
        >
          ✨ START ✨
        </button>

        <p className="text-xs text-white/40 mt-8 anim-fade-up" style={{ animationDelay: "1.3s" }}>
          Hitu's Little World v1.0 · built with 100% love
        </p>
      </div>
    </div>
  );
}
