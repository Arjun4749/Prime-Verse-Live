import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users, MapPin, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { Tournament } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface TournamentCardProps {
  tournament: Tournament;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const getStatusBadge = (status: Tournament['status']) => {
    switch (status) {
      case 'Registration Open':
        return <Badge variant="lime" pulse>Registration Open</Badge>;
      case 'Live':
        return <Badge variant="red" pulse>Live</Badge>;
      case 'Upcoming':
        return <Badge variant="blue">Upcoming</Badge>;
      case 'Completed':
        return <Badge variant="gold">Completed</Badge>;
      case 'Registration Closed':
        return <Badge variant="gray">Closed</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <Card hoverEffect glow={tournament.status === 'Live' ? 'lime' : tournament.status === 'Registration Open' ? 'lime' : 'none'} className="flex flex-col h-full group bg-[#111111] border border-[#222222] rounded-[28px] p-6">
      {/* Banner Container */}
      <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-[28px]">
        <img
          src={tournament.banner_url}
          alt={tournament.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {getStatusBadge(tournament.status)}
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-[#0A0A0A]/90 backdrop-blur-md rounded-full text-[10px] font-mono font-bold text-[#D4FF33] border border-[#222222]">
            {tournament.format} ({tournament.mode})
          </span>
        </div>

        {/* Map Indicator */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-xs text-zinc-200 font-bold bg-[#0A0A0A]/80 px-3 py-1 rounded-full backdrop-blur-sm border border-[#222222]">
          <MapPin className="w-3.5 h-3.5 text-[#D4FF33]" />
          {tournament.map}
        </div>
      </div>

      {/* Title & Description */}
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-bold text-white group-hover:text-[#D4FF33] transition-colors line-clamp-1">
          {tournament.title}
        </h3>
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {tournament.description}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-[#1A1A1A] rounded-2xl border border-[#222222] text-xs">
        <div>
          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Prize Pool</span>
          <span className="font-mono font-black text-[#D4FF33] text-base">
            ₹{tournament.prize_pool.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Entry Fee</span>
          <span className="font-mono font-bold text-white text-sm">
            {tournament.entry_fee === 0 ? 'FREE' : `₹${tournament.entry_fee}`}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Slots Filled</span>
          <span className="font-mono font-bold text-zinc-300">
            {tournament.registered_teams} / {tournament.max_teams} Teams
          </span>
        </div>
        <div>
          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Schedule</span>
          <span className="font-mono font-bold text-zinc-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#D4FF33]" />
            {tournament.start_time}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-[#222222] flex items-center justify-between">
        <span className="text-[10px] text-zinc-500 font-mono">
          Start: {new Date(tournament.start_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
        </span>

        <Link to={`/tournaments/${tournament.slug}`}>
          <Button variant={tournament.status === 'Registration Open' ? 'primary' : 'outline'} size="sm">
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
