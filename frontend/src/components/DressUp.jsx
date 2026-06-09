// Bitmoji-style SVG avatar with layered <g> groups.
// All clothing items are inline SVG paths injected into the correct layer.
import { useState, useEffect, useRef } from "react";
import SectionShell from "./SectionShell";
import { Upload, Shuffle, Save, RotateCcw, X, Trash2, Undo2, Redo2 } from "lucide-react";

// =============== AVATAR (one big SVG, viewBox 0 0 300 600) ===============
// Skin #c68642, default hair #1a0a00, eyes #2c1810
const BODY = (
  <g id="layer-body">
    {/* legs */}
    <path d="M120,420 Q118,490 122,560 L140,560 L138,490 Q138,460 140,420 Z" fill="#c68642" />
    <path d="M160,420 Q162,490 158,560 L178,560 L180,490 Q182,460 180,420 Z" fill="#c68642" />
    {/* torso */}
    <path d="M105,260 Q100,340 110,420 L190,420 Q200,340 195,260 Q170,250 150,250 Q130,250 105,260 Z" fill="#c68642" />
    {/* arms */}
    <path d="M105,260 Q88,310 92,400 L110,400 Q108,310 118,260 Z" fill="#c68642" />
    <path d="M195,260 Q212,310 208,400 L190,400 Q192,310 182,260 Z" fill="#c68642" />
    {/* neck */}
    <rect x="138" y="220" width="24" height="40" fill="#c68642" />
    {/* head */}
    <ellipse cx="150" cy="170" rx="55" ry="62" fill="#c68642" />
    {/* eyes */}
    <ellipse cx="130" cy="170" rx="4.5" ry="6" fill="#2c1810" />
    <ellipse cx="170" cy="170" rx="4.5" ry="6" fill="#2c1810" />
    <ellipse cx="131" cy="167" rx="1.5" ry="2" fill="#fff" />
    <ellipse cx="171" cy="167" rx="1.5" ry="2" fill="#fff" />
    {/* brows */}
    <path d="M120,158 Q130,154 140,158" stroke="#3a2a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M160,158 Q170,154 180,158" stroke="#3a2a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* nose */}
    <path d="M150,178 Q148,192 152,196" stroke="#a87850" strokeWidth="2" fill="none" />
    {/* lips */}
    <path d="M138,206 Q150,214 162,206 Q150,210 138,206" fill="#c9586e" />
    {/* blush */}
    <ellipse cx="125" cy="195" rx="7" ry="3.5" fill="#ff9da6" opacity="0.45" />
    <ellipse cx="175" cy="195" rx="7" ry="3.5" fill="#ff9da6" opacity="0.45" />
    {/* feet */}
    <ellipse cx="129" cy="565" rx="14" ry="6" fill="#c68642" />
    <ellipse cx="169" cy="565" rx="14" ry="6" fill="#c68642" />
  </g>
);

// =============== HAIR CATALOG ===============
const HAIR = {
  long: (c) => (
    <>
      <path d="M95,140 Q90,90 150,80 Q210,90 205,140 Q205,210 215,290 L240,440 L260,440 L255,290 Q215,80 150,72 Q85,80 45,290 L40,440 L60,440 L85,290 Q95,210 95,140 Z" fill={c} />
      <path d="M95,120 Q140,135 205,120 L205,160 Q150,180 95,160 Z" fill={c} />
    </>
  ),
  bun: (c) => (
    <>
      <circle cx="150" cy="80" r="32" fill={c} />
      <path d="M100,140 Q95,100 150,90 Q205,100 200,140 Q205,160 200,180 L100,180 Q95,160 100,140 Z" fill={c} />
    </>
  ),
  ponytail: (c) => (
    <>
      <path d="M95,140 Q90,90 150,80 Q210,90 205,140 L205,180 L95,180 Z" fill={c} />
      <path d="M195,150 Q235,180 230,290 L215,290 Q210,200 190,170 Z" fill={c} />
    </>
  ),
  braid: (c) => (
    <>
      <path d="M95,140 Q90,90 150,80 Q210,90 205,140 L205,180 L95,180 Z" fill={c} />
      <path d="M100,170 Q95,260 110,360 L130,360 Q120,260 115,170 Z" fill={c} />
      <circle cx="113" cy="200" r="6" fill={c} stroke="#000" strokeOpacity="0.2" />
      <circle cx="115" cy="250" r="6" fill={c} stroke="#000" strokeOpacity="0.2" />
      <circle cx="118" cy="300" r="6" fill={c} stroke="#000" strokeOpacity="0.2" />
    </>
  ),
  bob: (c) => (
    <>
      <path d="M88,150 Q85,85 150,75 Q215,85 212,150 L212,210 Q150,225 88,210 Z" fill={c} />
    </>
  ),
  wavy: (c) => (
    <>
      <path d="M88,140 Q80,80 150,70 Q220,80 212,140 Q220,220 235,310 L245,310 Q220,200 210,140 L210,180 Q150,200 90,180 L90,140 Q80,200 55,310 L65,310 Q80,220 88,140 Z" fill={c} />
    </>
  ),
};

const HAIR_OPTIONS = [
  { id: "long", name: "Long", color: "#1a0a00" },
  { id: "bun", name: "Bun", color: "#1a0a00" },
  { id: "ponytail", name: "Ponytail", color: "#3a1a08" },
  { id: "braid", name: "Side Braid", color: "#1a0a00" },
  { id: "bob", name: "Short Bob", color: "#5a3018" },
  { id: "wavy", name: "Wavy", color: "#1a0a00" },
];
const HAIR_COLORS = ["#000000", "#1a0a00", "#3a1a08", "#5a3018", "#8a4818", "#722f37"];

// =============== TOP CATALOG ===============
const TOP = {
  kurta: (c, c2) => (
    <>
      <path d="M105,250 Q100,360 115,460 L185,460 Q200,360 195,250 Q170,243 150,243 Q130,243 105,250 Z" fill={c} />
      {/* sleeves */}
      <path d="M105,250 Q90,290 95,360 L110,360 Q108,290 118,250 Z" fill={c} />
      <path d="M195,250 Q210,290 205,360 L190,360 Q192,290 182,250 Z" fill={c} />
      {/* embroidery */}
      <circle cx="150" cy="280" r="3" fill={c2} />
      <circle cx="140" cy="295" r="2" fill={c2} />
      <circle cx="160" cy="295" r="2" fill={c2} />
      <path d="M150,250 L150,460" stroke={c2} strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
    </>
  ),
  tshirt: (c) => (
    <>
      <path d="M105,250 Q100,320 110,400 L190,400 Q200,320 195,250 Q170,245 150,245 Q130,245 105,250 Z" fill={c} />
      <path d="M105,250 Q92,275 95,310 L108,310 Q108,275 115,250 Z" fill={c} />
      <path d="M195,250 Q208,275 205,310 L192,310 Q192,275 185,250 Z" fill={c} />
    </>
  ),
  hoodie: (c, c2) => (
    <>
      <path d="M105,250 Q98,330 108,420 L192,420 Q202,330 195,250 Q170,245 150,245 Q130,245 105,250 Z" fill={c} />
      <path d="M105,250 Q88,300 92,400 L108,400 Q105,310 115,250 Z" fill={c} />
      <path d="M195,250 Q212,300 208,400 L192,400 Q195,310 185,250 Z" fill={c} />
      {/* hood */}
      <path d="M105,250 Q120,225 150,222 Q180,225 195,250 Q170,240 150,240 Q130,240 105,250 Z" fill={c2 || "#0a0a0a"} opacity="0.45" />
      <line x1="150" y1="260" x2="150" y2="380" stroke={c2 || "#0a0a0a"} strokeWidth="2" opacity="0.45" />
    </>
  ),
  croptop: (c) => (
    <>
      <path d="M108,250 Q105,295 110,320 L190,320 Q195,295 192,250 Q170,245 150,245 Q130,245 108,250 Z" fill={c} />
    </>
  ),
  offshoulder: (c) => (
    <>
      <path d="M115,260 Q108,310 115,400 L185,400 Q192,310 185,260 Q170,255 150,255 Q130,255 115,260 Z" fill={c} />
      {/* ruffle */}
      <path d="M115,258 Q150,266 185,258 L185,270 Q150,278 115,270 Z" fill={c} opacity="0.6" />
    </>
  ),
  blouse: (c) => (
    <>
      <path d="M115,250 Q110,300 118,340 L182,340 Q190,300 185,250 Q170,245 150,245 Q130,245 115,250 Z" fill={c} />
    </>
  ),
};
const TOP_OPTIONS = [
  { id: "kurta", name: "Kurta", color: "#ff85a2", color2: "#ffd700" },
  { id: "tshirt", name: "T-shirt", color: "#ffd60a" },
  { id: "hoodie", name: "Hoodie", color: "#c4b0e0" },
  { id: "croptop", name: "Crop Top", color: "#ff6b9d" },
  { id: "offshoulder", name: "Off-shoulder", color: "#fafafa" },
  { id: "blouse", name: "Blouse", color: "#e63946" },
];

// =============== BOTTOM CATALOG ===============
const BOTTOM = {
  jeans: (c) => (
    <>
      <path d="M115,400 Q112,490 120,560 L142,560 L140,490 Q140,440 145,400 Z" fill={c} />
      <path d="M185,400 Q188,490 180,560 L158,560 L160,490 Q160,440 155,400 Z" fill={c} />
      <line x1="150" y1="400" x2="150" y2="445" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </>
  ),
  palazzo: (c) => (
    <>
      <path d="M115,400 Q105,490 100,560 L145,560 L148,490 Q148,440 148,400 Z" fill={c} />
      <path d="M185,400 Q195,490 200,560 L155,560 L152,490 Q152,440 152,400 Z" fill={c} />
    </>
  ),
  lehengaSkirt: (c, c2) => (
    <>
      <path d="M105,400 Q70,510 50,580 L250,580 Q230,510 195,400 Z" fill={c} />
      <path d="M50,565 L250,565 L245,580 L55,580 Z" fill={c2 || "#ffd700"} />
      <path d="M60,540 L240,540" stroke={c2 || "#ffd700"} strokeWidth="2" opacity="0.6" />
    </>
  ),
  miniSkirt: (c) => (
    <>
      <path d="M108,400 Q90,470 80,480 L220,480 Q210,470 192,400 Z" fill={c} />
    </>
  ),
  joggers: (c) => (
    <>
      <path d="M115,400 Q112,490 118,558 L142,558 L140,490 Q142,440 145,400 Z" fill={c} />
      <path d="M185,400 Q188,490 182,558 L158,558 L160,490 Q158,440 155,400 Z" fill={c} />
      <rect x="115" y="395" width="70" height="6" fill={c} />
    </>
  ),
  midiSkirt: (c) => (
    <>
      <path d="M105,400 Q85,490 75,520 L225,520 Q215,490 195,400 Z" fill={c} />
    </>
  ),
};
const BOTTOM_OPTIONS = [
  { id: "jeans", name: "Jeans", color: "#3a5a8a" },
  { id: "palazzo", name: "Palazzo", color: "#ff85a2" },
  { id: "lehengaSkirt", name: "Lehenga", color: "#ffd60a", color2: "#c0392b" },
  { id: "miniSkirt", name: "Mini Skirt", color: "#ff6b9d" },
  { id: "joggers", name: "Joggers", color: "#1a1a1a" },
  { id: "midiSkirt", name: "Midi Skirt", color: "#7a3a8c" },
];

// =============== FULL OUTFIT CATALOG ===============
const FULL = {
  saree: (c, c2) => (
    <>
      {/* blouse */}
      <path d="M115,250 Q110,300 118,340 L182,340 Q190,300 185,250 Q170,245 150,245 Q130,245 115,250 Z" fill={c2 || "#c0392b"} />
      {/* drape */}
      <path d="M105,260 Q60,360 50,580 L250,580 Q240,360 195,260 Q170,290 150,295 Q130,290 105,260 Z" fill={c} />
      {/* pleats */}
      <path d="M120,400 Q100,500 95,575" stroke={c2 || "#c0392b"} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M150,400 Q140,500 138,575" stroke={c2 || "#c0392b"} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M180,400 Q200,500 205,575" stroke={c2 || "#c0392b"} strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* pallu over shoulder */}
      <path d="M105,260 Q140,290 170,260 L172,330 Q140,330 105,310 Z" fill={c} opacity="0.85" />
      <path d="M50,575 L250,575 L245,585 L55,585 Z" fill={c2 || "#c0392b"} />
    </>
  ),
  lehengaSet: (c, c2) => (
    <>
      {/* choli */}
      <path d="M115,250 Q108,295 120,335 L180,335 Q192,295 185,250 Q170,245 150,245 Q130,245 115,250 Z" fill={c} />
      {/* skirt */}
      <path d="M100,395 Q60,510 45,585 L255,585 Q240,510 200,395 Z" fill={c} />
      <path d="M45,565 L255,565 L250,585 L50,585 Z" fill={c2 || "#ffd700"} />
      {/* dupatta */}
      <path d="M75,250 Q150,280 225,250 L223,330 Q150,360 77,330 Z" fill={c2 || "#fff"} opacity="0.6" />
    </>
  ),
  sundress: (c) => (
    <>
      <path d="M108,250 Q95,400 95,490 L205,490 Q205,400 192,250 Q170,245 150,245 Q130,245 108,250 Z" fill={c} />
    </>
  ),
  salwar: (c, c2) => (
    <>
      {/* kameez */}
      <path d="M105,250 Q100,400 115,470 L185,470 Q200,400 195,250 Q170,245 150,245 Q130,245 105,250 Z" fill={c} />
      <path d="M105,250 Q90,310 95,400 L110,400 Q108,310 118,250 Z" fill={c} />
      <path d="M195,250 Q210,310 205,400 L190,400 Q192,310 182,250 Z" fill={c} />
      {/* salwar bottom */}
      <path d="M115,470 Q108,540 118,560 L142,560 L140,520 Q142,490 148,470 Z" fill={c2 || c} />
      <path d="M185,470 Q192,540 182,560 L158,560 L160,520 Q158,490 152,470 Z" fill={c2 || c} />
    </>
  ),
};
const FULL_OPTIONS = [
  { id: "saree", name: "Saree", color: "#ff6b9d", color2: "#c0392b" },
  { id: "lehengaSet", name: "Lehenga", color: "#ffd60a", color2: "#c0392b" },
  { id: "sundress", name: "Sundress", color: "#7ad0c0" },
  { id: "salwar", name: "Salwar Suit", color: "#c4b0e0", color2: "#7c3aed" },
];

// =============== SHOES ===============
const SHOES = {
  sneakers: (c) => (
    <>
      <ellipse cx="129" cy="565" rx="16" ry="7" fill={c} />
      <ellipse cx="169" cy="565" rx="16" ry="7" fill={c} />
      <rect x="115" y="560" width="28" height="3" fill="#fff" />
      <rect x="155" y="560" width="28" height="3" fill="#fff" />
    </>
  ),
  heels: (c) => (
    <>
      <ellipse cx="129" cy="563" rx="14" ry="5" fill={c} />
      <ellipse cx="169" cy="563" rx="14" ry="5" fill={c} />
      <rect x="135" y="563" width="3" height="8" fill={c} />
      <rect x="163" y="563" width="3" height="8" fill={c} />
    </>
  ),
  flats: (c) => (
    <>
      <ellipse cx="129" cy="563" rx="14" ry="4" fill={c} />
      <ellipse cx="169" cy="563" rx="14" ry="4" fill={c} />
    </>
  ),
  kolhapuri: (c) => (
    <>
      <ellipse cx="129" cy="563" rx="15" ry="6" fill={c} />
      <ellipse cx="169" cy="563" rx="15" ry="6" fill={c} />
      <path d="M120,563 L138,563" stroke="#3a1a08" strokeWidth="1.5" />
      <path d="M160,563 L178,563" stroke="#3a1a08" strokeWidth="1.5" />
    </>
  ),
  boots: (c) => (
    <>
      <rect x="118" y="540" width="22" height="25" fill={c} rx="3" />
      <rect x="158" y="540" width="22" height="25" fill={c} rx="3" />
    </>
  ),
};
const SHOE_OPTIONS = [
  { id: "sneakers", name: "Sneakers", color: "#fafafa" },
  { id: "heels", name: "Heels", color: "#c0392b" },
  { id: "flats", name: "Flats", color: "#1a1a1a" },
  { id: "kolhapuri", name: "Kolhapuri", color: "#8a4818" },
  { id: "boots", name: "Boots", color: "#3a1a08" },
];

// =============== ACCESSORIES ===============
const ACCESSORIES = {
  bindi: () => <circle cx="150" cy="142" r="3" fill="#c0392b" />,
  earrings: () => (
    <>
      <circle cx="98" cy="180" r="3.5" fill="#c0c0c0" />
      <circle cx="98" cy="188" r="2.5" fill="#c0c0c0" />
      <circle cx="202" cy="180" r="3.5" fill="#c0c0c0" />
      <circle cx="202" cy="188" r="2.5" fill="#c0c0c0" />
    </>
  ),
  necklace: () => (
    <>
      <path d="M125,235 Q150,260 175,235" stroke="#c0c0c0" strokeWidth="2.5" fill="none" />
      <circle cx="150" cy="252" r="3" fill="#ffd700" />
    </>
  ),
  sunglasses: () => (
    <>
      <ellipse cx="130" cy="172" rx="11" ry="8" fill="#1a1a1a" />
      <ellipse cx="170" cy="172" rx="11" ry="8" fill="#1a1a1a" />
      <line x1="141" y1="172" x2="159" y2="172" stroke="#1a1a1a" strokeWidth="2" />
    </>
  ),
  dupatta: (c) => (
    <path d="M75,250 Q150,280 225,250 L223,330 Q150,360 77,330 Z" fill={c || "#ff85a2"} opacity="0.7" />
  ),
};
const ACC_OPTIONS = [
  { id: "bindi", name: "Bindi" },
  { id: "earrings", name: "Earrings" },
  { id: "necklace", name: "Necklace" },
  { id: "sunglasses", name: "Sunglasses" },
  { id: "dupatta", name: "Dupatta" },
];

// ===== ALL ITEMS / CATEGORIES =====
const CATALOG = {
  hair: { items: HAIR_OPTIONS, render: HAIR, colors: HAIR_COLORS },
  top: { items: TOP_OPTIONS, render: TOP, colors: ["#ff85a2", "#c4b0e0", "#fafafa", "#1a1a1a", "#ffd60a", "#7ad0c0"] },
  bottom: { items: BOTTOM_OPTIONS, render: BOTTOM, colors: ["#3a5a8a", "#1a1a1a", "#fafafa", "#ff85a2", "#c0392b", "#7ab070"] },
  full: { items: FULL_OPTIONS, render: FULL, colors: ["#ff6b9d", "#ffd60a", "#7ad0c0", "#c4b0e0", "#c0392b", "#1a1a1a"] },
  shoes: { items: SHOE_OPTIONS, render: SHOES, colors: ["#fafafa", "#c0392b", "#1a1a1a", "#ffd60a", "#8a4818"] },
  acc: { items: ACC_OPTIONS, render: ACCESSORIES, colors: [] },
};

const CATEGORIES = [
  { id: "lightning", icon: "⚡", name: "Trending" },
  { id: "full",      icon: "🧥", name: "Outfit" },
  { id: "top",       icon: "👕", name: "Top" },
  { id: "bottom",    icon: "👖", name: "Bottom" },
  { id: "hair",      icon: "💇", name: "Hair" },
  { id: "shoes",     icon: "👟", name: "Shoes" },
  { id: "acc",       icon: "💼", name: "Extras" },
  { id: "upload",    icon: "📷", name: "Mine" },
];

const COLLECTIONS = [
  { id: "hitu",      name: "HITU'S PICKS", chip: "💛", filter: () => true },
  { id: "indie",     name: "Indie Wear",   chip: "🪷", filter: (id) => ["kurta", "saree", "lehengaSet", "salwar", "lehengaSkirt", "palazzo", "kolhapuri", "dupatta"].includes(id) },
  { id: "western",   name: "Western",      chip: "👖", filter: (id) => ["tshirt", "hoodie", "croptop", "offshoulder", "jeans", "miniSkirt", "joggers", "sundress", "sneakers", "heels"].includes(id) },
  { id: "festive",   name: "Festive",      chip: "✨", filter: (id) => ["saree", "lehengaSet", "lehengaSkirt", "salwar", "blouse", "necklace", "bindi", "earrings"].includes(id) },
];

const STORAGE = "hitu_dressup_v4";

const DEFAULT_STATE = {
  hair: { id: "long", color: "#1a0a00" },
  top: { id: "kurta", color: "#ff85a2", color2: "#ffd700" },
  bottom: { id: "jeans", color: "#3a5a8a" },
  full: null,
  shoes: { id: "flats", color: "#1a1a1a" },
  acc: ["earrings", "bindi"],
  uploads: [],
  uploadActive: null, // { id, zone }
  savedLooks: [],
};

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE)) || DEFAULT_STATE; }
  catch (err) { console.warn("DressUp: load failed, using defaults", err); return DEFAULT_STATE; }
}

export default function DressUp({ onBack }) {
  const [state, setState] = useState(load);
  const [cat, setCat] = useState("lightning");
  const [collection, setCollection] = useState("hitu");
  const [uploadZone, setUploadZone] = useState(null); // zone-pick modal
  const [pendingUpload, setPendingUpload] = useState(null);
  const [history, setHistory] = useState([]); // undo stack
  const [future, setFuture] = useState([]);   // redo stack
  const fileRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state]);

  const pushHistory = (snapshot) => {
    setHistory((h) => [...h.slice(-20), snapshot]);
    setFuture([]);
  };
  const snapshot = () => ({ hair: state.hair, top: state.top, bottom: state.bottom, full: state.full, shoes: state.shoes, acc: [...state.acc], uploadActive: state.uploadActive });
  const undo = () => {
    if (history.length === 0) return;
    setFuture((f) => [snapshot(), ...f]);
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setState((s) => ({ ...s, ...prev }));
  };
  const redo = () => {
    if (future.length === 0) return;
    setHistory((h) => [...h, snapshot()]);
    const next = future[0];
    setFuture((f) => f.slice(1));
    setState((s) => ({ ...s, ...next }));
  };

  const pickItem = (catId, item) => {
    pushHistory(snapshot());
    if (catId === "acc") {
      const has = state.acc.includes(item.id);
      setState((s) => ({ ...s, acc: has ? s.acc.filter((x) => x !== item.id) : [...s.acc, item.id] }));
      return;
    }
    if (catId === "full") {
      setState((s) => ({ ...s, full: { id: item.id, color: item.color, color2: item.color2 }, top: null, bottom: null }));
      return;
    }
    setState((s) => {
      const next = { ...s, [catId]: { id: item.id, color: item.color, color2: item.color2 } };
      if (catId === "top" || catId === "bottom") next.full = null;
      return next;
    });
  };

  const recolor = (color) => {
    if (!state[cat] || cat === "acc" || cat === "upload") return;
    setState((s) => ({ ...s, [cat]: { ...s[cat], color } }));
  };

  const randomize = () => {
    const pickRand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setState((s) => ({
      ...s,
      hair: { ...pickRand(HAIR_OPTIONS) },
      top: { ...pickRand(TOP_OPTIONS) },
      bottom: { ...pickRand(BOTTOM_OPTIONS) },
      full: null,
      shoes: { ...pickRand(SHOE_OPTIONS) },
      acc: ACC_OPTIONS.filter(() => Math.random() < 0.4).map((a) => a.id),
    }));
  };

  const reset = () => setState({ ...DEFAULT_STATE, uploads: state.uploads, savedLooks: state.savedLooks });

  // Save look — serialize SVG into PNG via canvas
  const saveLook = async () => {
    const snap = { id: `look_${Date.now()}`, ts: new Date().toLocaleDateString("en-IN"), ...state };
    setState((s) => ({ ...s, savedLooks: [snap, ...s.savedLooks].slice(0, 12) }));
    // export to PNG
    try {
      const svg = svgRef.current;
      const data = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 600; canvas.height = 1200;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `hitu-look-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (err) {
      console.warn("DressUp: failed to export look as PNG", err);
    }
  };

  const restoreLook = (l) => setState((s) => ({ ...l, uploads: s.uploads, savedLooks: s.savedLooks }));
  const removeLook = (id) => setState((s) => ({ ...s, savedLooks: s.savedLooks.filter((l) => l.id !== id) }));

  // ---- upload ----
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 3 * 1024 * 1024) { alert("≤3MB please"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setPendingUpload(ev.target.result); setUploadZone("top"); };
    reader.readAsDataURL(f);
  };

  const confirmUpload = (zone) => {
    if (!pendingUpload) return;
    const id = `up_${Date.now()}`;
    const newItem = { id, src: pendingUpload, zone };
    setState((s) => ({ ...s, uploads: [newItem, ...s.uploads], uploadActive: newItem }));
    setPendingUpload(null); setUploadZone(null);
    setCat("upload");
  };

  const setUploadActive = (id) => {
    if (state.uploadActive?.id === id) {
      setState((s) => ({ ...s, uploadActive: null }));
    } else {
      const u = state.uploads.find((x) => x.id === id);
      setState((s) => ({ ...s, uploadActive: u || null }));
    }
  };

  const removeUpload = (id) => {
    setState((s) => ({ ...s, uploads: s.uploads.filter((x) => x.id !== id), uploadActive: s.uploadActive?.id === id ? null : s.uploadActive }));
  };

  // --- upload SVG zones (clip rects)
  const UPLOAD_ZONES = {
    top:    { x: 100, y: 245, w: 100, h: 160 },
    bottom: { x: 95,  y: 395, w: 110, h: 170 },
    full:   { x: 50,  y: 240, w: 200, h: 340 },
    shoes:  { x: 110, y: 555, w: 80,  h: 20  },
  };

  const renderLayer = (catId) => {
    const item = state[catId];
    if (!item || !item.id) return null;
    const renderer = CATALOG[catId].render[item.id];
    if (!renderer) return null;
    return renderer(item.color, item.color2);
  };

  // build the items list for current category honouring collection filter
  const itemsForCat = (catId) => {
    if (catId === "lightning") {
      // trending = a mix across categories
      const mix = [
        ...TOP_OPTIONS.map((i) => ({ ...i, _cat: "top" })),
        ...FULL_OPTIONS.map((i) => ({ ...i, _cat: "full" })),
        ...BOTTOM_OPTIONS.map((i) => ({ ...i, _cat: "bottom" })),
      ];
      return mix.filter((i) => COLLECTIONS.find((c) => c.id === collection)?.filter(i.id) ?? true);
    }
    return CATALOG[catId]?.items.filter((i) => COLLECTIONS.find((c) => c.id === collection)?.filter(i.id) ?? true) || [];
  };

  // ===== render =====
  return (
    <SectionShell title="Hitu's Wardrobe 👗" subtitle="bitmoji-style · instant try-on" onBack={onBack} testId="dressup-section">
      {/* AVATAR card with corner buttons */}
      <div
        className="relative w-full rounded-3xl overflow-hidden mb-3"
        style={{ background: "radial-gradient(ellipse at top,#3a2a4a 0%,#1a0a2a 60%,#0a0010 100%)" }}
      >
        <button onClick={onBack} className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center" data-testid="dressup-close" aria-label="close">
          <X className="w-4 h-4 text-white" />
        </button>
        <button onClick={saveLook} className="absolute top-3 right-3 z-10 px-4 py-1.5 rounded-full bg-white text-black text-sm font-bold" data-testid="dressup-save">
          Save
        </button>

        <svg ref={svgRef} viewBox="0 0 300 600" className="w-full" style={{ maxHeight: 460, filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.6))" }} data-testid="avatar-svg">
          <defs>
            {Object.entries(UPLOAD_ZONES).map(([z, r]) => (
              <clipPath key={z} id={`clip-${z}`}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="20" ry="20" />
              </clipPath>
            ))}
          </defs>
          {BODY}
          <g id="layer-shoes" style={{ transition: "opacity 0.2s" }}>{renderLayer("shoes")}</g>
          {state.full ? (
            <g id="layer-fullbody">{renderLayer("full")}</g>
          ) : (
            <>
              <g id="layer-bottom">{renderLayer("bottom")}</g>
              <g id="layer-top">{renderLayer("top")}</g>
            </>
          )}
          {state.uploadActive && (
            <g id="layer-uploaded">
              <image
                href={state.uploadActive.src}
                x={UPLOAD_ZONES[state.uploadActive.zone].x}
                y={UPLOAD_ZONES[state.uploadActive.zone].y}
                width={UPLOAD_ZONES[state.uploadActive.zone].w}
                height={UPLOAD_ZONES[state.uploadActive.zone].h}
                clipPath={`url(#clip-${state.uploadActive.zone})`}
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          )}
          <g id="layer-hair" style={{ transition: "opacity 0.2s" }}>{renderLayer("hair")}</g>
          <g id="layer-accessory">
            {state.acc.map((a) => {
              const r = CATALOG.acc.render[a];
              return r ? <g key={a}>{r("#ff85a2")}</g> : null;
            })}
          </g>
        </svg>

        {/* undo / redo */}
        <div className="flex justify-center gap-6 pb-3">
          <button onClick={undo} disabled={history.length === 0} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center disabled:opacity-30" data-testid="dressup-undo" aria-label="undo">
            <Undo2 className="w-5 h-5 text-white" />
          </button>
          <button onClick={redo} disabled={future.length === 0} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center disabled:opacity-30" data-testid="dressup-redo" aria-label="redo">
            <Redo2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Bottom drawer / wardrobe */}
      <div className="rounded-t-3xl bg-black/70 backdrop-blur px-3 pt-3 pb-4 -mx-4 border-t border-white/10">
        {/* handle */}
        <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-3" />

        {/* category icon strip */}
        <div className="flex justify-between items-center px-1 mb-3 overflow-x-auto gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              data-testid={`cat-${c.id}`}
              className={`flex-shrink-0 flex flex-col items-center pb-2 px-2 transition relative ${cat === c.id ? "text-[var(--sunflower)]" : "text-white/55"}`}
            >
              <span className="text-2xl">{c.icon}</span>
              {cat === c.id && <div className="absolute -bottom-0 h-0.5 w-6 bg-[var(--sunflower)] rounded-full" />}
            </button>
          ))}
        </div>

        {/* collection chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCollection(c.id)}
              data-testid={`collection-${c.id}`}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${collection === c.id ? "bg-white text-black" : "bg-white/10 text-white"}`}
            >
              <span className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: collection === c.id ? "#000" : "rgba(255,255,255,0.15)" }}>
                <span className="text-base">{c.chip}</span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wide whitespace-nowrap">{c.name}</span>
            </button>
          ))}
        </div>

        {/* collection title */}
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-sm">
            {COLLECTIONS.find((c) => c.id === collection)?.chip}
          </span>
          <p className="font-bold text-white text-sm uppercase tracking-wide">{COLLECTIONS.find((c) => c.id === collection)?.name}</p>
        </div>

        {/* items grid */}
        {cat === "upload" ? (
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              data-testid="custom-upload-btn"
              className="w-full glass-yellow rounded-2xl py-6 flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-[var(--sunflower)]" />
              <span className="handwritten text-2xl text-white">+ Add Your Cloth 📷</span>
              <span className="text-[10px] text-white/50">JPG/PNG · ≤3MB</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} data-testid="custom-file-input" />
            {state.uploads.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {state.uploads.map((u) => {
                  const on = state.uploadActive?.id === u.id;
                  return (
                    <div key={u.id} className={`relative rounded-xl p-1.5 ${on ? "ring-2 ring-pink-400 bg-white/10" : "bg-white/5"}`}>
                      <img src={u.src} className="w-full aspect-square object-cover rounded" alt="" />
                      <p className="text-[10px] text-white/70 text-center mt-1">{u.zone}</p>
                      <button onClick={() => setUploadActive(u.id)} className="absolute inset-0 rounded-xl" data-testid={`up-toggle-${u.id}`} />
                      <button onClick={() => removeUpload(u.id)} className="absolute top-1 right-1 bg-red-500/80 w-5 h-5 rounded-full flex items-center justify-center z-10" data-testid={`up-remove-${u.id}`}><X className="w-3 h-3 text-white" /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : cat === "acc" ? (
          <div className="grid grid-cols-3 gap-2">
            {CATALOG.acc.items.map((it) => {
              const on = state.acc.includes(it.id);
              return (
                <button key={it.id} onClick={() => pickItem("acc", it)} data-testid={`cloth-${it.id}`} className={`rounded-2xl p-3 transition bg-gradient-to-b from-white/95 to-white/85 text-black ${on ? "ring-2 ring-pink-400" : ""}`}>
                  <p className="text-xs font-bold">{it.name}</p>
                  <p className="text-[10px] text-black/50 mt-1">{on ? "✓ wearing" : "+ add"}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              {itemsForCat(cat).map((it) => {
                const itemCat = it._cat || cat;
                const active = state[itemCat]?.id === it.id || state.full?.id === it.id;
                const renderer = CATALOG[itemCat].render[it.id];
                return (
                  <button
                    key={`${itemCat}-${it.id}`}
                    onClick={() => pickItem(itemCat, it)}
                    data-testid={`cloth-${it.id}`}
                    className={`rounded-2xl overflow-hidden bg-gradient-to-b from-white to-gray-200 text-black relative transition ${active ? "ring-2 ring-pink-400 scale-[1.04]" : ""}`}
                  >
                    <svg viewBox="0 0 300 600" style={{ width: "100%", height: 110 }}>
                      <g transform={
                        itemCat === "shoes" ? "translate(0,-440) scale(1)" :
                        itemCat === "hair" ? "translate(0,-50) scale(1)" :
                        itemCat === "bottom" ? "translate(0,-380) scale(1)" :
                        itemCat === "full" ? "translate(0,-220) scale(0.9)" :
                        "translate(0,-220) scale(1)"
                      }>{renderer && renderer(active ? state[itemCat].color : it.color, it.color2)}</g>
                    </svg>
                    <p className="text-[10px] font-semibold py-1.5 px-1 truncate">{it.name}</p>
                    {active && <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-pink-400 text-white text-xs flex items-center justify-center">✓</div>}
                  </button>
                );
              })}
            </div>

            {state[cat]?.id && cat !== "lightning" && CATALOG[cat]?.colors.length > 0 && (
              <div className="mt-3 bg-white/5 rounded-2xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-white/60 mb-2">recolor</p>
                <div className="flex flex-wrap gap-2">
                  {CATALOG[cat].colors.map((c) => (
                    <button key={c} onClick={() => { pushHistory(snapshot()); recolor(c); }} data-testid={`color-${c}`} className={`w-8 h-8 rounded-full border-2 transition ${state[cat].color === c ? "border-pink-400 scale-110" : "border-white/20"}`} style={{ background: c }} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* footer actions */}
        <div className="flex gap-2 mt-4">
          <button onClick={randomize} className="flex-1 bg-white/10 rounded-xl py-2 flex items-center justify-center gap-1 text-sm text-white" data-testid="dressup-randomize">
            <Shuffle className="w-4 h-4" /> random
          </button>
          <button onClick={reset} className="flex-1 bg-white/10 rounded-xl py-2 flex items-center justify-center gap-1 text-sm text-white" data-testid="dressup-reset">
            <RotateCcw className="w-4 h-4" /> reset
          </button>
        </div>

        {/* saved looks */}
        {state.savedLooks.length > 0 && (
          <>
            <p className="text-xs uppercase tracking-widest text-white/60 mt-4 mb-2">your saved looks</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {state.savedLooks.map((l) => (
                <div key={l.id} className="bg-white/5 rounded-xl p-2 flex-shrink-0 w-20 text-center relative" data-testid={`look-${l.id}`}>
                  <button onClick={() => removeLook(l.id)} className="absolute top-0 right-0 text-white/40 p-1" data-testid={`look-remove-${l.id}`}><Trash2 className="w-3 h-3" /></button>
                  <button onClick={() => restoreLook(l)} className="block w-full" data-testid={`look-load-${l.id}`}>
                    <div className="text-2xl">👗</div>
                    <p className="text-[9px] text-white/60 mt-1">{l.ts}</p>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* upload zone picker modal */}
      {pendingUpload && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur p-4 flex items-center justify-center" data-testid="upload-zone-modal">
          <div className="glass rounded-3xl p-5 max-w-sm w-full text-center">
            <p className="handwritten text-3xl sunflower-text mb-3">what type is this?</p>
            <img src={pendingUpload} alt="preview" className="w-32 h-32 mx-auto object-cover rounded-xl mb-4" />
            <div className="grid grid-cols-2 gap-2">
              {["top", "bottom", "full", "shoes"].map((z) => (
                <button key={z} onClick={() => confirmUpload(z)} className="sticker-btn !py-2 !text-sm" data-testid={`zone-${z}`}>
                  {z === "full" ? "Full Outfit" : z[0].toUpperCase() + z.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={() => { setPendingUpload(null); setUploadZone(null); }} className="text-white/60 text-xs mt-3 underline">cancel</button>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
