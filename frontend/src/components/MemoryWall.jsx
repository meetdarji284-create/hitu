import { useState, useEffect, useRef } from "react";
import SectionShell from "./SectionShell";
import { PHOTOS } from "../data/hituData";
import { Upload, Star, Trash2, X, Pencil } from "lucide-react";

const THEMES = [
  { id: "white", name: "polaroid", bg: "#fafafa", text: "#1a1a1a" },
  { id: "floral", name: "floral 🌸", bg: "#fde9f0", text: "#7a2a4a" },
  { id: "sepia", name: "vintage", bg: "#f0e1c4", text: "#5a3a1a" },
  { id: "pastel", name: "pastel", bg: "linear-gradient(135deg,#fef3c7 0%,#fce7f3 100%)", text: "#3a2a1a" },
  { id: "gold", name: "gold foil ✨", bg: "linear-gradient(135deg,#fff5cc 0%,#ffd60a 100%)", text: "#1a1a1a" },
];

const STICKERS = ["🌻", "❤️", "✨", "🍫", "🥺", "💌", "🌸", "🌙", "☕", "🥰"];

// pre-seeded memories so the wall is never empty
const SEED = [
  { id: "s1", src: PHOTOS.sunflowerNight, title: "sunflowers + you", date: "2026-04-21", note: "you on a Mumbai street, holding the prettiest bouquet 🌻", sticker: "🌻", theme: "white", featured: true },
  { id: "s2", src: PHOTOS.sunflowerHug, title: "my sunshine", date: "2026-04-11", note: "the day you smelled the sunflower and the whole world paused", sticker: "❤️", theme: "floral" },
  { id: "s3", src: PHOTOS.lehenga, title: "garba queen", date: "2026-05-12", note: "yellow lehenga, you spinning, me dead", sticker: "💃", theme: "gold" },
  { id: "s4", src: PHOTOS.purpleKurti, title: "purple suits you", date: "2026-04-24", note: "soft purple, soft you ✨", sticker: "✨", theme: "pastel" },
  { id: "s5", src: PHOTOS.floralKurti, title: "soft girl era", date: "2026-04-02", note: "floral kurti energy 🌸", sticker: "🌸", theme: "sepia" },
];

const STORAGE_KEY = "hitu_memories_v2";
// Note: photos+captions are stored in localStorage by design — this is a personal
// single-device scrapbook with no auth or server, so localStorage is the intended
// store. No third-party PII or credentials are ever stored here.

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : SEED;
  } catch { return SEED; }
}
function save(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn("MemoryWall: failed to save to localStorage", err);
  }
}

function MemoryCard({ m, onClick, isFeatured }) {
  const theme = THEMES.find((t) => t.id === m.theme) || THEMES[0];
  const tilt = (parseInt(m.id.slice(-2), 36) % 7) - 3;
  return (
    <button
      onClick={onClick}
      data-testid={`memory-card-${m.id}`}
      className="block w-full text-left polaroid relative hover:z-20 mb-3"
      style={{
        background: theme.bg,
        transform: `rotate(${isFeatured ? 0 : tilt}deg)`,
        boxShadow: isFeatured
          ? "0 0 30px rgba(255,214,10,0.55), 0 12px 30px rgba(0,0,0,0.5)"
          : "0 10px 24px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
        animation: isFeatured ? "pulseGlow 2.5s ease-in-out infinite" : undefined,
      }}
    >
      {isFeatured && (
        <div className="absolute -top-3 -right-3 bg-[var(--sunflower)] text-black rounded-full px-2 py-0.5 text-xs flex items-center gap-1 font-bold z-10">
          <Star className="w-3 h-3 fill-black" /> featured
        </div>
      )}
      {m.sticker && <div className="absolute -top-2 -left-2 text-3xl z-10 anim-wiggle">{m.sticker}</div>}
      <img src={m.src} alt={m.title} loading="lazy" />
      <p className="polaroid-caption" style={{ color: theme.text }}>{m.title}</p>
      {m.date && <p className="text-xs text-center -mt-7 mb-2 opacity-70" style={{ color: theme.text }}>{m.date}</p>}
    </button>
  );
}

function UploadForm({ onSave, onCancel, initial }) {
  const [src, setSrc] = useState(initial?.src || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(initial?.note || "");
  const [sticker, setSticker] = useState(initial?.sticker || "🌻");
  const [theme, setTheme] = useState(initial?.theme || "white");
  const [featured, setFeatured] = useState(initial?.featured || false);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 4 * 1024 * 1024) {
      alert("Photo too big (>4MB). Try a smaller one, jaan 🥺");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setSrc(ev.target.result);
    reader.readAsDataURL(f);
  };

  const submit = () => {
    if (!src) return alert("Pick a photo first 📸");
    if (!title.trim()) return alert("Give it a sweet title ❤️");
    onSave({
      id: initial?.id || `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      src, title: title.trim(), date, note: note.slice(0, 200), sticker, theme, featured,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur p-4 overflow-y-auto" onClick={onCancel} data-testid="memory-upload-modal">
      <div className="glass rounded-3xl p-5 max-w-md mx-auto my-4 anim-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <p className="handwritten text-3xl sunflower-text">{initial ? "edit memory" : "new memory 📸"}</p>
          <button onClick={onCancel} data-testid="memory-form-close"><X className="w-5 h-5 text-white/70" /></button>
        </div>

        {src ? (
          <div className="relative">
            <img src={src} alt="preview" className="w-full aspect-square object-cover rounded-2xl" />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-2 right-2 sticker-btn !py-1 !px-3 text-xs"
              data-testid="memory-change-photo"
            >change</button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            data-testid="memory-pick-photo"
            className="w-full aspect-square rounded-2xl border-2 border-dashed border-[var(--sunflower)]/50 flex flex-col items-center justify-center gap-2 text-white/70 hover:bg-[var(--sunflower)]/5 transition"
          >
            <Upload className="w-10 h-10 text-[var(--sunflower)]" />
            <span className="handwritten text-2xl">pick a photo</span>
            <span className="text-xs opacity-60">jpeg / png / webp · up to 4MB</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} data-testid="memory-file-input" />

        <label className="block mt-3">
          <span className="text-xs uppercase tracking-widest text-white/60">title</span>
          <input
            data-testid="memory-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Our first date ❤️"
            className="w-full mt-1 bg-black/40 rounded-xl px-3 py-2 text-white border border-white/10 focus:border-[var(--sunflower)] outline-none handwritten text-xl"
          />
        </label>

        <label className="block mt-3">
          <span className="text-xs uppercase tracking-widest text-white/60">date</span>
          <input
            data-testid="memory-date-input"
            type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 bg-black/40 rounded-xl px-3 py-2 text-white border border-white/10 focus:border-[var(--sunflower)] outline-none"
          />
        </label>

        <label className="block mt-3">
          <span className="text-xs uppercase tracking-widest text-white/60">love note ({note.length}/200)</span>
          <textarea
            data-testid="memory-note-input"
            value={note} onChange={(e) => setNote(e.target.value.slice(0, 200))}
            rows={3} placeholder="why this moment matters..."
            className="w-full mt-1 bg-black/40 rounded-xl px-3 py-2 text-white border border-white/10 focus:border-[var(--sunflower)] outline-none handwritten text-lg"
          />
        </label>

        <p className="text-xs uppercase tracking-widest text-white/60 mt-3 mb-1">mood sticker</p>
        <div className="flex flex-wrap gap-2">
          {STICKERS.map((s) => (
            <button
              key={s}
              data-testid={`memory-sticker-${s}`}
              onClick={() => setSticker(s)}
              className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center transition ${sticker === s ? "bg-[var(--sunflower)]/30 ring-2 ring-[var(--sunflower)]" : "bg-white/5"}`}
            >{s}</button>
          ))}
        </div>

        <p className="text-xs uppercase tracking-widest text-white/60 mt-3 mb-1">card theme</p>
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              data-testid={`memory-theme-${t.id}`}
              onClick={() => setTheme(t.id)}
              className={`h-12 rounded-lg text-xs handwritten transition ${theme === t.id ? "ring-2 ring-[var(--sunflower)]" : ""}`}
              style={{ background: t.bg, color: t.text }}
            >{t.name}</button>
          ))}
        </div>

        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
            data-testid="memory-featured-toggle"
            className="w-4 h-4 accent-[var(--sunflower)]"
          />
          <span className="text-sm text-white/80">⭐ make this the featured memory</span>
        </label>

        <button onClick={submit} className="sticker-btn w-full mt-5" data-testid="memory-save">
          save memory ❤️
        </button>
      </div>
    </div>
  );
}

function ViewModal({ m, onClose, onEdit, onDelete }) {
  if (!m) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur p-4 flex items-center justify-center" onClick={onClose} data-testid="memory-view-modal">
      <div className="glass rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto anim-fade-up relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center z-10" data-testid="memory-view-close">
          <X className="w-4 h-4 text-white" />
        </button>
        <img src={m.src} alt={m.title} className="w-full aspect-square object-cover rounded-t-3xl" />
        <div className="p-5">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{m.sticker}</span>
            <div className="flex-1">
              <p className="handwritten text-3xl sunflower-text leading-tight">{m.title}</p>
              {m.date && <p className="text-xs text-white/60 mt-1">{new Date(m.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>}
            </div>
          </div>
          {m.note && (
            <p className="handwritten text-2xl text-white/95 mt-4 leading-snug whitespace-pre-line">&ldquo;{m.note}&rdquo;</p>
          )}
          <div className="flex gap-2 mt-5">
            <button onClick={onEdit} className="flex-1 glass rounded-xl py-2 flex items-center justify-center gap-1.5 text-sm" data-testid="memory-edit">
              <Pencil className="w-4 h-4" /> edit
            </button>
            <button
              onClick={() => { if (confirm("Delete this memory? this can't be undone 🥺")) onDelete(); }}
              className="flex-1 bg-red-500/15 border border-red-400/40 text-red-200 rounded-xl py-2 flex items-center justify-center gap-1.5 text-sm"
              data-testid="memory-delete"
            >
              <Trash2 className="w-4 h-4" /> delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemoryWall({ onBack }) {
  const [items, setItems] = useState(load());
  const [view, setView] = useState(null); // memory being viewed
  const [edit, setEdit] = useState(null); // memory being edited
  const [creating, setCreating] = useState(false);
  const [mode, setMode] = useState("wall"); // "wall" | "timeline"

  useEffect(() => { save(items); }, [items]);

  const upsert = (m) => {
    setItems((prev) => {
      // if featured, un-feature others
      let next = m.featured ? prev.map((x) => ({ ...x, featured: false })) : prev;
      const idx = next.findIndex((x) => x.id === m.id);
      if (idx >= 0) { next = [...next]; next[idx] = m; } else { next = [m, ...next]; }
      return next;
    });
    setCreating(false); setEdit(null); setView(null);
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setView(null);
  };

  const featured = items.find((x) => x.featured);
  const rest = items.filter((x) => !x.featured);
  const sortedTimeline = [...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <SectionShell title="Memory Wall 📸" subtitle="our story · frame by frame" onBack={onBack} testId="memory-section">
      {/* counter + actions */}
      <div className="flex items-center justify-between mb-4">
        <p className="handwritten text-2xl text-[var(--sunflower)]" data-testid="memory-count">
          🌻 {items.length} memories together
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setMode(mode === "wall" ? "timeline" : "wall")}
            data-testid="memory-mode-toggle"
            className="text-xs px-3 py-1.5 rounded-full glass"
          >{mode === "wall" ? "📅 timeline" : "🖼️ wall"}</button>
        </div>
      </div>

      {/* empty state */}
      {items.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center" data-testid="memory-empty">
          <div className="text-7xl mb-3">📸</div>
          <p className="handwritten text-3xl text-white mb-2">no memories yet, jaan</p>
          <p className="text-sm text-white/60 mb-5">add the first one and start our little scrapbook ❤️</p>
          <button onClick={() => setCreating(true)} className="sticker-btn" data-testid="memory-add-first">
            + add first memory
          </button>
        </div>
      ) : mode === "wall" ? (
        <>
          {featured && (
            <div className="mb-4">
              <MemoryCard m={featured} onClick={() => setView(featured)} isFeatured />
            </div>
          )}
          {/* masonry-ish 2-col */}
          <div className="columns-2 gap-3">
            {rest.map((m) => (
              <div key={m.id} className="break-inside-avoid">
                <MemoryCard m={m} onClick={() => setView(m)} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="relative pl-6 border-l-2 border-[var(--sunflower)]/40">
          {sortedTimeline.map((m) => (
            <div key={m.id} className="relative mb-5" data-testid={`timeline-${m.id}`}>
              <div className="absolute -left-[1.85rem] top-2 w-4 h-4 rounded-full bg-[var(--sunflower)] border-2 border-black" />
              <p className="text-xs text-white/60 mb-1">
                {m.date ? new Date(m.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "undated"}
              </p>
              <MemoryCard m={m} onClick={() => setView(m)} />
            </div>
          ))}
        </div>
      )}

      {/* big add button */}
      <button
        onClick={() => setCreating(true)}
        data-testid="memory-add-button"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 sticker-btn z-30 anim-pulse-glow"
      >
        ＋ add new memory
      </button>

      {creating && <UploadForm onSave={upsert} onCancel={() => setCreating(false)} />}
      {edit && <UploadForm initial={edit} onSave={upsert} onCancel={() => setEdit(null)} />}
      {view && !edit && (
        <ViewModal
          m={view}
          onClose={() => setView(null)}
          onEdit={() => setEdit(view)}
          onDelete={() => remove(view.id)}
        />
      )}
    </SectionShell>
  );
}
