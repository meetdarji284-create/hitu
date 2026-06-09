import { useEffect, useRef, useState } from "react";
import SectionShell from "../SectionShell";
import { Eraser, Trash2, Download, FolderOpen, Save, Sparkles, X } from "lucide-react";

const COLORS = ["#ffd60a", "#ff6b9d", "#7ad0ff", "#a0d97a", "#d6a0ff", "#ff9d6b", "#ffffff", "#000000", "#c0392b", "#7c3aed"];
const SIZES = [3, 6, 12, 22];

const STORAGE = "hitu_drawings_v1";
function loadGallery() { try { return JSON.parse(localStorage.getItem(STORAGE)) || []; } catch { return []; } }
function saveGallery(arr) { localStorage.setItem(STORAGE, JSON.stringify(arr)); }

const EFFECTS = [
  "rainbow", "confetti", "stars", "watercolor", "flower", "glitter", "mirror", "vintage",
];
const EFFECT_NAMES = {
  rainbow: "🌈 Rainbow Spiral",
  confetti: "🎉 Confetti Explosion",
  stars: "✨ Starry Night",
  watercolor: "💧 Watercolor Wash",
  flower: "🌸 Flower Burst",
  glitter: "✨ Magic Glitter",
  mirror: "🪞 Mirror Flip",
  vintage: "📜 Vintage Filter",
};

export default function DrawingBoard({ onBack }) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#ff6b9d");
  const [size, setSize] = useState(6);
  const [erasing, setErasing] = useState(false);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const lastEffect = useRef(null);
  const [gallery, setGallery] = useState(loadGallery);
  const [showGallery, setShowGallery] = useState(false);
  const [toast, setToast] = useState(null);
  const [drawingName, setDrawingName] = useState("");

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [phoneImage, setPhoneImage] = useState(null); // dataURL shown in full-screen long-press modal

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const rect = c.getBoundingClientRect();
    c.width = rect.width * window.devicePixelRatio;
    c.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
  }, []);

  const pos = (ev) => {
    const c = canvasRef.current; const rect = c.getBoundingClientRect();
    const e = ev.touches ? ev.touches[0] : ev;
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (ev) => { ev.preventDefault(); drawing.current = true; last.current = pos(ev); };
  const move = (ev) => {
    if (!drawing.current) return;
    ev.preventDefault();
    const p = pos(ev);
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = erasing ? "#1a1a1a" : color;
    ctx.lineWidth = erasing ? size * 2 : size;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };
  const end = () => { drawing.current = false; };

  const newDrawing = () => setConfirmClear(true);
  const doClearCanvas = () => {
    const c = canvasRef.current; const ctx = c.getContext("2d");
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 0, c.width, c.height);
    setConfirmClear(false);
  };
  const downloadPng = async () => {
    const c = canvasRef.current;
    const dataUrl = c.toDataURL("image/png");
    const ts = Date.now();
    const filename = `hitu-doodle-${ts}.png`;

    // Try a real file download first — works on Android Chrome and iOS Safari 13+
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1500);
      showToast("📥 downloading to your phone 💛");
    } catch (e) {
      // Last resort: show full-screen image so user can long-press → Save Image
      setPhoneImage(dataUrl);
    }
  };

  const openSaveModal = () => {
    setDrawingName("Doodle " + (gallery.length + 1));
    setShowSaveModal(true);
  };

  const saveDrawing = () => {
    const name = (drawingName || "Doodle " + (gallery.length + 1)).slice(0, 30);
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const item = { id: Date.now(), name, ts: new Date().toLocaleDateString("en-IN"), src: dataUrl };
    const next = [item, ...gallery].slice(0, 30);
    setGallery(next); saveGallery(next);
    setShowSaveModal(false);
    setDrawingName("");
    showToast(`💾 saved as "${name}"`);
  };

  const loadDrawing = (item) => {
    const c = canvasRef.current; const ctx = c.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width / window.devicePixelRatio, c.height / window.devicePixelRatio);
      setShowGallery(false);
      showToast(`📂 loaded "${item.name}"`);
    };
    img.src = item.src;
  };

  const deleteDrawing = (id) => {
    const next = gallery.filter((d) => d.id !== id);
    setGallery(next); saveGallery(next);
    showToast("🗑️ deleted");
  };

  // ============ SURPRISE EFFECTS ============
  const applyEffect = () => {
    const remaining = EFFECTS.filter((e) => e !== lastEffect.current);
    const effect = remaining[Math.floor(Math.random() * remaining.length)];
    lastEffect.current = effect;
    const c = canvasRef.current; const ctx = c.getContext("2d");
    const w = c.width / window.devicePixelRatio;
    const h = c.height / window.devicePixelRatio;
    const cx = w / 2, cy = h / 2;

    if (effect === "rainbow") {
      const rb = ["#ff0000","#ff8800","#ffd60a","#22cc22","#22aaff","#7c3aed","#ff6b9d"];
      for (let t = 0; t < 400; t++) {
        const a = t * 0.15;
        const r = t * 0.4;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        ctx.fillStyle = rb[Math.floor(t / 15) % rb.length];
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
      }
    } else if (effect === "confetti") {
      const cols = ["#ff6b9d","#ffd60a","#7ad0ff","#a0d97a","#d6a0ff","#ff9d6b","#fff"];
      for (let i = 0; i < 120; i++) {
        ctx.fillStyle = cols[i % cols.length];
        ctx.save();
        ctx.translate(Math.random() * w, Math.random() * h);
        ctx.rotate(Math.random() * Math.PI);
        ctx.fillRect(-4, -8, 8, 16);
        ctx.restore();
      }
    } else if (effect === "stars") {
      for (let i = 0; i < 80; i++) {
        const sx = Math.random() * w, sy = Math.random() * h;
        const sz = 4 + Math.random() * 8;
        ctx.fillStyle = "rgba(255,255,255," + (0.4 + Math.random() * 0.6) + ")";
        // 4-point star
        ctx.beginPath();
        ctx.moveTo(sx, sy - sz);
        ctx.lineTo(sx + sz * 0.3, sy - sz * 0.3);
        ctx.lineTo(sx + sz, sy);
        ctx.lineTo(sx + sz * 0.3, sy + sz * 0.3);
        ctx.lineTo(sx, sy + sz);
        ctx.lineTo(sx - sz * 0.3, sy + sz * 0.3);
        ctx.lineTo(sx - sz, sy);
        ctx.lineTo(sx - sz * 0.3, sy - sz * 0.3);
        ctx.closePath(); ctx.fill();
      }
    } else if (effect === "watercolor") {
      const cols = ["rgba(255,180,210,0.35)","rgba(180,210,255,0.35)","rgba(255,230,150,0.35)","rgba(200,255,200,0.35)","rgba(220,180,255,0.35)"];
      for (let i = 0; i < 12; i++) {
        const r = 60 + Math.random() * 80;
        const grad = ctx.createRadialGradient(Math.random() * w, Math.random() * h, 0, Math.random() * w, Math.random() * h, r);
        grad.addColorStop(0, cols[i % cols.length]);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, r, 0, Math.PI * 2); ctx.fill();
      }
    } else if (effect === "flower") {
      const fx = last.current.x || cx;
      const fy = last.current.y || cy;
      ctx.font = "24px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const emo = ["🌸","🌻","🌹","🌷","🌼","💐"];
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r = 70;
        ctx.fillText(emo[i % emo.length], fx + Math.cos(a) * r, fy + Math.sin(a) * r);
      }
    } else if (effect === "glitter") {
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "#ffd700" : "#c0c0c0";
        const x = Math.random() * w, y = Math.random() * h;
        ctx.beginPath(); ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2); ctx.fill();
      }
    } else if (effect === "mirror") {
      // copy left half to right half mirrored
      const img = ctx.getImageData(0, 0, w / 2, h);
      // clear right half
      ctx.save();
      ctx.translate(w, 0); ctx.scale(-1, 1);
      ctx.putImageData(img, 0, 0);
      ctx.restore();
    } else if (effect === "vintage") {
      const img = ctx.getImageData(0, 0, w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        d[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        d[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        d[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
      ctx.putImageData(img, 0, 0);
    }

    showToast(`✨ ${EFFECT_NAMES[effect]} applied!`);
  };

  return (
    <SectionShell title="Doodle Board 🎨" subtitle="draw · save · surprise effects" onBack={onBack} testId="drawing-section">
      <div className="glass rounded-3xl p-3 mb-3 relative">
        <canvas
          ref={canvasRef}
          data-testid="drawing-canvas"
          className="w-full rounded-xl touch-none"
          style={{ height: 380, background: "#1a1a1a" }}
          onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
          onTouchStart={start} onTouchMove={move} onTouchEnd={end}
        />
        {toast && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full anim-fade-up z-10" data-testid="drawing-toast">
            {toast}
          </div>
        )}
      </div>

      {/* color row */}
      <p className="handwritten text-xl text-[var(--sunflower)] mb-1">colors</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3">
        {COLORS.map((c) => (
          <button key={c} data-testid={`draw-color-${c}`} onClick={() => { setColor(c); setErasing(false); }}
            className={`w-9 h-9 rounded-full flex-shrink-0 border-2 transition ${color === c && !erasing ? "border-[var(--sunflower)] scale-110" : "border-white/20"}`}
            style={{ background: c }} />
        ))}
      </div>

      <p className="handwritten text-xl text-[var(--sunflower)] mb-1">brush</p>
      <div className="flex gap-2 mb-3">
        {SIZES.map((s) => (
          <button key={s} data-testid={`draw-size-${s}`} onClick={() => setSize(s)}
            className={`flex-1 glass rounded-xl py-2 flex items-center justify-center transition ${size === s ? "ring-2 ring-[var(--sunflower)]" : ""}`}>
            <span className="rounded-full bg-white" style={{ width: s, height: s }} />
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        <button onClick={() => setErasing((v) => !v)} className={`flex-1 glass rounded-xl py-2 flex items-center justify-center gap-1 text-sm ${erasing ? "ring-2 ring-[var(--sunflower)]" : ""}`} data-testid="draw-erase">
          <Eraser className="w-4 h-4" /> {erasing ? "erasing" : "eraser"}
        </button>
        <button onClick={newDrawing} className="flex-1 bg-red-500/15 border border-red-400/40 text-red-200 rounded-xl py-2 flex items-center justify-center gap-1 text-sm" data-testid="draw-clear">
          <Trash2 className="w-4 h-4" /> new
        </button>
        <button onClick={applyEffect} className="flex-1 sticker-btn !py-2 !text-sm" data-testid="draw-surprise">
          <Sparkles className="w-4 h-4 inline mr-1" /> surprise
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={openSaveModal} className="flex-1 glass rounded-xl py-2 flex items-center justify-center gap-1 text-sm" data-testid="draw-save">
          <Save className="w-4 h-4" /> save
        </button>
        <button onClick={() => setShowGallery(true)} className="flex-1 glass rounded-xl py-2 flex items-center justify-center gap-1 text-sm" data-testid="draw-gallery">
          <FolderOpen className="w-4 h-4" /> dashboard ({gallery.length})
        </button>
        <button onClick={downloadPng} className="flex-1 glass rounded-xl py-2 flex items-center justify-center gap-1 text-sm" data-testid="draw-download">
          <Download className="w-4 h-4" /> save to phone
        </button>
      </div>
      <p className="text-[10px] text-white/40 text-center mt-1 mb-1">📥 downloads the image to your phone</p>

      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur p-4 overflow-y-auto" onClick={() => setShowGallery(false)} data-testid="drawing-gallery-modal">
          <div className="max-w-md mx-auto glass rounded-3xl p-4 my-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="handwritten text-3xl sunflower-text">My Dashboard 🎨</p>
              <button onClick={() => setShowGallery(false)} data-testid="gallery-close"><X className="w-5 h-5 text-white" /></button>
            </div>
            {gallery.length === 0 ? (
              <p className="handwritten text-2xl text-white/60 text-center py-8">no drawings yet · save one first 💛</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {gallery.map((d) => (
                  <div key={d.id} className="bg-white/5 rounded-xl p-2" data-testid={`drawing-item-${d.id}`}>
                    <img src={d.src} alt={d.name} className="w-full aspect-square object-cover rounded bg-black" />
                    <p className="handwritten text-lg text-white mt-1 truncate">{d.name}</p>
                    <p className="text-[10px] text-white/50">{d.ts}</p>
                    <div className="flex gap-1 mt-1">
                      <button onClick={() => loadDrawing(d)} className="flex-1 text-[11px] bg-[var(--sunflower)] text-black rounded py-1" data-testid={`drawing-load-${d.id}`}>load</button>
                      <button onClick={() => deleteDrawing(d.id)} className="bg-red-500/30 text-red-200 rounded px-2 py-1 text-[11px]" data-testid={`drawing-delete-${d.id}`}>del</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Save-to-phone full-screen modal — long-press the image to save to Photos */}
      {phoneImage && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur p-4 flex flex-col items-center justify-center" onClick={() => setPhoneImage(null)} data-testid="drawing-phone-modal">
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <p className="handwritten text-3xl text-[var(--sunflower)] text-center mb-1">save to your phone 📸</p>
            <p className="text-sm text-white/80 text-center mb-3 leading-snug">
              <span className="text-[var(--sunflower)]">long-press</span> the image below →<br/>
              tap <b>"Save to Photos"</b> / <b>"Add to Photos"</b> / <b>"Download image"</b> 💛
            </p>
            <img
              src={phoneImage}
              alt="doodle to save"
              className="w-full rounded-2xl border-2 border-[var(--sunflower)]/40 shadow-lg bg-black"
              style={{ touchAction: "manipulation" }}
              data-testid="drawing-phone-image"
            />
            <button onClick={() => setPhoneImage(null)} className="mt-4 w-full bg-white/10 rounded-xl py-2 text-sm text-white" data-testid="drawing-phone-close">
              done · close
            </button>
          </div>
        </div>
      )}

      {/* Save name modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur p-4" onClick={() => setShowSaveModal(false)} data-testid="drawing-save-modal">
          <div className="glass rounded-3xl p-5 max-w-xs w-full" onClick={(e) => e.stopPropagation()}>
            <p className="handwritten text-3xl text-[var(--sunflower)] mb-2">name this drawing</p>
            <input
              autoFocus
              value={drawingName}
              onChange={(e) => setDrawingName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveDrawing(); }}
              maxLength={30}
              placeholder="my masterpiece..."
              className="w-full bg-black/40 rounded-xl px-3 py-2 text-white border border-white/15 focus:border-[var(--sunflower)] outline-none handwritten text-xl"
              data-testid="drawing-save-input"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowSaveModal(false)} className="flex-1 bg-white/10 rounded-xl py-2 text-sm text-white" data-testid="drawing-save-cancel">cancel</button>
              <button onClick={saveDrawing} className="flex-1 sticker-btn !py-2 !text-sm" data-testid="drawing-save-confirm">save</button>
            </div>
          </div>
        </div>
      )}

      {/* Clear-canvas confirm modal */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur p-4" onClick={() => setConfirmClear(false)} data-testid="drawing-clear-modal">
          <div className="glass rounded-3xl p-5 max-w-xs w-full text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-5xl mb-2">🥺</p>
            <p className="handwritten text-3xl text-[var(--sunflower)] mb-1">start fresh?</p>
            <p className="text-sm text-white/70 mb-4">your current doodle will be cleared</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmClear(false)} className="flex-1 bg-white/10 rounded-xl py-2 text-sm text-white" data-testid="drawing-clear-cancel">keep it</button>
              <button onClick={doClearCanvas} className="flex-1 bg-red-500/80 rounded-xl py-2 text-sm text-white" data-testid="drawing-clear-confirm">clear</button>
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
