import { useState, useMemo } from "react";
import Journaling from "./components/Journaling";
import Chat from "./components/Chat";
import ToolsView from "./components/ToolsView";
import { Login, SignUp } from "./components/Login";
import OnboardingTour from "./components/OnboardingTour"; // NEU
import {
  PRIMARY_BG,
  PRIMARY_BTN,
  CARD,
  TITLE,
  SUBTITLE,
  MENU_BTN,
  LOGOUT_BTN,
} from "./styles/classes";
import type { Entry, AppView, ToolOption } from "./types";
import Home from "./pages/Home";

// Hilfsfunktionen
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

const MOTIVATION_QUOTES = [
  "Jeder Tag ist eine neue Chance.",
  "Du bist stärker als du denkst.",
  "Kleine Schritte führen zum Ziel.",
  "Selbstfürsorge ist kein Luxus.",
  "Du bist nicht allein.",
  "Heute ist ein guter Tag für einen Neuanfang.",
  "Vertraue dir selbst.",
  "Auch Rückschritte sind Teil des Weges.",
];

// --- Hauptkomponente ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeView, setActiveView] = useState<AppView>("journaling");
  const [showMenu, setShowMenu] = useState(false);
  const [selectedToolOption, setSelectedToolOption] = useState<ToolOption>(null);
  const [showStart, setShowStart] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false); // NEU

  // Personalisierung
  const [username, setUsername] = useState<string>("");
  // Avatar: Initialen
  const initials = useMemo(() => getInitials(username || "U"), [username]);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  // Toasts
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Fortschritt (Streaks)
  const today = new Date().toLocaleDateString("de-DE");
  const streak = useMemo(() => {
    // Zähle aufeinanderfolgende Tage mit Einträgen
    const dates = Array.from(
      new Set(entries.map((e) => new Date(e.timestamp).toLocaleDateString("de-DE")))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let s = 0;
    let d = new Date();
    for (let i = 0; i < dates.length; i++) {
      if (dates[i] === d.toLocaleDateString("de-DE")) {
        s++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return s;
  }, [entries]);

  // Motivationsspruch
  const motivation = useMemo(
    () => MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)],
    [showStart, activeView]
  );

  // Erinnerung: Kein Eintrag heute?
  const hasEntryToday = entries.some(
    (e) => new Date(e.timestamp).toLocaleDateString("de-DE") === today
  );

  // Animationen: einfache Fade-Transition
  const fadeClass = "transition-opacity duration-500";

  const toggleMenu = () => setShowMenu(!showMenu);

  const changeView = (view: AppView) => {
    setActiveView(view);
    setShowMenu(false);
    if (view !== "tools") setSelectedToolOption(null);
  };

  // Login/SignUp Übergabe Username
  if (!isLoggedIn) {
    return showSignUp ? (
      <SignUp
        onSignUp={(name) => {
          setIsLoggedIn(true);
          setShowStart(true);
          setUsername(name);
          setShowOnboarding(true); // Onboarding nach Registrierung
        }}
        onSwitch={() => setShowSignUp(false)}
      />
    ) : (
      <Login
        onLogin={(name) => {
          setIsLoggedIn(true);
          setShowStart(true);
          setUsername(name);
          setShowOnboarding(true); // Onboarding nach Login (nur beim ersten Mal)
        }}
        onSwitch={() => setShowSignUp(true)}
      />
    );
  }

  // Onboarding-Tour anzeigen, wenn aktiv
  if (showOnboarding) {
    return (
      <div className={`${PRIMARY_BG} min-h-screen p-8 text-violet-900 ${darkMode ? "dark bg-gray-900 text-gray-100" : ""}`}>
        <OnboardingTour onFinish={() => setShowOnboarding(false)} />
      </div>
    );
  }

  // Start-Seite nach Login/SignUp, danach normale Views
  if (showStart) {
    return (
      <div className={`${PRIMARY_BG} min-h-screen p-8 text-violet-900 ${darkMode ? "dark bg-gray-900 text-gray-100" : ""}`}>
        {/* Menü- und Logout-Button + Avatar */}
        <button
          onClick={() => {
            setIsLoggedIn(false);
            setShowStart(false);
            setUsername("");
          }}
          className={`${LOGOUT_BTN} fixed right-8 top-8 z-30 flex items-center gap-2`}
        >
          <span className="w-10 h-10 rounded-full bg-violet-400 flex items-center justify-center text-white font-bold text-xl border-2 border-violet-200 select-none" aria-label={`Profil von ${username}`}>
            {initials}
          </span>
          Logout
        </button>
        <h1 className={TITLE} style={{ marginTop: "3.5rem" }}>🧠 Mental Journal</h1>
        <Home username={username} />
        {/* Fortschritt & Motivation */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
          <div className={`${CARD} flex flex-col items-center px-8 py-4`}>
            <span className="text-2xl font-bold text-violet-700">{streak}</span>
            <span className="text-sm text-violet-500">Tage in Folge reflektiert</span>
          </div>
          <div className={`${CARD} px-8 py-4`}>
            <span className="text-violet-600 italic">{motivation}</span>
          </div>
        </div>
        {/* Notfall-Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-2xl shadow font-bold"
            onClick={() => window.open("https://www.nummergegenkummer.de/", "_blank")}
            aria-label="Notfallhilfe öffnen"
          >
            Notfall-Hilfe
          </button>
        </div>
        {/* Darkmode Umschalter */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            className="bg-violet-200 hover:bg-violet-400 text-violet-900 px-4 py-2 rounded-full shadow"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Dark Mode umschalten"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
        {/* Weiter-Button */}
        <div className="flex justify-center mt-10">
          <button
            className={`${PRIMARY_BTN} px-8 py-3 rounded-2xl text-lg`}
            onClick={() => setShowStart(false)}
          >
            Weiter
          </button>
        </div>
        {/* Toast */}
        {toast && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-6 py-3 rounded-2xl shadow-lg animate-fadein z-50">
            {toast}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${PRIMARY_BG} min-h-screen p-8 text-violet-900 ${darkMode ? "dark bg-gray-900 text-gray-100" : ""}`}>
      {/* Menü-Button links oben */}
      <button
        onClick={toggleMenu}
        className={`${MENU_BTN} fixed left-8 top-8 z-30`}
        aria-label="Menü öffnen"
      >
        ☰ Menü
      </button>
      {/* Logout-Button rechts oben mit Avatar */}
      <button 
        onClick={() => {
          setIsLoggedIn(false);
          setUsername("");
        }}
        className={`${LOGOUT_BTN} fixed right-8 top-8 z-30 flex items-center gap-2`}
      >
        <span className="w-10 h-10 rounded-full bg-violet-400 flex items-center justify-center text-white font-bold text-xl border-2 border-violet-200 select-none" aria-label={`Profil von ${username}`}>
          {initials}
        </span>
        Logout
      </button>
      {/* Menü-Popup */}
      {showMenu && (
        <div className={`${CARD} fixed left-8 top-20 shadow-lg p-2 z-40 w-52`}>
          <button
            onClick={() => setShowStart(true)}
            className="w-full text-left p-3 hover:bg-violet-50 rounded-2xl flex items-center gap-2"
            aria-label="Zur Startseite"
          >
            <span role="img" aria-label="Haus">🏠</span> Startseite
          </button>
          <button
            onClick={() => changeView("journaling")}
            className={`w-full text-left p-3 hover:bg-violet-50 rounded-2xl flex items-center gap-2 ${activeView === "journaling" ? "bg-violet-100 font-bold ring-2 ring-violet-300" : ""}`}
            aria-label="Journaling öffnen"
          >
            <span role="img" aria-label="Tagebuch">📓</span> Journaling
          </button>
          <button
            onClick={() => changeView("chat")}
            className={`w-full text-left p-3 hover:bg-violet-50 rounded-2xl flex items-center gap-2 ${activeView === "chat" ? "bg-violet-100 font-bold ring-2 ring-violet-300" : ""}`}
            aria-label="Chat öffnen"
          >
            <span role="img" aria-label="Chat">💬</span> Chat
          </button>
          <button
            onClick={() => changeView("tools")}
            className={`w-full text-left p-3 hover:bg-violet-50 rounded-2xl flex items-center gap-2 ${activeView === "tools" ? "bg-violet-100 font-bold ring-2 ring-violet-300" : ""}`}
            aria-label="Tools öffnen"
          >
            <span role="img" aria-label="Werkzeug">🛠️</span> Tools
          </button>
        </div>
      )}
      <h1 className={TITLE} style={{ marginTop: "3.5rem" }}>🧠 Mental Journal</h1>
      {/* Erinnerung, falls kein Eintrag heute */}
      {!hasEntryToday && activeView === "journaling" && (
        <div className="flex justify-center mt-2">
          <div className="bg-amber-100 text-violet-700 px-6 py-2 rounded-xl shadow font-medium animate-pulse" role="status">
            Erinnerung: Heute noch keinen Eintrag erstellt!
          </div>
        </div>
      )}
      {/* Fortschritt & Motivation */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-4">
        <div className={`${CARD} flex flex-col items-center px-8 py-4`}>
          <span className="text-2xl font-bold text-violet-700">{streak}</span>
          <span className="text-sm text-violet-500">Tage in Folge reflektiert</span>
        </div>
        <div className={`${CARD} px-8 py-4`}>
          <span className="text-violet-600 italic">{motivation}</span>
        </div>
      </div>
      {/* Notfall-Button */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-2xl shadow font-bold"
          onClick={() => window.open("https://www.nummergegenkummer.de/", "_blank")}
          aria-label="Notfallhilfe öffnen"
        >
          Notfall-Hilfe
        </button>
      </div>
      {/* Darkmode Umschalter */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="bg-violet-200 hover:bg-violet-400 text-violet-900 px-4 py-2 rounded-full shadow"
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Dark Mode umschalten"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>
      {/* Views mit Fade-Animation */}
      <div className={`${fadeClass}`}>
        {activeView === "journaling" ? (
          <Journaling
            entries={entries}
            setEntries={(e) => {
              setEntries(e);
              showToast("Eintrag erfolgreich gespeichert!");
            }}
            username={username}
            showToast={showToast}
          />
        ) : activeView === "chat" ? (
          <Chat showToast={showToast} />
        ) : (
          <ToolsView selectedOption={selectedToolOption} setSelectedOption={setSelectedToolOption} />
        )}
      </div>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-6 py-3 rounded-2xl shadow-lg animate-fadein z-50">
          {toast}
        </div>
      )}
    </div>
  );
}