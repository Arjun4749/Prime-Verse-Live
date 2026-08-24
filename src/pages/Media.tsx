import React from 'react';
import { Tv, Image as ImageIcon, Play, ExternalLink } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { Card } from '../components/ui/Card';

export const Media: React.FC = () => {
  const videos = dbStore.getYouTubeVideos();
  const winners = dbStore.getWinnerRecords();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
          Esports Content Hub
        </span>
        <h1 className="text-3xl sm:text-5xl font-black italic text-white uppercase font-mono">
          Media & Gallery
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {winners.map((w) => (
          <Card key={w.id} className="p-4 space-y-2">
            <img src={w.winner_screenshot} alt={w.winning_team_name} className="w-full h-48 object-cover rounded-xl border border-gray-800" />
            <h3 className="text-sm font-bold text-white">{w.winning_team_name} Victory</h3>
            <span className="text-xs text-gray-400 font-mono">{w.tournament_title}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};
