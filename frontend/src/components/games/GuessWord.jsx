import { useState, useEffect } from "react";
import SectionShell from "../SectionShell";
import { GUESS_WORDS } from "../../data/hituData";

const MAX_WRONG = 6;
const FLOWER_STAGES = ["🌻", "🌼", "🌸", "🥀", "🥀", "💀"];

function pickWord() {
  return GUESS_WORDS[Math.floor(Math.random() * GUESS_WORDS.length)];
}

export default function GuessWord({ onBack }) {
  const [puzzle, setPuzzle] = useState(pickWord());
  const [picked, setPicked] = useState(new Set());
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(Number(localStorage.getItem("hitu_guess_streak") || 0));
  const [best, setBest] = useState(Number(localStorage.getItem("hitu_guess_best") || 0));
  const [showHint, setShowHint] = useState(false);

  const wordLetters = puzzle.word.toLowerCase();
  const guessed = new Set([...picked].map((l) => l.toLowerCase()));
  const won = [...wordLetters].every((l) => guessed.has(l));
  const lost = wrong >= MAX_WRONG;
  const done = won || lost;

  useEffect(() => {
    if (won) {
      const next = streak + 1;
      setStreak(next);
      localStorage.setItem("hitu_guess_streak", String(next));
      if (next > best) {
        setBest(next);
        localStorage.setItem("hitu_guess_best", String(next));
      }
    } else if (lost) {
      setStreak(0);
      localStorage.setItem("hitu_guess_streak", "0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won, lost]);

  const pick = (letter) => {
    if (done || picked.has(letter)) return;
    const next = new Set(picked); next.add(letter);
    setPicked(next);
    if (!wordLetters.includes(letter)) setWrong((w) => w + 1);
  };

  const nextRound = () => {
    setPuzzle(pickWord()); setPicked(new Set()); setWrong(0); setShowHint(false);
  };

  return (
    <SectionShell title="Guess the Word 💌" subtitle="6 wrong guesses & the flower wilts 🥀" onBack={onBack} testId="guess-word-section">
      <div className="flex justify-between text-sm mb-3">
        <span className="text-white/70">streak: <b className="text-[var(--sunflower)]" data-testid="guess-streak">{streak}</b></span>
        <span className="text-white/70">best: {best}</span>
      </div>

      <div className="glass-yellow rounded-3xl p-5 text-center">
        <div className="text-7xl mb-2" data-testid="guess-flower">{FLOWER_STAGES[Math.min(wrong, MAX_WRONG - 1)]}</div>
        <p className="text-xs text-white/60 mb-3 uppercase tracking-widest">{puzzle.category}</p>

        {/* word */}
        <div className="flex justify-center flex-wrap gap-1.5 mb-4" data-testid="guess-word-display">
          {[...wordLetters].map((l, i) => {
            const reveal = guessed.has(l) || lost;
            return (
              <span key={i} className="inline-flex items-center justify-center w-8 h-10 border-b-2 border-[var(--sunflower)]/70 handwritten text-3xl text-white">
                {reveal ? l.toUpperCase() : ""}
              </span>
            );
          })}
        </div>

        {!showHint && !done && (
          <button onClick={() => setShowHint(true)} className="text-xs text-white/60 underline mb-3" data-testid="guess-hint-btn">show hint (−1 streak risk)</button>
        )}
        {showHint && <p className="handwritten text-xl text-white/90 mb-3">💡 {puzzle.hint}</p>}
      </div>

      {/* keyboard */}
      <div className="grid grid-cols-7 gap-1.5 mt-4">
        {"abcdefghijklmnopqrstuvwxyz".split("").map((l) => {
          const isPicked = picked.has(l);
          const inWord = wordLetters.includes(l);
          return (
            <button
              key={l}
              data-testid={`key-${l}`}
              onClick={() => pick(l)}
              disabled={isPicked || done}
              className={`aspect-square rounded-lg text-sm font-bold uppercase transition ${
                isPicked
                  ? inWord
                    ? "bg-[var(--sunflower)] text-black"
                    : "bg-red-500/30 text-red-200"
                  : "glass text-white hover:bg-[var(--sunflower)]/20"
              }`}
            >{l}</button>
          );
        })}
      </div>

      {done && (
        <div className="glass rounded-3xl p-5 mt-4 text-center anim-fade-up">
          <p className="handwritten text-4xl sunflower-text">{won ? "you got it! 🌻" : "oops 🥀"}</p>
          <p className="handwritten text-2xl text-white mt-1">the word was <b className="text-[var(--sunflower)]">{puzzle.word}</b></p>
          <button onClick={nextRound} className="sticker-btn mt-4" data-testid="guess-next">next word →</button>
        </div>
      )}
    </SectionShell>
  );
}
