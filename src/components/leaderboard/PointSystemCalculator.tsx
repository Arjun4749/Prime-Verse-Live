import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Crosshair,
  Award,
  Zap,
  Calculator,
  HelpCircle,
  CheckCircle,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '../ui/Card';

export interface PointPreset {
  id: string;
  name: string;
  description: string;
  wwcdPoints: number;
  pointsPerKill: number;
  placements: Record<number, number>;
}

export const POINT_PRESETS: PointPreset[] = [
  {
    id: 'bgis-10pt',
    name: 'BGIS 2026 Official (10-Pt Standard)',
    description: 'Current Official BGMI Esports Point Matrix (10 WWCD + 1pt/Kill)',
    wwcdPoints: 10,
    pointsPerKill: 1,
    placements: {
      1: 10,
      2: 6,
      3: 5,
      4: 4,
      5: 3,
      6: 2,
      7: 1,
      8: 1,
    },
  },
  {
    id: 'pmco-15pt',
    name: 'PMCO Classic (15-Pt Standard)',
    description: 'Classic Esports High-Reward Placement Matrix (15 WWCD + 1pt/Kill)',
    wwcdPoints: 15,
    pointsPerKill: 1,
    placements: {
      1: 15,
      2: 12,
      3: 10,
      4: 8,
      5: 6,
      6: 4,
      7: 2,
    },
  },
  {
    id: 'blitz-20pt',
    name: 'Aggressive Blitz (20-Pt + 2pt/Kill)',
    description: 'Double Kill Weight & Mega Winner Bonus for Fast-Paced Tournaments',
    wwcdPoints: 20,
    pointsPerKill: 2,
    placements: {
      1: 20,
      2: 14,
      3: 10,
      4: 8,
      5: 6,
      6: 4,
      7: 2,
    },
  },
];

export const PointSystemCalculator: React.FC<{ defaultPresetId?: string }> = ({ defaultPresetId = 'bgis-10pt' }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPresetId);
  const [inputPlacement, setInputPlacement] = useState<number>(1);
  const [inputKills, setInputKills] = useState<number>(8);

  const activePreset = POINT_PRESETS.find((p) => p.id === selectedPresetId) || POINT_PRESETS[0];

  const placementPoints = activePreset.placements[inputPlacement] || 0;
  const killPoints = inputKills * activePreset.pointsPerKill;
  const totalPoints = placementPoints + killPoints;

  return (
    <Card className="p-6 sm:p-8 bg-[#0a0d18] border-2 border-orange-500/40 shadow-[0_0_50px_rgba(249,115,22,0.1)] font-mono space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-widest">
            <Zap className="w-4 h-4 text-orange-400" />
            Official Scoring Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-black italic text-white uppercase mt-0.5">
            Point System & Score Calculator
          </h2>
        </div>

        {/* Preset Rule Switcher */}
        <div className="flex flex-wrap gap-2">
          {POINT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedPresetId === preset.id
                  ? 'bg-orange-500 text-black border-orange-400 shadow-md shadow-orange-500/30'
                  : 'bg-black/60 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
              }`}
            >
              {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Description */}
      <div className="p-4 rounded-2xl bg-[#111526] border border-orange-500/20 text-xs text-orange-200 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-orange-400 shrink-0" />
        <div>
          <span className="font-bold text-white uppercase block">{activePreset.name}</span>
          <p className="text-gray-300 mt-0.5">{activePreset.description}</p>
        </div>
      </div>

      {/* Interactive Score Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Control Box */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-gradient-to-b from-[#12162a] to-[#0a0d18] border border-gray-800 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-gray-800 pb-3">
            <Calculator className="w-4 h-4 text-orange-400" />
            Match Outcome Simulator
          </h3>

          {/* Placement Selector Slider / Number */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Squad Placement (Rank)
              </span>
              <span className="text-white font-black bg-black px-2.5 py-1 rounded-lg border border-gray-800">
                #{inputPlacement} {inputPlacement === 1 ? '🥇 (WWCD WINNER)' : ''}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={25}
              value={inputPlacement}
              onChange={(e) => setInputPlacement(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-gray-800 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-gray-500 font-bold">
              <span>1st (WWCD)</span>
              <span>8th Place</span>
              <span>16th Place</span>
              <span>25th Place</span>
            </div>
          </div>

          {/* Kills Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-red-400" />
                Team Finishes (Kills)
              </span>
              <span className="text-red-400 font-black bg-black px-2.5 py-1 rounded-lg border border-gray-800">
                {inputKills} Kills
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setInputKills(Math.max(0, inputKills - 1))}
                className="w-10 h-10 rounded-xl bg-black border border-gray-800 hover:border-red-500 text-white font-black text-lg flex items-center justify-center cursor-pointer transition-all"
              >
                -
              </button>
              <input
                type="number"
                min={0}
                max={50}
                value={inputKills}
                onChange={(e) => setInputKills(Math.max(0, Number(e.target.value)))}
                className="flex-1 bg-black border border-gray-800 rounded-xl py-2 px-3 text-center text-white font-black text-base focus:border-orange-500"
              />
              <button
                onClick={() => setInputKills(inputKills + 1)}
                className="w-10 h-10 rounded-xl bg-black border border-gray-800 hover:border-emerald-500 text-white font-black text-lg flex items-center justify-center cursor-pointer transition-all"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Calculation Output Badge */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-gradient-to-b from-[#182012] to-[#0a0d18] border border-emerald-500/30 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Calculated Match Output
            </span>
            <span className="text-[10px] text-gray-400 uppercase">Live Preview</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-black/60 border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Winning / Placement Pts</span>
              <p className="text-2xl font-black text-amber-400 mt-1">
                +{placementPoints} <span className="text-xs text-gray-400">pts</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Kill Pts ({activePreset.pointsPerKill}pt/kill)
              </span>
              <p className="text-2xl font-black text-red-400 mt-1">
                +{killPoints} <span className="text-xs text-gray-400">pts</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-1">
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">
              TOTAL MATCH POINTS GAINED
            </span>
            <p className="text-4xl font-black text-[#D4FF33] tracking-tight drop-shadow-[0_0_15px_rgba(212,255,51,0.4)]">
              {totalPoints} <span className="text-lg text-[#D4FF33]">PTS</span>
            </p>
          </div>
        </div>
      </div>

      {/* Official Placement Points Matrix Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          {activePreset.name} — Placement Points Matrix
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((rank) => {
            const pts = activePreset.placements[rank] || 0;
            const isSelected = inputPlacement === rank;

            return (
              <div
                key={rank}
                onClick={() => setInputPlacement(rank)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer text-center space-y-1 ${
                  isSelected
                    ? 'bg-orange-500 border-orange-400 text-black shadow-lg shadow-orange-500/30 scale-105'
                    : rank === 1
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : pts > 0
                    ? 'bg-[#111424] border-gray-800 text-gray-300 hover:border-gray-700'
                    : 'bg-black/40 border-gray-900 text-gray-600'
                }`}
              >
                <span className="text-[10px] font-bold uppercase block">
                  {rank === 1 ? '🥇 1st (WWCD)' : `#${rank} Place`}
                </span>
                <p className="text-lg font-black">{pts} PTS</p>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-500 italic">
          * Positions 9th to 25th earn 0 Placement Points but receive full Finish / Kill Points.
        </p>
      </div>

      {/* Tie-Breaker Protocol Info Box */}
      <div className="p-4 rounded-2xl bg-[#0e111d] border border-gray-800 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-white font-bold uppercase border-b border-gray-800 pb-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Official Tie-Breaker Rules (In Order of Priority)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-gray-300 font-mono">
          <div className="p-3 rounded-xl bg-black/60 border border-gray-800/80">
            <span className="text-[10px] text-orange-400 font-bold uppercase block">Rule #1</span>
            <p className="font-bold text-white mt-0.5">Most Winner Winner Chicken Dinners (WWCDs)</p>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-gray-800/80">
            <span className="text-[10px] text-orange-400 font-bold uppercase block">Rule #2</span>
            <p className="font-bold text-white mt-0.5">Highest Cumulative Kill Points</p>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-gray-800/80">
            <span className="text-[10px] text-orange-400 font-bold uppercase block">Rule #3</span>
            <p className="font-bold text-white mt-0.5">Best Placement in Final Match of Tournament</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
