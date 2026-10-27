import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Trash2, Play, Copy, Check } from 'lucide-react';
import { TargetMachine, CommandOutput } from '../types/cyber';
import { executeVirtualCommand } from '../utils/cyberRules';

interface AttackBoxTerminalProps {
  targetMachine: TargetMachine | null;
  onClose: () => void;
  isFloating?: boolean;
}

export const AttackBoxTerminal: React.FC<AttackBoxTerminalProps> = ({
  targetMachine,
  onClose,
  isFloating = false,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [currentDir, setCurrentDir] = useState('/home/rootforge');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: 'h-init-1',
      type: 'system',
      text: '═════════════════════════════════════════════════════════════════════',
    },
    {
      id: 'h-init-2',
      type: 'system',
      text: ' 💻 RootForge AttackBox [100% Kostenlos • Dein virtuelles Terminal]',
    },
    {
      id: 'h-init-3',
      type: 'system',
      text: ' 💡 Tipp für Anfänger: Du musst keine Befehle auswendig lernen!',
    },
    {
      id: 'h-init-4',
      type: 'system',
      text: ' Klicke einfach auf die Schnell-Buttons unten (z.B. "whoami" oder "help").',
    },
    {
      id: 'h-init-5',
      type: 'system',
      text: '═════════════════════════════════════════════════════════════════════',
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleRunCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to input history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Add user command line
    const userLine: CommandOutput = {
      id: `cmd-${Date.now()}`,
      type: 'input',
      text: `rootforge@attackbox:${currentDir}$ ${trimmed}`,
    };

    const result = executeVirtualCommand(trimmed, targetMachine, currentDir);

    if (result.clearScreen) {
      setHistory([]);
      setCurrentDir(result.newDir);
      setInputVal('');
      return;
    }

    const outputLines: CommandOutput[] = result.outputLines.map((line, idx) => ({
      id: `out-${Date.now()}-${idx}`,
      type: line.toLowerCase().includes('error') || line.toLowerCase().includes('unreachable') ? 'stderr' : 'stdout',
      text: line,
    }));

    setHistory((prev) => [...prev, userLine, ...outputLines]);
    setCurrentDir(result.newDir);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    }
  };

  const copyTerminalOutput = () => {
    const text = history.map((h) => h.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickCommands = [
    { label: 'whoami (Wer bin ich?)', cmd: 'whoami' },
    { label: 'help (Alle Befehle zeigen)', cmd: 'help' },
    { label: 'cat target.ip (IP-Adresse anzeigen)', cmd: 'cat target.ip' },
    { label: 'nmap scan (Offene Türen/Ports suchen)', cmd: `nmap -sV ${targetMachine?.status === 'online' ? targetMachine.ip : '10.10.142.87'}` },
    { label: 'curl /robots.txt (Webseite abrufen)', cmd: `curl http://${targetMachine?.status === 'online' ? targetMachine.ip : '10.10.142.87'}/robots.txt` },
    { label: 'gobuster dir (Versteckte Ordner suchen)', cmd: `gobuster dir -u http://${targetMachine?.status === 'online' ? targetMachine.ip : '10.10.142.87'}/ -w common.txt` },
  ];

  return (
    <div
      className={`flex flex-col bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ${
        isExpanded ? 'h-[85vh]' : 'h-96'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-semibold">attackbox@rootforge:~</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-mono text-[11px]">Unlimited Session</span>
          {targetMachine && targetMachine.status === 'online' && (
            <span className="text-cyan-400 font-mono text-[11px] ml-2">
              Target: {targetMachine.ip} ({targetMachine.hostname})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyTerminalOutput}
            className="p-1 hover:text-white text-slate-400 transition-colors"
            title="Copy terminal log"
            aria-label="Copy terminal log"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setHistory([])}
            className="p-1 hover:text-white text-slate-400 transition-colors"
            title="Clear terminal"
            aria-label="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:text-white text-slate-400 transition-colors"
            title={isExpanded ? 'Minimize height' : 'Expand height'}
            aria-label={isExpanded ? 'Minimize height' : 'Expand height'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:text-rose-400 text-slate-400 transition-colors"
            title="Close AttackBox"
            aria-label="Close AttackBox"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Command Launcher Bar */}
      <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 whitespace-nowrap text-[10px] uppercase font-mono mr-1">Quick:</span>
        {quickCommands.map((qc) => (
          <button
            key={qc.label}
            onClick={() => handleRunCommand(qc.cmd)}
            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-750 transition-colors font-mono whitespace-nowrap border border-slate-700/50"
          >
            {qc.label}
          </button>
        ))}
      </div>

      {/* Terminal Screen Body */}
      <div
        className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-200 space-y-1 select-text bg-black/40"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line) => {
          if (line.type === 'input') {
            return (
              <div key={line.id} className="text-emerald-400 font-semibold break-all">
                {line.text}
              </div>
            );
          }
          if (line.type === 'stderr') {
            return (
              <div key={line.id} className="text-rose-400 break-all whitespace-pre-wrap">
                {line.text}
              </div>
            );
          }
          if (line.type === 'system') {
            return (
              <div key={line.id} className="text-slate-500 break-all whitespace-pre-wrap">
                {line.text}
              </div>
            );
          }
          return (
            <div key={line.id} className="text-slate-300 break-all whitespace-pre-wrap">
              {line.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Row */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border-t border-slate-800">
        <span className="text-emerald-400 font-mono text-xs font-semibold whitespace-nowrap">
          rootforge@attackbox:{currentDir}$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. nmap 10.10.142.87 or help..."
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs placeholder:text-slate-600 focus:ring-0"
          autoFocus
        />
        <button
          onClick={() => handleRunCommand(inputVal)}
          className="p-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-30"
          disabled={!inputVal.trim()}
          aria-label="Execute command"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
};
