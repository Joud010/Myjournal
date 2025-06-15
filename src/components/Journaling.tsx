import { useState, useMemo } from "react";
import type { Entry, JournalingProps } from "../types";
import { CARD, INPUT, PRIMARY_BTN, SUBTITLE } from "../styles/classes";

function Journaling({ entries, setEntries, username, showToast }: JournalingProps) {
  // Formularfelder für strukturierten Eintrag
  const [gefuehle, setGefuehle] = useState("");
  const [gut, setGut] = useState("");
  const [dankbarkeit, setDankbarkeit] = useState("");
  const [herausforderungen, setHerausforderungen] = useState("");
  const [lernen, setLernen] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [entryText, setEntryText] = useState("");
  // Bearbeiten-Modus
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "mood">("date");
  const [mood, setMood] = useState<number>(3);

  // Speichern oder Bearbeiten
  const handleSave = () => {
    if (
      !gefuehle.trim() &&
      !gut.trim() &&
      !dankbarkeit.trim() &&
      !herausforderungen.trim() &&
      !lernen.trim() &&
      !entryText.trim()
    )
      return;

    const newEntry: Entry = {
      id: editId ?? Date.now().toString(),
      timestamp: editId
        ? entries.find((e) => e.id === editId)?.timestamp ?? new Date().toLocaleString()
        : new Date().toLocaleString(),
      gefuehle,
      gut,
      dankbarkeit,
      herausforderungen,
      lernen,
      tags,
      text: entryText,
    };

    if (editId) {
      setEntries(
        entries.map((e) => (e.id === editId ? newEntry : e))
      );
      setEditId(null);
    } else {
      setEntries([newEntry, ...entries]);
    }
    // Felder zurücksetzen
    setGefuehle("");
    setGut("");
    setDankbarkeit("");
    setHerausforderungen("");
    setLernen("");
    setTags([]);
    setTagInput("");
    setEntryText("");
  };

  // Eintrag löschen
  const handleDelete = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
    if (editId === id) setEditId(null);
  };

  // Eintrag bearbeiten
  const handleEdit = (entry: Entry) => {
    setEditId(entry.id);
    setGefuehle(entry.gefuehle ?? "");
    setGut(entry.gut ?? "");
    setDankbarkeit(entry.dankbarkeit ?? "");
    setHerausforderungen(entry.herausforderungen ?? "");
    setLernen(entry.lernen ?? "");
    setTags(entry.tags ?? []);
    setEntryText(entry.text ?? "");
  };

  // Tag hinzufügen
  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  // Tag entfernen
  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  // Favorit umschalten
  const toggleFavorite = (id: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, favorite: !e.favorite } : e));
  };

  // Stimmung speichern
  const handleSetMood = (val: number) => {
    setMood(val);
  };

  // Export als Textdatei
  const handleExport = () => {
    const text = entries.map(e =>
      `Datum: ${e.timestamp}\nGefühle: ${e.gefuehle}\nGut: ${e.gut}\nDankbarkeit: ${e.dankbarkeit}\nHerausforderungen: ${e.herausforderungen}\nLernen: ${e.lernen}\nText: ${e.text}\nTags: ${(e.tags || []).join(", ")}\n---\n`
    ).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "journal-entries.txt";
    a.click();
    URL.revokeObjectURL(url);
    showToast?.("Exportiert!");
  };

  // Filter/Suche/Sortierung
  const filteredEntries = useMemo(() => {
    let list = entries;
    if (search.trim()) {
      list = list.filter(e =>
        (e.text || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.gefuehle || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (filterTag) {
      list = list.filter(e => (e.tags || []).includes(filterTag));
    }
    if (sortBy === "mood") {
      list = [...list].sort((a, b) => (b.mood || 0) - (a.mood || 0));
    } else {
      list = [...list].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return list;
  }, [entries, search, filterTag, sortBy]);

  return (
    <div className="mt-6 md:mt-10">
      <h2 className={SUBTITLE}>Journal {username && <span className="text-violet-400">({username})</span>}</h2>
      {/* Formular für neuen/bearbeiteten Eintrag */}
      <div className="space-y-3 mb-10 bg-white/80 rounded-2xl shadow p-6 max-w-full mx-auto animate-fadein" aria-label="Neuer Eintrag">
        {/* Stimmungstracker */}
        <div className="flex gap-2 items-center mb-2">
          <span className="text-violet-700 font-medium">Stimmung heute:</span>
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => handleSetMood(val)}
              className={`text-2xl ${mood === val ? "scale-125" : "opacity-60"} transition`}
              aria-label={`Stimmung ${val}`}
              tabIndex={0}
            >
              {["😞", "😕", "😐", "🙂", "😃"][val - 1]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={gefuehle}
            onChange={(e) => setGefuehle(e.target.value)}
            placeholder="Gefühle heute"
            className={INPUT}
          />
          <input
            value={gut}
            onChange={(e) => setGut(e.target.value)}
            placeholder="Was lief gut?"
            className={INPUT}
          />
          <input
            value={dankbarkeit}
            onChange={(e) => setDankbarkeit(e.target.value)}
            placeholder="Dankbarkeit"
            className={INPUT}
          />
          <input
            value={herausforderungen}
            onChange={(e) => setHerausforderungen(e.target.value)}
            placeholder="Herausforderungen"
            className={INPUT}
          />
          <input
            value={lernen}
            onChange={(e) => setLernen(e.target.value)}
            placeholder="Lernmomente"
            className={INPUT}
          />
        </div>
        <textarea
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
          placeholder="Fließtext (alles andere)"
          className={`${INPUT} resize-none h-20`}
          style={{ fontFamily: 'Segoe UI, Arial, sans-serif' }}
        />
        {/* Tags */}
        <div className="flex gap-2 items-center flex-wrap">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Tag hinzufügen (z.B. #Freude)"
            className={`${INPUT} w-40`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <button
            type="button"
            className={`${PRIMARY_BTN} px-3 py-1 rounded-xl`}
            onClick={handleAddTag}
          >
            +
          </button>
          <div className="flex gap-1 flex-wrap">
            {tags.map((t) => (
              <span
                key={t}
                className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-xl cursor-pointer"
                onClick={() => handleRemoveTag(t)}
                title="Tag entfernen"
              >
                {t} &times;
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => {
              handleSave();
              showToast?.(editId ? "Eintrag erfolgreich aktualisiert!" : "Eintrag erfolgreich gespeichert!");
            }}
            className={`${PRIMARY_BTN} px-6 py-2 rounded-2xl text-lg`}
            aria-label={editId ? "Änderungen speichern" : "Speichern"}
          >
            {editId ? "Änderungen speichern" : "Speichern"}
          </button>
          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setGefuehle("");
                setGut("");
                setDankbarkeit("");
                setHerausforderungen("");
                setLernen("");
                setTags([]);
                setTagInput("");
                setEntryText("");
              }}
              className="px-6 py-2 rounded-2xl bg-amber-100 text-violet-700 shadow"
            >
              Abbrechen
            </button>
          )}
        </div>
      </div>
      {/* Suche, Filter, Export */}
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Suche nach Text, Tag, Gefühl..."
          className={`${INPUT} w-56`}
          aria-label="Suche"
        />
        <select
          value={filterTag || ""}
          onChange={e => setFilterTag(e.target.value || null)}
          className={INPUT}
          aria-label="Nach Tag filtern"
        >
          <option value="">Alle Tags</option>
          {[...new Set(entries.flatMap(e => e.tags || []))].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as "date" | "mood")}
          className={INPUT}
          aria-label="Sortierung"
        >
          <option value="date">Sortierung: Datum</option>
          <option value="mood">Sortierung: Stimmung</option>
        </select>
        <button
          className={`${PRIMARY_BTN} px-4 py-2 rounded-xl`}
          onClick={handleExport}
          aria-label="Exportieren"
        >
          Exportieren
        </button>
      </div>
      <div className={`${CARD} mb-6 overflow-x-auto`} style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: "rgba(255,255,255,0.95)" }}>
        {filteredEntries.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            <p className="mb-2">Noch keine Einträge gefunden.</p>
            <p className="text-violet-500">Beginne jetzt mit deinem ersten Eintrag! Nutze das Formular oben, um deine Gedanken zu erfassen.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-violet-100">
            <thead className="bg-violet-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-500 uppercase tracking-wider rounded-tl-2xl">Datum</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-500 uppercase tracking-wider">Gefühle</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-500 uppercase tracking-wider">Gut lief</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-500 uppercase tracking-wider">Dankbarkeit</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-500 uppercase tracking-wider">Herausforderungen</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-500 uppercase tracking-wider">Lernen</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-500 uppercase tracking-wider">Fließtext</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-violet-500 uppercase tracking-wider">Tags</th>
                <th className="px-2 py-4 text-xs font-bold text-violet-500 uppercase tracking-wider">Fav</th>
                <th className="px-2 py-4 text-xs font-bold text-violet-500 uppercase tracking-wider">Stimmung</th>
                <th className="px-6 py-4 rounded-tr-2xl"></th>
              </tr>
            </thead>
            <tbody className="bg-white/80 divide-y divide-violet-50">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-violet-50/60 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.timestamp ? new Date(entry.timestamp).toLocaleDateString('de-DE') : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.gefuehle || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.gut || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.dankbarkeit || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.herausforderungen || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.lernen || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{entry.text || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {entry.tags && entry.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((t) => (
                          <span key={t} className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-xl">{t}</span>
                        ))}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-2 py-4 text-center">
                    <button
                      aria-label={entry.favorite ? "Favorit entfernen" : "Als Favorit markieren"}
                      onClick={() => toggleFavorite(entry.id)}
                      className="text-xl"
                    >
                      {entry.favorite ? "★" : "☆"}
                    </button>
                  </td>
                  <td className="px-2 py-4 text-center">
                    {entry.mood ? "😊😐😞".charAt(entry.mood - 1) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-violet-600 hover:text-violet-900 mr-2 underline underline-offset-2"
                      onClick={() => handleEdit(entry)}
                    >
                      Bearbeiten
                    </button>
                    <button
                      className="text-rose-500 hover:text-rose-700 underline underline-offset-2"
                      onClick={() => handleDelete(entry.id)}
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Journaling;