import { CARD, SUBTITLE, PRIMARY_BTN } from "../styles/classes";

type HomeProps = {
  username?: string;
};

const TODO_ITEMS = [
  { done: true, text: "Heute: 1x Reflektieren" },
  { done: false, text: "1 Tool anwenden" },
  { done: false, text: "5 Min. Pause einplanen" },
];

const TOOL_OPTIONS = [
  { key: "option1", label: "Atemübung" },
  { key: "option2", label: "Gefühls-Check-in" },
  { key: "option3", label: "Gedanken sortieren" },
  { key: "option4", label: "Dankbarkeitsübung" },
  { key: "option5", label: "Motivations-Impuls" },
];

export default function Home({ username }: HomeProps) {
  // Dummy-Handler für Schnellzugriff (kann später Routing/Callback bekommen)
  const handleToolClick = (tool: string) => {
    // z.B. Navigation oder Callback
    alert(`Schnellzugriff: ${tool}`);
  };

  return (
    <div className="mt-8 md:mt-14 flex flex-col items-center gap-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-center text-violet-700 mb-2 drop-shadow">
          {username ? `Willkommen zurück, ${username}!` : "Willkommen zurück!"}
        </h1>
        <div className="text-center text-violet-600 text-lg mb-4 font-medium">
          <span className="inline-block bg-amber-50 rounded-xl px-4 py-2 shadow-sm">
            Schön, dass du wieder da bist.{" "}
            <span className="font-bold text-violet-700">Dein Wohlbefinden zählt!</span>
          </span>
        </div>
        <div className={`${CARD} flex flex-col md:flex-row gap-6 items-center justify-between mb-8`} style={{ background: "rgba(255,255,255,0.97)" }}>
          <div className="flex-1">
            <h2 className={SUBTITLE}>Deine Tagesziele</h2>
            <ul className="space-y-2 mt-2">
              {TODO_ITEMS.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-lg">
                  <span className={item.done ? "text-green-500" : "text-amber-400"}>
                    {item.done ? "🟩" : "⬜️"}
                  </span>
                  <span className={item.done ? "line-through text-gray-400" : "text-violet-700"}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <h2 className={SUBTITLE}>Schnellzugriff: Tools</h2>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {TOOL_OPTIONS.map((tool) => (
                <button
                  key={tool.key}
                  className={`${PRIMARY_BTN} px-4 py-2 rounded-xl text-sm shadow`}
                  onClick={() => handleToolClick(tool.label)}
                  style={{ minWidth: 120 }}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={`${CARD} max-w-2xl mx-auto p-8 shadow-xl`} style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: "rgba(255,255,255,0.97)" }}>
        <p className="text-lg text-violet-800 leading-relaxed text-center">
          Das ist eine <span className="font-bold text-violet-600">KI-gestützte Selbstreflexions-App</span> speziell für junge Menschen, die emotionale Struktur, Klarheit und mentale Stärke vermittelt.<br />
          <span className="text-amber-600 font-semibold">Mit Fokus auf rationale Problemlösung, Eigenverantwortung und nachhaltige Veränderung</span> – unterstützt durch KI Modelle, tägliche Reflexion, Tools und datenschutzfreundliche Speicherung.
        </p>
      </div>
      <div className="text-center text-violet-500 mt-4 italic">
        <span className="inline-block bg-violet-50 px-4 py-2 rounded-xl shadow-sm">
          Du bist nicht allein – Schritt für Schritt zu mehr Klarheit und Stärke.
        </span>
      </div>
    </div>
  );
}
