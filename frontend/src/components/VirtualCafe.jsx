import { useState } from "react";
import SectionShell from "./SectionShell";
import { ChevronLeft } from "lucide-react";

const MODES = {
  coffee: {
    name: "Coffee Builder ☕",
    steps: [
      { key: "base", q: "pick your base", opts: [
        { id: "espresso", label: "Espresso", color: "#3a1f0f" },
        { id: "filter", label: "Filter Coffee", color: "#5a2f1a" },
        { id: "cold", label: "Cold Brew", color: "#2a1a0a" },
        { id: "matcha", label: "Matcha", color: "#7aa84a" },
      ]},
      { key: "milk", q: "milk?", opts: [
        { id: "full", label: "Full cream", color: "#fff8e6" },
        { id: "oat", label: "Oat milk", color: "#f0e3c8" },
        { id: "almond", label: "Almond milk", color: "#f5ead4" },
        { id: "none", label: "No milk", color: null },
      ]},
      { key: "temp", q: "temperature?", opts: [
        { id: "hot", label: "Hot ♨️" }, { id: "iced", label: "Iced 🧊" }, { id: "frothy", label: "Frothy ☁️" },
      ]},
      { key: "flavor", q: "flavor shot", opts: [
        { id: "vanilla", label: "Vanilla" }, { id: "caramel", label: "Caramel" }, { id: "hazelnut", label: "Hazelnut" }, { id: "none", label: "No syrup" },
      ]},
      { key: "topping", q: "topping", opts: [
        { id: "cinnamon", label: "Cinnamon dust ✨" }, { id: "cocoa", label: "Cocoa powder" }, { id: "whip", label: "Whipped cream ☁️" }, { id: "none", label: "None" },
      ]},
    ],
  },
  cupcake: {
    name: "Cupcake 🧁",
    steps: [
      { key: "base", q: "cupcake flavor", opts: [
        { id: "vanilla", label: "Vanilla", color: "#f5e6b8" },
        { id: "choco", label: "Chocolate", color: "#4a2a18" },
        { id: "redvelvet", label: "Red velvet", color: "#a02038" },
        { id: "matcha", label: "Matcha", color: "#9ac070" },
      ]},
      { key: "frosting", q: "frosting", opts: [
        { id: "vanilla", label: "Vanilla", color: "#fff8e6" },
        { id: "choco", label: "Chocolate", color: "#3a1f0f" },
        { id: "pink", label: "Strawberry", color: "#ffb0c0" },
        { id: "yellow", label: "Honey", color: "#ffd60a" },
      ]},
      { key: "drizzle", q: "drizzle", opts: [
        { id: "choco", label: "Chocolate drizzle" }, { id: "caramel", label: "Caramel" }, { id: "none", label: "None" },
      ]},
      { key: "topping", q: "topping", opts: [
        { id: "sprinkles", label: "Rainbow sprinkles 🌈" }, { id: "cherry", label: "Cherry 🍒" }, { id: "kitkat", label: "Crushed KitKat 🍫" }, { id: "none", label: "None" },
      ]},
    ],
  },
  boba: {
    name: "Boba Tea 🧋",
    steps: [
      { key: "tea", q: "tea base", opts: [
        { id: "black", label: "Black tea", color: "#4a2a18" },
        { id: "green", label: "Green tea", color: "#7ab070" },
        { id: "thai", label: "Thai tea", color: "#e88a3a" },
        { id: "taro", label: "Taro", color: "#b08acd" },
      ]},
      { key: "milk", q: "milk", opts: [
        { id: "regular", label: "Regular milk", color: "#fff8e6" },
        { id: "oat", label: "Oat milk", color: "#f0e3c8" },
        { id: "none", label: "No milk", color: null },
      ]},
      { key: "boba", q: "boba type", opts: [
        { id: "pearl", label: "Tapioca pearls ⚫" }, { id: "popping", label: "Popping boba 💥" }, { id: "lychee", label: "Lychee jelly" },
      ]},
      { key: "topping", q: "topping", opts: [
        { id: "cream", label: "Cream cheese foam" }, { id: "pudding", label: "Pudding" }, { id: "none", label: "None" },
      ]},
    ],
  },
  waffle: {
    name: "Waffle 🧇",
    steps: [
      { key: "base", q: "waffle type", opts: [
        { id: "classic", label: "Classic", color: "#d4a060" },
        { id: "choco", label: "Chocolate", color: "#5a3a20" },
        { id: "redvelvet", label: "Red velvet", color: "#a02038" },
      ]},
      { key: "scoop", q: "ice cream scoop", opts: [
        { id: "vanilla", label: "Vanilla", color: "#fff8e6" },
        { id: "choco", label: "Chocolate", color: "#3a1f0f" },
        { id: "strawberry", label: "Strawberry", color: "#ffb0c0" },
        { id: "butter", label: "Butterscotch", color: "#e8b870" },
      ]},
      { key: "sauce", q: "sauce", opts: [
        { id: "choco", label: "Chocolate" }, { id: "caramel", label: "Caramel" }, { id: "berry", label: "Berry" }, { id: "honey", label: "Honey" },
      ]},
      { key: "topping", q: "topping", opts: [
        { id: "sprinkles", label: "Sprinkles 🌈" }, { id: "kitkat", label: "Crushed KitKat 🍫" }, { id: "nuts", label: "Mixed nuts" }, { id: "fruit", label: "Fresh fruit" },
      ]},
    ],
  },
};

function CupVisual({ mode, picks }) {
  if (mode === "coffee") {
    const base = picks.base;
    const milk = picks.milk;
    const isIced = picks.temp === "iced";
    const isFrothy = picks.temp === "frothy";
    const isHot = picks.temp === "hot";
    return (
      <div className="relative w-48 h-56 mx-auto">
        {/* cup */}
        <div className="absolute inset-x-2 bottom-0 top-6 rounded-b-3xl rounded-t-md border-4 border-white/80 overflow-hidden bg-black/50">
          {base && (
            <div
              className="absolute inset-x-0 bottom-0 transition-all duration-700 anim-fade-up"
              style={{ height: "60%", background: base.color }}
            />
          )}
          {milk && milk.color && (
            <div
              className="absolute inset-x-0 transition-all duration-700 anim-fade-up"
              style={{ bottom: "60%", height: "30%", background: milk.color, opacity: 0.95 }}
            />
          )}
          {isFrothy && (
            <div className="absolute inset-x-0 top-0 h-8 bg-white rounded-b-full opacity-90 anim-fade-up flex items-end justify-around">
              {[...Array(5)].map((_, i) => <span key={i} className="text-xs" style={{ animation: `floatY ${1+i*0.2}s ease-in-out infinite` }}>○</span>)}
            </div>
          )}
          {isIced && [...Array(4)].map((_, i) => (
            <div key={i} className="absolute bg-white/70 rounded"
              style={{ width: 16, height: 16, top: `${30 + i*15}%`, left: `${15 + (i%2)*40}%`, animation: `floatY ${2+i*0.3}s ease-in-out infinite` }} />
          ))}
          {picks.topping?.id === "whip" && (
            <div className="absolute -top-3 inset-x-2 h-8 bg-white rounded-full anim-fade-up" />
          )}
          {picks.topping?.id === "cinnamon" && [...Array(8)].map((_, i) => (
            <span key={i} className="absolute text-orange-400" style={{ top: `${5+Math.random()*20}%`, left: `${10+Math.random()*80}%`, fontSize: 8 }}>•</span>
          ))}
          {picks.topping?.id === "cocoa" && [...Array(10)].map((_, i) => (
            <span key={i} className="absolute text-amber-900" style={{ top: `${5+Math.random()*20}%`, left: `${10+Math.random()*80}%`, fontSize: 6 }}>●</span>
          ))}
        </div>
        {/* handle */}
        <div className="absolute right-0 top-16 w-6 h-12 border-4 border-white/80 rounded-r-full" />
        {/* steam */}
        {isHot && [...Array(3)].map((_, i) => (
          <div key={i} className="absolute text-white/70 text-2xl" style={{ top: -8, left: `${30+i*20}%`, animation: `steam ${2+i*0.4}s ease-in-out infinite`, animationDelay: `${i*0.3}s` }}>~</div>
        ))}
      </div>
    );
  }

  if (mode === "cupcake") {
    return (
      <div className="relative w-48 h-56 mx-auto flex flex-col items-center justify-end">
        {/* wrapper */}
        <div className="w-32 h-20 bg-pink-400/70 anim-fade-up" style={{ clipPath: "polygon(8% 0,92% 0,100% 100%,0 100%)" }}>
          <div className="w-full h-full" style={{ background: "repeating-linear-gradient(90deg,transparent 0,transparent 6px,rgba(0,0,0,0.15) 6px,rgba(0,0,0,0.15) 8px)" }} />
        </div>
        {/* cake */}
        {picks.base && (
          <div className="absolute bottom-20 w-32 h-12 rounded-t-lg anim-fade-up" style={{ background: picks.base.color }} />
        )}
        {/* frosting */}
        {picks.frosting && (
          <div className="absolute bottom-28 w-28 h-16 anim-fade-up" style={{
            background: picks.frosting.color,
            borderRadius: "50% 50% 30% 30% / 70% 70% 30% 30%",
          }} />
        )}
        {/* drizzle */}
        {picks.drizzle && picks.drizzle.id !== "none" && (
          <div className="absolute bottom-32 w-24 h-8 anim-fade-up" style={{
            background: picks.drizzle.id === "choco" ? "#3a1f0f" : "#c9881f",
            borderRadius: "50% 50% 50% 50% / 80% 80% 30% 30%",
            opacity: 0.85,
          }} />
        )}
        {/* topping */}
        {picks.topping?.id === "cherry" && <div className="absolute bottom-40 text-3xl anim-heartbeat">🍒</div>}
        {picks.topping?.id === "kitkat" && <div className="absolute bottom-40 text-3xl anim-heartbeat">🍫</div>}
        {picks.topping?.id === "sprinkles" && (
          <div className="absolute bottom-36 w-24 h-8">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="absolute" style={{
                left: `${Math.random()*100}%`, top: `${Math.random()*100}%`,
                width: 4, height: 8, background: ["#ff6b9d","#ffd60a","#7ad0ff","#a0ff7a"][i%4],
                transform: `rotate(${Math.random()*180}deg)`,
              }} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (mode === "boba") {
    return (
      <div className="relative w-40 h-56 mx-auto">
        <div className="absolute inset-x-2 bottom-0 top-2 rounded-b-2xl rounded-t-sm border-4 border-white/80 overflow-hidden bg-black/50">
          {picks.tea && (
            <div className="absolute inset-x-0 bottom-0 transition-all duration-700 anim-fade-up" style={{ height: "70%", background: picks.tea.color, opacity: 0.85 }} />
          )}
          {picks.milk && picks.milk.color && (
            <div className="absolute inset-x-0 transition-all duration-700 anim-fade-up" style={{ bottom: "70%", height: "20%", background: picks.milk.color, opacity: 0.9 }} />
          )}
          {/* boba */}
          {picks.boba && [...Array(picks.boba.id === "pearl" ? 12 : 8)].map((_, i) => (
            <div key={i} className="absolute rounded-full anim-fade-up" style={{
              width: 10, height: 10,
              left: `${10 + (i % 4) * 22}%`,
              bottom: `${5 + Math.floor(i / 4) * 12}%`,
              background: picks.boba.id === "pearl" ? "#1a0a0a" : picks.boba.id === "popping" ? "#ff6b9d" : "#fff5a0",
            }} />
          ))}
          {picks.topping?.id === "cream" && (
            <div className="absolute inset-x-0 top-0 h-6 bg-white/80 rounded-b-full anim-fade-up" />
          )}
        </div>
        {/* straw */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-12 bg-pink-400 rounded-full anim-fade-up" />
      </div>
    );
  }

  if (mode === "waffle") {
    return (
      <div className="relative w-56 h-56 mx-auto flex items-end justify-center">
        {/* plate */}
        <div className="absolute bottom-0 w-52 h-4 bg-white rounded-full" />
        {/* waffle */}
        {picks.base && (
          <div className="absolute bottom-3 w-40 h-20 anim-fade-up" style={{
            background: picks.base.color,
            backgroundImage: "repeating-linear-gradient(90deg,rgba(0,0,0,0.2) 0 2px,transparent 2px 16px), repeating-linear-gradient(0deg,rgba(0,0,0,0.2) 0 2px,transparent 2px 16px)",
            borderRadius: 8,
          }} />
        )}
        {/* scoop */}
        {picks.scoop && (
          <div className="absolute bottom-16 w-16 h-16 rounded-full anim-fade-up" style={{ background: picks.scoop.color, boxShadow: "inset -6px -6px 8px rgba(0,0,0,0.15)" }} />
        )}
        {/* sauce */}
        {picks.sauce && (
          <div className="absolute bottom-20 w-24 h-3 anim-fade-up" style={{
            background: picks.sauce.id === "choco" ? "#3a1f0f" : picks.sauce.id === "caramel" ? "#c9881f" : picks.sauce.id === "berry" ? "#a02038" : "#ffd60a",
            borderRadius: 4,
          }} />
        )}
        {picks.topping?.id === "sprinkles" && [...Array(15)].map((_, i) => (
          <span key={i} className="absolute" style={{
            bottom: `${22 + Math.random()*16}px`,
            left: `${30+Math.random()*40}%`,
            width: 4, height: 8, background: ["#ff6b9d","#ffd60a","#7ad0ff","#a0ff7a"][i%4],
            transform: `rotate(${Math.random()*180}deg)`,
          }} />
        ))}
        {picks.topping?.id === "kitkat" && <div className="absolute bottom-32 text-2xl anim-heartbeat">🍫</div>}
        {picks.topping?.id === "fruit" && <div className="absolute bottom-32 text-2xl">🍓</div>}
        {picks.topping?.id === "nuts" && <div className="absolute bottom-32 text-2xl">🥜</div>}
      </div>
    );
  }

  return null;
}

function Builder({ mode, onBack, onSave }) {
  const cfg = MODES[mode];
  const [stepIdx, setStepIdx] = useState(0);
  const [picks, setPicks] = useState({});
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);

  const step = cfg.steps[stepIdx];
  const choose = (opt) => {
    const next = { ...picks, [step.key]: opt };
    setPicks(next);
    setTimeout(() => {
      if (stepIdx + 1 < cfg.steps.length) setStepIdx(stepIdx + 1);
      else setDone(true);
    }, 350);
  };

  const reset = () => { setStepIdx(0); setPicks({}); setDone(false); setName(""); };

  const finalSave = () => {
    onSave({ id: `${mode}_${Date.now()}`, mode, name: name.trim() || `Untitled ${cfg.name}`, picks });
    reset();
  };

  return (
    <div className="anim-fade-in" data-testid={`cafe-builder-${mode}`}>
      <button onClick={onBack} className="flex items-center gap-1 text-white/70 mb-3" data-testid="cafe-builder-back">
        <ChevronLeft className="w-4 h-4" /> <span className="handwritten text-lg">back to café</span>
      </button>

      <p className="handwritten text-3xl sunflower-text mb-1">{cfg.name}</p>
      {!done && <p className="text-xs text-white/60 mb-3">step {stepIdx + 1} of {cfg.steps.length}</p>}

      <div className="glass rounded-3xl p-4">
        <CupVisual mode={mode} picks={picks} />
      </div>

      {!done ? (
        <div className="mt-4">
          <p className="handwritten text-2xl text-white mb-2">{step.q}</p>
          <div className="grid grid-cols-2 gap-2">
            {step.opts.map((o) => (
              <button
                key={o.id}
                onClick={() => choose(o)}
                data-testid={`cafe-opt-${step.key}-${o.id}`}
                className="glass rounded-xl px-3 py-3 flex items-center gap-2 hover:scale-[1.03] transition text-left"
              >
                {o.color && <span className="w-5 h-5 rounded-full border border-white/20" style={{ background: o.color }} />}
                <span className="handwritten text-lg text-white">{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 glass-yellow rounded-3xl p-5 text-center anim-fade-up">
          <p className="handwritten text-3xl sunflower-text">all done! ✨</p>
          <p className="handwritten text-xl text-white/90 mb-3">name your creation:</p>
          <input
            value={name} onChange={(e) => setName(e.target.value.slice(0, 30))}
            placeholder="Hitu's special..."
            className="w-full bg-black/40 rounded-xl px-3 py-2 text-white border border-white/15 focus:border-[var(--sunflower)] outline-none handwritten text-xl text-center"
            data-testid="cafe-drink-name"
          />
          <div className="flex gap-2 mt-4">
            <button onClick={reset} className="flex-1 glass rounded-xl py-2 handwritten text-lg" data-testid="cafe-make-another">make another</button>
            <button onClick={finalSave} className="flex-1 sticker-btn !py-2" data-testid="cafe-save-menu">save to menu</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VirtualCafe({ onBack }) {
  const [mode, setMode] = useState(null);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hitu_cafe_menu") || "[]"); } catch { return []; }
  });

  const persist = (next) => { setSaved(next); localStorage.setItem("hitu_cafe_menu", JSON.stringify(next)); };
  const addSaved = (item) => persist([item, ...saved].slice(0, 12));
  const removeSaved = (id) => persist(saved.filter((x) => x.id !== id));

  return (
    <SectionShell title="Hitu's Café ☕" subtitle="cozy sim · make your own treat" onBack={onBack} testId="cafe-section">
      {!mode ? (
        <>
          {/* ambiance */}
          <div className="glass rounded-3xl p-4 mb-4 relative overflow-hidden" style={{ background: "radial-gradient(circle at 70% 30%,rgba(122,74,42,0.3) 0%,rgba(20,20,20,0.6) 70%)" }}>
            <div className="flex items-center gap-3">
              <div className="text-5xl anim-float">🐕</div>
              <div>
                <p className="handwritten text-2xl text-[var(--sunflower)]">welcome back, cutuu</p>
                <p className="text-xs text-white/70">your usual? or something new today?</p>
              </div>
            </div>
            <div className="absolute top-1 right-2 text-2xl" style={{ animation: "steam 2.6s ease-in-out infinite" }}>💨</div>
            <div className="absolute top-3 right-8 text-2xl" style={{ animation: "steam 3s ease-in-out infinite", animationDelay: "0.4s" }}>💨</div>
          </div>

          <p className="handwritten text-2xl text-[var(--sunflower)] mb-2">what are we making?</p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(MODES).map(([key, m]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                data-testid={`cafe-mode-${key}`}
                className="glass rounded-2xl p-4 hover:scale-[1.03] transition text-center"
              >
                <div className="text-5xl mb-1 anim-float">{m.name.match(/\p{Emoji}/u)?.[0]}</div>
                <p className="handwritten text-xl text-white">{m.name.replace(/\s*\p{Emoji}/u, "")}</p>
              </button>
            ))}
          </div>

          {/* saved menu */}
          {saved.length > 0 && (
            <>
              <p className="handwritten text-2xl text-[var(--sunflower)] mt-6 mb-2">your menu 📖</p>
              <div className="grid grid-cols-2 gap-2">
                {saved.map((s) => (
                  <div key={s.id} className="glass rounded-xl p-3 relative" data-testid={`cafe-saved-${s.id}`}>
                    <button onClick={() => removeSaved(s.id)} className="absolute top-1 right-1 text-white/40 hover:text-red-300 text-xs" data-testid={`cafe-remove-${s.id}`}>✕</button>
                    <p className="text-xs text-white/60 uppercase tracking-wider">{MODES[s.mode]?.name}</p>
                    <p className="handwritten text-xl text-white leading-tight mt-1">{s.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <Builder mode={mode} onBack={() => setMode(null)} onSave={addSaved} />
      )}
    </SectionShell>
  );
}
