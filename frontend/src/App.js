import { useEffect, useState } from "react";
import "@/App.css";

import Particles from "@/components/Particles";
import IntroScreen from "@/components/IntroScreen";
import Hub from "@/components/Hub";
import PeriodComfort from "@/components/PeriodComfort";
import SunflowerGame from "@/components/SunflowerGame";
import BubblePop from "@/components/BubblePop";
import FlowerGarden from "@/components/FlowerGarden";
import GuessWord from "@/components/games/GuessWord";
import DrawingBoard from "@/components/games/DrawingBoard";
import CricketRCB from "@/components/games/CricketRCB";
import MemoryMatch from "@/components/games/MemoryMatch";
import BouquetBuilder from "@/components/games/BouquetBuilder";
import GamesRoom from "@/components/GamesRoom";
import HituQuiz from "@/components/HituQuiz";
import DressUp from "@/components/DressUp";
import VirtualCafe from "@/components/VirtualCafe";
import OpenWhen from "@/components/OpenWhen";
import LoveMeter from "@/components/LoveMeter";
import MemoryWall from "@/components/MemoryWall";
import RcbSection from "@/components/RcbSection";
import MusicToggle from "@/components/MusicToggle";
import SurprisePopup from "@/components/SurprisePopup";

function Loading({ done }) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${done ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      data-testid="loading-screen"
    >
      <div className="text-7xl anim-heartbeat">🌻</div>
      <p className="handwritten text-3xl text-[var(--sunflower)] mt-3">loading love...</p>
      <div className="w-40 h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
        <div className="h-full bg-[var(--sunflower)] origin-left" style={{ animation: "loadbar 1.4s ease-out forwards" }} />
      </div>
      <style>{`@keyframes loadbar { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [loading, setLoading] = useState(true);
  const [surpriseTick, setSurpriseTick] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  // heart-burst on click — easter egg ❤️
  useEffect(() => {
    const onClick = (e) => {
      if (Math.random() > 0.85) return; // rare
      const el = document.createElement("div");
      el.className = "heart-burst";
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
      el.textContent = ["❤️", "🌻", "✨", "💛"][Math.floor(Math.random() * 4)];
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 900);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // konami-ish easter egg: type "hitu"
  useEffect(() => {
    let buf = "";
    const onKey = (e) => {
      buf = (buf + e.key.toLowerCase()).slice(-4);
      if (buf === "hitu") {
        setSurpriseTick(Date.now());
        buf = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goHub = () => setScreen("hub");
  const pick = (id) => setScreen(id);
  const back = () => setScreen("hub");
  const fireSurprise = () => setSurpriseTick(Date.now());

  return (
    <div className="App cute-cursor">
      <Loading done={!loading} />
      <Particles />
      <MusicToggle />
      <SurprisePopup trigger={surpriseTick} />

      {screen === "intro" && <IntroScreen onStart={goHub} />}
      {screen === "hub" && <Hub onPick={pick} onSurprise={fireSurprise} />}
      {screen === "comfort" && <PeriodComfort onBack={back} />}
      {screen === "games" && <GamesRoom onBack={back} onPick={pick} />}
      {screen === "sunflower" && <SunflowerGame onBack={() => setScreen("games")} />}
      {screen === "bubble" && <BubblePop onBack={() => setScreen("games")} />}
      {screen === "garden" && <FlowerGarden onBack={() => setScreen("games")} />}
      {screen === "guess" && <GuessWord onBack={() => setScreen("games")} />}
      {screen === "drawing" && <DrawingBoard onBack={() => setScreen("games")} />}
      {screen === "cricket" && <CricketRCB onBack={() => setScreen("games")} />}
      {screen === "match" && <MemoryMatch onBack={() => setScreen("games")} />}
      {screen === "bouquet" && <BouquetBuilder onBack={() => setScreen("games")} />}
      {screen === "quiz" && <HituQuiz onBack={back} />}
      {screen === "dressup" && <DressUp onBack={back} />}
      {screen === "cafe" && <VirtualCafe onBack={back} />}
      {screen === "openwhen" && <OpenWhen onBack={back} />}
      {screen === "love" && <LoveMeter onBack={back} />}
      {screen === "memory" && <MemoryWall onBack={back} />}
      {screen === "rcb" && <RcbSection onBack={back} />}

      <footer className="text-center text-white/30 text-xs py-6 relative z-10 handwritten text-base">
        made with ❤️ for Hitanshi · pssst, type "hitu" anywhere for a surprise 🤫
      </footer>
    </div>
  );
}
