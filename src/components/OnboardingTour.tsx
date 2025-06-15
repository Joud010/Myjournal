import { useState } from "react";
import { CARD, PRIMARY_BTN } from "../styles/classes";

const steps = [
  {
    title: "Willkommen bei Mental Journal!",
    text: "Diese App hilft dir, deine Gedanken, Gefühle und Fortschritte festzuhalten. Lass uns gemeinsam die wichtigsten Bereiche entdecken.",
    highlight: null,
  },
  {
    title: "Journaling",
    text: "Hier kannst du täglich deine Einträge verfassen, reflektieren und deine Stimmung tracken.",
    highlight: "journaling",
  },
  {
    title: "Chat",
    text: "Im Chat kannst du mit einer KI sprechen, Fragen stellen oder dir Übungen vorschlagen lassen.",
    highlight: "chat",
  },
  {
    title: "Tools",
    text: "Nutze Tools wie Atemübungen, Dankbarkeitslisten und mehr, um dich im Alltag zu unterstützen.",
    highlight: "tools",
  },
  {
    title: "Los geht's!",
    text: "Du bist bereit! Viel Freude beim Entdecken und Reflektieren. Du kannst die Tour später im Menü erneut starten.",
    highlight: null,
  },
];

type OnboardingTourProps = {
  onFinish: () => void;
};

export default function OnboardingTour({ onFinish }: OnboardingTourProps) {
  const [step, setStep] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`${CARD} max-w-lg mx-auto p-8 relative animate-fadein`} style={{ background: "rgba(255,255,255,0.98)" }}>
        <h2 className="text-2xl font-bold mb-4 text-violet-700">{steps[step].title}</h2>
        <p className="text-violet-700 mb-6">{steps[step].text}</p>
        <div className="flex justify-between">
          <button
            className="text-violet-400 hover:underline"
            onClick={onFinish}
            aria-label="Tour überspringen"
          >
            Überspringen
          </button>
          {step < steps.length - 1 ? (
            <button
              className={`${PRIMARY_BTN} px-6 py-2 rounded-2xl`}
              onClick={() => setStep(step + 1)}
              aria-label="Weiter"
            >
              Weiter →
            </button>
          ) : (
            <button
              className={`${PRIMARY_BTN} px-6 py-2 rounded-2xl`}
              onClick={onFinish}
              aria-label="Tour beenden"
            >
              Fertig!
            </button>
          )}
        </div>
        {/* Visuelle Hervorhebung */}
        {steps[step].highlight === "journaling" && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[-60px]">
            <div className="bg-violet-100 text-violet-700 px-4 py-2 rounded-xl shadow font-bold animate-fadein">📓 Journaling</div>
          </div>
        )}
        {steps[step].highlight === "chat" && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[-60px]">
            <div className="bg-amber-100 text-violet-700 px-4 py-2 rounded-xl shadow font-bold animate-fadein">💬 Chat</div>
          </div>
        )}
        {steps[step].highlight === "tools" && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[-60px]">
            <div className="bg-violet-200 text-violet-700 px-4 py-2 rounded-xl shadow font-bold animate-fadein">🛠️ Tools</div>
          </div>
        )}
      </div>
    </div>
  );
}
