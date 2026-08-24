import React, { useState } from 'react';
import { Save, RefreshCw, Upload, CheckCircle2, AlertCircle, Zap, Trophy, Crosshair } from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Match, Team, MatchResult, ScoringRule } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AdminCsvImport } from './AdminCsvImport';
import { POINT_PRESETS } from '../leaderboard/PointSystemCalculator';

export const AdminResultsEntry: React.FC = () => {
  const tournaments = dbStore.getTournaments();
  const [selectedTournamentId, setSelectedTournamentId] = useState(tournaments[0]?.id || '');

  const matches = dbStore.getMatches(selectedTournamentId);
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id || '');

  const teams = dbStore.getTeams();
  const existingResults = dbStore.getMatchResults(selectedMatchId);

  const [activePresetId, setActivePresetId] = useState<string>('bgis-10pt');

  const selectedPreset = POINT_PRESETS.find((p) => p.id === activePresetId) || POINT_PRESETS[0];

  const currentScoringRule: ScoringRule = {
    id: activePresetId,
    placement_points: selectedPreset.placements,
    points_per_kill: selectedPreset.pointsPerKill,
    tie_breaker_order: ['points', 'wins', 'kills', 'best_placement'],
  };

  // Form local state for each team
  const [teamRows, setTeamRows] = useState<{ team_id: string; placement: number; kills: number }[]>(
    teams.map((t, idx) => {
      const existing = existingResults.find((r) => r.team_id === t.id);
      return {
        team_id: t.id,
        placement: existing?.placement || idx + 1,
        kills: existing?.kills || 0,
      };
    })
  );

  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handlePlacementChange = (teamId: string, placement: number) => {
    setTeamRows((prev) => prev.map((row) => (row.team_id === teamId ? { ...row, placement } : row)));
  };

  const handleKillsChange = (teamId: string, kills: number) => {
    setTeamRows((prev) => prev.map((row) => (row.team_id === teamId ? { ...row, kills } : row)));
  };

  const handleSaveAll = () => {
    if (!selectedMatchId || !selectedTournamentId) return;

    dbStore.saveMatchResults(selectedMatchId, selectedTournamentId, teamRows);
    dbStore.logAction('Saved Match Results', 'MatchResult', selectedMatchId, '', `Teams calculated: ${teamRows.length}`);
    setStatusMsg(`Results published with ${selectedPreset.name}! Standings recalculated instantly.`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white italic uppercase flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-400" />
            Match Result & Point Entry
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Enter squad placements & kills. Points automatically calculate based on the chosen BGMI Esports rule matrix.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedTournamentId}
            onChange={(e) => {
              setSelectedTournamentId(e.target.value);
              const m = dbStore.getMatches(e.target.value);
              if (m[0]) setSelectedMatchId(m[0].id);
            }}
            className="bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 cursor-pointer"
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
            className="bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-orange-500 cursor-pointer"
          >
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                Match #{m.match_number} ({m.map})
              </option>
            ))}
          </select>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Point Preset Selection Bar */}
      <div className="p-4 rounded-2xl bg-[#0f1322] border border-orange-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] text-orange-400 font-bold uppercase block">Active Scoring Preset</span>
          <span className="text-sm font-black text-white">{selectedPreset.name}</span>
          <p className="text-[11px] text-gray-400">
            1st Place (WWCD) = <strong className="text-amber-400">{selectedPreset.wwcdPoints} Pts</strong> • Kills = <strong className="text-red-400">{selectedPreset.pointsPerKill} Pt / Finish</strong>
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          {POINT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActivePresetId(preset.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                activePresetId === preset.id
                  ? 'bg-orange-500 text-black border-orange-400'
                  : 'bg-black/60 text-gray-400 border-gray-800 hover:text-white'
              }`}
            >
              {preset.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs for Entry Mode */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2.5 text-xs font-bold uppercase border-b-2 transition-colors ${
            activeTab === 'manual' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400'
          }`}
        >
          Manual Points Entry
        </button>
        <button
          onClick={() => setActiveTab('csv')}
          className={`px-4 py-2.5 text-xs font-bold uppercase border-b-2 transition-colors ${
            activeTab === 'csv' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400'
          }`}
        >
          CSV Match Import
        </button>
      </div>

      {activeTab === 'manual' ? (
        <Card className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 text-gray-400 uppercase font-mono border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Squad Name</th>
                  <th className="py-3 px-4 w-28">Placement</th>
                  <th className="py-3 px-4 w-28">Kills</th>
                  <th className="py-3 px-4 text-center">Placement Pts</th>
                  <th className="py-3 px-4 text-center">Kill Pts</th>
                  <th className="py-3 px-4 text-right pr-6">Calculated Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium">
                {teamRows.map((row) => {
                  const team = teams.find((t) => t.id === row.team_id);
                  const { placementPoints, killPoints, totalPoints } = dbStore.calculatePoints(
                    row.placement,
                    row.kills,
                    currentScoringRule
                  );

                  return (
                    <tr key={row.team_id} className="hover:bg-white/5">
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{team?.name}</span>
                        <span className="text-[10px] text-orange-400 font-mono">[{team?.tag}]</span>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min={1}
                          max={32}
                          value={row.placement}
                          onChange={(e) => handlePlacementChange(row.team_id, Number(e.target.value))}
                          className="w-16 bg-black border border-gray-800 rounded-lg px-2 py-1 text-center font-mono text-white focus:border-orange-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min={0}
                          value={row.kills}
                          onChange={(e) => handleKillsChange(row.team_id, Number(e.target.value))}
                          className="w-16 bg-black border border-gray-800 rounded-lg px-2 py-1 text-center font-mono text-red-400 font-bold focus:border-red-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">
                        +{placementPoints}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-red-400">
                        +{killPoints}
                      </td>
                      <td className="py-3 px-4 text-right pr-6 font-mono font-black text-amber-400 text-sm">
                        {totalPoints} pts
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end gap-2">
            <Button variant="primary" size="md" onClick={handleSaveAll} glow>
              <Save className="w-4 h-4" /> Save & Update Standings
            </Button>
          </div>
        </Card>
      ) : (
        <AdminCsvImport tournamentId={selectedTournamentId} matchId={selectedMatchId} />
      )}
    </div>
  );
};

