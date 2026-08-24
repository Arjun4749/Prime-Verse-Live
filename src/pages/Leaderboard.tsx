import React, { useState } from 'react';
import { Trophy, Award, Flame, Calculator, Grid, Zap } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { PointSystemCalculator } from '../components/leaderboard/PointSystemCalculator';

export const Leaderboard: React.FC = () => {
  const tournaments = dbStore.getTournaments();
  const [selectedTournamentId, setSelectedTournamentId] = useState(tournaments[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'standings' | 'point_system'>('standings');

  const leaderboard = dbStore.getTournamentLeaderboard(selectedTournamentId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            <Award className="w-4 h-4 text-amber-400" />
            Official Tournament Rankings & Points System
          </div>
          <h1 className="text-3xl sm:text-5xl font-black italic text-white uppercase font-mono">
            Championship Leaderboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTournamentId}
            onChange={(e) => setSelectedTournamentId(e.target.value)}
            className="bg-black/80 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white font-bold focus:border-orange-500 focus:outline-none cursor-pointer font-mono"
          >
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs View */}
      <div className="flex border-b border-gray-800 font-mono">
        <button
          onClick={() => setActiveTab('standings')}
          className={`px-5 py-3 text-xs font-black uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'standings'
              ? 'border-orange-500 text-orange-400 bg-orange-500/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Live Rankings</span>
        </button>

        <button
          onClick={() => setActiveTab('point_system')}
          className={`px-5 py-3 text-xs font-black uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'point_system'
              ? 'border-orange-500 text-orange-400 bg-orange-500/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Point System & Score Simulator</span>
        </button>
      </div>

      {activeTab === 'standings' ? (
        <div className="space-y-8">
          <LeaderboardTable leaderboard={leaderboard} />
          
          {/* Embedded Quick Point Rules Summary */}
          <div className="p-4 rounded-2xl bg-[#0b0e1a] border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <span className="font-bold text-white uppercase block">Scoring Engine: BGIS 2026 Official Rules</span>
                <span className="text-gray-400">1st Place (WWCD) = 10 Pts • Finish (Kill) = 1 Pt / Kill</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('point_system')}
              className="px-3.5 py-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 hover:bg-orange-500 hover:text-black font-bold transition-all cursor-pointer text-xs"
            >
              Open Score Calculator →
            </button>
          </div>
        </div>
      ) : (
        <PointSystemCalculator />
      )}
    </div>
  );
};

