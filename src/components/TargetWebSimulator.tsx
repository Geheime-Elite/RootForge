import React, { useState } from 'react';
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Terminal,
  Server,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { TargetMachine } from '../types/cyber';

interface TargetWebSimulatorProps {
  targetMachine: TargetMachine;
}

export const TargetWebSimulator: React.FC<TargetWebSimulatorProps> = ({ targetMachine }) => {
  const [currentPath, setCurrentPath] = useState(targetMachine.webApp?.path || '/');
  const [copiedTutorialFlag, setCopiedTutorialFlag] = useState(false);
  
  // SQLi state
  const [sqliUser, setSqliUser] = useState('');
  const [sqliPass, setSqliPass] = useState('');
  const [sqliResult, setSqliResult] = useState<{ success: boolean; message: string; flag?: string } | null>(null);

  // LFI state
  const [lfiParam, setLfiParam] = useState('system.log');
  const [lfiContent, setLfiContent] = useState<string | null>(null);

  // Command injection state
  const [cmdiHost, setCmdiHost] = useState('127.0.0.1');
  const [cmdiOutput, setCmdiOutput] = useState<string | null>(null);

  const handleSqliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = sqliUser.trim();
    // Test for common SQL injection bypasses
    const isBypass =
      cleanUser.includes("' OR 1=1") ||
      cleanUser.includes("' or 1=1") ||
      cleanUser.includes("' or '1'='1") ||
      cleanUser.includes("admin' --") ||
      cleanUser.includes("admin' #");

    if (isBypass) {
      setSqliResult({
        success: true,
        message: 'SQL Injection successful! Query evaluated to TRUE. Authenticated as System Administrator.',
        flag: 'THM{unrestricted_sql_bypass_2026}',
      });
    } else if (cleanUser === 'admin' && sqliPass === 'supersecret') {
      setSqliResult({
        success: true,
        message: 'Authenticated via valid credentials.',
        flag: 'THM{unrestricted_sql_bypass_2026}',
      });
    } else {
      setSqliResult({
        success: false,
        message: 'Invalid credentials. Database query returned 0 rows: SELECT * FROM users WHERE user=\'' + cleanUser + '\'',
      });
    }
  };

  const handleLfiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanParam = lfiParam.trim();
    if (cleanParam.includes('root.txt') || cleanParam.includes('flag')) {
      setLfiContent(
        '=== [DUMP OF /root/root.txt] ===\nFLAG: THM{suid_root_pwned_zero_limits}\nOWNER: root (uid 0)\nPERMISSIONS: -rw-------'
      );
    } else if (cleanParam.includes('passwd')) {
      setLfiContent(
        'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\ntux:x:1000:1000:Tux Admin:/home/tux:/bin/bash'
      );
    } else if (cleanParam.includes('shadow')) {
      setLfiContent(
        'root:$6$vX8bL0mZ$p8dD...:19240:0:99999:7:::\ntux:$6$kL9xY2a$Wv7Z...:19240:0:99999:7:::'
      );
    } else {
      setLfiContent(
        `=== [LOG VIEWER: ${cleanParam}] ===\n[2026-10-27 08:14:02] Kernel initializing\n[2026-10-27 08:14:03] Service auditd started\n[2026-10-27 08:14:04] Warning: SUID permission misconfigured on /usr/bin/find`
      );
    }
  };

  const handleCmdiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cmdiHost.trim();
    if (clean.includes('cat flag.txt') || clean.includes('cat /flag.txt') || clean.includes('flag')) {
      setCmdiOutput(
        `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.038 ms\n\n--- 127.0.0.1 ping statistics ---\n1 packets transmitted, 1 received, 0% packet loss\n\n[EXECUTING INJECTED COMMAND: cat flag.txt]\nTHM{rce_pipe_command_executed_freely}`
      );
    } else if (clean.includes('whoami')) {
      setCmdiOutput(
        `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.040 ms\n\n[COMMAND INJECTION DETECTED]\nwww-data`
      );
    } else if (clean.includes(';') || clean.includes('&&') || clean.includes('|')) {
      setCmdiOutput(
        `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.032 ms\n\n[COMMAND INJECTION SUCCESSFUL]\nuid=33(www-data) gid=33(www-data) groups=33(www-data)`
      );
    } else {
      setCmdiOutput(
        `PING ${clean} (${clean}) 56(84) bytes of data.\n64 bytes from ${clean}: icmp_seq=1 ttl=64 time=0.045 ms\n\n--- ${clean} ping statistics ---\n1 packets transmitted, 1 received, 0% packet loss`
      );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Browser Chrome Header */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
          </div>
          <button className="text-slate-400 hover:text-white p-1" aria-label="Go back">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="text-slate-400 hover:text-white p-1" aria-label="Go forward">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="text-slate-400 hover:text-white p-1" aria-label="Refresh">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-xl bg-slate-900 border border-slate-750 px-3 py-1 rounded text-xs font-mono text-slate-300 flex items-center gap-2">
          <Lock className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="text-slate-500">http://</span>
          <span className="text-white">{targetMachine.ip}</span>
          <span className="text-emerald-400">{currentPath}</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Server className="w-3.5 h-3.5 text-cyan-400" />
          <span>{targetMachine.hostname}</span>
        </div>
      </div>

      {/* Browser Viewport */}
      <div className="p-6 bg-slate-950 min-h-[380px]">
        {/* SQL Injection Target App */}
        {targetMachine.webApp?.type === 'sqli' && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-semibold text-white text-base">VaultSec Portal Login</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Vulnerable authentication endpoint. Exploitable via standard SQL injection payloads.
            </p>

            <form onSubmit={handleSqliSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  value={sqliUser}
                  onChange={(e) => setSqliUser(e.target.value)}
                  placeholder="admin or ' OR 1=1 --"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={sqliPass}
                  onChange={(e) => setSqliPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
                >
                  Authenticate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSqliUser("' OR 1=1 --");
                    setSqliPass("anything");
                  }}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-mono rounded-lg transition-colors whitespace-nowrap border border-slate-700"
                >
                  Paste SQLi Payload
                </button>
              </div>
            </form>

            {sqliResult && (
              <div
                className={`mt-4 p-3 rounded-lg text-xs border ${
                  sqliResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                <p className="font-semibold">{sqliResult.message}</p>
                {sqliResult.flag && (
                  <div className="mt-2 pt-2 border-t border-emerald-500/20">
                    <span className="text-slate-400 text-[11px]">Server Admin Flag:</span>
                    <div className="font-mono font-bold text-sm text-emerald-400 select-all mt-0.5">
                      {sqliResult.flag}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* LFI Target App */}
        {targetMachine.webApp?.type === 'lfi' && (
          <div className="max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-white text-base mb-1">Tux Internal Log Viewer (LFI Vulnerable)</h3>
            <p className="text-xs text-slate-400 mb-4">
              Endpoint: <code className="text-cyan-400">/diagnostics?file={lfiParam}</code>
            </p>

            <form onSubmit={handleLfiSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={lfiParam}
                onChange={(e) => setLfiParam(e.target.value)}
                placeholder="e.g. ../../../../root/root.txt or /etc/passwd"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition-colors"
              >
                Fetch
              </button>
            </form>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setLfiParam('../../../../root/root.txt')}
                className="text-[11px] font-mono px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-750"
              >
                Load /root/root.txt
              </button>
              <button
                onClick={() => setLfiParam('../../../../etc/passwd')}
                className="text-[11px] font-mono px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-750"
              >
                Load /etc/passwd
              </button>
            </div>

            {lfiContent && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-emerald-300 whitespace-pre-wrap select-all max-h-60 overflow-y-auto">
                {lfiContent}
              </div>
            )}
          </div>
        )}

        {/* Command Injection Target App */}
        {targetMachine.webApp?.type === 'command_injection' && (
          <div className="max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-white text-base mb-1">NetPing Network Utility</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter target host to send ping requests. Uses system shell call without sanitation.
            </p>

            <form onSubmit={handleCmdiSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={cmdiHost}
                onChange={(e) => setCmdiHost(e.target.value)}
                placeholder="127.0.0.1; cat flag.txt"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
              >
                Ping Host
              </button>
            </form>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setCmdiHost('127.0.0.1; cat flag.txt')}
                className="text-[11px] font-mono px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-750"
              >
                Payload: 127.0.0.1; cat flag.txt
              </button>
            </div>

            {cmdiOutput && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-amber-300 whitespace-pre-wrap select-all">
                {cmdiOutput}
              </div>
            )}
          </div>
        )}

        {/* Tutorial Bootcamp Portal */}
        {targetMachine.webApp?.type === 'tutorial_portal' && (
          <div className="max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Ziel-Webseite (10.10.100.1)</h3>
            </div>
            
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-emerald-400 block mb-1">
                🎉 Super gemacht! Du bist auf der Webseite der Ziel-Maschine.
              </span>
              In echten CTF-Rätseln untersuchst du Webseiten nach geheimen Passwörtern oder Codes. 
              Hier haben wir dir deine allererste Flagge direkt bereitgestellt:
            </div>

            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Deine erste Willkommens-Flagge:</span>
                <span className="text-emerald-400 font-bold font-mono text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  BEREIT ZUM KOPIEREN
                </span>
              </div>
              
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-sm text-emerald-400 font-bold flex items-center justify-between gap-2">
                <span className="truncate">THM&#123;welcome_to_unrestricted_rootforge&#125;</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('THM{welcome_to_unrestricted_rootforge}');
                    setCopiedTutorialFlag(true);
                    setTimeout(() => setCopiedTutorialFlag(false), 3000);
                  }}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copiedTutorialFlag ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Kopiert!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Flagge kopieren</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[12px] text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                👉 <strong>Nächster Schritt:</strong> Wechsle oben auf den Reiter 
                <span className="text-emerald-400 font-semibold"> „Aufgaben & Fragen“</span>, 
                füge diesen Code bei <strong>Aufgabe 3</strong> ein und klicke auf <strong>Absenden</strong>!
              </div>
            </div>
          </div>
        )}

        {/* Recon / Default Portal */}
        {(!targetMachine.webApp || targetMachine.webApp.type === 'recon_portal') && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <Globe className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white text-base mb-1">Web Server HTTP/1.1 200 OK</h3>
            <p className="text-xs text-slate-400 mb-4">
              Server header: Apache / nginx on port 80.
            </p>
            <div className="bg-slate-950 p-3 rounded font-mono text-left text-xs text-slate-300 space-y-1">
              <div>User-agent: *</div>
              <div>Disallow: /admin</div>
              <div>Disallow: /backup</div>
              <div className="text-emerald-400 font-bold"># THM&#123;robots_file_enumeration_success&#125;</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
