import { useState } from "react";
import SectionShell from "./SectionShell";

const LETTERS = {
  sad:        { title: "Open when sad 🌧️", color: "#7a8fa8", pattern: "stripes", text: "Hey hituu. I know today feels heavy. But sambhado — you are not a problem. You are a person. A whole, soft, beautiful person who is just tired. It's okay to not be okay. Cry if you have to. Im with you in this the storm with to make you smile n happy. You're going to be okay. Not because you have to be — but because I know how strong n brave u r n how u have handles things so far n ik u will handle this too like always. I love u. cutuu. ❤️" },
  angry:      { title: "Open when angry 🔥", color: "#c0392b", pattern: "flames", text: "hello my angry bird relax n sant thao. Breathe. In for four, hold for four, out for four. Whoever made you angry — they don't get to live rent-free in your head excluding me. You're too iconic for that. Throw a tantrum. Vent to me. Eat a KitKat. Then come back, soft and silly, and we'll plot revenge over ur fav dessert. I'm on your side. Always your side. 🍫" },
  missing:    { title: "Open when missing me 💌", color: "#ff85a2", pattern: "hearts", text: "I'm missing you too princess. Right now. Probably more. Close your eyes — I'm there.  Right now I'm probably thinking about you, checking my phone, waiting for your message, or smiling like an idiot at something that reminded me of you. Close your eyes for a second. Imagine we're sitting together eating KitKat and talking nonsense for hours. That's where I am. Distance can be annoying, but it can never make me love you less. Come to me, we will soon, cutuu. I miss my favourite person. 🌻" },
  periods:    { title: "Open during periods 🌸", color: "#e94e77", pattern: "dots", text: "Heyyy my brave girl.I know periods are being rude again. So today's mission is simple: survive. No overworking. No stressing. No pretending you're okay when you're not. Blanket? Approved. Chocolate? Approved. Random mood swings? Also approved. If I was there I'd make sure you're comfortable and remind you every five minutes if u need anything im here. Be gentle with yourself today, sunshinee. Your body is already working hard enough. 🌷💗" },
  overthink:  { title: "Open when overthinking 🌀", color: "#7c3aed", pattern: "spiral", text: "STOP RIGHT THERE, HITANSHI JI 😤❤️. I know exactly what's happening. Your brain has started creating 500 imaginary situations and now you're treating them like facts. Breathe. Slowly. Look around. Right now, in this moment, you're safe. You're loved. And I'm not going anywhere. Most of the things you're worried about won't even matter a month from now. So drink some water, look at snowy pic if possible pet, and text me what's bothering you. We'll fight the thoughts together.🌙 You are loved. You are safe. You are doing better than you think. Put your phone down. Drink water. Look at one cute thing — a floweror your own pretty face in the mirror. I'm right here. Talk to me. Always. 🌙" },
  laugh:      { title: "Open when you need a laugh 😂", color: "#ffd60a", pattern: "stars", text: "Baapre hitu ji sad 🥺, here goes: knock knock? say 'who's there?' Cow says. ask Cow says who?  No cutuu, cow says MOO! 🐄😂  Not funny? Fine. Imagine me trying to make u laugh you by doing a funny dance. ur smile is literally my favourite thing. Picture me trying to do a funny dance n accidently padi gayo. Now smile, bacchaa. The world looks nicer when you do. 🌻"},
  proud:      { title: "Open when you're proud of yourself 🏆", color: "#d4af37", pattern: "stars", text: "YAYYYYYYYY YOU OPENED THIS SO YOU DID SOMETHING AMAZING. Tell me what it was!. SAY IT. lets celebrate cutuuu You worked hard. You showed up. You did the scary thing. Look at U. I am so so so so so proud of you, my soft fierce little girl. Take a bow, queen. The universe is clapping. (I'm the loudest one.) 🌻" },
  motivation: { title: "Open when you need motivation 💪", color: "#22c55e", pattern: "stripes", text: "Listen. You don't have to be ON today. You just have to take ONE step. Drink one glass of water. Brush your hair. ONE thing. Then sit down. sleep if needed. The fact that you opened this letter means you're already trying. That counts. I see you trying. And you're more capable than you'll ever realise. You've survived every difficult day life has thrown at you so far. You're stronger than you realise. And even on days when you don't feel strong, I'll believe in you until you can believe in yourself again. Now go show the world what my sunshine can do 🌻✨" },
  sleep:      { title: "Open when you can't sleep 🌙", color: "#1e1b4b", pattern: "stars", text: "Hey night-owl. I'm here. Stop scrolling. Put. Think of one calm thing okay Hitu. Put the phone down. Yes, I'm talking to you 😤❤️. The world can wait until tomorrow. The worries can wait until tomorrow. Right now your only job is to rest. Imagine I'm sitting beside you, my hand in your hair back and telling you everything will be okay. Because it will. Tomorrow doesn't need a perfect version of you. It just needs you. Goodnight, babydoll. Sweet dreams fall asleep thinking My hand on your forehead.  I'm right here in your dreams. 🌙❤️" },
  dance:      { title: "Open when you want to dance 💃", color: "#a855f7", pattern: "dots", text: "PUT THE SONG ON. Loud. Right now. Yes, even if you're alone. Yes. twist your kamar, jump on the bed, do ur best dance steps the world has ever witnessed — I'm RIGHT THERE with you. Dance like nobody's recording (because nobody is). Your hips? Iconic. Your moves? Award-winning. Now dance, my sunshine. The world owes us this song. 🎶" },
  hardself:   { title: "Open when you're being too hard on yourself 🥺", color: "#06b6d4", pattern: "hearts", text: "Hey. Stop cutuu. Breathe. The voice in your head right now — telling you you're 'not enough', 'too much', 'falling behind'? That voice is LYING. You are doing better than you think. You woke up. You're giving ur best. That's already a lot. Would you say to your best friend what you're saying to yourself right now? No. Then don't say it to my favourite person either. Be soft with yourself, Hitu. The way you are with everyone else. ❤️" },
};

const KEYS = Object.keys(LETTERS).map((k) => ({ k, ...LETTERS[k] }));

// CSS pattern overlay generator
const patternStyle = (pattern, color) => {
  const lighten = color + "AA";
  if (pattern === "stripes") return { backgroundImage: `repeating-linear-gradient(45deg, ${color} 0 10px, ${lighten} 10px 20px)` };
  if (pattern === "dots")    return { backgroundColor: color, backgroundImage: `radial-gradient(rgba(255,255,255,0.45) 2px, transparent 3px)`, backgroundSize: "14px 14px" };
  if (pattern === "stars")   return { backgroundColor: color, backgroundImage: `radial-gradient(rgba(255,255,255,0.6) 1.5px, transparent 2px)`, backgroundSize: "18px 18px" };
  if (pattern === "hearts")  return { backgroundColor: color, backgroundImage: `radial-gradient(rgba(255,255,255,0.35) 3px, transparent 4px)`, backgroundSize: "20px 20px" };
  if (pattern === "spiral")  return { background: `conic-gradient(from 0deg, ${color}, ${lighten}, ${color})` };
  if (pattern === "flames")  return { backgroundColor: color, backgroundImage: `linear-gradient(0deg, rgba(255,200,0,0.4) 0%, transparent 60%)` };
  return { backgroundColor: color };
};

export default function OpenWhen({ onBack }) {
  const [open, setOpen] = useState(null);
  const [opening, setOpening] = useState(false);

  const openLetter = (k) => {
    setOpening(true);
    setTimeout(() => { setOpen(k); setOpening(false); }, 600);
  };

  return (
    <SectionShell title="Open When... 💌" subtitle="letters i wrote for any mood" onBack={onBack} testId="openwhen-section">
      <div className="grid grid-cols-2 gap-3">
        {KEYS.map((it) => (
          <button
            key={it.k}
            data-testid={`openwhen-${it.k}`}
            onClick={() => openLetter(it.k)}
            className="relative rounded-2xl p-4 text-left hover:scale-[1.03] transition-transform overflow-hidden"
            style={{ ...patternStyle(it.pattern, it.color), aspectRatio: "5/3" }}
          >
            {/* envelope flap */}
            <div className="absolute top-0 inset-x-0 h-6" style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.25), transparent)`, clipPath: "polygon(0 0, 50% 100%, 100% 0)" }} />
            {/* wax seal */}
            <div className="absolute right-2 bottom-2 w-7 h-7 rounded-full bg-red-700 border-2 border-red-900 flex items-center justify-center text-xs font-bold text-yellow-200" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>♥</div>
            <p className="handwritten text-xl text-white drop-shadow leading-tight pr-8" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>{it.title}</p>
          </button>
        ))}
      </div>

      {/* opening animation overlay */}
      {opening && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur pointer-events-none">
          <div className="text-7xl" style={{ animation: "envelopeFlip 0.6s ease-out forwards" }}>💌</div>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur p-4"
          onClick={() => setOpen(null)}
          data-testid="openwhen-modal"
        >
          <div
            className="max-w-md w-full max-h-[85vh] overflow-y-auto rounded-3xl p-1 anim-fade-up"
            onClick={(e) => e.stopPropagation()}
            style={{ background: `linear-gradient(135deg, ${LETTERS[open].color} 0%, rgba(255,255,255,0.3) 50%, ${LETTERS[open].color} 100%)` }}
          >
            <div
              className="rounded-3xl p-6 relative"
              style={{
                background: "#1a1a1a",
                backgroundImage: "repeating-linear-gradient(180deg, transparent 0px, transparent 31px, rgba(192,192,192,0.08) 32px)",
              }}
            >
              {/* decorative corners */}
              <div className="absolute top-2 left-2 text-2xl">✦</div>
              <div className="absolute top-2 right-2 text-2xl">✦</div>
              <div className="absolute bottom-2 left-2 text-2xl">✦</div>
              <div className="absolute bottom-2 right-2 text-2xl">✦</div>

              <p className="handwritten text-3xl mb-4 text-center" style={{ color: LETTERS[open].color, textShadow: "0 0 20px " + LETTERS[open].color + "66" }}>{LETTERS[open].title}</p>
              <p className="handwritten text-2xl text-white/95 leading-snug whitespace-pre-line">
                {LETTERS[open].text}
              </p>
              <p className="text-right handwritten text-2xl text-[var(--sunflower)] mt-6">— yours Batak ❤️</p>
              <button onClick={() => setOpen(null)} className="sticker-btn mt-5 w-full" data-testid="openwhen-close">
                close letter
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes envelopeFlip {
          0% { transform: scale(0.4) rotateY(0); opacity: 0; }
          50% { transform: scale(1.4) rotateY(180deg); opacity: 1; }
          100% { transform: scale(1.2) rotateY(360deg); opacity: 1; }
        }
      `}</style>
    </SectionShell>
  );
}
