import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, Terminal, HelpCircle, Loader2 } from 'lucide-react';
import { Room } from '../types/cyber';

interface AiLabAssistantDrawerProps {
  room: Room;
  currentTaskTitle?: string;
  currentQuestionPrompt?: string;
  onClose: () => void;
}

export const AiLabAssistantDrawer: React.FC<AiLabAssistantDrawerProps> = ({
  room,
  currentTaskTitle,
  currentQuestionPrompt,
  onClose,
}) => {
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; id: string }>
  >([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hi! Ich bin dein persönlicher KI-Mentor für den Raum **"${room.title}"**.\n\nCybersecurity wirkt am Anfang oft kompliziert – aber keine Sorge! Du musst kein Programmierer sein. Wenn du einen Begriff nicht verstehst oder nicht weißt, was du tun sollst: Frag mich einfach! Ich erkläre dir alles Schritt für Schritt auf Deutsch.`,
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskMentor = async (queryText?: string) => {
    const textToSend = queryText || inputQuestion;
    if (!textToSend.trim() || loading) return;

    const userMsgId = `u-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: textToSend }]);
    setInputQuestion('');
    setLoading(true);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          roomTitle: room.title,
          taskTitle: currentTaskTitle || room.tasks[0]?.title || 'Allgemein',
          questionPrompt: currentQuestionPrompt || 'Aufgabe im Raum',
          userQuestion: textToSend,
        }),
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: data.advice || 'Hier ist ein einfacher Denkanstoß für dich.',
          },
        ]);
      } else {
        throw new Error('API failed');
      }
    } catch {
      clearTimeout(timer);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `💡 **Schritt-für-Schritt-Hilfe für ${room.title}:**\n\n1. Klicke oben auf **"🟢 Deploy Free Machine"**, falls die Maschine noch offline ist.\n2. Sobald die grüne IP (wie ${room.targetMachine.ip}) leuchtet, ist der Ziel-Computer bereit.\n3. Schau dir die Aufgabenstellung genau an: Manchmal musst du nur eine IP kopieren, manchmal den Reiter **"Target Web Browser"** öffnen oder in der AttackBox einen Befehl ausführen.\n\nSag mir gerne, welcher Satz dir unklar ist!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    '🧒 Erklär es mir für absolute Anfänger',
    '👣 Welchen Button muss ich als Nächstes klicken?',
    '🔍 Was bedeutet diese Aufgabe in einfachem Deutsch?',
    '💻 Welchen Terminal-Befehl brauche ich jetzt?',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>RootAdvisor KI-Mentor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </h3>
            <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{room.title}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-medium'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 px-1 font-mono">
              {m.sender === 'user' ? 'Du' : 'RootAdvisor KI'}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 max-w-[80%]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>RootAdvisor analysiert das Lab-Szenario...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-slate-900/50 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 text-[10px] uppercase font-mono mr-1">Vorschlag:</span>
        {quickPrompts.map((qp) => (
          <button
            key={qp}
            onClick={() => handleAskMentor(qp)}
            disabled={loading}
            className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-750 transition-colors whitespace-nowrap border border-slate-700/60 disabled:opacity-40"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskMentor();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Frag den Mentor (z.B. Warum schlägt nmap fehl?)..."
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors disabled:opacity-40"
            aria-label="Frage senden"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
