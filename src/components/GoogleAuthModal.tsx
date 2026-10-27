import React, { useState } from 'react';
import { X, Check, Shield, User, LogOut, ArrowRight } from 'lucide-react';
import { GoogleUser } from '../types/cyber';

interface GoogleAuthModalProps {
  currentUser: GoogleUser | null;
  onLogin: (user: GoogleUser) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onClose,
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomFields, setShowCustomFields] = useState(false);

  const defaultUser: GoogleUser = {
    id: 'google-user-default',
    name: 'Piras Perry',
    email: 'pirasperrypi@gmail.com',
    avatarUrl: '/src/assets/images/avatar_hacker_agent_1793101204088.jpg',
    locale: 'de',
    signedInAt: new Date().toISOString(),
  };

  const handleDefaultSignIn = () => {
    onLogin(defaultUser);
    onClose();
  };

  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    const user: GoogleUser = {
      id: `google-user-${Date.now()}`,
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim(),
      avatarUrl: '/src/assets/images/avatar_hacker_agent_1793101204088.jpg',
      locale: 'de',
      signedInAt: new Date().toISOString(),
    };

    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Google Colorful G Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <h2 className="text-sm font-bold text-white tracking-tight">Mit Google anmelden</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {currentUser ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border border-emerald-500/40 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{currentUser.name}</h3>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      GOOGLE LOGIN
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-emerald-400 block mb-1">
                  ✓ Synchronisierung aktiv
                </span>
                Dein Lab-Fortschritt, errungene XP, Zertifikate und Flags sind mit diesem Google-Konto verknüpft.
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/40 rounded-xl transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Abmelden</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-colors"
                >
                  Fertig
                </button>
              </div>
            </div>
          ) : (
            /* Login flow */
            <div className="space-y-5">
              <p className="text-xs text-slate-300 leading-relaxed">
                Melde dich mit deinem Google-Konto an, um deinen Lab-Fortschritt geräteübergreifend zu sichern und Zertifikate freizuschalten.
              </p>

              {/* One-Click Google Account Option */}
              <button
                type="button"
                onClick={handleDefaultSignIn}
                className="w-full p-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-between gap-3 font-medium text-xs shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900">Weiter als {defaultUser.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{defaultUser.email}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Custom email toggle */}
              {!showCustomFields ? (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowCustomFields(true)}
                    className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Mit einer anderen Google-Adresse anmelden?
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomSignIn} className="space-y-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Dein Name"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Google E-Mail *</label>
                    <input
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    Anmelden & synchronisieren
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
