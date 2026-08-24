import React from 'react';
import { BookOpen, ShieldCheck, AlertOctagon, CheckCircle2, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PointSystemCalculator } from '../components/leaderboard/PointSystemCalculator';

export const Rules: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 font-mono animate-fade-in">
      <div className="space-y-2 text-center">
        <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
          Fair Play & Technical Standards
        </span>
        <h1 className="text-3xl sm:text-5xl font-black italic text-white uppercase font-mono">
          Official Tournament Rulebook
        </h1>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
          <div className="p-4 bg-orange-950/20 border border-orange-500/30 rounded-xl space-y-2">
            <h3 className="font-bold text-orange-400 uppercase text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-400" /> 1. Eligibility & Anti-Cheat Compliance
            </h3>
            <p>
              All participating players must have an active BGMI account of Level 30 or higher. Use of third-party plugins, GFX tools, iPad views, emulators, or script modifications results in an immediate lifetime ban.
            </p>
          </div>

          <div className="p-4 bg-black/60 border border-gray-800 rounded-xl space-y-2">
            <h3 className="font-bold text-white uppercase text-sm">2. Room Credentials & Automatic Slot Assignments</h3>
            <p>
              Room ID and Password are disclosed 15 minutes before the scheduled match start time. Team Leaders receive an automatic <strong>Room Slot Pass (SLOT #01 to #25)</strong> on their dashboard. All 4 squad members must sit strictly in their assigned slot.
            </p>
          </div>

          <div className="p-4 bg-black/60 border border-gray-800 rounded-xl space-y-2">
            <h3 className="font-bold text-white uppercase text-sm">3. Prize Claim Verification</h3>
            <p>
              Winning team captains must submit unedited match end-screen screenshots to the admin panel within 30 minutes of match completion for payout audit and approval.
            </p>
          </div>
        </div>
      </Card>

      {/* Point System Matrix & Calculator */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-widest">
          <Zap className="w-4 h-4 text-orange-400" />
          Rulebook Section 4
        </div>
        <PointSystemCalculator />
      </div>
    </div>
  );
};

