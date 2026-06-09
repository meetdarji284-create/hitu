import { useState } from "react";
import { Music, X } from "lucide-react";

// Spotify embed for "Darkhaast" (per user's link)
const SPOTIFY_EMBED = "https://open.spotify.com/embed/track/1awtp7rf6ajhGY9BgzCHeZ?utm_source=generator&theme=0";

export default function MusicToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        data-testid="music-toggle"
        onClick={() => setOpen((v) => !v)}
        className="fixed top-4 right-4 z-40 w-12 h-12 rounded-full glass-yellow flex items-center justify-center hover:scale-110 transition-transform anim-pulse-glow"
        aria-label="Toggle music"
      >
        <Music className="w-5 h-5 text-[var(--sunflower)]" />
      </button>

      {open && (
        <div
          className="fixed top-20 right-4 z-40 w-[300px] glass rounded-2xl p-3 anim-fade-up"
          data-testid="music-player"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="handwritten text-xl text-[var(--sunflower)]">Darkhaast 🎵</p>
            <button onClick={() => setOpen(false)} aria-label="Close music" data-testid="music-close">
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>
          <iframe
            title="darkhaast-spotify"
            src={SPOTIFY_EMBED}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: 12 }}
          />
          <p className="text-[11px] text-white/50 mt-2 text-center handwritten text-base">
            our song, jaan 💕
          </p>
        </div>
      )}
    </>
  );
}
