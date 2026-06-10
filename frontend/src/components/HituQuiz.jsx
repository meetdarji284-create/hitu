import { useState } from "react";
import SectionShell from "./SectionShell";
import { QUIZ_QUESTIONS } from "../data/hituData";

export default function HituQuiz({ onBack }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    const perfect = score === QUIZ_QUESTIONS.length;
    return (
      <SectionShell title="Quiz done ❤️" onBack={onBack} testId="quiz-section">
        <div className="glass-yellow rounded-3xl p-6 text-center" data-testid="quiz-result">
          <p className="text-6xl mb-3">{perfect ? "🏆" : score >= 7 ? "🌻" : "💛"}</p>
          <p className="handwritten text-4xl sunflower-text">{score} / {QUIZ_QUESTIONS.length}</p>
          <p className="handwritten text-2xl text-white/90 mt-3">
            {perfect
              ? "You know yourself, queen ❤️ (and I know you too, just saying 😏)"
              : score >= 7
              ? "Almost perfect, cutuu 🥺"
              : "It's okay — I'll quiz you on yourself anytime 💗"}
          </p>
          <button
            onClick={() => { setI(0); setScore(0); setPicked(null); setDone(false); }}
            className="sticker-btn mt-5"
            data-testid="quiz-restart"
          >
            Play again
          </button>
        </div>
      </SectionShell>
    );
  }

  const q = QUIZ_QUESTIONS[i];
  const correct = picked === q.answer;

  const next = () => {
    if (i + 1 >= QUIZ_QUESTIONS.length) setDone(true);
    else { setI(i + 1); setPicked(null); }
  };

  const pick = (idx) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  return (
    <SectionShell title="Hitu Quiz ❤️" subtitle={`question ${i + 1} of ${QUIZ_QUESTIONS.length}`} onBack={onBack} testId="quiz-section">
      <div className="glass rounded-3xl p-5">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-[var(--sunflower)] transition-all"
            style={{ width: `${((i + (picked !== null ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>

        <p className="handwritten text-3xl text-white mb-5 leading-tight" data-testid="quiz-question">{q.q}</p>

        <div className="grid gap-2">
          {q.options.map((opt, idx) => {
            const isPicked = picked === idx;
            const showCorrect = picked !== null && idx === q.answer;
            const showWrong = isPicked && idx !== q.answer;
            return (
              <button
                key={idx}
                onClick={() => pick(idx)}
                data-testid={`quiz-option-${idx}`}
                className={`text-left rounded-2xl px-4 py-3 border transition-all ${
                  showCorrect
                    ? "bg-[var(--sunflower)]/20 border-[var(--sunflower)] text-[var(--sunflower)]"
                    : showWrong
                    ? "bg-red-500/15 border-red-400/50 text-red-200"
                    : "glass border-white/10 hover:border-[var(--sunflower)]/50"
                }`}
              >
                <span className="handwritten text-xl">{opt}</span>
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="mt-4 anim-fade-up">
            <p className="handwritten text-xl text-white/80">
              {correct ? "right, obviously 😌" : `nope — it's "${q.options[q.answer]}". ${q.hint}`}
            </p>
            <button onClick={next} className="sticker-btn mt-4 w-full" data-testid="quiz-next">
              {i + 1 >= QUIZ_QUESTIONS.length ? "see result" : "next →"}
            </button>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
