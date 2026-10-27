import React from 'react';
import { BookOpen, Award, CheckCircle, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { LearningPath, Room } from '../types/cyber';
import { calculateRoomProgress } from '../utils/cyberRules';

interface LearningPathsViewProps {
  paths: LearningPath[];
  rooms: Room[];
  solvedQuestions: Record<string, boolean>;
  onSelectRoom: (room: Room) => void;
}

export const LearningPathsView: React.FC<LearningPathsViewProps> = ({
  paths,
  rooms,
  solvedQuestions,
  onSelectRoom,
}) => {
  const getRoomById = (id: string) => rooms.find((r) => r.id === id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Lernpfade & Karriere-Tracks</h1>
        <p className="text-sm text-slate-400 mt-1">
          Strukturierte Curricula von Pre-Security bis zum Red-Teaming. Alle Pfade und Zertifikatsprüfungen sind 100% kostenfrei freigeschaltet.
        </p>
      </div>

      {/* Pathways Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paths.map((path) => {
          const pathRooms = path.roomIds
            .map((id) => getRoomById(id))
            .filter((r): r is Room => r !== undefined);

          const completedCount = pathRooms.filter(
            (r) => calculateRoomProgress(r, solvedQuestions).isComplete
          ).length;

          const progressPercent =
            pathRooms.length > 0 ? Math.round((completedCount / pathRooms.length) * 100) : 0;

          const isPathCompleted = progressPercent === 100 && pathRooms.length > 0;

          return (
            <div
              key={path.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-400">{path.difficulty}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {path.estimatedHours}h
                    </span>
                  </div>
                  <span className="text-cyan-400 font-mono text-[11px]">{path.careerRole}</span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white mb-2">{path.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">{path.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Fortschritt:</span>
                    <span className="text-emerald-400 font-bold tabular-nums">
                      {completedCount} / {pathRooms.length} Rooms ({progressPercent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Rooms Checklist in Path */}
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Enthaltene Labs:
                  </span>
                  <div className="space-y-1.5">
                    {pathRooms.map((room) => {
                      const roomStatus = calculateRoomProgress(room, solvedQuestions);
                      return (
                        <div
                          key={room.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer text-xs"
                          onClick={() => onSelectRoom(room)}
                        >
                          <div className="flex items-center gap-2">
                            {roomStatus.isComplete ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                            )}
                            <span className="text-slate-200 font-medium">{room.title}</span>
                          </div>
                          <span className="text-slate-400 font-mono text-[11px] shrink-0">
                            {room.totalXp} XP
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action / Certificate Footer */}
              <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
                {isPathCompleted ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Zertifikat freigeschaltet!</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">
                    Schließe alle {pathRooms.length} Rooms ab für das Zertifikat
                  </span>
                )}

                {pathRooms.length > 0 && (
                  <button
                    onClick={() => {
                      const nextUnsolved = pathRooms.find(
                        (r) => !calculateRoomProgress(r, solvedQuestions).isComplete
                      );
                      if (nextUnsolved) onSelectRoom(nextUnsolved);
                      else onSelectRoom(pathRooms[0]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
                  >
                    <span>{isPathCompleted ? 'Erneut üben' : 'Nächster Room'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
