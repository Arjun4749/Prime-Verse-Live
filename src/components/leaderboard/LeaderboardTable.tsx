import React from 'react';
import { Trophy, Flame, Crosshair, Award } from 'lucide-react';
import { TournamentLeaderboardEntry } from '../../types';
import { GradientAvatar } from '../ui/GradientAvatar';

interface LeaderboardTableProps {
  leaderboard: TournamentLeaderboardEntry[];
  highlightTeamId?: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ leaderboard, highlightTeamId }) => {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="p-12 text-center bg-[#0f121d]/80 rounded-2xl border border-gray-800 space-y-3">
        <Trophy className="w-10 h-10 text-gray-600 mx-auto" />
        <h3 className="text-base font-bold text-gray-300 uppercase">No Standings Available Yet</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Match results will be published here automatically as soon as referees submit verified scores.
        </p>
      </div>
    );
  }

  const getRankBadge = (rank: number, index: number = 0) => {
    const delayStyle = { animationDelay: `${Math.min(index, 16) * 55}ms` };

    if (rank === 1)
      return (
        <span
          style={delayStyle}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-600 text-black font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-rank-badge animate-gold-glow hover:scale-110 transition-transform cursor-pointer"
          title="1st Place - Champion"
        >
          1st
        </span>
      );
    if (rank === 2)
      return (
        <span
          style={delayStyle}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 text-black font-black flex items-center justify-center text-sm shadow-[0_0_12px_rgba(203,213,225,0.4)] animate-rank-badge hover:scale-110 transition-transform cursor-pointer"
          title="2nd Place - Runner Up"
        >
          2nd
        </span>
      );
    if (rank === 3)
      return (
        <span
          style={delayStyle}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-amber-100 font-black flex items-center justify-center text-sm shadow-[0_0_10px_rgba(180,83,9,0.4)] border border-amber-600/40 animate-rank-badge hover:scale-110 transition-transform cursor-pointer"
          title="3rd Place - Podium"
        >
          3rd
        </span>
      );
    return (
      <span
        style={delayStyle}
        className="w-8 h-8 rounded-full bg-black/60 border border-gray-800/80 text-sm font-mono font-bold text-gray-400 flex items-center justify-center animate-rank-badge hover:border-orange-500/50 hover:text-orange-400 hover:scale-110 transition-all cursor-pointer"
      >
        #{rank}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-800 bg-[#0f121d]/90 backdrop-blur-md">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/60 text-gray-400 uppercase font-mono tracking-wider border-b border-gray-800">
            <tr>
              <th className="py-4 px-4 text-center">Rank</th>
              <th className="py-4 px-4">Team</th>
              <th className="py-4 px-4 text-center">Matches</th>
              <th className="py-4 px-4 text-center">Wins (WWCD)</th>
              <th className="py-4 px-4 text-center">Kills</th>
              <th className="py-4 px-4 text-center">Placement Pts</th>
              <th className="py-4 px-4 text-center">Kill Pts</th>
              <th className="py-4 px-4 text-right pr-6">Total Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 font-medium">
            {leaderboard.map((entry, idx) => {
              const isHighlighted = entry.team_id === highlightTeamId;
              return (
                <tr
                  key={`${entry.team_id}-${entry.rank}`}
                  className={`transition-colors hover:bg-white/5 ${
                    isHighlighted ? 'bg-orange-500/15 border-l-4 border-l-orange-500' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 flex items-center justify-center">{getRankBadge(entry.rank, idx)}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <GradientAvatar
                        name={entry.team_name}
                        src={entry.team_logo_url}
                        size="sm"
                        shape="rounded-lg"
                        badge={entry.rank === 1 ? 'crown' : undefined}
                      />
                      <div>
                        <span className="font-bold text-white block text-sm">{entry.team_name}</span>
                        <span className="text-[10px] font-mono text-orange-400 font-semibold">{entry.team_tag}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-300">{entry.matches_played}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-400">
                    <span className="inline-flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      {entry.chicken_dinners}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-red-400">
                    <span className="inline-flex items-center gap-1">
                      <Crosshair className="w-3.5 h-3.5 text-red-400" />
                      {entry.total_kills}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-gray-300">{entry.placement_points}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-gray-300">{entry.kill_points}</td>
                  <td className="py-3.5 px-4 text-right pr-6 font-mono font-black text-base text-amber-400">
                    {entry.total_points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {leaderboard.map((entry, idx) => (
          <div
            key={`${entry.team_id}-${entry.rank}`}
            className={`p-4 rounded-xl border bg-[#0f121d] flex items-center justify-between gap-3 ${
              entry.rank === 1
                ? 'border-amber-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                : 'border-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {getRankBadge(entry.rank, idx)}
              <GradientAvatar
                name={entry.team_name}
                src={entry.team_logo_url}
                size="md"
                shape="rounded-lg"
                badge={entry.rank === 1 ? 'crown' : undefined}
              />
              <div>
                <h4 className="text-sm font-bold text-white">{entry.team_name}</h4>
                <div className="flex gap-2 text-[10px] text-gray-400 font-mono mt-0.5">
                  <span className="text-amber-400">{entry.chicken_dinners} WWCD</span>
                  <span>&bull;</span>
                  <span className="text-red-400">{entry.total_kills} Kills</span>
                </div>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-gray-400 uppercase block">Total</span>
              <span className="text-lg font-black text-amber-400">{entry.total_points} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
