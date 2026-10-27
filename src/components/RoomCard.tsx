import React from 'react';
import { Clock, Shield, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { Room } from '../types/cyber';
import { calculateRoomProgress } from '../utils/cyberRules';

interface RoomCardProps {
  room: Room;
  solvedQuestions: Record<string, boolean>;
  onSelect: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, solvedQuestions, onSelect }) => {
  const { solvedCount, totalQuestions, percent, isComplete } = calculateRoomProgress(
    room,
    solvedQuestions
  );

  const difficultyColors = {
    Easy: 'text-emerald-400',
    Medium: 'text-amber-400',
    Hard: 'text-rose-400',
    Insane: 'text-purple-400',
  };

  return (
    <div
      onClick={onSelect}
      className="group relative bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-emerald-500/5"
    >
      <div>
        {/* Room Cover Image */}
        <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
          {room.image ? (
            <img
              src={room.image}
              alt={room.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-700">
              <Shield className="w-12 h-12" />
            </div>
          )}

          {/* Clean Unboxed Status Indicator */}
          {isComplete && (
            <div className="absolute top-3 right-3 bg-slate-950/90 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Abgeschlossen</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Metadata Row: Clean Unboxed Text with Separators */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <span className={difficultyColors[room.difficulty] || 'text-slate-300'}>
              {room.difficulty}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{room.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {room.estimatedMinutes}m
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {room.title}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-400 font-mono">
            {room.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0 border-t border-slate-800/60 mt-3">
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
            <span className="text-emerald-400 font-bold">+{room.totalXp} XP</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">
              {solvedCount}/{totalQuestions} Flags ({percent}%)
            </span>
          </div>

          <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 group-hover:translate-x-0.5 transition-transform">
            <span>Lab öffnen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Progress Mini Bar */}
        <div className="mt-2.5 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
