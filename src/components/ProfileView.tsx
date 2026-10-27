import React from 'react';
import { Award, ShieldCheck, Flame, Terminal, CheckCircle2, RotateCcw, Sparkles, LogIn, Check } from 'lucide-react';
import { calculateLevelAndRank } from '../utils/cyberRules';
import { GoogleUser } from '../types/cyber';

interface ProfileViewProps {
  xp: number;
  streakDays: number;
  solvedCount: number;
  completedRoomsCount: number;
  onResetProgress: () => void;
  googleUser: GoogleUser | null;
  onOpenGoogleAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  xp,
  streakDays,
  solvedCount,
  completedRoomsCount,
  onResetProgress,
  googleUser,
  onOpenGoogleAuth,
}) => {
  const { level, rankTitle, progressPercent, xpForNextLevel } = calculateLevelAndRank(xp);

  const certifications = [
    {
      title: 'Junior Penetration Tester',
      status: completedRoomsCount >= 3 ? 'Verifiziert' : 'In Bearbeitung',
      unlocked: completedRoomsCount >= 3,
      date: completedRoomsCount >= 3 ? '2026-10-27' : '—',
    },
    {
      title: 'Web Application Security Specialist',
      status: solvedCount >= 4 ? 'Verifiziert' : 'In Bearbeitung',
      unlocked: solvedCount >= 4,
      date: solvedCount >= 4 ? '2026-10-27' : '—',
    },
    {
      title: 'Linux Privilege Escalation Master',
      status: xp >= 400 ? 'Verifiziert' : 'In Bearbeitung',
      unlocked: xp >= 400,
      date: xp >= 400 ? '2026-10-27' : '—',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shrink-0 shadow-lg">
          <img
            src={googleUser?.avatarUrl || '/src/assets/images/avatar_hacker_agent_1793101204088.jpg'}
            alt="Operative Avatar"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl font-bold text-white">
              {googleUser ? googleUser.name : 'Operative_0xRoot'}
            </h1>
            <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded self-center sm:self-auto">
              {rankTitle} (Level {level})
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {googleUser ? (
              <span className="flex items-center justify-center sm:justify-start gap-1 text-emerald-300">
                <Check className="w-3.5 h-3.5" />
                <span>Google-Konto verknüpft: {googleUser.email}</span>
              </span>
            ) : (
              <span>Gast-Modus (Lokal im Browser) · Keine Abonnements nötig</span>
            )}
          </p>

          {/* Level Progress */}
          <div className="space-y-1 pt-1 max-w-md">
            <div className="flex justify-between text-xs font-mono tabular-nums">
              <span className="text-slate-400">Level {level} Progress:</span>
              <span className="text-emerald-400 font-semibold">
                {xp} / {xpForNextLevel} XP ({progressPercent}%)
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Google Status & Plan Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center sm:text-right shrink-0 space-y-2">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-mono block">Tarif-Status</span>
            <span className="text-sm font-bold text-emerald-400 block mt-0.5">100% Unrestricted</span>
          </div>

          {googleUser ? (
            <button
              onClick={onOpenGoogleAuth}
              className="text-xs text-slate-300 hover:text-white underline block"
            >
              Google-Konto verwalten
            </button>
          ) : (
            <button
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-900 font-semibold text-xs rounded-lg hover:bg-slate-100 transition-colors mx-auto sm:ml-auto"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Mit Google verbinden</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gesamte XP</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{xp}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Tages-Streak</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{streakDays} Tage</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Gelöste Fragen</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{solvedCount}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Abgeschlossene Rooms</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{completedRoomsCount}</div>
        </div>
      </div>

      {/* Unlocked Certifications */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Zertifikate & Qualifikationen</span>
        </h2>

        <div className="space-y-3">
          {certifications.map((cert) => (
            <div
              key={cert.title}
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                cert.unlocked
                  ? 'bg-slate-950 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className={`w-5 h-5 ${cert.unlocked ? 'text-emerald-400' : 'text-slate-600'}`}
                />
                <div>
                  <h3 className="text-sm font-semibold text-white">{cert.title}</h3>
                  <p className="text-xs text-slate-400">
                    Status: {cert.status} · Ausstellungsdatum: {cert.date}
                  </p>
                </div>
              </div>

              {cert.unlocked ? (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-500/30">
                  GÜLTIG & VERIFIZIERT
                </span>
              ) : (
                <span className="text-xs font-mono text-slate-600">Gesperrt</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data Management Footer */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onResetProgress}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Fortschritt & Flags zurücksetzen</span>
        </button>
      </div>
    </div>
  );
};
