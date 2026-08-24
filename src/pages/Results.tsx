import React, { useState } from 'react';
import { Trophy, Crosshair, CheckCircle2 } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { Card } from '../components/ui/Card';
import { PrizeDistributionChart } from '../components/results/PrizeDistributionChart';

export const Results: React.FC = () => {
  const tournaments = dbStore.getTournaments();
  const [selectedTournamentId, setSelectedTournamentId] = useState(tournaments[0]?.id || '');

  const matches = dbStore.getMatches(selectedTournamentId);
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id || '');

  const matchResults = dbStore.getMatchResults(selectedMatchId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
            Post-Match Breakdown
          </span>
          <h1 className="text-3xl sm:text-5xl font-black italic text-white uppercase font-mono">
            Match Results
          </h1>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedTournamentId}
            onChange={(e) => {
              setSelectedTournamentId(e.target.value);
              const m = dbStore.getMatches(e.target.value);
              if (m[0]) setSelectedMatchId(m[0].id);
            }}
            className="bg-black/80 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white"
          >
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="bg-black/80 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono"
          >
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                Match #{m.match_number} ({m.map})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RECHARTS PRIZE DISTRIBUTION BREAKDOWN */}
      <PrizeDistributionChart />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/80 text-gray-400 uppercase border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4 text-center">Placement</th>
                <th className="py-3.5 px-4">Team</th>
                <th className="py-3.5 px-4 text-center">Kills</th>
                <th className="py-3.5 px-4 text-center">Placement Pts</th>
                <th className="py-3.5 px-4 text-center">Kill Pts</th>
                <th className="py-3.5 px-4 text-right pr-6">Total Match Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {matchResults.map((r) => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="py-3 px-4 text-center font-bold text-amber-400">#{r.placement}</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <img src={r.team_logo_url} alt={r.team_name} className="w-7 h-7 rounded object-cover" />
                    {r.team_name}
                  </td>
                  <td className="py-3 px-4 text-center text-red-400 font-bold">{r.kills}</td>
                  <td className="py-3 px-4 text-center text-gray-300">{r.placement_points}</td>
                  <td className="py-3 px-4 text-center text-gray-300">{r.kill_points}</td>
                  <td className="py-3 px-4 text-right pr-6 font-black text-amber-400 text-sm">{r.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
