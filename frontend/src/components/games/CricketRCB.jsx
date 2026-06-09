// IPL Cricket Game — RCB Batting Edition
// Canvas-based, requestAnimationFrame, bezier ball trajectories,
// stadium, animations, IPL match flow with opponent selection.
import { useEffect, useRef, useState } from "react";
import SectionShell from "../SectionShell";

const TEAMS = [
  { id: "MI",   name: "Mumbai Indians",     short: "MI",   color: "#004BA0", diff: 5 },
  { id: "CSK",  name: "Chennai Super Kings",short: "CSK",  color: "#FDB913", diff: 5 },
  { id: "KKR",  name: "Kolkata Knight Riders", short: "KKR", color: "#3A225D", diff: 4 },
  { id: "DC",   name: "Delhi Capitals",     short: "DC",   color: "#17449B", diff: 3 },
  { id: "SRH",  name: "Sunrisers Hyderabad",short: "SRH",  color: "#FF822A", diff: 4 },
  { id: "PBKS", name: "Punjab Kings",       short: "PBKS", color: "#ED1A37", diff: 3 },
  { id: "RR",   name: "Rajasthan Royals",   short: "RR",   color: "#EA1A85", diff: 4 },
  { id: "GT",   name: "Gujarat Titans",     short: "GT",   color: "#1B2133", diff: 4 },
  { id: "LSG",  name: "Lucknow Super Giants", short: "LSG", color: "#3A8DDE", diff: 3 },
];

const FORMATS = [
  { id: "quick", name: "Quick 3", overs: 3 },
  { id: "super", name: "Super 6", overs: 6 },
  { id: "t20",   name: "T20",     overs: 20 },
];

const SHOTS = {
  defend: { name: "DEFEND", emoji: "🛡️", outcomes: [["dot", 70], ["1", 20], ["W-caught", 10]] },
  drive:  { name: "DRIVE",  emoji: "🏏", outcomes: [["dot", 10], ["1", 25], ["2", 10], ["4", 30], ["6", 10], ["W-caught", 15]] },
  smash:  { name: "SMASH",  emoji: "💥", outcomes: [["dot", 5],  ["1", 10], ["2", 5],  ["4", 25], ["6", 30], ["W-caught", 25]] },
  flick:  { name: "FLICK",  emoji: "🔄", outcomes: [["dot", 15], ["1", 20], ["2", 15], ["3", 5], ["4", 25], ["6", 10], ["W-caught", 10]] },
};

const RCB_BATSMEN = ["V Kohli (18)", "F du Plessis (7)", "G Maxwell (32)", "R Patidar (24)", "D Karthik"];

const COMMENTARY = {
  dot:  ["dot ball.", "no run, defended well.", "tight delivery."],
  "1":  ["pushed into the gap, single.", "quick single by Hitu's boys!", "rotates the strike."],
  "2":  ["two runs! good running.", "couple to deep cover.", "punched into the gap, TWO!"],
  "3":  ["QUICK RUNNING! THREE RUNS! 🏃", "rare three! fielder fumbles!"],
  "4":  ["FOUR! 🔴 Cover Drive by Virat! WHAT A SHOT!", "FOUR! Pull Shot timed to perfection!", "FOUR! Flick off the pads, classy!", "FOUR! Crashed through the off side!"],
  "6":  ["SIX! 🔥🔥 THAT'S GONE INTO THE SECOND TIER!", "SIX! 🚀 Maxwell-style finish!", "SIX! 🏏 Over long-on, beautiful!", "SIX! ☄️ This is RCB territory!"],
  "W-caught": ["CAUGHT! taken by the fielder! 😭", "edged & gone! brilliant catch.", "skied it... gone!"],
  "W-bowled": ["BOWLED HIM!! TIMBER!! 💥", "stumps shattered!", "what a delivery!"],
};

const SHOT_NAMES = ["Cover Drive", "Pull Shot", "Flick", "Cut", "Sweep", "Lofted Drive", "On Drive"];

function pickOutcome(shotKey) {
  const opts = SHOTS[shotKey].outcomes;
  const total = opts.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [o, w] of opts) { r -= w; if (r <= 0) return o; }
  return opts[0][0];
}

function pickMsg(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function CricketRCB({ onBack }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState("setup"); // setup | toss | innings | done
  const [opponent, setOpponent] = useState(null);
  const [format, setFormat] = useState(FORMATS[0]);
  const [target, setTarget] = useState(null);
  const [state, setState] = useState({ runs: 0, wickets: 0, balls: 0, batsmanIdx: 0, overBalls: [], lastShot: null });
  const [overlay, setOverlay] = useState(null); // {label, color, big}
  const [shake, setShake] = useState(0);
  const [commentary, setCommentary] = useState("ee sala cup namde 🏆");
  const [best, setBest] = useState(Number(localStorage.getItem("hitu_cricket_v2_best") || 0));
  const [fireworks, setFireworks] = useState([]);
  const ballRef = useRef({ active: false, t: 0, path: null, scale: 1 });
  const rafRef = useRef(null);
  const animRef = useRef(null);

  const maxBalls = format.overs * 6;
  const oversStr = `${Math.floor(state.balls / 6)}.${state.balls % 6}`;

  // ----- canvas drawing -----
  useEffect(() => {
    if (phase !== "innings") return;
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // night stadium sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, "#0a0a1a");
      skyGrad.addColorStop(1, "#1a1a2a");
      ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, w, h);

      // crowd / stands at top
      const standsH = 40;
      for (let i = 0; i < w; i += 6) {
        const isGold = ((i / 6) | 0) % 4 < 2;
        ctx.fillStyle = isGold ? "#FFD700" : "#CC0000";
        const bounce = (overlay?.big && Math.sin(Date.now() / 80 + i) > 0) ? -3 : 0;
        ctx.fillRect(i, bounce, 5, standsH);
      }
      // banner
      ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(0, standsH, w, 18);
      ctx.fillStyle = "#FFD700"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("🏏 ROYAL CHALLENGERS BENGALURU 🏏", w / 2, standsH + 13);

      // outfield (oval green)
      const cx = w / 2, cy = h * 0.55;
      ctx.fillStyle = "#2D6A4F";
      ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.48, h * 0.42, 0, 0, Math.PI * 2); ctx.fill();
      // inner gradient
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, w * 0.5);
      grad.addColorStop(0, "#52B788"); grad.addColorStop(1, "#1B4332");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.46, h * 0.40, 0, 0, Math.PI * 2); ctx.fill();
      // boundary rope
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.46, h * 0.40, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      // pitch
      const pX = cx - 18, pY = cy - 100, pW = 36, pH = 220;
      ctx.fillStyle = "#D4A96A"; ctx.fillRect(pX, pY, pW, pH);
      // crease lines
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(pX - 6, pY + 30); ctx.lineTo(pX + pW + 6, pY + 30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pX - 6, pY + pH - 30); ctx.lineTo(pX + pW + 6, pY + pH - 30); ctx.stroke();

      // bowler (top)
      const bowlerX = cx, bowlerY = pY + 12;
      ctx.font = "20px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("🤾", bowlerX, bowlerY);

      // stumps (top, behind bowler)
      ctx.fillStyle = "#fff"; ctx.fillRect(cx - 6, pY + 5, 2, 12); ctx.fillRect(cx, pY + 5, 2, 12); ctx.fillRect(cx + 6, pY + 5, 2, 12);

      // batsman (bottom of pitch)
      const batsmanX = cx, batsmanY = pY + pH - 5;
      ctx.font = "28px sans-serif";
      ctx.fillText("👑", batsmanX, batsmanY);
      // bat
      ctx.fillStyle = "#8B4513"; ctx.fillRect(batsmanX + 12, batsmanY - 20, 4, 16);

      // fielders
      const fielders = [
        { x: cx - w * 0.35, y: cy },
        { x: cx + w * 0.35, y: cy },
        { x: cx, y: cy + h * 0.30 },
        { x: cx, y: cy - h * 0.20 },
      ];
      ctx.font = "16px sans-serif";
      fielders.forEach((f) => ctx.fillText("🏃", f.x, f.y));

      // ball animation
      if (ballRef.current.active) {
        const { t, path, scale } = ballRef.current;
        const pos = cubicBezier(path, t);
        ctx.save();
        ctx.shadowColor = "#f00"; ctx.shadowBlur = 8;
        ctx.fillStyle = "#CC0000";
        ctx.beginPath(); ctx.arc(pos.x, pos.y, 6 * scale, 0, Math.PI * 2); ctx.fill();
        // seam
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(pos.x, pos.y, 6 * scale, -0.5, 0.5); ctx.stroke();
        ctx.restore();
      }

      // fireworks
      fireworks.forEach((fw) => {
        ctx.save();
        const alpha = Math.max(0, 1 - fw.age / 60);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fw.color;
        fw.particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(fw.x + p.dx * fw.age, fw.y + p.dy * fw.age + (fw.age * fw.age * 0.05), 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      });
    };

    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    loop();
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, overlay, fireworks]);

  // tick fireworks
  useEffect(() => {
    if (fireworks.length === 0) return;
    const id = setInterval(() => {
      setFireworks((arr) => arr.map((f) => ({ ...f, age: f.age + 1 })).filter((f) => f.age < 60));
    }, 50);
    return () => clearInterval(id);
  }, [fireworks.length]);

  function cubicBezier(p, t) {
    const [a, b, c, d] = p;
    const u = 1 - t;
    return {
      x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
      y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
    };
  }

  // ---- gameplay ----
  const animateBall = (outcome, onDone) => {
    const c = canvasRef.current; if (!c) return onDone();
    const w = c.clientWidth, h = c.clientHeight;
    const cx = w / 2, cy = h * 0.55;
    const start = { x: cx, y: cy - 100 + 12 };
    const batter = { x: cx, y: cy + 110 };
    let end, mid1, mid2, duration, scaleEnd = 1;

    if (outcome === "dot") {
      end = { x: cx, y: cy - 30 }; mid1 = { x: cx, y: cy + 50 }; mid2 = { x: cx - 8, y: cy + 20 }; duration = 700;
    } else if (outcome === "1") {
      end = { x: cx + (Math.random() > 0.5 ? 60 : -60), y: cy + 30 }; mid1 = batter; mid2 = { x: end.x * 0.7 + cx * 0.3, y: cy + 80 }; duration = 800;
    } else if (outcome === "2" || outcome === "3") {
      const side = Math.random() > 0.5 ? 1 : -1;
      end = { x: cx + side * w * 0.30, y: cy + h * 0.10 }; mid1 = batter; mid2 = { x: cx + side * w * 0.15, y: cy + 70 }; duration = 1000;
    } else if (outcome === "4") {
      const side = Math.random() > 0.5 ? 1 : -1;
      end = { x: cx + side * w * 0.46, y: cy + (Math.random() - 0.5) * h * 0.30 };
      mid1 = batter; mid2 = { x: cx + side * w * 0.30, y: cy + 30 }; duration = 600;
    } else if (outcome === "6") {
      const side = (Math.random() - 0.5) * 2;
      end = { x: cx + side * w * 0.5, y: -20 };
      mid1 = batter; mid2 = { x: cx + side * w * 0.4, y: cy - 200 }; duration = 800;
      scaleEnd = 1.6;
    } else if (outcome === "W-caught") {
      end = { x: cx + (Math.random() > 0.5 ? 1 : -1) * w * 0.30, y: cy }; mid1 = batter; mid2 = { x: cx, y: cy - 50 }; duration = 700;
    } else {
      end = { x: cx, y: cy - 95 }; mid1 = batter; mid2 = batter; duration = 600;
    }

    const path = [start, mid1, mid2, end];
    const t0 = Date.now();
    ballRef.current = { active: true, t: 0, path, scale: 1 };
    cancelAnimationFrame(animRef.current);
    const tick = () => {
      const t = Math.min(1, (Date.now() - t0) / duration);
      ballRef.current.t = t;
      ballRef.current.scale = 1 + (scaleEnd - 1) * t;
      if (t < 1) animRef.current = requestAnimationFrame(tick);
      else {
        ballRef.current.active = false;
        onDone();
      }
    };
    animRef.current = requestAnimationFrame(tick);
  };

  const playShot = (shotKey) => {
    if (ballRef.current.active || phase !== "innings") return;
    setState((s) => ({ ...s, lastShot: shotKey }));
    const outcome = pickOutcome(shotKey);

    animateBall(outcome, () => {
      // resolve outcome
      let runs = 0, wicketAdd = 0, label = "", color = "#FFD700", big = false;
      let comm = "";
      if (outcome === "dot") { comm = pickMsg(COMMENTARY.dot); }
      else if (outcome === "1") { runs = 1; label = "1"; comm = pickMsg(COMMENTARY["1"]); }
      else if (outcome === "2") { runs = 2; label = "2"; comm = pickMsg(COMMENTARY["2"]); }
      else if (outcome === "3") { runs = 3; label = "3"; comm = pickMsg(COMMENTARY["3"]); color = "#F59E0B"; }
      else if (outcome === "4") {
        runs = 4; label = "FOUR!"; color = "#CC0000"; big = true;
        comm = pickMsg(COMMENTARY["4"]).replace("Cover Drive", pickMsg(SHOT_NAMES));
      } else if (outcome === "6") {
        runs = 6; label = "SIX!"; color = "#FFD700"; big = true;
        comm = pickMsg(COMMENTARY["6"]);
        setShake(8); setTimeout(() => setShake(0), 350);
        spawnFireworks();
      } else if (outcome === "W-caught" || outcome === "W-bowled") {
        wicketAdd = 1; label = "OUT!"; color = "#CC0000"; big = true;
        comm = pickMsg(COMMENTARY[outcome] || COMMENTARY["W-caught"]);
      }

      setCommentary(comm);
      if (label) {
        setOverlay({ label, color, big });
        setTimeout(() => setOverlay(null), big ? 1100 : 700);
      }

      setState((s) => {
        const newBalls = s.balls + 1;
        const newOverBalls = [...s.overBalls, outcome === "dot" ? "." : outcome.startsWith("W") ? "W" : outcome === "4" ? "4" : outcome === "6" ? "6" : outcome];
        const newRuns = s.runs + runs;
        const newWickets = s.wickets + wicketAdd;
        const newBatsmanIdx = wicketAdd ? Math.min(s.batsmanIdx + 1, RCB_BATSMEN.length - 1) : s.batsmanIdx;
        const next = {
          ...s,
          runs: newRuns,
          wickets: newWickets,
          balls: newBalls,
          overBalls: newBalls % 6 === 0 ? [] : newOverBalls,
          batsmanIdx: newBatsmanIdx,
        };
        // check end
        const allOut = newWickets >= 10;
        const oversDone = newBalls >= maxBalls;
        const chased = target !== null && newRuns >= target;
        if (allOut || oversDone || chased) {
          setTimeout(() => {
            setPhase("done");
            if (newRuns > best) { setBest(newRuns); localStorage.setItem("hitu_cricket_v2_best", String(newRuns)); }
          }, big ? 1200 : 700);
        }
        return next;
      });
    });
  };

  const spawnFireworks = () => {
    const c = canvasRef.current; if (!c) return;
    const w = c.clientWidth, h = c.clientHeight;
    const newFw = [];
    for (let i = 0; i < 4; i++) {
      const particles = Array.from({ length: 12 }, (_, k) => {
        const angle = (k / 12) * Math.PI * 2;
        return { dx: Math.cos(angle) * 1.5, dy: Math.sin(angle) * 1.5 };
      });
      newFw.push({ id: Date.now() + i, x: 50 + Math.random() * (w - 100), y: h - 30, color: i % 2 === 0 ? "#FFD700" : "#CC0000", age: 0, particles });
    }
    setFireworks((arr) => [...arr, ...newFw]);
  };

  const startMatch = () => {
    if (!opponent) return;
    // simulate opponent score quickly (skipping interactive bowling)
    const oppScore = 30 + Math.floor(Math.random() * (format.overs * 8)) + opponent.diff * 5;
    setTarget(oppScore + 1);
    setState({ runs: 0, wickets: 0, balls: 0, batsmanIdx: 0, overBalls: [], lastShot: null });
    setPhase("toss");
    setTimeout(() => {
      setPhase("innings");
      setCommentary(`Target: ${oppScore + 1} from ${format.overs} overs. let's go RCB! 🏏`);
    }, 1800);
  };

  const restart = () => { setPhase("setup"); setOpponent(null); setOverlay(null); setFireworks([]); };

  // ===== render =====
  if (phase === "setup") {
    return (
      <SectionShell title="IPL Cricket 🏏" subtitle="play as RCB · pick your opponent" onBack={onBack} testId="cricket-section">
        <p className="handwritten text-2xl text-[var(--sunflower)] mb-2">select opponent</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {TEAMS.map((t) => (
            <button
              key={t.id}
              data-testid={`cricket-team-${t.id}`}
              onClick={() => setOpponent(t)}
              className={`glass rounded-xl p-3 text-center transition ${opponent?.id === t.id ? "ring-2 ring-[var(--sunflower)]" : ""}`}
            >
              <div className="w-10 h-10 mx-auto rounded-full mb-1" style={{ background: t.color }} />
              <p className="text-xs text-white font-bold">{t.short}</p>
              <p className="text-[10px] text-white/50">{"⭐".repeat(t.diff)}</p>
            </button>
          ))}
        </div>

        <p className="handwritten text-2xl text-[var(--sunflower)] mb-2">format</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              data-testid={`cricket-format-${f.id}`}
              onClick={() => setFormat(f)}
              className={`glass rounded-xl py-3 transition ${format.id === f.id ? "ring-2 ring-[var(--sunflower)] bg-[var(--sunflower)]/10" : ""}`}
            >
              <p className="text-white font-bold">{f.name}</p>
              <p className="text-[10px] text-white/50">{f.overs} overs</p>
            </button>
          ))}
        </div>

        <button onClick={startMatch} disabled={!opponent} className="sticker-btn w-full disabled:opacity-50" data-testid="cricket-start-match">
          🪙 toss & start match
        </button>
        <p className="text-xs text-white/50 mt-2 text-center">best: {best} runs</p>
      </SectionShell>
    );
  }

  if (phase === "toss") {
    return (
      <SectionShell title="Toss 🪙" onBack={onBack} testId="cricket-section">
        <div className="glass-yellow rounded-3xl p-8 text-center">
          <div className="text-8xl mb-3" style={{ animation: "spin 1.5s linear infinite" }}>🪙</div>
          <p className="handwritten text-3xl sunflower-text">RCB won the toss!</p>
          <p className="handwritten text-2xl text-white/90 mt-1">{opponent.short} batted first... scored their total.</p>
          <p className="handwritten text-2xl text-white mt-3">TARGET: {target} in {format.overs} overs</p>
          <p className="text-xs text-white/60 mt-2">get ready to bat!</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotateY(0); } to { transform: rotateY(360deg); } }`}</style>
      </SectionShell>
    );
  }

  if (phase === "done") {
    const won = state.runs >= target && state.wickets < 10;
    return (
      <SectionShell title={won ? "RCB WON! 🏆" : "We'll win next time 💪"} onBack={onBack} testId="cricket-section">
        <div className={`rounded-3xl p-6 text-center border-2 ${won ? "border-yellow-400/60" : "border-red-500/40"}`} style={{ background: won ? "linear-gradient(135deg,#5a3a06 0%,#3a0606 50%,#0a0a0a 100%)" : "linear-gradient(135deg,#3a0606 0%,#0a0a0a 100%)" }}>
          <p className="text-7xl mb-3">{won ? "🏆" : "🌧️"}</p>
          <p className="handwritten text-4xl text-[var(--sunflower)]">{state.runs}/{state.wickets}</p>
          <p className="text-sm text-white/80 mt-1">in {oversStr} overs · target was {target}</p>
          <p className="handwritten text-3xl text-white mt-4">{won ? "EE SALA CUP NAMDE! 🦁" : "Loyal to the core 🦁"}</p>
          <p className="text-xs text-white/60 mt-3">best: {Math.max(best, state.runs)}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={restart} className="flex-1 sticker-btn" data-testid="cricket-replay">play again</button>
          <button onClick={onBack} className="flex-1 glass rounded-xl py-3">back home</button>
        </div>
      </SectionShell>
    );
  }

  // innings UI
  return (
    <SectionShell title="RCB Batting 🏏" subtitle={`vs ${opponent.short} · need ${Math.max(0, target - state.runs)} from ${maxBalls - state.balls} balls`} onBack={onBack} testId="cricket-section">
      {/* scoreboard */}
      <div className="glass rounded-2xl p-3 mb-3">
        <div className="flex justify-between items-baseline">
          <p className="font-bold text-2xl text-[var(--sunflower)]" data-testid="cricket-score">RCB {state.runs}/{state.wickets}</p>
          <p className="text-sm text-white/70">{oversStr} / {format.overs} ov</p>
        </div>
        <p className="text-xs text-white/70 mt-1">batting: <b>{RCB_BATSMEN[state.batsmanIdx] || RCB_BATSMEN[RCB_BATSMEN.length - 1]}</b> · target {target}</p>
        <div className="flex gap-1 mt-2">
          {state.overBalls.map((b, i) => (
            <span key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              b === "." ? "bg-green-500/30 text-green-200" : b === "W" ? "bg-red-500 text-white" : b === "4" ? "bg-orange-500 text-white" : b === "6" ? "bg-yellow-400 text-black" : "bg-yellow-500/30 text-yellow-200"
            }`}>{b}</span>
          ))}
        </div>
      </div>

      {/* canvas */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-red-600/60" style={{ boxShadow: "0 0 30px rgba(204,6,6,0.4)", transform: `translateX(${shake ? (Math.random()-0.5)*shake : 0}px)` }}>
        <canvas ref={canvasRef} data-testid="cricket-canvas" className="w-full block" style={{ height: 380, background: "#0a0a1a" }} />
        {overlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" data-testid="cricket-overlay">
            <p
              className="font-black drop-shadow-[0_0_20px_currentColor]"
              style={{
                color: overlay.color,
                fontSize: overlay.big ? "5rem" : "3rem",
                animation: "popLabel 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                textShadow: `0 0 30px ${overlay.color}`,
              }}
            >{overlay.label}</p>
          </div>
        )}
      </div>

      {/* commentary */}
      <div className="glass rounded-2xl p-3 mt-3" style={{ background: "rgba(127,29,29,0.4)" }}>
        <p className="handwritten text-xl text-white text-center" data-testid="cricket-commentary">{commentary}</p>
      </div>

      {/* shot buttons */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {Object.entries(SHOTS).map(([k, s]) => (
          <button
            key={k}
            onClick={() => playShot(k)}
            disabled={ballRef.current.active}
            data-testid={`shot-${k}`}
            className="glass rounded-2xl py-4 flex flex-col items-center disabled:opacity-50 hover:bg-[var(--sunflower)]/10 transition active:scale-95"
          >
            <span className="text-3xl">{s.emoji}</span>
            <span className="font-bold text-sm text-white mt-1">{s.name}</span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes popLabel {
          0% { transform: scale(0.4) rotate(-5deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </SectionShell>
  );
}
