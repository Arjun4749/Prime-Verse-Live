import React from 'react';
import { Search, Filter, RefreshCcw, X, Crosshair, Users } from 'lucide-react';
import { TournamentFormat, TournamentStatus } from '../../types';

interface TournamentFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedFormat: string;
  setSelectedFormat: (f: string) => void;
  selectedMap: string;
  setSelectedMap: (m: string) => void;
  onReset: () => void;
}

export const TournamentFilter: React.FC<TournamentFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedFormat,
  setSelectedFormat,
  selectedMap,
  setSelectedMap,
  onReset,
}) => {
  const quickModes = ['Squad', 'Duo', 'Solo', 'Erangel', 'Miramar', 'Sanhok'];

  return (
    <div className="bg-[#0f121d]/90 backdrop-blur-md border border-gray-800/80 rounded-2xl p-4 sm:p-5 space-y-3 mb-8 shadow-xl">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tournament name, game mode (Squad, Duo, Solo), map..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-gray-800 focus:border-orange-500 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer p-0.5"
              title="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-black/60 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-gray-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Registration Open">Registration Open</option>
            <option value="Live">Live</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Format */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-black/60 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-gray-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Formats</option>
            <option value="Squad">Squad</option>
            <option value="Duo">Duo</option>
            <option value="Solo">Solo</option>
          </select>

          {/* Map */}
          <select
            value={selectedMap}
            onChange={(e) => setSelectedMap(e.target.value)}
            className="bg-black/60 border border-gray-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs text-gray-200 font-semibold focus:outline-none cursor-pointer col-span-2 sm:col-span-1"
          >
            <option value="ALL">All Maps</option>
            <option value="Erangel">Erangel</option>
            <option value="Miramar">Miramar</option>
            <option value="Sanhok">Sanhok</option>
            <option value="Vikendi">Vikendi</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="px-3.5 py-2.5 bg-gray-900 border border-gray-800 hover:border-orange-500/50 hover:text-white text-gray-400 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
          title="Reset Filters"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Quick Filter Tag Shortcuts */}
      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[11px]">
        <span className="text-gray-500 font-mono uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
          <Crosshair className="w-3 h-3 text-orange-400" /> Quick Search:
        </span>
        {quickModes.map((mode) => {
          const isActive = searchQuery.toLowerCase() === mode.toLowerCase();
          return (
            <button
              key={mode}
              onClick={() => setSearchQuery(isActive ? '' : mode)}
              className={`px-2.5 py-0.5 rounded-lg font-bold border transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                  : 'bg-black/40 border-gray-800/80 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              {mode}
            </button>
          );
        })}
      </div>
    </div>
  );
};
