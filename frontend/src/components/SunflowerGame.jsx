import { useEffect, useRef, useState } from "react";
import SectionShell from "./SectionShell";
import { ROMANTIC_MESSAGES } from "../data/hituData";

const UNLOCK_AT = [5, 10, 20, 35, 50];

export default function SunflowerGame({ onBack }) {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(Number(localStorage.getItem("hitu_best") || 0));
  const [time, setTime] = useState(30);
  const [items, setItems] = useState([]);
  const [unlocked, setUnlocked] = useState(null);
  const areaRef = useRef(null);
  const tickRef = useRef(null);
  const spawnRef = useRef(null);

  const start = () => {
    setScore(0);
    setTime(30);
    setItems([]);
    setUnlocked(null);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;

    spawnRef.current = setInterval(() => {
      const id = Date.now() + Math.random();
      const isBomb = Math.random() < 0.1;
      setItems((prev) => [
        ...prev,
        {
          id,
          x: 5 + Math.random() * 85,
          duration: 2.2 + Math.random() * 1.6,
          emoji: isBomb ? "🍫" : Math.random() < 0.15 ? "❤️" : "🌻",
          bomb: isBomb,
        },
      ]);
      setTimeout(() => setItems((p) => p.filter((i) => i.id !== id)), 4500);
    }, 520);

    tickRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setRunning(false);
          clearInterval(spawnRef.current);
          clearInterval(tickRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnRef.current);
      clearInterval(tickRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (!running && score > 0 && score > best) {
      localStorage.setItem("hitu_best", String(score));
      setBest(score);
    }
  }, [running, score, best]);

  const tap = (item) => {
    setItems((p) => p.filter((i) => i.id !== item.id));
    if (item.bomb) {
      setScore((s) => Math.max(0, s - 2));
      return;
    }
    setScore((s) => {
      const ns = s + (item.emoji === "❤️" ? 3 : 1);
      const milestone = UNLOCK_AT.findIndex((m) => s < m && ns >= m);
      if (milestone !== -1) {
        setUnlocked(ROMANTIC_MESSAGES[milestone]);
        setTimeout(() => setUnlocked(null), 3500);
      }
      return ns;
    });
  };

  return (
    <SectionShell title="Catch Sunflowers 🌻" subtitle="tap flowers · avoid kitkats (just kidding, eat them after)" onBack={onBack} testId="sunflower-game-section">
      <div className="glass rounded-3xl p-4">
        <div className="flex justify-between items-center mb-3 text-sm">
          <span className="handwritten text-2xl text-[var(--sunflower)]" data-testid="game-score">Score: {score}</span>
          <span className="text-white/70">Best: {best}</span>
          <span className="text-white/70">⏱ {time}s</span>
        </div>

        <div
          ref={areaRef}
          className="relative w-full bg-black/40 rounded-2xl border border-white/10 overflow-hidden"
          style={{ height: 380 }}
          data-testid="game-area"
        >
          {!running && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              {time === 0 ? (
                <>
                  <p className="handwritten text-4xl text-[var(--sunflower)]">Time's up!</p>
                  <p className="text-white/80 mt-2">You scored <b>{score}</b></p>
                  <p className="handwritten text-2xl text-white/70 my-2">"that was so cute, do it again cutuu 🥺"</p>
                  <button onClick={start} className="sticker-btn mt-3" data-testid="game-restart">Play again</button>
                </>
              ) : (
                <>
                  <p className="text-6xl mb-3 anim-float">🌻</p>
                  <p className="handwritten text-3xl text-white mb-1">tap the sunflowers,</p>
                  <p className="handwritten text-2xl text-white/70 mb-4">unlock love notes ❤️</p>
                  <button onClick={start} className="sticker-btn" data-testid="game-start">Start</button>
                </>
              )}
            </div>
          )}

          {running &&
            items.map((it) => (
              <button
                key={it.id}
                onClick={() => tap(it)}
                className="absolute text-4xl select-none"
                style={{
                  left: `${it.x}%`,
                  top: -40,
                  animation: `fall ${it.duration}s linear forwards`,
                }}
              >
                {it.emoji}
              </button>
            ))}

          {unlocked && (
            <div className="absolute inset-x-4 bottom-4 glass-yellow rounded-2xl p-3 anim-fade-up" data-testid="unlocked-message">
              <p className="text-xs uppercase tracking-widest text-[var(--sunflower)]">unlocked 💌</p>
              <p className="handwritten text-xl text-white">{unlocked}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fall {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(420px) rotate(360deg); }
        }
      `}</style>
    </SectionShell>
  );
}
