import React from 'react';
import { Shield, Trophy, Users, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2 text-center">
        <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
          Platform Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-black italic text-white uppercase font-mono">
          About BGMI.ARENA
        </h1>
      </div>

      <Card className="p-8 space-y-6 leading-relaxed text-xs text-gray-300 font-mono">
        <p className="text-sm text-gray-200">
          BGMI.ARENA is India's premier independent community BGMI esports tournament platform dedicated to providing grassroot mobile gamers and tier-1 esports athletes with transparent, automated, and cheat-free competitive scrims and scrimmages.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          <div className="p-4 bg-black/60 rounded-xl border border-gray-800 space-y-2">
            <h3 className="font-bold text-orange-400 uppercase text-sm">Automated Points Engine</h3>
            <p>Calculates placement and kill points instantly adhering strictly to official Krafton BGMI esports point matrices.</p>
          </div>
          <div className="p-4 bg-black/60 rounded-xl border border-gray-800 space-y-2">
            <h3 className="font-bold text-blue-400 uppercase text-sm">Verified Prize Distribution</h3>
            <p>Every winner payout is audited with transparent receipt proofs published directly to our community Hall of Fame.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
