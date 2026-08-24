import React, { useState } from 'react';
import { Users, Shield, Award, Crown, Sparkles, Check, ArrowRight, UserCheck } from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Card } from '../ui/Card';
import { UserProfile } from '../../types';

export const AdminTeams: React.FC = () => {
  const teams = dbStore.getTeams();
  const [users, setUsers] = useState<UserProfile[]>(dbStore.getUsers());
  const currentUser = dbStore.getCurrentUser();
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [selectedRank, setSelectedRank] = useState<string>('Ace Tier');
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const handleUpdateRank = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = dbStore.updateUserRank(selectedUserId, selectedRank);
    setUsers(dbStore.getUsers());
    if (updated) {
      setUpdateMessage(
        `Successfully updated ${updated.game_name || updated.username}'s seasonal rank to '${selectedRank}'! ${
          selectedRank.toLowerCase().includes('ace')
            ? '⚡ Ace Tier Unlock animation will trigger on their Dashboard!'
            : ''
        }`
      );
      setTimeout(() => setUpdateMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Seasonal Rank Management Box */}
      <Card className="bg-[#10121d] border-orange-500/40 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-600 text-white flex items-center justify-center p-2 border border-amber-300">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase font-mono italic">
              Seasonal Player Rank & Tier Manager
            </h2>
            <p className="text-xs text-gray-400">
              Update any player's seasonal rank (e.g. Upgrade to 'Ace Tier' to trigger the Ace Unlock Animation)
            </p>
          </div>
        </div>

        {updateMessage && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{updateMessage}</span>
          </div>
        )}

        <form onSubmit={handleUpdateRank} className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Select Player / User</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.game_name || u.username} ({u.role}) — Current: {u.rank || 'Crown'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">New Seasonal Rank</label>
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-orange-500"
            >
              <option value="Bronze I">Bronze I</option>
              <option value="Silver I">Silver I</option>
              <option value="Gold I">Gold I</option>
              <option value="Platinum I">Platinum I</option>
              <option value="Crown I">Crown I</option>
              <option value="Ace Tier">Ace Tier (Triggers Framer Motion Unlock)</option>
              <option value="Ace Master">Ace Master</option>
              <option value="Ace Dominator">Ace Dominator</option>
              <option value="Conqueror">Conqueror</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 fill-black" />
              <span>Update Player Rank</span>
            </button>
          </div>
        </form>
      </Card>

      <div>
        <h2 className="text-xl font-black text-white">Registered Squads & Roster Management</h2>
        <p className="text-xs text-gray-400">View team rosters, captain BGMI IDs, and member player profiles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card key={team.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={team.logo_url}
                alt={team.name}
                className="w-12 h-12 rounded-xl object-cover border border-gray-800"
              />
              <div>
                <h3 className="text-base font-bold text-white">{team.name}</h3>
                <span className="text-xs font-mono font-bold text-orange-400">{team.tag}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-800/80 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Squad Roster:</span>
              {team.members?.map((m) => (
                <div key={m.id} className="flex justify-between items-center text-gray-300 font-mono text-[11px] bg-black/40 px-2 py-1 rounded">
                  <span>{m.game_name} ({m.role})</span>
                  <span className="text-gray-500">ID: {m.player_id}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
