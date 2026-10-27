/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Terminal,
  Shield,
  LockOpen,
  ArrowRight,
  Bot,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Room, TargetMachine, GoogleUser } from './types/cyber';
import { INITIAL_ROOMS, LEARNING_PATHS } from './data/mockRooms';
import { filterRooms, calculateLevelAndRank } from './utils/cyberRules';
import { Navbar } from './components/Navbar';
import { RoomCard } from './components/RoomCard';
import { RoomDetailModal } from './components/RoomDetailModal';
import { AttackBoxTerminal } from './components/AttackBoxTerminal';
import { LearningPathsView } from './components/LearningPathsView';
import { ToolbeltView } from './components/ToolbeltView';
import { CustomRoomCreator } from './components/CustomRoomCreator';
import { ProfileView } from './components/ProfileView';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { AiStartAdvisorModal } from './components/AiStartAdvisorModal';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'rooms' | 'paths' | 'toolbelt' | 'custom' | 'profile'>('rooms');
  const [isBeginnerGuideOpen, setIsBeginnerGuideOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem('rootforge_rooms');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...INITIAL_ROOMS, ...parsed];
      }
    } catch {}
    return INITIAL_ROOMS;
  });

  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [activeMachineRoomId, setActiveMachineRoomId] = useState<string | null>(null);
  const [deployedMachines, setDeployedMachines] = useState<Record<string, TargetMachine>>({});

  const [isAttackBoxOpen, setIsAttackBoxOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // Google User State
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem('rootforge_google_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User Stats & State
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('rootforge_xp');
      return saved ? Number(saved) : 120;
    } catch {
      return 120;
    }
  });

  const [streakDays] = useState(7);

  const [solvedQuestions, setSolvedQuestions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('rootforge_solved');
      return saved ? JSON.parse(saved) : { 'q-net-1': true };
    } catch {
      return { 'q-net-1': true };
    }
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [onlyCompleted, setOnlyCompleted] = useState(false);

  // Save states to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rootforge_xp', String(xp));
    } catch {}
  }, [xp]);

  useEffect(() => {
    try {
      localStorage.setItem('rootforge_solved', JSON.stringify(solvedQuestions));
    } catch {}
  }, [solvedQuestions]);

  useEffect(() => {
    try {
      if (googleUser) {
        localStorage.setItem('rootforge_google_user', JSON.stringify(googleUser));
      } else {
        localStorage.removeItem('rootforge_google_user');
      }
    } catch {}
  }, [googleUser]);

  // Target Machine management
  const handleDeployMachine = (roomId: string) => {
    const targetRoom = rooms.find((r) => r.id === roomId);
    if (!targetRoom) return;

    const newMachineState: TargetMachine = {
      ...targetRoom.targetMachine,
      status: 'online',
      uptimeSeconds: 1,
    };

    setDeployedMachines((prev) => ({
      ...prev,
      [roomId]: newMachineState,
    }));
    setActiveMachineRoomId(roomId);
  };

  const handleTerminateMachine = (roomId: string) => {
    setDeployedMachines((prev) => {
      const copy = { ...prev };
      delete copy[roomId];
      return copy;
    });
    if (activeMachineRoomId === roomId) {
      setActiveMachineRoomId(null);
    }
  };

  const handleResetMachine = (roomId: string) => {
    handleDeployMachine(roomId);
  };

  const handleSolveQuestion = (questionId: string, points: number) => {
    if (!solvedQuestions[questionId]) {
      setSolvedQuestions((prev) => ({ ...prev, [questionId]: true }));
      setXp((prev) => prev + points);
    }
  };

  const handleSaveCustomRoom = (newRoom: Room) => {
    setRooms((prev) => [newRoom, ...prev]);
    try {
      const savedCustom = JSON.parse(localStorage.getItem('rootforge_rooms') || '[]');
      localStorage.setItem('rootforge_rooms', JSON.stringify([newRoom, ...savedCustom]));
    } catch {}
  };

  const handleImportRooms = (imported: Room[]) => {
    setRooms((prev) => [...imported, ...prev]);
  };

  const handleResetProgress = () => {
    if (window.confirm('Möchtest du deinen Fortschritt und alle gelösten Flags wirklich zurücksetzen?')) {
      setSolvedQuestions({});
      setXp(0);
      localStorage.removeItem('rootforge_solved');
      localStorage.removeItem('rootforge_xp');
    }
  };

  const { level } = calculateLevelAndRank(xp);
  const filteredRooms = filterRooms(
    rooms,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    onlyCompleted,
    solvedQuestions
  );

  // Active target machine for the active room or terminal
  const currentActiveMachine = activeMachineRoomId ? deployedMachines[activeMachineRoomId] || null : null;
  const currentRoomMachine: TargetMachine = activeRoom
    ? deployedMachines[activeRoom.id] || { ...activeRoom.targetMachine, status: 'offline' }
    : {
        ip: '10.10.10.10',
        hostname: 'offline.thm',
        os: 'Linux Ubuntu 22.04 LTS',
        status: 'offline',
        uptimeSeconds: 0,
        openPorts: [],
      };

  const categories = [
    'All',
    'Web Exploitation',
    'Privilege Escalation',
    'Network Security',
    'Cryptography',
    'Active Directory',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Navbar with 3-Zone Contract */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isAttackBoxOpen={isAttackBoxOpen}
        onToggleAttackBox={() => setIsAttackBoxOpen(!isAttackBoxOpen)}
        userXp={xp}
        userLevel={level}
        googleUser={googleUser}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        onOpenBeginnerGuide={() => setIsBeginnerGuideOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* ROOMS & LABS VIEW */}
        {currentTab === 'rooms' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <LockOpen className="w-4 h-4" />
                  <span>100% UNRESTRICTED CYBER RANGE</span>
                  <span>·</span>
                  <span>TRYHACKME OHNE ABO</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Cybersecurity lernen.<br />
                  <span className="text-emerald-400">Ohne Abo-Limits. Mit KI-Mentor & Google Login.</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Greife auf alle Pentesting Rooms, das Anfänger-Tutorial und die integrierte
                  virtuelle AttackBox zu – inklusive intelligenter KI-Hilfe, die dir alles Schritt für Schritt erklärt.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* Tutorial Room direct CTA */}
                  <button
                    onClick={() => {
                      const tutorialRoom = rooms.find((r) => r.id === 'tutorial-bootcamp') || rooms[0];
                      setActiveRoom(tutorialRoom);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-lg shadow-emerald-500/10"
                  >
                    <span>👉 Anfänger-Tutorial starten</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Beginner Guide CTA */}
                  <button
                    onClick={() => setIsBeginnerGuideOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
                  >
                    <span>🔰</span>
                    <span>Anfänger-Erklärung (In 2 Min)</span>
                  </button>

                  {/* AI Recommendation CTA */}
                  <button
                    onClick={() => setIsAiAdvisorOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-medium text-xs sm:text-sm rounded-xl transition-colors"
                  >
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span>KI-Startempfehlung</span>
                  </button>
                </div>
              </div>

              {/* Decorative Subtle Background Overlay */}
              <div className="absolute top-0 right-0 w-full sm:w-1/2 h-full opacity-20 pointer-events-none overflow-hidden">
                <img
                  src="/src/assets/images/hero_cyber_range_1793101202349.jpg"
                  alt="Cyber Range Matrix"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Beginner Quick-Help Banner */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
                  🔰
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Neu hier? Keine Vorkenntnisse nötig!</span>
                    <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/30 font-semibold">
                      100% EINSTEIGERFREUNDLICH
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Du musst weder programmieren können noch Befehle auswendig lernen. Schau in unseren 2-Minuten-Guide 
                    oder starte direkt das Klick-für-Klick Tutorial. Unser KI-Mentor hilft dir bei jeder Frage!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setIsBeginnerGuideOpen(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold transition-colors flex-1 sm:flex-none text-center"
                >
                  Begriffe erklärt
                </button>
                <button
                  onClick={() => {
                    const tutorialRoom = rooms.find((r) => r.id === 'tutorial-bootcamp') || rooms[0];
                    setActiveRoom(tutorialRoom);
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex-1 sm:flex-none text-center shadow-md shadow-emerald-500/10"
                >
                  Tutorial starten →
                </button>
              </div>
            </div>

            {/* Active Machine Status Strip (if any deployed) */}
            {activeMachineRoomId && currentActiveMachine && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <div>
                    <span className="text-xs text-slate-400 font-mono block">Aktive Target-Maschine bereit:</span>
                    <span className="text-sm font-bold text-white font-mono">
                      {currentActiveMachine.ip} ({currentActiveMachine.hostname})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const r = rooms.find((x) => x.id === activeMachineRoomId);
                      if (r) setActiveRoom(r);
                    }}
                    className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-semibold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
                  >
                    Zum aktiven Lab
                  </button>
                  <button
                    onClick={() => setIsAttackBoxOpen(true)}
                    className="px-3 py-1.5 bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs rounded-lg hover:bg-slate-750 transition-colors"
                  >
                    AttackBox öffnen
                  </button>
                </div>
              </div>
            )}

            {/* Search & Filter Controls */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rooms durchsuchen (z.B. Tutorial, SQLi, PrivEsc, Nmap, RCE)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Difficulty & Completed Toggles */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">Alle Schwierigkeiten</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <button
                    onClick={() => setOnlyCompleted(!onlyCompleted)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap ${
                      onlyCompleted
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {onlyCompleted ? '✓ Nur Gelöste' : 'Alle Rooms'}
                  </button>
                </div>
              </div>

              {/* Category Segmented Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                      selectedCategory === cat
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Cards Grid */}
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    solvedQuestions={solvedQuestions}
                    onSelect={() => setActiveRoom(room)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
                <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white mb-1">Keine Rooms gefunden</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Für deine aktuellen Filterkriterien gibt es keine Treffer.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedDifficulty('All');
                    setOnlyCompleted(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors"
                >
                  Filter zurücksetzen
                </button>
              </div>
            )}
          </div>
        )}

        {/* LEARNING PATHS VIEW */}
        {currentTab === 'paths' && (
          <LearningPathsView
            paths={LEARNING_PATHS}
            rooms={rooms}
            solvedQuestions={solvedQuestions}
            onSelectRoom={(r) => {
              setActiveRoom(r);
              setCurrentTab('rooms');
            }}
          />
        )}

        {/* HACKER TOOLBELT VIEW */}
        {currentTab === 'toolbelt' && <ToolbeltView />}

        {/* CTF CREATOR VIEW */}
        {currentTab === 'custom' && (
          <CustomRoomCreator
            onSaveRoom={(newRoom) => {
              handleSaveCustomRoom(newRoom);
              setActiveRoom(newRoom);
              setCurrentTab('rooms');
            }}
            onImportRooms={handleImportRooms}
          />
        )}

        {/* USER PROFILE VIEW */}
        {currentTab === 'profile' && (
          <ProfileView
            xp={xp}
            streakDays={streakDays}
            solvedCount={Object.keys(solvedQuestions).length}
            completedRoomsCount={
              rooms.filter((r) => {
                const totalQ = r.tasks.reduce((sum, t) => sum + t.questions.length, 0);
                const solvedQ = r.tasks.reduce(
                  (sum, t) => sum + t.questions.filter((q) => solvedQuestions[q.id]).length,
                  0
                );
                return totalQ > 0 && totalQ === solvedQ;
              }).length
            }
            onResetProgress={handleResetProgress}
            googleUser={googleUser}
            onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
          />
        )}
      </main>

      {/* Floating / Docked AttackBox Terminal */}
      {isAttackBoxOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-2xl px-4 sm:px-0">
          <AttackBoxTerminal
            targetMachine={currentActiveMachine}
            onClose={() => setIsAttackBoxOpen(false)}
            isFloating={true}
          />
        </div>
      )}

      {/* Active Room Detail Modal */}
      {activeRoom && (
        <RoomDetailModal
          room={activeRoom}
          targetMachine={currentRoomMachine}
          onDeployMachine={handleDeployMachine}
          onTerminateMachine={() => handleTerminateMachine(activeRoom.id)}
          onResetMachine={() => handleResetMachine(activeRoom.id)}
          solvedQuestions={solvedQuestions}
          onSolveQuestion={handleSolveQuestion}
          onClose={() => setActiveRoom(null)}
          onOpenAttackBox={() => setIsAttackBoxOpen(true)}
        />
      )}

      {/* AI Start Advisor Modal */}
      {isAiAdvisorOpen && (
        <AiStartAdvisorModal
          rooms={rooms}
          onSelectRoom={(room) => {
            setActiveRoom(room);
            setCurrentTab('rooms');
          }}
          onClose={() => setIsAiAdvisorOpen(false)}
        />
      )}

      {/* Google Sign-In Authentication Modal */}
      {isGoogleAuthOpen && (
        <GoogleAuthModal
          currentUser={googleUser}
          onLogin={(user) => setGoogleUser(user)}
          onLogout={() => setGoogleUser(null)}
          onClose={() => setIsGoogleAuthOpen(false)}
        />
      )}

      {/* Beginner Guide Modal */}
      {isBeginnerGuideOpen && (
        <BeginnerGuideModal
          onClose={() => setIsBeginnerGuideOpen(false)}
          onStartTutorial={() => {
            const tutorialRoom = rooms.find((r) => r.id === 'tutorial-bootcamp') || rooms[0];
            setActiveRoom(tutorialRoom);
            setCurrentTab('rooms');
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          RootForge Unrestricted · 100% Free Cybersecurity Training Labs · Powered by RootAdvisor KI · Keine Abos.
        </p>
      </footer>
    </div>
  );
}
