import { useState, useRef } from "react";
import SectionShell from "../SectionShell";
import { Trash2, Save } from "lucide-react";

const FLOWERS = [
  { id: "sunflower", emoji: "🌻", name: "Sunflower", colors: ["#ffd60a", "#ffb700"] },
  { id: "rose", emoji: "🌹", name: "Rose", colors: ["#c0392b", "#ff85a2"] },
  { id: "daisy", emoji: "🌼", name: "Daisy", colors: ["#fafafa", "#ffd60a"] },
  { id: "tulip", emoji: "🌷", name: "Tulip", colors: ["#ff6b9d", "#7a3a8c"] },
  { id: "lavender", emoji: "🪻", name: "Lavender", colors: ["#c4b0e0", "#7c3aed"] },
  { id: "peony", emoji: "🌸", name: "Peony", colors: ["#ffb0c0", "#ff6b9d"] },
];

const STYLES = [
  { id: "bloom", name: "open bloom", scale: 1.0 },
  { id: "bud", name: "bud", scale: 0.6 },
  { id: "full", name: "full bloom", scale: 1.25 },
];
const STEMS = [
  { id: "short", name: "short", h: 60 },
  { id: "medium", name: "medium", h: 110 },
  { id: "tall", name: "tall", h: 160 },
];
const LEAVES = [
  { id: "simple", name: "simple" },
  { id: "lush", name: "lush" },
  { id: "none", name: "no leaves" },
];
const LEAF_COLORS = [
  { id: "green", name: "green", color: "#4a8a3a" },
  { id: "darkgreen", name: "dark", color: "#2a5a1a" },
  { id: "orange", name: "autumn", color: "#d4710a" },
];

const WRAPS = [
  { id: "kraft", name: "kraft paper", color: "#c89770" },
  { id: "pink",  name: "pink tissue", color: "#ffb0c0" },
  { id: "white", name: "white lace",  color: "#fafafa" },
  { id: "lav",   name: "lavender",    color: "#c4b0e0" },
];

const STORAGE = "hitu_bouquets_v1";

function load() { try { return JSON.parse(localStorage.getItem(STORAGE)) || []; } catch { return []; } }
function save(arr) { localStorage.setItem(STORAGE, JSON.stringify(arr)); }

// Render the bouquet as SVG
function BouquetPreview({ stems, wrap }) {
  const W = 280, H = 360;
  // Lay flowers out in a fan arrangement
  const n = stems.length;
  const baseY = wrap ? 280 : 320;
  const baseX = W / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {/* stems (back-to-front so center is on top) */}
      {stems.map((s, i) => {
        const offset = n === 1 ? 0 : (i - (n - 1) / 2) * (n > 5 ? 18 : 26);
        const stemH = s.stem;
        const headX = baseX + offset;
        const headY = baseY - stemH;
        const leaf = LEAF_COLORS.find((l) => l.id === s.leafColor)?.color || "#4a8a3a";
        return (
          <g key={s.id}>
            {/* stem */}
            <line x1={baseX} y1={baseY} x2={headX} y2={headY} stroke={leaf} strokeWidth="3" strokeLinecap="round" />
            {/* leaves */}
            {s.leaf === "simple" && (
              <ellipse cx={(baseX + headX) / 2 + 6} cy={(baseY + headY) / 2} rx="9" ry="4" fill={leaf} transform={`rotate(40 ${(baseX + headX) / 2 + 6} ${(baseY + headY) / 2})`} />
            )}
            {s.leaf === "lush" && (
              <>
                <ellipse cx={(baseX + headX) / 2 + 8} cy={(baseY + headY) / 2 - 10} rx="10" ry="4.5" fill={leaf} transform={`rotate(40 ${(baseX + headX) / 2 + 8} ${(baseY + headY) / 2 - 10})`} />
                <ellipse cx={(baseX + headX) / 2 - 8} cy={(baseY + headY) / 2 + 10} rx="10" ry="4.5" fill={leaf} transform={`rotate(-40 ${(baseX + headX) / 2 - 8} ${(baseY + headY) / 2 + 10})`} />
                <ellipse cx={(baseX + headX) / 2 + 6} cy={(baseY + headY) / 2 + 20} rx="8" ry="4" fill={leaf} transform={`rotate(30 ${(baseX + headX) / 2 + 6} ${(baseY + headY) / 2 + 20})`} />
              </>
            )}
            {/* flower head — custom SVG for lavender (real lavender spike), emoji for others */}
            {s.type === "lavender" ? (
              <g transform={`translate(${headX} ${headY}) scale(${s.scale || 1})`}>
                {/* central spike stem extension */}
                <line x1="0" y1="6" x2="0" y2="-26" stroke="#5a8a3a" strokeWidth="1.6" strokeLinecap="round" />
                {/* lavender buds — clustered ovals on alternating sides */}
                {[0, 1, 2, 3, 4, 5, 6].map((k) => {
                  const y = 4 - k * 5;
                  const side = k % 2 === 0 ? 1 : -1;
                  const dx = (k < 6 ? 4 : 0) * side;
                  return (
                    <g key={k}>
                      <ellipse cx={dx} cy={y} rx="3.2" ry="4.2" fill={k < 2 ? "#9d6bd6" : "#7c3aed"} transform={`rotate(${side * 18} ${dx} ${y})`} />
                      <ellipse cx={-dx} cy={y - 2} rx="2.6" ry="3.4" fill="#a685e0" transform={`rotate(${-side * 18} ${-dx} ${y - 2})`} opacity="0.85" />
                    </g>
                  );
                })}
                {/* tip bud */}
                <ellipse cx="0" cy="-30" rx="2.4" ry="3.2" fill="#b89ce6" />
              </g>
            ) : (
              <text x={headX} y={headY + 8} textAnchor="middle" fontSize={36 * (s.scale || 1)}>{s.emoji}</text>
            )}
          </g>
        );
      })}

      {/* wrap */}
      {wrap && (
        <>
          <path d={`M${baseX - 60},${baseY - 30} L${baseX + 60},${baseY - 30} L${baseX + 80},${baseY + 50} L${baseX - 80},${baseY + 50} Z`} fill={wrap.color} stroke="rgba(0,0,0,0.2)" />
          {/* ribbon */}
          <rect x={baseX - 70} y={baseY + 5} width="140" height="10" fill="#d4af37" />
          <path d={`M${baseX - 6},${baseY + 15} L${baseX - 20},${baseY + 40} L${baseX - 4},${baseY + 25} Z`} fill="#d4af37" />
          <path d={`M${baseX + 6},${baseY + 15} L${baseX + 20},${baseY + 40} L${baseX + 4},${baseY + 25} Z`} fill="#d4af37" />
        </>
      )}

      {/* empty hint */}
      {n === 0 && (
        <text x={W / 2} y={H / 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="14" fontFamily="Caveat">pick flowers from the left ✨</text>
      )}
    </svg>
  );
}

// thumbnail for saved bouquet
function MiniPreview({ stems, wrap }) {
  return (
    <div className="w-full h-full" style={{ pointerEvents: "none" }}>
      <BouquetPreview stems={stems} wrap={wrap} />
    </div>
  );
}

export default function BouquetBuilder({ onBack }) {
  const [stems, setStems] = useState([]);
  const [wrap, setWrap] = useState(null);
  const [saved, setSaved] = useState(load);
  const [bouquetName, setBouquetName] = useState("");

  // current setup for adding a new flower
  const [activeFlower, setActiveFlower] = useState(FLOWERS[0]);
  const [style, setStyle] = useState("bloom");
  const [stem, setStem] = useState("medium");
  const [leaf, setLeaf] = useState("simple");
  const [leafColor, setLeafColor] = useState("green");

  const addFlower = () => {
    if (stems.length >= 9) return;
    const styleObj = STYLES.find((s) => s.id === style);
    const stemObj = STEMS.find((s) => s.id === stem);
    setStems((arr) => [...arr, {
      id: Date.now(),
      type: activeFlower.id,
      emoji: activeFlower.emoji,
      scale: styleObj.scale,
      stem: stemObj.h,
      leaf, leafColor,
    }]);
  };

  const removeLast = () => setStems((arr) => arr.slice(0, -1));
  const clearAll = () => { setStems([]); setWrap(null); };

  const toggleWrap = () => setWrap(wrap ? null : WRAPS[0]);
  const setWrapType = (w) => setWrap(w);

  const saveBouquet = () => {
    if (stems.length === 0) return alert("add at least one flower 🌻");
    const name = (bouquetName || `Bouquet ${saved.length + 1}`).slice(0, 24);
    const next = [{ id: Date.now(), name, ts: new Date().toLocaleDateString("en-IN"), stems, wrap }, ...saved].slice(0, 12);
    setSaved(next); save(next); setBouquetName("");
  };

  const loadBouquet = (b) => { setStems(b.stems); setWrap(b.wrap); };
  const removeBouquet = (id) => { const next = saved.filter((b) => b.id !== id); setSaved(next); save(next); };

  return (
    <SectionShell title="Bouquet Builder 💐" subtitle="mix · arrange · wrap · save" onBack={onBack} testId="bouquet-section">
      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-6 lg:items-start">
        {/* LEFT (mobile bottom): controls */}
        <div className="lg:order-1 order-2">
          {/* Flower picker */}
          <p className="handwritten text-2xl text-[var(--sunflower)] mb-1">pick a flower</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {FLOWERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFlower(f)}
            data-testid={`bouquet-flower-${f.id}`}
            className={`rounded-xl p-3 text-center transition ${activeFlower.id === f.id ? "ring-2 ring-[var(--sunflower)] bg-white/10" : "bg-white/5"}`}
          >
            {f.id === "lavender" ? (
              <div className="h-9 flex items-center justify-center">
                <svg viewBox="-12 -36 24 48" width="36" height="48">
                  <line x1="0" y1="10" x2="0" y2="-22" stroke="#5a8a3a" strokeWidth="1.6" strokeLinecap="round" />
                  {[0, 1, 2, 3, 4, 5].map((k) => {
                    const y = 4 - k * 5;
                    const side = k % 2 === 0 ? 1 : -1;
                    const dx = 4 * side;
                    return (
                      <g key={k}>
                        <ellipse cx={dx} cy={y} rx="3.2" ry="4.2" fill={k < 2 ? "#9d6bd6" : "#7c3aed"} transform={`rotate(${side * 18} ${dx} ${y})`} />
                        <ellipse cx={-dx} cy={y - 2} rx="2.4" ry="3.2" fill="#a685e0" opacity="0.85" />
                      </g>
                    );
                  })}
                  <ellipse cx="0" cy="-26" rx="2.4" ry="3.2" fill="#b89ce6" />
                </svg>
              </div>
            ) : (
              <div className="text-3xl">{f.emoji}</div>
            )}
            <p className="text-xs text-white/80 mt-1">{f.name}</p>
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="glass rounded-2xl p-3 mb-3 space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">flower style</p>
          <div className="grid grid-cols-3 gap-1.5">
            {STYLES.map((s) => (
              <button key={s.id} onClick={() => setStyle(s.id)} data-testid={`bouquet-style-${s.id}`} className={`py-1.5 rounded-lg text-xs transition ${style === s.id ? "bg-[var(--sunflower)] text-black" : "bg-white/10 text-white/80"}`}>{s.name}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">stem</p>
          <div className="grid grid-cols-3 gap-1.5">
            {STEMS.map((s) => (
              <button key={s.id} onClick={() => setStem(s.id)} data-testid={`bouquet-stem-${s.id}`} className={`py-1.5 rounded-lg text-xs transition ${stem === s.id ? "bg-[var(--sunflower)] text-black" : "bg-white/10 text-white/80"}`}>{s.name}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">leaves</p>
          <div className="grid grid-cols-3 gap-1.5">
            {LEAVES.map((l) => (
              <button key={l.id} onClick={() => setLeaf(l.id)} data-testid={`bouquet-leaf-${l.id}`} className={`py-1.5 rounded-lg text-xs transition ${leaf === l.id ? "bg-[var(--sunflower)] text-black" : "bg-white/10 text-white/80"}`}>{l.name}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">leaf color</p>
          <div className="grid grid-cols-3 gap-1.5">
            {LEAF_COLORS.map((l) => (
              <button key={l.id} onClick={() => setLeafColor(l.id)} data-testid={`bouquet-leafcolor-${l.id}`} className={`py-1.5 rounded-lg text-xs transition flex items-center justify-center gap-1 ${leafColor === l.id ? "ring-2 ring-[var(--sunflower)]" : ""}`} style={{ background: leaf === "none" ? "rgba(255,255,255,0.1)" : l.color, color: "#fff" }}>
                {l.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={addFlower} className="sticker-btn w-full" data-testid="bouquet-add">
        + add this flower 🌷
      </button>

      {/* Wrap */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="handwritten text-2xl text-[var(--sunflower)]">wrap it</p>
          <button onClick={toggleWrap} data-testid="bouquet-wrap-toggle" className={`text-xs px-3 py-1 rounded-full ${wrap ? "bg-[var(--sunflower)] text-black" : "bg-white/10 text-white"}`}>
            {wrap ? "ON ✓" : "tap to wrap"}
          </button>
        </div>
        {wrap && (
          <div className="grid grid-cols-4 gap-1.5">
            {WRAPS.map((w) => (
              <button key={w.id} onClick={() => setWrapType(w)} data-testid={`bouquet-wrap-${w.id}`} className={`py-2 rounded-lg text-xs text-black transition ${wrap.id === w.id ? "ring-2 ring-[var(--sunflower)]" : ""}`} style={{ background: w.color }}>
                {w.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="glass rounded-2xl p-3 mt-4">
        <p className="handwritten text-2xl text-[var(--sunflower)] mb-2">save your bouquet</p>
        <input
          value={bouquetName} onChange={(e) => setBouquetName(e.target.value)}
          placeholder="for Hitu, with love..."
          maxLength={24}
          className="w-full bg-black/40 rounded-xl px-3 py-2 text-white border border-white/15 focus:border-[var(--sunflower)] outline-none handwritten text-xl"
          data-testid="bouquet-name-input"
        />
        <button onClick={saveBouquet} className="sticker-btn w-full mt-2" data-testid="bouquet-save">
          <Save className="w-4 h-4 inline mr-1" /> save bouquet
        </button>
      </div>

      {/* My Bouquets shelf */}
      {saved.length > 0 && (
        <>
          <p className="handwritten text-2xl text-[var(--sunflower)] mt-5 mb-2">My Bouquets 💐</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {saved.map((b) => (
              <div key={b.id} className="glass rounded-xl p-2 flex-shrink-0 w-28 relative" data-testid={`bouquet-saved-${b.id}`}>
                <div className="bg-black/30 rounded-lg h-32 overflow-hidden">
                  <MiniPreview stems={b.stems} wrap={b.wrap} />
                </div>
                <p className="text-[11px] text-white/90 mt-1 truncate handwritten text-base">{b.name}</p>
                <p className="text-[9px] text-white/40">{b.ts}</p>
                <div className="flex gap-1 mt-1">
                  <button onClick={() => loadBouquet(b)} className="flex-1 text-[10px] bg-[var(--sunflower)] text-black rounded py-1" data-testid={`bouquet-load-${b.id}`}>load</button>
                  <button onClick={() => removeBouquet(b.id)} className="bg-red-500/30 rounded px-1 py-1" data-testid={`bouquet-del-${b.id}`}><Trash2 className="w-3 h-3 text-red-200" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
        </div>

        {/* RIGHT (mobile top): live preview — sticky on desktop */}
        <div className="lg:order-2 order-1 lg:sticky lg:top-4 mb-4 lg:mb-0">
          <div className="glass rounded-3xl p-3 anim-pulse-glow" style={{ background: "radial-gradient(circle at 50% 30%,#3a2a4a 0%,#1a0a2a 100%)" }}>
            <div style={{ aspectRatio: "7/9" }}>
              <BouquetPreview stems={stems} wrap={wrap} />
            </div>
            <div className="flex justify-between text-xs text-white/70 mt-2 px-2">
              <span>🌻 {stems.length}/9</span>
              <button onClick={removeLast} className="underline" data-testid="bouquet-undo">undo last</button>
              <button onClick={clearAll} className="underline" data-testid="bouquet-clear">clear all</button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
