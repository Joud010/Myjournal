export type Entry = {
  text: string;
  timestamp: string;
  id: string;
  gefuehle?: string;
  gut?: string;
  dankbarkeit?: string;
  herausforderungen?: string;
  lernen?: string;
  tags?: string[];
  favorite?: boolean;
  mood?: number; // 1-5
};

export type JournalingProps = {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  username?: string;
  showToast?: (msg: string) => void;
};

export type AppView = "journaling" | "chat" | "tools";
export type ToolOption = "option1" | "option2" | "option3" | "option4" | "option5" | null;
