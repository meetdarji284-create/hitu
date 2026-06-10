import { useEffect, useRef, useState } from "react";
import SectionShell from "./SectionShell";

const COLORS = ["#ff6b9d", "#ffd60a", "#7ad0ff", "#a0ff9a", "#d6a0ff", "#ff9d6b"];

export default function BubblePop({ onBack }) {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [time, setTime] = useState(60);
  const [best, setBest] = useState(Number(localStorage.getItem("hitu_bubble_best") || 0));
  const [bubbles, setBubbles] = useState([]);
  const [bursts, setBursts] = useState([]);
  const comboTimer = useRef(null);
  const spawnRef = useRef(null);
  const tickRef = useRef(null);

  const start = () => {
    setScore(0); setCombo(0); setTime(60); setBubbles([]); setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    spawnRef.current = setInterval(() => {
      const elapsed = 60 - time;
      const speedFactor = 1 + elapsed * 0.02;
      setBubbles((p) => [...p, {
        id: Date.now() + Math.random(),
        x: 8 + Math.random() * 84,
        size: 32 + Math.random() * 26,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        duration: (5 - speedFactor) + Math.random() * 1.5,
      }]);
    }, 400);
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
    return () => { clearInterval(spawnRef.current); clearInterval(tickRef.current); };
  }, [running, time]);

  useEffect(() => {
    if (!running && score > best) {
      setBest(score);
      localStorage.setItem("hitu_bubble_best", String(score));
    }
  }, [running, score, best]);

  const pop = (b, ev) => {
    setBubbles((p) => p.filter((x) => x.id !== b.id));
    setCombo((c) => c + 1);
    setScore((s) => s + 1 + Math.floor(combo / 3));
    // burst
    const rect = ev.currentTarget.getBoundingClientRect();
    setBursts((arr) => [...arr, { id: Date.now() + Math.random(), x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, color: b.color }]);
    clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 900);
  };

  useEffect(() => {
    if (bursts.length === 0) return;
    const t = setTimeout(() => setBursts((arr) => arr.slice(1)), 700);
    return () => clearTimeout(t);
  }, [bursts]);

  // auto-remove escaped bubbles
  useEffect(() => {
    const id = setInterval(() => {
      setBubbles((p) => p.filter((b) => Date.now() - b.id < (b.duration + 0.5) * 1000));
    }, 600);
    return () => clearInterval(id);
  }, []);

  return (
    <SectionShell title="Bubble Pop 🫧" subtitle="tap fast, combos = bonus" onBack={onBack} testId="bubble-pop-section">
      <div className="glass rounded-3xl p-4">
        <div className="flex justify-between text-sm mb-3">
          <span className="handwritten text-2xl text-[var(--sunflower)]" data-testid="bubble-score">Score: {score}</span>
          {combo >= 3 && <span className="handwritten text-2xl text-pink-300 anim-wiggle" data-testid="bubble-combo">x{combo} 🔥</span>}
          <span className="text-white/70">Best: {best}</span>
          <span className="text-white/70">⏱ {time}s</span>
        </div>

        <div className="relative w-full overflow-hidden bg-gradient-to-b from-pink-200/10 to-yellow-200/10 rounded-2xl border border-white/10" style={{ height: 400 }} data-testid="bubble-area">
          {!running && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              {time === 0 ? (
                <>
                  <p className="handwritten text-4xl text-[var(--sunflower)]">popped {score}!</p>
                  <p className="handwritten text-2xl text-white/80 my-2">"so satisfying na? 🥺"</p>
                  <button onClick={start} className="sticker-btn mt-3" data-testid="bubble-restart">play again</button>
                </>
              ) : (
                <>
                  <p className="text-6xl mb-3 anim-float">🫧</p>
                  <p className="handwritten text-3xl text-white mb-1">pop the bubbles</p>
                  <p className="handwritten text-xl text-white/70 mb-4">3+ in a row = combo bonus ✨</p>
                  <button onClick={start} className="sticker-btn" data-testid="bubble-start">start</button>
                </>
              )}
            </div>
          )}
          {running && bubbles.map((b) => (
            <button
              key={b.id}
              onClick={(ev) => pop(b, ev)}
              className="absolute rounded-full shadow-lg"
              style={{
                left: `${b.x}%`,
                bottom: -60,
                width: b.size,
                height: b.size,
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), ${b.color} 70%)`,
                animation: `bubbleUp ${b.duration}s linear forwards`,
              }}
            />
          ))}
        </div>
      </div>

      {bursts.map((b) => (
        <div key={b.id} className="fixed pointer-events-none z-50" style={{ left: b.x, top: b.y }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} className="absolute" style={{
              width: 6, height: 6, borderRadius: "50%", background: b.color,
              animation: `burst 0.6s ease-out forwards`,
              transform: `rotate(${i*45}deg) translate(0, 0)`,
              ["--a"]: `${i*45}deg`,
            }}>✨</span>
          ))}
        </div>
      ))}

      <style>{`
        @keyframes bubbleUp {
          0% { transform: translateY(0); opacity: 0.5; }
          15% { opacity: 1; }
          100% { transform: translateY(-460px); opacity: 1; }
        }
        @keyframes burst {
          0% { transform: translate(0,0) scale(0.5); opacity: 1; }
          100% { transform: translate(calc(cos(var(--a)) * 40px), calc(sin(var(--a)) * 40px)) scale(1.4); opacity: 0; }
        }
      `}</style>
    </SectionShell>
  );
}
