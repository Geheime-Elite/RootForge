import React from 'react';
import { X, Sparkles, BookOpen, Terminal, Globe, Key, ShieldCheck, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Room } from '../types/cyber';

interface BeginnerGuideModalProps {
  onClose: () => void;
  onStartTutorial: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({
  onClose,
  onStartTutorial,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Cybersecurity für absolute Anfänger</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold uppercase">
                  Schritt-für-Schritt
                </span>
              </h2>
              <p className="text-xs text-slate-400">Keine Vorkenntnisse erforderlich – in 2 Minuten verstanden</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-200 text-xs sm:text-sm">
          {/* Welcome Metaphor Box */}
          <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>Was machen wir hier eigentlich?</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              Du bist hier ein <strong>digitaler Detektiv</strong> (ein sogenannter „White-Hat-Hacker“). 
              Deine Aufgabe ist es, zu lernen wie Computersysteme und Internetseiten aufgebaut sind und 
              wie man Fehler darin findet, um die Welt vor echten Cyberkriminellen zu schützen.
              Alles geschieht in einer <strong>vollkommen sicheren, legalen Spielwiese</strong>.
            </p>
          </div>

          {/* The 4 core concepts explained simply */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Die 4 wichtigsten Begriffe – Einfach mit Alltags-Beispielen:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Target Machine */}
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                    🖥️
                  </div>
                  <span>Ziel-Maschine (Target)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong>Wie ein Übungshaus:</strong> Ein virtueller Computer, der dir gehört. Klicke einfach auf 
                  <span className="text-emerald-400 font-medium"> „Ziel-Maschine starten“</span>, und er wird gestartet.
                </p>
              </div>

              {/* 2. IP Address */}
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                    📍
                  </div>
                  <span>IP-Adresse</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong>Wie eine Hausnummer oder Telefonnummer:</strong> Zum Beispiel <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">10.10.100.1</code>. 
                  Damit weiß dein Computer, mit welchem Zielrechner du sprichst.
                </p>
              </div>

              {/* 3. AttackBox & Terminal */}
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                    💻
                  </div>
                  <span>AttackBox / Terminal</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong>Dein Werkzeugkasten:</strong> Ein Fenster, in das du kurze Textbefehle tippst 
                  (oder einfach per Klick auf die Buttons ausführen lässt).
                </p>
              </div>

              {/* 4. Flag (Flagge) */}
              <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">
                    🚩
                  </div>
                  <span>Flagge (CTF-Flag)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong>Das Lösungswort / Der Schatz:</strong> Ein geheimer Code wie <code className="text-purple-300 bg-slate-950 px-1 py-0.5 rounded">THM&#123;...&#125;</code>. 
                  Wenn du ihn findest und unten eintippst, ist die Aufgabe gelöst!
                </p>
              </div>
            </div>
          </div>

          {/* 3 Step Tutorial */}
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>In 3 Schritten ein Lab lösen:</span>
            </h4>
            <ol className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                <div>
                  <strong>Raum öffnen & Maschine starten:</strong> Klicke auf den grünen Button <span className="text-emerald-400 font-medium">„Deploy Free Machine“</span>. Die Maschine wird in 1 Sekunde online geschaltet.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                <div>
                  <strong>Hinweise & Aufgaben lesen:</strong> Jede Aufgabe erklärt dir genau, was du tun musst. Du kannst auch den Reiter <span className="text-cyan-400 font-medium">„Target Web Browser“</span> öffnen, um die simulierte Internetseite zu sehen.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                <div>
                  <strong>Code oder Antwort eintragen:</strong> Wenn du die Lösung hast, gibst du sie in das Textfeld ein und klickst auf <span className="text-emerald-400 font-medium">„Absenden“</span>. Du erhältst sofort Punkte und steigst im Level auf!
                </div>
              </li>
            </ol>
          </div>

          {/* KI-Mentor Help Promise */}
          <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-300">
              <strong className="text-white block">Kommst du mal nicht weiter?</strong>
              Klicke einfach auf den blauen Button <span className="text-cyan-400 font-semibold">„KI-Mentor fragen“</span>. Unsere eingebaute KI erklärt dir jeden Schritt ohne Fachchinesisch!
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/70 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Verstanden, schließen
          </button>

          <button
            onClick={() => {
              onStartTutorial();
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/10"
          >
            <span>Jetzt das Anfänger-Tutorial starten</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
