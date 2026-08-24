import React, { useState } from 'react';
import { dbStore } from '../services/dbStore';
import { TournamentCard } from '../components/tournament/TournamentCard';
import { TournamentFilter } from '../components/tournament/TournamentFilter';
import { Trophy } from 'lucide-react';

export const Tournaments: React.FC = () => {
  const allTournaments = dbStore.getTournaments();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [selectedMap, setSelectedMap] = useState('ALL');

  const filtered = allTournaments.filter((t) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.format.toLowerCase().includes(q) ||
      t.map.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q);
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesFormat = selectedFormat === 'ALL' || t.format === selectedFormat;
    const matchesMap = selectedMap === 'ALL' || t.map.toLowerCase() === selectedMap.toLowerCase();

    return matchesSearch && matchesStatus && matchesFormat && matchesMap;
  });

  const handleReset = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedFormat('ALL');
    setSelectedMap('ALL');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
          <Trophy className="w-4 h-4 text-orange-400" />
          BGMI Esports Competitions
        </div>
        <h1 className="text-3xl sm:text-5xl font-black italic text-white uppercase font-mono">
          Tournaments Arena
        </h1>
        <p className="text-sm text-gray-400 max-w-xl">
          Browse upcoming, live, and completed BGMI tournaments. Join solo, duo, or squad matches and compete for prize rewards.
        </p>
      </div>

      {/* Filter Component */}
      <TournamentFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        selectedMap={selectedMap}
        setSelectedMap={setSelectedMap}
        onReset={handleReset}
      />

      {/* Tournament Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#0f121d]/80 rounded-2xl border border-gray-800 space-y-3">
          <Trophy className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-gray-300 uppercase">No Tournaments Found</h3>
          <p className="text-xs text-gray-500">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </div>
  );
};
