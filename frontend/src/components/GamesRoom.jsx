import SectionShell from "./SectionShell";

const GAMES = [
  { id: "bouquet", title: "Bouquet Builder", emoji: "💐", sub: "mix · arrange · save" },
  { id: "sunflower", title: "Catch Sunflowers", emoji: "🌻", sub: "tap & score" },
  { id: "bubble", title: "Bubble Pop", emoji: "🫧", sub: "combos for bonus" },
  { id: "garden", title: "Flower Garden", emoji: "🌷", sub: "plant · water · grow" },
  { id: "guess", title: "Guess the Word", emoji: "💌", sub: "before the flower wilts" },
  { id: "drawing", title: "Doodle Board", emoji: "🎨", sub: "draw · gallery · effects" },
  { id: "cricket", title: "Cricket — RCB", emoji: "🏏", sub: "ee sala cup namde" },
  { id: "match", title: "Memory Match", emoji: "🧠", sub: "find the pairs" },
];

export default function GamesRoom({ onBack, onPick }) {
  return (
    <SectionShell title="Games Room 🎮" subtitle="pick your distraction, jaan" onBack={onBack} testId="games-room-section">
      <div className="grid grid-cols-1 gap-3">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => onPick(g.id)}
            data-testid={`games-room-${g.id}`}
            className="glass rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] active:scale-95 transition relative overflow-hidden"
          >
            <div className="text-5xl">{g.emoji}</div>
            <div className="text-left">
              <p className="handwritten text-2xl text-white">{g.title}</p>
              <p className="text-xs text-white/60">{g.sub}</p>
            </div>
            <span className="ml-auto text-[var(--sunflower)] text-2xl">→</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-white/40 mt-6 handwritten text-xl text-center">
        more games coming soon, princess ❤️
      </p>
    </SectionShell>
  );
}
