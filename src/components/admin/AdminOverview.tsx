import React from 'react';
import { Trophy, Users, Shield, Award, Calendar, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const stats = dbStore.getDynamicStats();
  const tournaments = dbStore.getTournaments();
  const teams = dbStore.getTeams();
  const disputes = dbStore.getDisputes();
  const logs = dbStore.getAuditLogs();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/60 via-black to-blue-950/60 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
            Command Center
          </span>
          <h2 className="text-2xl font-black text-white">BGMI.ARENA Admin Dashboard</h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage tournaments, match room keys, result verification, point system calculations, and winner payout proof.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => onNavigateTab('tournaments')}>
            <Plus className="w-4 h-4" /> Create Tournament
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigateTab('results')}>
            Enter Results
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card glow="orange">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Active Tournaments</span>
            <Trophy className="w-5 h-5 text-orange-400" />
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-white">{stats.activeTournaments}</div>
        </Card>

        <Card glow="blue">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Registered Teams</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-white">{teams.length}</div>
        </Card>

        <Card glow="gold">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Total Prize Pool</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-amber-400">
            ₹{stats.totalPrizePool.toLocaleString('en-IN')}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Matches Completed</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-white">{stats.matchesPlayed}</div>
        </Card>
      </div>

      {/* Recent Tournaments & Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tournaments Table */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Tournaments Control</h3>
            <button
              onClick={() => onNavigateTab('tournaments')}
              className="text-xs text-orange-400 hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {tournaments.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-black/50 border border-gray-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{t.title}</h4>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {t.format} &bull; {t.registered_teams}/{t.max_teams} Teams
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">₹{t.prize_pool.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Log Activity */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Recent Audit Logs</h3>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-orange-400 hover:underline font-semibold"
            >
              View Full Logs
            </button>
          </div>

          <div className="space-y-3">
            {logs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-black/50 border border-gray-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-400">{log.action}</span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-400 text-[11px]">
                  By <strong className="text-gray-200">{log.admin_name}</strong> &bull; Target: {log.target_type} #{log.target_id}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
