import React from 'react';
import { Tv, Youtube, Play, ExternalLink } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const YouTubePage: React.FC = () => {
  const videos = dbStore.getYouTubeVideos();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Channel Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-red-950/80 via-black to-orange-950/80 border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg">
            <Youtube className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest block">
              Official YouTube Channel
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">BGMI.ARENA Live Streams</h1>
            <p className="text-xs text-gray-400 mt-1">Watch live tournament matches, casters highlights, and grand finals.</p>
          </div>
        </div>

        <a href="https://youtube.com" target="_blank" rel="noreferrer">
          <Button variant="danger" size="lg" glow>
            <Youtube className="w-5 h-5" /> SUBSCRIBE ON YOUTUBE
          </Button>
        </a>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <Card key={vid.id} className="space-y-3">
            <div className="relative h-48 rounded-xl overflow-hidden border border-gray-800 bg-black/80 group">
              <img src={vid.thumbnail_url} alt={vid.title} className="w-full h-full object-cover" />
              <a
                href={vid.youtube_url}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 ml-1" />
                </div>
              </a>
            </div>

            <h3 className="text-sm font-bold text-white line-clamp-2">{vid.title}</h3>
            <p className="text-xs text-gray-400 line-clamp-2">{vid.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
