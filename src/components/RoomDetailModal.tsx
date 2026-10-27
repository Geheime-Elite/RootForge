import React, { useState } from 'react';
import {
  X,
  Play,
  Square,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Terminal,
  Globe,
  ChevronDown,
  ChevronUp,
  Bot,
} from 'lucide-react';
import { Room, TargetMachine } from '../types/cyber';
import { verifyFlag, calculateRoomProgress } from '../utils/cyberRules';
import { TargetWebSimulator } from './TargetWebSimulator';
import { AiLabAssistantDrawer } from './AiLabAssistantDrawer';

interface RoomDetailModalProps {
  room: Room;
  targetMachine: TargetMachine;
  onDeployMachine: (roomId: string) => void;
  onTerminateMachine: () => void;
  onResetMachine: () => void;
  solvedQuestions: Record<string, boolean>;
  onSolveQuestion: (questionId: string, points: number) => void;
  onClose: () => void;
  onOpenAttackBox: () => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  targetMachine,
  onDeployMachine,
  onTerminateMachine,
  onResetMachine,
  solvedQuestions,
  onSolveQuestion,
  onClose,
  onOpenAttackBox,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'target_web'>('tasks');
  const [openTaskIds, setOpenTaskIds] = useState<Record<string, boolean>>({
    [room.tasks[0]?.id || '']: true,
  });
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { success: boolean; msg: string }>>({});
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>(room.tasks[0]?.title || '');
  const [selectedQuestionPrompt, setSelectedQuestionPrompt] = useState<string>('');

  const progress = calculateRoomProgress(room, solvedQuestions);

  const toggleTask = (taskId: string) => {
    setOpenTaskIds((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const toggleHint = (qId: string) => {
    setOpenHints((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleAnswerSubmit = (qId: string, expectedAnswers: string[], points: number) => {
    const input = answers[qId] || '';
    if (!input.trim()) return;

    const isCorrect = verifyFlag(input, expectedAnswers);
    if (isCorrect) {
      setFeedback((prev) => ({
        ...prev,
        [qId]: { success: true, msg: `Richtig! +${points} XP erhalten.` },
      }));
      onSolveQuestion(qId, points);
    } else {
      setFeedback((prev) => ({
        ...prev,
        [qId]: {
          success: false,
          msg: 'Falsche Antwort oder ungültige Flag. Überprüfe die Schreibweise oder nutze den Hinweis!',
        },
      }));
    }
  };

  const handleAskAiAboutQuestion = (taskTitle: string, questionPrompt: string) => {
    setSelectedTaskTitle(taskTitle);
    setSelectedQuestionPrompt(questionPrompt);
    setIsAiAssistantOpen(true);
  };

  const isMachineOnline = targetMachine.status === 'online';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col transition-all duration-300 ${
          isAiAssistantOpen ? 'max-w-6xl' : 'max-w-4xl'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="text-emerald-400 font-semibold">{room.category}</span>
                <span>·</span>
                <span>{room.difficulty}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {room.estimatedMinutes} min
                </span>
                <span>·</span>
                <span className="text-emerald-400 font-semibold">{room.totalXp} XP</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">{room.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                isAiAssistantOpen
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-cyan-300 hover:bg-slate-800 border-cyan-500/30'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{isAiAssistantOpen ? 'KI-Mentor schließen' : 'KI-Mentor fragen'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close Room"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Machine Control Bar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isMachineOnline ? 'bg-emerald-400 ring-2 ring-emerald-400/20' : 'bg-slate-600'
                }`}
              ></span>
              <span className="text-xs font-mono text-slate-300">
                Status: {isMachineOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            {isMachineOnline && (
              <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 border border-slate-800 px-3 py-1 rounded-md text-emerald-300">
                <span>Target IP:</span>
                <span className="font-bold text-white select-all">{targetMachine.ip}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isMachineOnline ? (
              <button
                onClick={() => onDeployMachine(room.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>🟢 Ziel-Maschine starten</span>
              </button>
            ) : (
              <>
                <button
                  onClick={onResetMachine}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors"
                  title="Maschine neustarten"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Neustart</span>
                </button>
                <button
                  onClick={onTerminateMachine}
                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs rounded-lg border border-rose-800/40 transition-colors"
                  title="Maschine beenden"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Beenden</span>
                </button>
              </>
            )}

            <button
              onClick={onOpenAttackBox}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-emerald-500/30 text-xs font-medium rounded-lg transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal (AttackBox)</span>
            </button>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/80 bg-slate-950 text-xs">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-2.5 px-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Aufgaben & Fragen</span>
            <span className="text-[11px] font-mono tabular-nums text-slate-500">
              ({progress.solvedCount}/{progress.totalQuestions})
            </span>
          </button>

          {isMachineOnline && (
            <button
              onClick={() => setActiveTab('target_web')}
              className={`pb-2.5 px-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'target_web'
                  ? 'border-emerald-400 text-emerald-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Ziel-Webseite ansehen</span>
            </button>
          )}
        </div>

        {/* Split Body: Main Content + Optional AI Mentor Drawer */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Main Modal Viewport */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'target_web' ? (
              <TargetWebSimulator targetMachine={targetMachine} />
            ) : (
              <>
                {/* Description & Overview */}
                <div className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
                  <p>{room.description}</p>
                  
                  {/* Beginner Guide Banner */}
                  <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-lg flex items-center justify-between gap-3 text-xs mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🔰</span>
                      <span className="text-slate-200">
                        {!isMachineOnline
                          ? 'Tipp für Anfänger: Klicke oben auf "🟢 Ziel-Maschine starten". Sobald die grüne IP da ist, kannst du die Aufgaben Schritt für Schritt lösen.'
                          : 'Super, die Ziel-Maschine läuft! Beantworte jetzt Aufgabe 1 oder klicke bei Fragen auf "KI-Mentor fragen".'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAskAiAboutQuestion(room.tasks[0]?.title || '', 'Wie fange ich als absoluter Anfänger in diesem Raum an?')}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold whitespace-nowrap text-[11px] shrink-0"
                    >
                      KI-Mentor fragen →
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-800/40 text-xs text-slate-400">
                    {room.tags.map((t) => (
                      <span key={t} className="text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tasks Accordion */}
                <div className="space-y-4">
                  {room.tasks.map((task, index) => {
                    const isOpen = !!openTaskIds[task.id];
                    const taskSolvedCount = task.questions.filter((q) => solvedQuestions[q.id]).length;
                    const isTaskDone = taskSolvedCount === task.questions.length;

                    return (
                      <div
                        key={task.id}
                        className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30"
                      >
                        {/* Task Header */}
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/60 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                                isTaskDone
                                  ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {isTaskDone ? '✓' : index + 1}
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-white">{task.title}</h3>
                              <p className="text-xs text-slate-400">
                                {taskSolvedCount} von {task.questions.length} Fragen gelöst
                              </p>
                            </div>
                          </div>

                          <div className="text-slate-400">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {/* Task Body */}
                        {isOpen && (
                          <div className="p-4 pt-0 space-y-4 border-t border-slate-800/50">
                            <p className="text-xs text-slate-300 leading-relaxed mt-3">{task.description}</p>

                            {task.theory && (
                              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-300 font-sans leading-relaxed">
                                <span className="font-semibold text-emerald-400 block mb-1">
                                  Hintergrund & Konzept:
                                </span>
                                {task.theory}
                              </div>
                            )}

                            {/* Questions List */}
                            <div className="space-y-3 pt-2">
                              {task.questions.map((q) => {
                                const isSolved = !!solvedQuestions[q.id];
                                const hintShown = !!openHints[q.id];
                                const fb = feedback[q.id];

                                return (
                                  <div
                                    key={q.id}
                                    className={`p-3.5 rounded-lg border text-xs transition-colors ${
                                      isSolved
                                        ? 'bg-emerald-950/10 border-emerald-500/30'
                                        : 'bg-slate-950 border-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                      <p className="text-slate-200 font-medium leading-relaxed">{q.prompt}</p>
                                      <span className="text-emerald-400 font-mono text-[11px] shrink-0 font-semibold">
                                        +{q.points} XP
                                      </span>
                                    </div>

                                    {isSolved ? (
                                      <div className="flex items-center gap-2 text-emerald-400 font-medium pt-1">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Gelöst! Flag verifiziert.</span>
                                      </div>
                                    ) : (
                                      <div className="space-y-2 mt-2">
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={answers[q.id] || ''}
                                            onChange={(e) =>
                                              setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                                            }
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                handleAnswerSubmit(q.id, q.expectedAnswers, q.points);
                                              }
                                            }}
                                            placeholder="Antwort oder THM{flag} eingeben..."
                                            className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-750 rounded text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                                          />
                                          <button
                                            onClick={() =>
                                              handleAnswerSubmit(q.id, q.expectedAnswers, q.points)
                                            }
                                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded transition-colors whitespace-nowrap"
                                          >
                                            Absenden
                                          </button>
                                        </div>

                                        {/* Hint & AI Mentor Triggers */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                          {q.answerHint && (
                                            <button
                                              onClick={() => toggleHint(q.id)}
                                              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
                                            >
                                              <HelpCircle className="w-3 h-3 text-cyan-400" />
                                              <span>
                                                {hintShown ? 'Hinweis verbergen' : 'Kostenloser Hinweis'}
                                              </span>
                                            </button>
                                          )}

                                          <button
                                            onClick={() =>
                                              handleAskAiAboutQuestion(
                                                task.title,
                                                `Erkläre mir diese Frage bitte wie für einen absoluten Anfänger ohne IT-Vorwissen: "${q.prompt}"`
                                              )
                                            }
                                            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                                          >
                                            <Bot className="w-3 h-3" />
                                            <span>Erklär mir das für Anfänger (KI-Mentor)</span>
                                          </button>
                                        </div>

                                        {hintShown && q.answerHint && (
                                          <div className="mt-1.5 p-2 bg-cyan-950/20 border border-cyan-800/40 rounded text-[11px] text-cyan-300 font-mono">
                                            💡 {q.answerHint}
                                          </div>
                                        )}

                                        {fb && (
                                          <div
                                            className={`mt-1.5 text-[11px] ${
                                              fb.success ? 'text-emerald-400' : 'text-rose-400'
                                            }`}
                                          >
                                            {fb.msg}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* AI Mentor Drawer Side Panel */}
          {isAiAssistantOpen && (
            <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col h-80 md:h-auto">
              <AiLabAssistantDrawer
                room={room}
                currentTaskTitle={selectedTaskTitle}
                currentQuestionPrompt={selectedQuestionPrompt}
                onClose={() => setIsAiAssistantOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
