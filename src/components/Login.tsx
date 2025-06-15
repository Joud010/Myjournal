import { useState } from "react";
import { CARD, INPUT, PRIMARY_BTN } from "../styles/classes";

type LoginProps = {
  onLogin: (username: string) => void;
  onSwitch: () => void;
};

export function Login({ onLogin, onSwitch }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username);
  };

  return (
    <div className={`${CARD} max-w-md mx-auto mt-24 p-8`} style={{ background: "rgba(255,255,255,0.97)" }}>
      <h2 className="text-3xl font-extrabold mb-8 text-center text-violet-700 drop-shadow">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-violet-700 mb-2 font-medium" htmlFor="username">
            Benutzername
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={INPUT}
          />
        </div>
        <div className="mb-7">
          <label className="block text-violet-700 mb-2 font-medium" htmlFor="password">
            Passwort
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={INPUT}
          />
        </div>
        <div className="mb-5">
          <label className="flex items-center text-violet-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="accent-violet-500"
            />
            <span className="ml-2">Eingeloggt bleiben</span>
          </label>
        </div>
        {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
        <button
          type="submit"
          className={`${PRIMARY_BTN} w-full py-3 px-4 rounded-2xl text-lg`}
        >
          Einloggen
        </button>
      </form>
      <p className="mt-6 text-center text-violet-700">
        Noch kein Konto?{" "}
        <button className="text-violet-500 hover:underline font-semibold" onClick={onSwitch}>
          Jetzt registrieren!
        </button>
      </p>
    </div>
  );
}

type SignUpProps = {
  onSignUp: (username: string) => void;
  onSwitch: () => void;
};

export function SignUp({ onSignUp, onSwitch }: SignUpProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp(username);
  };

  return (
    <div className={`${CARD} max-w-md mx-auto mt-24 p-8`} style={{ background: "rgba(255,255,255,0.97)" }}>
      <h2 className="text-3xl font-extrabold mb-8 text-center text-violet-700 drop-shadow">Registrieren</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-violet-700 mb-2 font-medium" htmlFor="signup-username">
            Benutzername
          </label>
          <input
            id="signup-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={INPUT}
          />
        </div>
        <div className="mb-7">
          <label className="block text-violet-700 mb-2 font-medium" htmlFor="signup-password">
            Passwort
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={INPUT}
          />
        </div>
        <div className="mb-5">
          <label className="flex items-center text-violet-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="accent-violet-500"
            />
            <span className="ml-2">Eingeloggt bleiben</span>
          </label>
        </div>
        <button
          type="submit"
          className={`${PRIMARY_BTN} w-full py-3 px-4 rounded-2xl text-lg`}
        >
          Registrieren
        </button>
      </form>
      <p className="mt-6 text-center text-violet-700">
        Schon registriert?{" "}
        <button className="text-violet-500 hover:underline font-semibold" onClick={onSwitch}>
          Zum Login!
        </button>
      </p>
    </div>
  );
}
