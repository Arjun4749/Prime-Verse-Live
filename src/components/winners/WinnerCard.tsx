import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ShieldCheck, ExternalLink, Flame, Crosshair } from 'lucide-react';
import { WinnerRecord } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProofViewerModal } from './ProofViewerModal';
import { dbStore } from '../../services/dbStore';

interface WinnerCardProps {
  winner: WinnerRecord;
}

export const WinnerCard: React.FC<WinnerCardProps> = ({ winner }) => {
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const proofs = dbStore.getWinnerProofByRecord(winner.id);

  return (
    <>
      <Card glow="gold" className="flex flex-col justify-between h-full group bg-[#111111] border border-[#222222] rounded-[28px] p-6">
        <div>
          {/* Top Banner */}
          <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-[28px]">
            <img
              src={winner.winner_screenshot || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'}
              alt={winner.winning_team_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent" />

            <div className="absolute top-3 left-3">
              <Badge variant="lime" pulse>
                <Trophy className="w-3.5 h-3.5" /> Champion
              </Badge>
            </div>

            {winner.verified && (
              <div className="absolute top-3 right-3 bg-[#0A0A0A]/90 text-[#D4FF33] border border-[#222222] px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4FF33]" /> Verified Payout
              </div>
            )}

            {/* Team Logo Overlay */}
            <div className="absolute -bottom-4 left-5 flex items-end gap-3">
              <img
                src={winner.winning_team_logo}
                alt={winner.winning_team_name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4FF33] shadow-xl bg-[#0A0A0A]"
              />
            </div>
          </div>

          {/* Team Info */}
          <div className="mt-4 space-y-1">
            <span className="text-[10px] font-mono text-[#D4FF33] uppercase tracking-widest block">
              {winner.tournament_title}
            </span>
            <h3 className="text-xl font-bold text-white group-hover:text-[#D4FF33] transition-colors">
              {winner.winning_team_name}
            </h3>
            <p className="text-xs text-zinc-400">
              Roster: {winner.players.join(', ')}
            </p>
          </div>

          {/* Winning Stats */}
          <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-[#1A1A1A] rounded-2xl border border-[#222222] text-center font-mono">
            <div>
              <span className="text-[9px] text-zinc-500 uppercase block font-mono">Prize Money</span>
              <span className="font-mono font-black text-[#D4FF33] text-sm">
                ₹{winner.prize_amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 uppercase block font-mono">Points</span>
              <span className="font-mono font-bold text-white text-sm">{winner.total_points}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 uppercase block font-mono">Kills</span>
              <span className="font-mono font-bold text-emerald-400 text-sm flex items-center justify-center gap-1">
                <Crosshair className="w-3 h-3 text-emerald-400" />
                {winner.kills}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#222222] flex items-center justify-between gap-2">
          <Button variant="primary" size="sm" onClick={() => setProofModalOpen(true)} className="w-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Payment Proof
          </Button>

          <Link to={`/winners/${winner.id}`}>
            <Button variant="outline" size="sm" title="Detailed Winner Summary">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </Card>

      <ProofViewerModal
        isOpen={proofModalOpen}
        onClose={() => setProofModalOpen(false)}
        winner={winner}
        proofs={proofs}
      />
    </>
  );
};
