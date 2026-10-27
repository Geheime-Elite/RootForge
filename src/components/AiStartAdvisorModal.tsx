import React, { useState } from 'react';
import { Sparkles, X, Compass, ArrowRight, Bot, ShieldCheck, Check } from 'lucide-react';
import { Room } from '../types/cyber';

interface AiStartAdvisorModalProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  onClose: () => void;
}

export const AiStartAdvisorModal: React.FC<AiStartAdvisorModalProps> = ({
  rooms,
  onSelectRoom,
  onClose,
}) => {
  const [experience, setExperience] = useState('🔰 Absoluter Anfänger (Noch nie gehackt, keine Vorkenntnisse)');
  const [interest, setInterest] = useState('🟢 Die Grundlagen Klick für Klick im Tutorial lernen');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    recommendedRoomId: string;
    recommendedRoomTitle: string;
    mentorMessage: string;
    firstStepTip?: string;
  } | null>(null);

  const handleGetRecommendation = async () => {
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          experienceLevel: experience,
          interestArea: interest,
          goals: 'Effektiver Einstieg in praxisnahes Penetration Testing ohne Abo-Grenzen',
        }),
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        setRecommendation(data);
      } else {
        throw new Error('API error');
      }
    } catch {
      clearTimeout(timer);
      // Robust client fallback tailored to absolute beginners
      let recId = 'tutorial-bootcamp';
      let recTitle = 'Tutorial: Erste Schritte für absolute Anfänger (Kostenlos)';
      if (interest.includes('Web')) {
        recId = 'room-sqli';
        recTitle = 'SQL Injection: Auth Bypass & Data Extraction';
      } else if (interest.includes('Linux')) {
        recId = 'room-privesc';
        recTitle = 'Linux Privilege Escalation: SUID & Root Access';
      } else if (interest.includes('Netzwerk')) {
        recId = 'room-network';
        recTitle = 'Network Reconnaissance: Nmap & Service Auditing';
      }

      setRecommendation({
        recommendedRoomId: recId,
        recommendedRoomTitle: recTitle,
        mentorMessage: `Willkommen bei RootForge! Als Einsteiger ist der Raum "${recTitle}" der perfekte Startpunkt. Du brauchst keinerlei Vorkenntnisse: Alles wird in 3 einfachen Schritten mit Bildschirmen und Tipps erklärt.`,
        firstStepTip: 'Klicke einfach auf "Diesen Room jetzt öffnen" und starte mit Aufgabe 1!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchRecommended = () => {
    if (!recommendation) return;
    const target = rooms.find((r) => r.id === recommendation.recommendedRoomId) || rooms[0];
    onSelectRoom(target);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>RootAdvisor</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                  KI-STARTBERATER
                </span>
              </h2>
              <p className="text-xs text-slate-400">Finde den perfekten Raum für deinen Skill-Level</p>
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

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!recommendation ? (
            <div className="space-y-5">
              <p className="text-xs text-slate-300 leading-relaxed">
                Beantworte zwei kurze Fragen. Unsere KI analysiert dein Vorwissen und empfiehlt dir den
                optimalen Startpunkt auf RootForge:
              </p>

              {/* Question 1: Experience */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-200">
                  1. Wie viel Vorwissen bringst du mit?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    '🔰 Absoluter Anfänger (Noch nie gehackt, keine Vorkenntnisse)',
                    'Grundkenntnisse (Ein bisschen Linux oder Web)',
                    'Fortgeschritten (Bereits Erfahrung mit CTFs)',
                  ].map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setExperience(exp)}
                      className={`p-2.5 rounded-xl border text-left transition-colors font-medium ${
                        experience === exp
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Interest */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-200">
                  2. Welches Thema interessiert dich am meisten?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    '🟢 Die Grundlagen Klick für Klick im Tutorial lernen',
                    '🌐 Webseiten & wie man sich einloggt',
                    '🐧 Linux-Systeme & Dateien erkunden',
                    '📡 Netzwerke & offene Computer aufspüren',
                  ].map((inte) => (
                    <button
                      key={inte}
                      type="button"
                      onClick={() => setInterest(inte)}
                      className={`p-2.5 rounded-xl border text-left transition-colors font-medium ${
                        interest === inte
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {inte}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const tut = rooms.find((r) => r.id === 'tutorial-bootcamp') || rooms[0];
                    onSelectRoom(tut);
                    onClose();
                  }}
                  className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Direkt zum Anfänger-Tutorial →
                </button>

                <button
                  type="button"
                  onClick={handleGetRecommendation}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/10"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{loading ? 'KI analysiert dein Profil...' : 'KI-Empfehlung anfordern'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Recommendation Result View */
            <div className="space-y-5">
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                  <Compass className="w-4 h-4" />
                  <span>EMPFOHLENER STARTPUNKT</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {recommendation.recommendedRoomTitle}
                </h3>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <Bot className="w-4 h-4" />
                  <span>RootAdvisor Einschätzung:</span>
                </div>
                <p>{recommendation.mentorMessage}</p>

                {recommendation.firstStepTip && (
                  <div className="mt-3 pt-3 border-t border-slate-800 text-slate-400">
                    <span className="font-semibold text-cyan-400">Tipp für den ersten Schritt: </span>
                    <span>{recommendation.firstStepTip}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setRecommendation(null)}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  ← Neu befragen
                </button>

                <button
                  type="button"
                  onClick={handleLaunchRecommended}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/10"
                >
                  <span>Diesen Room jetzt öffnen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
