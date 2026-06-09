import { useEffect, useState } from "react";
import SectionShell from "../SectionShell";

const DECKS = {
  flowers: ["🌻", "🌹", "🌷", "🌼", "🌸", "🪷", "💐", "🌺"],
  food: ["🍫", "☕", "🍓", "🍰", "🍦", "🍪", "🧁", "🥐"],
  rcb: ["🏏", "👑", "🐐", "🔥", "🏆", "🇮🇳", "⭐", "💪"],
  hitu: ["🌻", "🍫", "☕", "🏏", "💍", "👗", "🎵", "❤️"],
};

const SIZES = { easy: 6, medium: 8 };

function buildDeck(theme, size) {
  const emojis = DECKS[theme].slice(0, size);
  const cards = [...emojis, ...emojis]
    .map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);
  return cards;
}

export default function MemoryMatch({ onBack }) {
  const [theme, setTheme] = useState("hitu");
  const [size, setSize] = useState("easy");
  const [deck, setDeck] = useState(() => buildDeck("hitu", SIZES.easy));
  const [opened, setOpened] = useState([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [best, setBest] = useState(Number(localStorage.getItem("hitu_match_best") || 999));

  const reset = (t = theme, s = size) => {
    setDeck(buildDeck(t, SIZES[s]));
    setOpened([]); setMoves(0); setLock(false);
  };

  useEffect(() => {
    if (opened.length === 2) {
      setLock(true);
      const [a, b] = opened;
      setTimeout(() => {
        if (deck[a].emoji === deck[b].emoji) {
          setDeck((d) => d.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
        } else {
          setDeck((d) => d.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
        }
        setOpened([]); setLock(false);
      }, 700);
      setMoves((m) => m + 1);
    }
  }, [opened, deck]);

  const won = deck.length > 0 && deck.every((c) => c.matched);

  useEffect(() => {
    if (won && moves < best) {
      setBest(moves);
      localStorage.setItem("hitu_match_best", String(moves));
    }
  }, [won, moves, best]);

  const flip = (i) => {
    if (lock || deck[i].flipped || deck[i].matched) return;
    setDeck((d) => d.map((c, idx) => (idx === i ? { ...c, flipped: true } : c)));
    setOpened((o) => [...o, i]);
  };

  const grid = SIZES[size] === 8 ? "grid-cols-4" : "grid-cols-4";
  const rows = SIZES[size] === 8 ? 4 : 3;

  return (
    <SectionShell title="Memory Match 🧠" subtitle={`${theme} deck · ${SIZES[size]} pairs`} onBack={onBack} testId="memory-match-section">
      <div className="flex gap-2 mb-3">
        {Object.keys(DECKS).map((t) => (
          <button
            key={t}
            data-testid={`mm-theme-${t}`}
            onClick={() => { setTheme(t); reset(t, size); }}
            className={`flex-1 glass rounded-xl py-1.5 text-sm transition ${theme === t ? "bg-[var(--sunflower)] text-black" : "text-white/80"}`}
          >{t}</button>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        {Object.keys(SIZES).map((s) => (
          <button
            key={s}
            data-testid={`mm-size-${s}`}
            onClick={() => { setSize(s); reset(theme, s); }}
            className={`flex-1 glass rounded-xl py-1.5 text-sm transition ${size === s ? "ring-2 ring-[var(--sunflower)]" : ""}`}
          >{s} ({SIZES[s]} pairs)</button>
        ))}
      </div>

      <div className="flex justify-between text-sm mb-3">
        <span className="text-white/70">moves: <b className="text-[var(--sunflower)]" data-testid="mm-moves">{moves}</b></span>
        <span className="text-white/70">best: {best === 999 ? "—" : best}</span>
      </div>

      <div className={`grid ${grid} gap-2`}>
        {deck.map((c, i) => (
          <button
            key={c.id}
            data-testid={`mm-card-${i}`}
            onClick={() => flip(i)}
            className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all duration-300 ${
              c.matched ? "bg-[var(--sunflower)]/20 ring-2 ring-[var(--sunflower)]" : c.flipped ? "bg-white/10" : "glass"
            }`}
            style={{ transform: c.flipped || c.matched ? "rotateY(0deg)" : "rotateY(0deg)" }}
          >
            {c.flipped || c.matched ? c.emoji : "❓"}
          </button>
        ))}
      </div>

      {won && (
        <div className="glass-yellow rounded-3xl p-5 mt-4 text-center anim-fade-up" data-testid="mm-win">
          <p className="text-5xl mb-2">🎉</p>
          <p className="handwritten text-3xl sunflower-text">brain of an ELEPHANT 🌻</p>
          <p className="handwritten text-xl text-white/90 mt-1">finished in {moves} moves</p>
          <button onClick={() => reset()} className="sticker-btn mt-4" data-testid="mm-restart">play again</button>
        </div>
      )}
    </SectionShell>
  );
}
