import React, { useState } from 'react';
import { Plus, Trash2, Download, Upload, Shield, Check } from 'lucide-react';
import { Room, Difficulty, RoomCategory } from '../types/cyber';

interface CustomRoomCreatorProps {
  onSaveRoom: (newRoom: Room) => void;
  onImportRooms: (imported: Room[]) => void;
}

export const CustomRoomCreator: React.FC<CustomRoomCreatorProps> = ({
  onSaveRoom,
  onImportRooms,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RoomCategory>('Web Exploitation');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [description, setDescription] = useState('');
  const [targetIp, setTargetIp] = useState('10.10.200.50');
  const [targetHost, setTargetHost] = useState('custom-target.thm');

  // Tasks & questions
  const [taskTitle, setTaskTitle] = useState('Task 1: System Exploitation');
  const [taskDesc, setTaskDesc] = useState('Analysiere das System und hole dir die Root-Flag.');
  const [qPrompt, setQPrompt] = useState('Finde die geheime CTF Flag auf dem Server:');
  const [qHint, setQHint] = useState('Überprüfe das Home-Verzeichnis.');
  const [qFlag, setQFlag] = useState('THM{custom_challenge_solved_2026}');
  const [qPoints, setQPoints] = useState(100);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !qFlag.trim()) return;

    const newRoom: Room = {
      id: `custom-room-${Date.now()}`,
      title: title.trim(),
      slug: title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      difficulty,
      estimatedMinutes,
      totalXp: qPoints,
      description: description.trim() || 'Benutzerdefinierte CTF-Challenge auf RootForge.',
      image: '/src/assets/images/room_web_security_1793101201512.jpg',
      tags: ['Custom CTF', 'Community', category],
      isVipOnlyInOriginalTHM: false,
      targetMachine: {
        ip: targetIp.trim() || '10.10.200.50',
        hostname: targetHost.trim() || 'custom-target.thm',
        os: 'Linux Ubuntu 22.04 LTS',
        status: 'offline',
        uptimeSeconds: 0,
        openPorts: [
          { port: 80, protocol: 'tcp', service: 'http', version: 'Apache/2.4', state: 'open' },
        ],
        webApp: {
          title: title.trim(),
          type: 'sqli',
          path: '/portal',
        },
      },
      tasks: [
        {
          id: `task-${Date.now()}`,
          title: taskTitle.trim() || 'Task 1: System Exploitation',
          description: taskDesc.trim(),
          questions: [
            {
              id: `q-${Date.now()}`,
              prompt: qPrompt.trim(),
              answerHint: qHint.trim(),
              expectedAnswers: [qFlag.trim()],
              points: qPoints,
            },
          ],
        },
      ],
    };

    onSaveRoom(newRoom);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    // Reset inputs
    setTitle('');
    setDescription('');
  };

  const handleExportJson = () => {
    const sample = {
      exportDate: new Date().toISOString(),
      platform: 'RootForge Unrestricted',
      note: 'Custom CTF Room format',
    };
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rootforge-custom-rooms-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CTF Room Creator</h1>
          <p className="text-sm text-slate-400 mt-1">
            Erstelle eigene Cybersecurity Labs und Challenges mit Flaggen und Hinweisen für dich und Freunde.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export JSON</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">
            Room erfolgreich gespeichert! Du findest ihn jetzt in der Room-Übersicht.
          </span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleCreateRoom} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Room Titel *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Broken Auth & Session Hijacking"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Kategorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Web Exploitation">Web Exploitation</option>
              <option value="Privilege Escalation">Privilege Escalation</option>
              <option value="Network Security">Network Security</option>
              <option value="Cryptography">Cryptography</option>
              <option value="Active Directory">Active Directory</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Schwierigkeit</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Insane">Insane</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Geschätzte Zeit (Min.)</label>
            <input
              type="number"
              min={5}
              max={240}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Belohnung (XP)</label>
            <input
              type="number"
              min={10}
              max={1000}
              value={qPoints}
              onChange={(e) => setQPoints(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Beschreibung</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibe das Angriffsszenario und Lernziel..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Machine Config */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Virtuelle Target-Maschine</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Ziel-IP Adresse</label>
              <input
                type="text"
                value={targetIp}
                onChange={(e) => setTargetIp(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Hostname</label>
              <input
                type="text"
                value={targetHost}
                onChange={(e) => setTargetHost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Task & Flag Config */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Aufgabe & CTF-Flag</h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Frage / Anweisung</label>
            <input
              type="text"
              value={qPrompt}
              onChange={(e) => setQPrompt(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Lösungsflagge * (z.B. THM&#123;...&#125;)
              </label>
              <input
                type="text"
                required
                value={qFlag}
                onChange={(e) => setQFlag(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Kostenloser Hinweis</label>
              <input
                type="text"
                value={qHint}
                onChange={(e) => setQHint(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-750 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/10"
        >
          Room speichern & in RootForge freischalten
        </button>
      </form>
    </div>
  );
};
