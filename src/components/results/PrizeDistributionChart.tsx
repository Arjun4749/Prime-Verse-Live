import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Trophy, Award, DollarSign, TrendingUp, ShieldCheck, Crown, Flame, PieChart as PieIcon, BarChart2 as BarIcon, Layers } from 'lucide-react';
import { Card } from '../ui/Card';

interface PrizeTier {
  rank: string;
  percentage: number;
  team: string;
  teamTag: string;
  teamLogo?: string;
  amount: number;
  color: string;
}

interface SeasonData {
  seasonId: string;
  seasonName: string;
  totalPrizePool: number;
  currency: string;
  tiers: PrizeTier[];
  historicalSeasons: {
    season: string;
    totalPrize: number;
    championPayout: number;
    teamsCount: number;
  }[];
}

const SEASON_PRIZE_DATA: SeasonData[] = [
  {
    seasonId: 'season-1',
    seasonName: 'BGMI Arena Pro Series: Season 1',
    totalPrizePool: 25000,
    currency: '₹',
    tiers: [
      { rank: '1st Place (Champion)', percentage: 50, team: 'GodLike eSports', teamTag: 'GODL', amount: 12500, color: '#D4FF33' },
      { rank: '2nd Place (Runner-Up)', percentage: 25, team: 'Soul Gaming', teamTag: 'SOUL', amount: 6250, color: '#38BDF8' },
      { rank: '3rd Place (2nd Runner-Up)', percentage: 15, team: 'Entity Gaming', teamTag: 'ENT', amount: 3750, color: '#F59E0B' },
      { rank: '4th Place', percentage: 5, team: 'Orangutan Gaming', teamTag: 'OG', amount: 1250, color: '#A855F7' },
      { rank: 'MVP / Top Fragger', percentage: 5, team: 'GODLxJONATHAN (GodLike)', teamTag: 'GODL', amount: 1250, color: '#F43F5E' },
    ],
    historicalSeasons: [
      { season: 'Qualifiers', totalPrize: 5000, championPayout: 2500, teamsCount: 32 },
      { season: 'Quarter Finals', totalPrize: 8000, championPayout: 4000, teamsCount: 24 },
      { season: 'Semi Finals', totalPrize: 12000, championPayout: 6000, teamsCount: 16 },
      { season: 'Grand Finals (S1)', totalPrize: 25000, championPayout: 12500, teamsCount: 16 },
    ],
  },
  {
    seasonId: 'season-cup',
    seasonName: 'Erangel Conquerors Cup',
    totalPrizePool: 10000,
    currency: '₹',
    tiers: [
      { rank: '1st Place (Champion)', percentage: 55, team: 'Soul Gaming', teamTag: 'SOUL', amount: 5500, color: '#D4FF33' },
      { rank: '2nd Place (Runner-Up)', percentage: 25, team: 'GodLike eSports', teamTag: 'GODL', amount: 2500, color: '#38BDF8' },
      { rank: '3rd Place', percentage: 12, team: 'Carnival Gaming', teamTag: 'CG', amount: 1200, color: '#F59E0B' },
      { rank: 'Top Duo Fraggers', percentage: 8, team: 'SOULxGOBLIN & SOULxNAKUL', teamTag: 'SOUL', amount: 800, color: '#F43F5E' },
    ],
    historicalSeasons: [
      { season: 'Stage 1 Duo', totalPrize: 2000, championPayout: 1000, teamsCount: 25 },
      { season: 'Stage 2 Duo', totalPrize: 3000, championPayout: 1500, teamsCount: 20 },
      { season: 'Stage 3 Finals', totalPrize: 10000, championPayout: 5500, teamsCount: 12 },
    ],
  },
  {
    seasonId: 'season-solo',
    seasonName: 'Sanhok Blitz Solo Championship',
    totalPrizePool: 5000,
    currency: '₹',
    tiers: [
      { rank: '1st Place (Solo King)', percentage: 60, team: 'GODLxJONATHAN', teamTag: 'GODL', amount: 3000, color: '#D4FF33' },
      { rank: '2nd Place', percentage: 25, team: 'SOULxGOBLIN', teamTag: 'SOUL', amount: 1250, color: '#38BDF8' },
      { rank: '3rd Place', percentage: 15, team: 'ENTxSAUMRAJ', teamTag: 'ENT', amount: 750, color: '#F59E0B' },
    ],
    historicalSeasons: [
      { season: 'Solo Group A', totalPrize: 1000, championPayout: 500, teamsCount: 50 },
      { season: 'Solo Group B', totalPrize: 1000, championPayout: 500, teamsCount: 50 },
      { season: 'Solo Championship', totalPrize: 5000, championPayout: 3000, teamsCount: 20 },
    ],
  },
];

export const PrizeDistributionChart: React.FC = () => {
  const [selectedSeasonId, setSelectedSeasonId] = useState('season-1');
  const [activeChartTab, setActiveChartTab] = useState<'donut' | 'bar' | 'trend'>('donut');

  const currentSeason = SEASON_PRIZE_DATA.find((s) => s.seasonId === selectedSeasonId) || SEASON_PRIZE_DATA[0];

  // Custom Recharts Tooltip for Donut/Bar Charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as PrizeTier;
      return (
        <div className="bg-[#0b0d14] border border-[#222222] p-3 rounded-xl shadow-2xl font-mono text-xs space-y-1">
          <p className="font-bold text-white uppercase flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: data.color }} />
            {data.rank}
          </p>
          <p className="text-gray-300">
            Winner: <span className="text-[#D4FF33] font-bold">[{data.teamTag}] {data.team}</span>
          </p>
          <p className="text-[#D4FF33] font-extrabold text-sm">
            Payout: ₹{data.amount.toLocaleString()} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0b0d14] border border-[#222222] p-3 rounded-xl shadow-2xl font-mono text-xs space-y-1">
          <p className="font-bold text-white uppercase">{data.season}</p>
          <p className="text-gray-300">Total Pool: <span className="text-[#D4FF33] font-bold">₹{data.totalPrize.toLocaleString()}</span></p>
          <p className="text-sky-400">1st Winner Share: ₹{data.championPayout.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header & Season Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0c0e17] border border-[#222222]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF33]/20 text-[#D4FF33] border border-[#D4FF33]/30 text-[10px] font-bold uppercase flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Recharts Analytics
            </span>
            <span className="text-xs text-gray-400 font-bold">Prize Distribution Breakdown</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black italic text-white uppercase">
            Tournament Cash Split
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSeasonId}
            onChange={(e) => setSelectedSeasonId(e.target.value)}
            className="bg-[#141724] border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold cursor-pointer hover:border-[#D4FF33]/50 transition-colors"
          >
            {SEASON_PRIZE_DATA.map((s) => (
              <option key={s.seasonId} value={s.seasonId}>
                {s.seasonName} (₹{s.totalPrizePool.toLocaleString()})
              </option>
            ))}
          </select>

          {/* View Toggles */}
          <div className="flex bg-[#141724] p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setActiveChartTab('donut')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeChartTab === 'donut'
                  ? 'bg-[#D4FF33] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setActiveChartTab('bar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeChartTab === 'bar'
                  ? 'bg-[#D4FF33] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarIcon className="w-3.5 h-3.5" />
              <span>Bars</span>
            </button>
            <button
              onClick={() => setActiveChartTab('trend')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeChartTab === 'trend'
                  ? 'bg-[#D4FF33] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Stages</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#0f121d] border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-[#D4FF33]" /> Total Pool
          </span>
          <p className="text-xl font-extrabold text-[#D4FF33]">
            ₹{currentSeason.totalPrizePool.toLocaleString()}
          </p>
          <span className="text-[10px] text-gray-500">100% Guaranteed</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f121d] border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-400" /> Champion Share
          </span>
          <p className="text-xl font-extrabold text-white">
            ₹{currentSeason.tiers[0].amount.toLocaleString()}
          </p>
          <span className="text-[10px] text-amber-400 font-bold">
            {currentSeason.tiers[0].percentage}% Pool Share
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f121d] border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
            <Award className="w-3 h-3 text-sky-400" /> Runner-Up Share
          </span>
          <p className="text-xl font-extrabold text-white">
            ₹{currentSeason.tiers[1].amount.toLocaleString()}
          </p>
          <span className="text-[10px] text-sky-400 font-bold">
            {currentSeason.tiers[1].percentage}% Pool Share
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f121d] border border-gray-800 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" /> MVP / Fragger
          </span>
          <p className="text-xl font-extrabold text-white">
            ₹{(currentSeason.tiers.find((t) => t.rank.includes('MVP') || t.rank.includes('Fragger'))?.amount || 1000).toLocaleString()}
          </p>
          <span className="text-[10px] text-rose-400 font-bold">Individual Bounty</span>
        </div>
      </div>

      {/* Main Visual Breakdown & Tier Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Visual Chart Panel */}
        <Card className="lg:col-span-7 p-6 bg-[#0c0e17] border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4FF33]" />
              {activeChartTab === 'donut' && 'Percentage Distribution Donut'}
              {activeChartTab === 'bar' && 'Payout Comparison Bar Chart'}
              {activeChartTab === 'trend' && 'Stage-Wise Prize Pool Accumulation'}
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">Interactive Hover</span>
          </div>

          <div className="h-[280px] sm:h-[320px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartTab === 'donut' ? (
                <PieChart>
                  <Pie
                    data={currentSeason.tiers}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="amount"
                    nameKey="rank"
                  >
                    {currentSeason.tiers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0c0e17" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              ) : activeChartTab === 'bar' ? (
                <BarChart data={currentSeason.tiers} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <XAxis
                    dataKey="teamTag"
                    stroke="#6B7280"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={10}
                    tickFormatter={(val) => `₹${val}`}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {currentSeason.tiers.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <AreaChart data={currentSeason.historicalSeasons} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="prizeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4FF33" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#D4FF33" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="season" stroke="#6B7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6B7280" fontSize={10} tickFormatter={(val) => `₹${val}`} tickLine={false} />
                  <Tooltip content={<CustomTrendTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="totalPrize"
                    stroke="#D4FF33"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#prizeGrad)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Color Legend Footer */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-gray-800 text-[11px]">
            {currentSeason.tiers.map((tier, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                <span className="text-gray-300 font-bold">{tier.rank}:</span>
                <span className="text-white">₹{tier.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Table Panel */}
        <Card className="lg:col-span-5 p-6 bg-[#0c0e17] border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Payout Schedule
            </h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase">
              Automated Disbursal
            </span>
          </div>

          <div className="space-y-3">
            {currentSeason.tiers.map((tier, index) => (
              <div
                key={index}
                className="p-3.5 rounded-2xl bg-[#121522] border border-gray-800 hover:border-gray-700 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-black text-xs shrink-0 shadow-md"
                    style={{ backgroundColor: tier.color }}
                  >
                    #{index + 1}
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">{tier.rank}</span>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="text-[#D4FF33]">[{tier.teamTag}]</span>
                      <span>{tier.team}</span>
                    </h5>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-[#D4FF33]">
                    ₹{tier.amount.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {tier.percentage}% Share
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
