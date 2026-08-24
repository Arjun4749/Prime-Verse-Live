import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Swords,
  Crosshair,
  Award,
  Calendar,
  Flame,
  ChevronRight,
  Sparkles,
  MapPin,
  ExternalLink,
  Shield,
  Users,
} from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Team } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface TeamMatchHistoryProps {
  teams: Team[];
}

export const TeamMatchHistory: React.FC<TeamMatchHistoryProps> = ({ teams }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || 'tm-1');
  const [filterTab, setFilterTab] = useState<'all' | 'wins' | 'top3'>('all');

  const currentTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  if (!currentTeam) {
    return (
      <Card className="p-8 text-center text-xs text-gray-400 space-y-3">
        <Users className="w-8 h-8 text-gray-600 mx-auto" />
        <p className="font-bold text-white uppercase">No Registered Squad Found</p>
        <p>Register or create a squad to track match performance and placement history.</p>
      </Card>
    );
  }

  const history = dbStore.getTeamMatchHistory(currentTeam.id);
  const summary = dbStore.getTeamPerformanceSummary(currentTeam.id);

  const filteredHistory = history.filter((item) => {
    if (filterTab === 'wins') return item.placement === 1;
    if (filterTab === 'top3') return item.placement <= 3;
    return true;
  });

  const getPlacementBadge = (placement: number) => {
    if (placement === 1) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black text-xs rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse">
          <Trophy className="w-3.5 h-3.5 fill-black" />
          <span>#1 CHICKEN DINNER</span>
        </div>
      );
    }
    if (placement === 2) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-300 text-black font-extrabold text-xs rounded-xl shadow">
          <Award className="w-3.5 h-3.5 text-black" />
          <span>#2 RUNNER UP</span>
        </div>
      );
    }
    if (placement === 3) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-700/80 border border-amber-600 text-amber-100 font-extrabold text-xs rounded-xl">
          <Award className="w-3.5 h-3.5 text-amber-200" />
          <span>#3 PODIUM</span>
        </div>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-black/60 border border-gray-800 text-gray-400 font-mono font-bold text-xs rounded-xl">
        #{placement} RANK
      </span>
    );
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent Match';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Squad Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-800">
        <div>
          <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest flex items-center gap-1">
            <Swords className="w-3.5 h-3.5" /> Competitive Record
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white italic uppercase font-mono">
            Team Match History & Stats
          </h2>
        </div>

        {/* Squad Selection Pills */}
        {teams.length > 1 && (
          <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-gray-800">
            <span className="text-[10px] text-gray-400 uppercase font-mono pl-2">Squad:</span>
            {teams.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTeamId(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedTeamId === t.id
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <img src={t.logo_url} alt={t.name} className="w-4 h-4 rounded-full object-cover" />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Team Performance Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0e1019] border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-mono block">Matches Played</span>
          <span className="text-xl font-black text-white font-mono">{summary.matchesPlayed}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-[#0e1019] border border-amber-500/30 space-y-1">
          <span className="text-[10px] text-amber-400 uppercase font-mono block flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Chicken Dinners
          </span>
          <span className="text-xl font-black text-amber-300 font-mono">{summary.wins}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e1019] border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-mono block">Top 3 Finishes</span>
          <span className="text-xl font-black text-cyan-400 font-mono">{summary.top3}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e1019] border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-mono block flex items-center gap-1">
            <Flame className="w-3 h-3 text-red-500" /> Total Kills
          </span>
          <span className="text-xl font-black text-red-400 font-mono">{summary.totalKills}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e1019] border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-mono block">Points Scored</span>
          <span className="text-xl font-black text-[#D4FF33] font-mono">{summary.totalPoints}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e1019] border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-mono block">Avg Kills / Match</span>
          <span className="text-xl font-black text-purple-400 font-mono">{summary.avgKills}</span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#0c0d15] p-2 rounded-2xl border border-gray-800/80">
        <div className="flex items-center gap-1 text-xs font-bold uppercase font-mono">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-orange-500 text-white shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All Matches ({history.length})
          </button>
          <button
            onClick={() => setFilterTab('wins')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterTab === 'wins'
                ? 'bg-orange-500 text-white shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Chicken Dinners ({summary.wins})
          </button>
          <button
            onClick={() => setFilterTab('top3')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterTab === 'top3'
                ? 'bg-orange-500 text-white shadow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Top 3 ({summary.top3})
          </button>
        </div>

        <span className="text-[11px] text-gray-500 font-mono hidden sm:inline-block">
          SQUAD: <strong className="text-white uppercase">{currentTeam.name} [{currentTeam.tag}]</strong>
        </span>
      </div>

      {/* Match History Cards / Table */}
      {filteredHistory.length === 0 ? (
        <Card className="p-8 text-center text-xs text-gray-400 space-y-2">
          <Swords className="w-8 h-8 text-gray-600 mx-auto" />
          <p className="font-bold text-white uppercase">No Match Records in This Category</p>
          <p>Match placement and kill logs will appear automatically once official scores are posted by tournament admins.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all hover:border-orange-500/40 bg-[#0f111a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.placement === 1
                  ? 'border-amber-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] bg-gradient-to-r from-amber-950/20 via-[#0f111a] to-[#0f111a]'
                  : 'border-gray-800/80'
              }`}
            >
              {/* Match & Tournament Title */}
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-black/60 border border-gray-800 shrink-0">
                  <Swords className="w-5 h-5 text-orange-400" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-white">{item.matchTitle}</h3>
                    <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold font-mono">
                      {item.map}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px] font-bold font-mono">
                      {item.format}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 font-medium">{item.tournamentTitle}</p>

                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" /> {formatDate(item.scheduled_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Placement & Score Breakdown */}
              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-800/80">
                {/* Placement Badge */}
                <div>{getPlacementBadge(item.placement)}</div>

                {/* Kills & Points Breakdown */}
                <div className="flex items-center gap-4 font-mono text-xs">
                  <div className="text-center">
                    <span className="text-[10px] text-gray-400 uppercase block">Kills</span>
                    <span className="text-sm font-black text-red-400 flex items-center justify-center gap-0.5">
                      <Flame className="w-3.5 h-3.5 fill-red-500" /> {item.kills}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-gray-400 uppercase block">Pl. Pts</span>
                    <span className="text-sm font-bold text-gray-300">+{item.placement_points}</span>
                  </div>

                  <div className="text-center bg-black/60 px-3 py-1.5 rounded-xl border border-gray-800">
                    <span className="text-[10px] text-gray-400 uppercase block">Total Pts</span>
                    <span className="text-base font-black text-[#D4FF33]">{item.total_points}</span>
                  </div>

                  {item.tournamentSlug && (
                    <Link
                      to={`/tournaments/${item.tournamentSlug}`}
                      className="p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-orange-500 hover:text-white text-gray-400 transition-colors"
                      title="View Tournament Standings"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
