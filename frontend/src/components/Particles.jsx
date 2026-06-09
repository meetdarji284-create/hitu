import { useEffect, useRef } from "react";

// Floating sunflowers + hearts + sparkles canvas overlay
export default function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const EMOJIS = ["🌻", "🌻", "💛", "🤍", "✨", "❤️", "🍫"];

    const spawn = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 30,
        vy: -0.3 - Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 0.4,
        size: 14 + Math.random() * 22,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.02,
        alpha: 0.6 + Math.random() * 0.4,
      });
    };

    // pre-seed
    for (let i = 0; i < 12; i++) {
      spawn();
      particles[particles.length - 1].y = Math.random() * canvas.height;
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.04 && particles.length < 28) spawn();

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
      });

      particles = particles.filter((p) => p.y > -50);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="particles-canvas"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.85,
      }}
    />
  );
}
