import { ChevronLeft } from "lucide-react";

export default function SectionShell({ title, subtitle, onBack, children, testId }) {
  return (
    <div className="min-h-screen px-4 pt-6 pb-32 relative z-10 anim-fade-in" data-testid={testId}>
      <div className="max-w-md mx-auto">
        <button
          onClick={onBack}
          data-testid="back-button"
          className="flex items-center gap-1 text-white/70 hover:text-[var(--sunflower)] mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> <span className="handwritten text-xl">back home</span>
        </button>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-sm text-white/60 mb-4">{subtitle}</p>}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
