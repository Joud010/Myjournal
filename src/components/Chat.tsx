import { useState, useRef, useEffect } from "react";
import { CARD, INPUT, PRIMARY_BTN, SUBTITLE } from "../styles/classes";

// Lade-Animation mit drei Punkten
function TypingLoader() {
  return (
    <div className="flex gap-1 items-center h-6 ml-2">
      <span className="dot-loader" />
      <style>{`
        .dot-loader {
          display: inline-block;
          width: 32px;
          height: 10px;
          position: relative;
        }
        .dot-loader::before, .dot-loader::after, .dot-loader span {
          content: '';
          display: inline-block;
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a78bfa;
          opacity: 0.7;
          animation: dot-fade 1.2s infinite;
        }
        .dot-loader::before {
          left: 0;
          animation-delay: 0s;
        }
        .dot-loader span {
          left: 12px;
          animation-delay: 0.2s;
        }
        .dot-loader::after {
          left: 24px;
          animation-delay: 0.4s;
        }
        @keyframes dot-fade {
          0% { opacity: 0.7; transform: scale(1);}
          20% { opacity: 1; transform: scale(1.2);}
          40% { opacity: 0.7; transform: scale(1);}
          60% { opacity: 0.3; transform: scale(0.8);}
          80% { opacity: 0; transform: scale(0.7);}
          100% { opacity: 0.7; transform: scale(1);}
        }
      `}</style>
      <span style={{ display: "none" }} /> {/* Für die mittlere Kugel */}
    </div>
  );
}

type ChatProps = {
  showToast?: (msg: string) => void;
};

function Chat({ showToast }: ChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Automatisches Scrollen
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Dynamische Höhe für Textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() === "" || isLoading) return;
    setMessages([...messages, {text: message, sender: 'user'}]);
    setMessage("");
    setIsLoading(true);
    showToast?.("Nachricht gesendet!");

    // Simuliere eine Bot-Antwort nach 1 Sekunde
    setTimeout(() => {
      setMessages(prev => [...prev, {text: "Das ist eine automatische Antwort", sender: 'bot'}]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mt-8 md:mt-12">
      <h2 className={SUBTITLE}>Chat</h2>
      <div className={`${CARD} p-4 h-[384px] overflow-y-auto mb-6`} style={{ background: "rgba(255,255,255,0.96)" }}>
        {messages.length === 0 && !isLoading ? (
          <div className="text-gray-400 text-center py-8">
            <p>Starte eine Unterhaltung.</p>
            <p className="text-violet-500 mt-2">Frag mich nach einer Übung oder teile, was dich beschäftigt.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`max-w-lg break-words p-3 rounded-2xl shadow ${msg.sender === 'user' ? 'bg-violet-100 ml-auto text-violet-900' : 'bg-amber-50 mr-auto text-violet-700'} font-sans`}
                style={{ fontFamily: 'Segoe UI, Arial, sans-serif' }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="max-w-lg p-3 rounded-2xl shadow bg-amber-50 mr-auto text-violet-700 font-sans flex items-center" style={{ fontFamily: 'Segoe UI, Arial, sans-serif', minHeight: 32 }}>
                <TypingLoader />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nachricht schreiben..."
          className={`${INPUT} flex-1 resize-none shadow`}
          style={{ fontFamily: 'Segoe UI, Arial, sans-serif', minHeight: 40, maxHeight: 120, overflow: "auto" }}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend}
          className={`${PRIMARY_BTN} px-5 py-2 rounded-2xl text-lg`}
          disabled={isLoading}
        >
          Senden
        </button>
      </div>
    </div>
  );
}

export default Chat;
