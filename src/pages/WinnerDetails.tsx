import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, ShieldCheck, Download, ArrowLeft, ExternalLink } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const WinnerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const winners = dbStore.getWinnerRecords();
  const winner = winners.find((w) => w.id === id) || winners[0];

  if (!winner) return null;

  const proofs = dbStore.getWinnerProofByRecord(winner.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <Link to="/winners">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4" /> Back to Winners Gallery
        </Button>
      </Link>

      <Card glow="gold" className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            <img
              src={winner.winning_team_logo}
              alt={winner.winning_team_name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400"
            />
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Champion</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{winner.winning_team_name}</h1>
              <span className="text-xs text-gray-400">{winner.tournament_title}</span>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs text-gray-400 uppercase block">Prize Reward</span>
            <span className="text-2xl font-black text-amber-400">₹{winner.prize_amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 bg-black/60 rounded-xl text-center font-mono text-xs">
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Final Rank</span>
            <span className="text-base font-bold text-amber-400">#1 Champion</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Total Points</span>
            <span className="text-base font-bold text-white">{winner.total_points}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Total Kills</span>
            <span className="text-base font-bold text-red-400">{winner.kills}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Verified Payment & Proof Documents
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {winner.payment_proof_url && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-300">Prize Payout Transfer Screenshot</span>
                <img src={winner.payment_proof_url} alt="Proof" className="w-full h-48 object-cover rounded-xl border border-gray-800" />
              </div>
            )}

            {winner.winner_screenshot && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-300">Final Match Victory Screenshot</span>
                <img src={winner.winner_screenshot} alt="Victory" className="w-full h-48 object-cover rounded-xl border border-gray-800" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
