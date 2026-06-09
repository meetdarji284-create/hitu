import { useEffect, useState } from "react";
import SectionShell from "./SectionShell";

const SPECIES = [
  { id: "sunflower", name: "Sunflower", emoji: "🌻", cost: 0, unlocked: true },
  { id: "rose", name: "Rose", emoji: "🌹", cost: 20 },
  { id: "daisy", name: "Daisy", emoji: "🌼", cost: 40 },
  { id: "tulip", name: "Tulip", emoji: "🌷", cost: 60 },
  { id: "lavender", name: "Lavender", emoji: "💜", cost: 100 },
  { id: "lotus", name: "Lotus", emoji: "🪷", cost: 150 },
  { id: "peony", name: "Peony", emoji: "🌸", cost: 250 },
];

const TAPS_PER_STAGE = 5; // 5 taps to go up a stage; 3 stages (sprout → 50% → 100% → mature)
const STAGES = 3;

const VISITORS = ["🐝", "🦋"];

const STORAGE = "hitu_garden_v2";
function loadGarden() { try { return JSON.parse(localStorage.getItem(STORAGE)) || null; } catch { return null; } }

// 3x3 grid plots
const PLOTS = 9;

const DEFAULT = {
  petals: 0,
  unlocked: ["sunflower"],
  blooms: 0,
  plots: Array(PLOTS).fill(null), // each plot: { species, taps } or null
  selected: "sunflower",
};

export default function FlowerGarden({ onBack }) {
  const [state, setState] = useState(() => loadGarden() || DEFAULT);
  const [floaters, setFloaters] = useState([]);
  const [bursts, setBursts] = useState([]);
  const [visitors, setVisitors] = useState([]); // { id, plotIdx, type, t, dir }

  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state]);

  // Visitor cycle — bees/butterflies fly to mature flowers
  useEffect(() => {
    const id = setInterval(() => {
      const mature = state.plots.map((p, i) => (p && p.taps >= TAPS_PER_STAGE * STAGES ? i : null)).filter((x) => x !== null);
      if (mature.length === 0) return;
      const target = mature[Math.floor(Math.random() * mature.length)];
      const v = { id: Date.now() + Math.random(), plotIdx: target, type: VISITORS[Math.floor(Math.random() * VISITORS.length)] };
      setVisitors((arr) => [...arr, v]);
      setTimeout(() => setVisitors((arr) => arr.filter((x) => x.id !== v.id)), 3500);
    }, 4500);
    return () => clearInterval(id);
  }, [state.plots]);

  const plant = (plotIdx) => {
    const sp = SPECIES.find((s) => s.id === state.selected);
    if (!sp || !state.unlocked.includes(sp.id)) return;
    if (state.plots[plotIdx]) return;
    setState((s) => {
      const next = [...s.plots];
      next[plotIdx] = { species: sp.id, taps: 1 };
      return { ...s, plots: next };
    });
  };

  const water = (plotIdx) => {
    const p = state.plots[plotIdx];
    if (!p) return plant(plotIdx);
    const maxTaps = TAPS_PER_STAGE * STAGES;
    const wasMature = p.taps >= maxTaps;

    setState((s) => {
      const next = [...s.plots];
      const newTaps = Math.min(maxTaps, p.taps + 1);
      const justBloomed = !wasMature && newTaps >= maxTaps;
      next[plotIdx] = { ...p, taps: newTaps };
      return {
        ...s,
        plots: next,
        blooms: s.blooms + (justBloomed ? 1 : 0),
        petals: s.petals + (justBloomed ? 5 : 1),
      };
    });

    // floater
    const fid = Date.now() + Math.random();
    setFloaters((f) => [...f, { id: fid, plotIdx }]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== fid)), 1500);

    // burst on mature flower tap
    if (wasMature) {
      const bid = Date.now() + Math.random();
      setBursts((b) => [...b, { id: bid, plotIdx }]);
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== bid)), 1000);
      // small petal bonus for love-taps on mature
      setState((s) => ({ ...s, petals: s.petals + 1 }));
    }
  };

  const harvest = (plotIdx) => {
    const p = state.plots[plotIdx];
    if (!p || p.taps < TAPS_PER_STAGE * STAGES) return;
    setState((s) => {
      const next = [...s.plots];
      next[plotIdx] = null;
      return { ...s, plots: next, petals: s.petals + 10 };
    });
  };

  const unlock = (sp) => {
    if (state.unlocked.includes(sp.id)) { setState((s) => ({ ...s, selected: sp.id })); return; }
    if (state.petals < sp.cost) return;
    setState((s) => ({ ...s, petals: s.petals - sp.cost, unlocked: [...s.unlocked, sp.id], selected: sp.id }));
  };

  const [confirmReset, setConfirmReset] = useState(false);

  const reset = () => setConfirmReset(true);
  const doReset = () => { setState(DEFAULT); setConfirmReset(false); };

  const getScale = (taps) => {
    // Show actual flower from the moment it's planted (no tiny seed-dot stage).
    // Stage 0 = newly planted small flower (50%), Stage 1 = growing (75%), Stage 2+ = full bloom (100%).
    const stage = Math.min(STAGES, Math.floor(taps / TAPS_PER_STAGE));
    if (stage === 0) return 0.5;
    if (stage === 1) return 0.75;
    return 1.0;
  };

  return (
    <SectionShell title="Flower Garden 🌻" subtitle="plant · water · grow · harvest" onBack={onBack} testId="garden-section">
      <div className="flex items-center justify-between mb-3">
        <p className="handwritten text-2xl text-[var(--sunflower)]" data-testid="garden-petals">🌸 {state.petals} petals</p>
        <p className="text-sm text-white/70" data-testid="garden-blooms">🏆 {state.blooms} blooms</p>
      </div>

      {/* selected species banner */}
      <div className="glass-yellow rounded-2xl p-3 mb-3 flex items-center gap-3">
        <span className="text-4xl">{SPECIES.find((s) => s.id === state.selected)?.emoji}</span>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60">currently planting</p>
          <p className="handwritten text-2xl text-white">{SPECIES.find((s) => s.id === state.selected)?.name}</p>
        </div>
      </div>

      {/* 3x3 garden grid */}
      <div
        className="grid grid-cols-3 gap-2 p-3 rounded-3xl"
        style={{ background: "linear-gradient(180deg,rgba(122,168,74,0.25) 0%,rgba(74,116,52,0.4) 100%)", border: "2px solid rgba(255,214,10,0.2)" }}
      >
        {state.plots.map((p, i) => {
          const sp = p ? SPECIES.find((x) => x.id === p.species) : null;
          const scale = p ? getScale(p.taps) : 0;
          const mature = p && p.taps >= TAPS_PER_STAGE * STAGES;
          const visitor = visitors.find((v) => v.plotIdx === i);
          const float = floaters.find((f) => f.plotIdx === i);
          const burst = bursts.find((b) => b.plotIdx === i);

          return (
            <button
              key={i}
              onClick={() => mature ? null : water(i)}
              onContextMenu={(e) => { e.preventDefault(); if (mature) harvest(i); }}
              onDoubleClick={() => { if (mature) harvest(i); }}
              data-testid={`plot-${i}`}
              className="relative aspect-square rounded-xl bg-amber-900/40 border border-amber-700/40 overflow-hidden flex items-center justify-center transition-all hover:bg-amber-900/60"
            >
              {/* dirt mound */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-xl" />
              {!p && (
                <span className="text-3xl opacity-40">+</span>
              )}
              {p && (
                <span
                  className="text-6xl relative z-10"
                  style={{
                    transform: `scale(${scale})`,
                    transition: "transform 1500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    filter: mature ? "drop-shadow(0 0 10px rgba(255,214,10,0.7))" : "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                  }}
                  data-testid={`plot-flower-${i}`}
                >
                  {sp.emoji}
                </span>
              )}
              {/* progress bar */}
              {p && !mature && (
                <div className="absolute bottom-1 inset-x-2 h-1 bg-black/40 rounded-full overflow-hidden z-10">
                  <div className="h-full bg-[var(--sunflower)]" style={{ width: `${(p.taps / (TAPS_PER_STAGE * STAGES)) * 100}%` }} />
                </div>
              )}
              {/* petal floater */}
              {float && (
                <span className="absolute text-xl pointer-events-none z-20" style={{ left: "50%", top: "30%", animation: "petalFloatGrid 1.4s ease-out forwards" }}>🌸</span>
              )}
              {/* visitor */}
              {visitor && (
                <span className="absolute text-2xl pointer-events-none z-20" style={{ animation: "visitorBuzz 3.5s ease-in-out forwards" }}>{visitor.type}</span>
              )}
              {/* burst */}
              {burst && (
                <div className="absolute inset-0 pointer-events-none z-30">
                  {[...Array(10)].map((_, k) => (
                    <span key={k} className="absolute text-xs" style={{
                      left: "50%", top: "50%",
                      color: ["#ffd60a","#ff6b9d","#7ad0ff","#a0d97a"][k % 4],
                      animation: `confettiBurst 0.9s ease-out forwards`,
                      animationDelay: `${k * 0.02}s`,
                      ["--ang"]: `${k * 36}deg`,
                    }}>✦</span>
                  ))}
                </div>
              )}
              {mature && <span className="absolute top-1 right-1 text-[10px] bg-[var(--sunflower)] text-black px-1 rounded-full z-20">harvest</span>}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-white/50 mt-2 text-center">tap to plant/water · double-tap mature flower to harvest (+10 petals)</p>

      <p className="handwritten text-2xl text-[var(--sunflower)] mt-6 mb-2">species 🌸</p>
      <div className="grid grid-cols-4 gap-2">
        {SPECIES.map((s) => {
          const owned = state.unlocked.includes(s.id);
          const active = state.selected === s.id;
          const canAfford = state.petals >= s.cost;
          return (
            <button
              key={s.id}
              onClick={() => unlock(s)}
              disabled={!owned && !canAfford}
              data-testid={`garden-species-${s.id}`}
              className={`glass rounded-2xl p-3 text-center transition disabled:opacity-40 ${active ? "ring-2 ring-[var(--sunflower)]" : ""}`}
            >
              <div className="text-3xl">{owned ? s.emoji : "🔒"}</div>
              <p className="text-[10px] text-white/80 mt-1">{s.name}</p>
              {!owned && <p className="text-[9px] text-[var(--sunflower)]">{s.cost} 🌸</p>}
            </button>
          );
        })}
      </div>

      <button onClick={reset} className="text-xs text-white/40 mt-5 underline" data-testid="garden-reset">reset garden</button>

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur p-4" onClick={() => setConfirmReset(false)} data-testid="garden-reset-modal">
          <div className="glass rounded-3xl p-5 max-w-xs w-full text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-5xl mb-2">🥺</p>
            <p className="handwritten text-3xl text-[var(--sunflower)] mb-2">reset everything?</p>
            <p className="text-sm text-white/70 mb-4">all flowers, petals & unlocked species will be gone, jaan</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmReset(false)} className="flex-1 bg-white/10 rounded-xl py-2 text-sm text-white" data-testid="garden-reset-cancel">no, keep my garden</button>
              <button onClick={doReset} className="flex-1 bg-red-500/80 rounded-xl py-2 text-sm text-white" data-testid="garden-reset-confirm">yes, reset</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes petalFloatGrid {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          100% { transform: translateY(-50px) scale(1.2) rotate(180deg); opacity: 0; }
        }
        @keyframes visitorBuzz {
          0% { transform: translate(-40px, -30px) scale(0.6); opacity: 0; }
          15% { transform: translate(-20px, -20px) scale(1); opacity: 1; }
          50% { transform: translate(5px, -5px) scale(1.1); opacity: 1; }
          85% { transform: translate(10px, 0); opacity: 1; }
          100% { transform: translate(40px, -30px) scale(0.6); opacity: 0; }
        }
        @keyframes confettiBurst {
          0% { transform: translate(-50%, -50%) scale(0.4); opacity: 1; }
          100% { transform: translate(calc(-50% + cos(var(--ang)) * 40px), calc(-50% + sin(var(--ang)) * 40px)) scale(1.6); opacity: 0; }
        }
      `}</style>
    </SectionShell>
  );
}
