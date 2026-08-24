import React from 'react';
import { Trophy, Award, ShieldCheck } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { WinnerCard } from '../components/winners/WinnerCard';

export const Winners: React.FC = () => {
  const winners = dbStore.getWinnerRecords();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
          <Trophy className="w-4 h-4 text-amber-400" />
          Hall of Champions & Verified Payouts
        </div>
        <h1 className="text-3xl sm:text-5xl font-black italic text-white uppercase font-mono">
          Tournament Winners
        </h1>
        <p className="text-xs text-gray-400 max-w-xl">
          Celebrating victorious BGMI squads. Every champion record includes audited payment proofs, match result sheets, and verified screenshots.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {winners.map((winner) => (
          <WinnerCard key={winner.id} winner={winner} />
        ))}
      </div>
    </div>
  );
};
