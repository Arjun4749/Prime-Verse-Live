import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Users, ShieldCheck, Clock, Swords, BookOpen, Key, Award, AlertCircle, Zap, Crown, Flame, CheckCircle2, MessageSquare, ExternalLink, Share2 } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { isDemoAuthenticated } from '../components/auth/ProtectedRoute';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RoomDetailsCard } from '../components/tournament/RoomDetailsCard';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';

export const TournamentDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const tournament = dbStore.getTournamentBySlug(slug || '');
  const currentUser = dbStore.getCurrentUser();

  const [activeTab, setActiveTab] = useState<'overview' | 'prizes' | 'matches' | 'standings' | 'rules' | 'teams'>('overview');

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#D4FF33] mx-auto" />
        <h2 className="text-2xl font-bold text-white uppercase">Tournament Not Found</h2>
        <p className="text-xs text-zinc-400 font-mono">The requested tournament may have been deleted or moved.</p>
        <Link to="/tournaments">
          <Button variant="primary" size="sm">
            Back to Tournaments
          </Button>
        </Link>
      </div>
    );
  }

  const matches = dbStore.getMatches(tournament.id);
  const registrations = dbStore.getRegistrations(tournament.id);
  const leaderboard = dbStore.getTournamentLeaderboard(tournament.id);
  const announcements = dbStore.getAnnouncements(tournament.id);

  const isUserRegistered = registrations.some((r) => r.captain_id === currentUser.id);
  const isAdminOrMod = currentUser.role === 'admin' || currentUser.role === 'moderator';

  // Prize calculations
  const pool = tournament.prize_pool;
  const firstPrize = Math.round(pool * 0.5);
  const secondPrize = Math.round(pool * 0.25);
  const thirdPrize = Math.round(pool * 0.15);
  const mvpPrize = Math.round(pool * 0.10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner & Title Header */}
      <div className="relative rounded-[32px] overflow-hidden border border-[#222222] shadow-2xl h-80 lg:h-96">
        <img src={tournament.banner_url} alt={tournament.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex gap-2">
              <Badge variant={tournament.status === 'Registration Open' ? 'lime' : 'gray'}>
                {tournament.status}
              </Badge>
              <Badge variant="blue">
                {tournament.format} ({tournament.mode})
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-mono">
              {tournament.title}
            </h1>
            <p className="text-xs text-zinc-300 font-mono flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4FF33]" /> Map: {tournament.map} &bull; Organizer: {tournament.organizer}
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            {tournament.status === 'Registration Open' ? (
              <Button
                variant="primary"
                size="lg"
               onClick={() => {
                const isAuthenticated = isDemoAuthenticated();

                  if (!isAuthenticated) {
                    navigate(
                      `/login?redirect=${encodeURIComponent(
                        `/tournaments/${tournament.slug}/register`
                          )}`,
                      { replace: true }
                    );
                    return;
                  }

                  navigate(`/tournaments/${tournament.slug}/register`);
                }}
                <Swords className="w-5 h-5" /> REGISTER YOUR TEAM
              </Button>
            ) : (
              <Button variant="outline" size="md" disabled>
                {tournament.status}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-[28px] bg-[#111111] border border-[#222222] text-center font-mono">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Total Prize Pool</span>
          <span className="text-2xl font-black text-[#D4FF33]">₹{tournament.prize_pool.toLocaleString('en-IN')}</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Entry Fee</span>
          <span className="text-2xl font-bold text-white">{tournament.entry_fee === 0 ? 'FREE' : `₹${tournament.entry_fee}`}</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Slots Filled</span>
          <span className="text-2xl font-bold text-zinc-300">{tournament.registered_teams} / {tournament.max_teams}</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Start Date</span>
          <span className="text-2xl font-bold text-cyan-400">
            {new Date(tournament.start_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* WHATSAPP ROOM ID ALERT CHANNEL BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#0a1811] to-[#0e2118] border border-emerald-500/40 rounded-[28px] p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_40px_rgba(16,185,129,0.12)] font-mono">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center p-2.5 shrink-0">
            <MessageSquare className="w-6 h-6 fill-emerald-400/20 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                🟢 Live Room Alerts
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">15-Min Advance Room ID Broadcast</span>
            </div>
            <h3 className="text-lg font-black text-white italic uppercase mt-0.5">
              Join {tournament.title} WhatsApp Group
            </h3>
            <p className="text-xs text-emerald-200/80">
              Get instant WhatsApp notifications when Room ID & Password are released for matches.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/whatsapp"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <span>Open WhatsApp Hub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-[#222222] gap-2 overflow-x-auto pb-1">
        {(['overview', 'prizes', 'matches', 'standings', 'rules', 'teams'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-widest font-mono rounded-t-2xl border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-[#D4FF33] text-[#D4FF33] bg-[#111111]'
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-[#111111]/50'
            }`}
          >
            {tab === 'prizes' ? 'Prize Pool Bento' : tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* BENTO GRID PRIZE DISTRIBUTION FEATURE SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#D4FF33]" /> Top Rewards & Prize Matrix
                </h3>
                <span className="text-xs font-mono text-[#D4FF33]">100% Guaranteed Payout</span>
              </div>

              {/* BENTO GRID LAYOUT FOR TOP REWARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {/* 1st Place - Champion Highlight (Col Span 2) */}
                <div className="md:col-span-2 bg-[#D4FF33] rounded-[32px] p-6 lg:p-8 text-black flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[240px]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-black text-[#D4FF33] font-mono font-black text-xs flex items-center justify-center">
                        #1
                      </span>
                      <span className="text-xs font-black font-mono tracking-widest uppercase bg-black/10 px-3 py-1 rounded-full">
                        CHAMPION SQUAD
                      </span>
                    </div>
                    <Crown className="w-8 h-8 text-black" />
                  </div>

                  <div className="my-4">
                    <p className="text-xs font-bold uppercase tracking-wider font-mono opacity-80">50% Prize Pool Share</p>
                    <p className="text-5xl lg:text-6xl font-black tracking-tighter italic font-mono leading-none my-1">
                      ₹{firstPrize.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs font-bold font-mono">+ Winner Trophy & Masters Seed</p>
                  </div>

                  <div className="pt-4 border-t border-black/20 flex items-center justify-between text-xs font-mono font-bold">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Instant Bank/UPI Transfer</span>
                    <span className="uppercase">50% SHARE</span>
                  </div>
                </div>

                {/* 2nd Place - Runner Up */}
                <div className="bg-[#111111] border border-[#222222] rounded-[32px] p-6 flex flex-col justify-between min-h-[240px]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#1A1A1A] text-zinc-300 font-mono font-bold text-xs flex items-center justify-center border border-[#222222]">
                        #2
                      </span>
                      <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-zinc-400">
                        RUNNER-UP
                      </span>
                    </div>
                    <Trophy className="w-6 h-6 text-zinc-400" />
                  </div>

                  <div className="my-3">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">25% Pool Share</p>
                    <p className="text-3xl font-black font-mono text-white tracking-tight">
                      ₹{secondPrize.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono mt-1">+ Silver Runner Medal</p>
                  </div>

                  <div className="pt-3 border-t border-[#222222] text-[10px] font-mono text-zinc-500 flex justify-between">
                    <span>Direct Payout</span>
                    <span className="text-[#D4FF33] font-bold">25% SHARE</span>
                  </div>
                </div>

                {/* 3rd Place - 2nd Runner Up */}
                <div className="bg-[#111111] border border-[#222222] rounded-[32px] p-6 flex flex-col justify-between min-h-[240px]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#1A1A1A] text-amber-500 font-mono font-bold text-xs flex items-center justify-center border border-[#222222]">
                        #3
                      </span>
                      <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-zinc-400">
                        3RD PLACE
                      </span>
                    </div>
                    <Award className="w-6 h-6 text-amber-500" />
                  </div>

                  <div className="my-3">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">15% Pool Share</p>
                    <p className="text-3xl font-black font-mono text-white tracking-tight">
                      ₹{thirdPrize.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono mt-1">+ Bronze Award</p>
                  </div>

                  <div className="pt-3 border-t border-[#222222] text-[10px] font-mono text-zinc-500 flex justify-between">
                    <span>Direct Payout</span>
                    <span className="text-amber-400 font-bold">15% SHARE</span>
                  </div>
                </div>

                {/* MVP & Special Category Bar (Col Span Full on sm, 4 on lg) */}
                <div className="md:col-span-3 lg:col-span-4 bg-[#111111] border border-[#222222] rounded-[28px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#222222] flex items-center justify-center text-[#D4FF33]">
                      <Flame className="w-5 h-5 text-[#D4FF33]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">MVP & Top Fragger Award</h4>
                      <p className="text-xs text-zinc-400 font-mono">Highest individual kills across all match lobbies</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">Award Prize</p>
                      <p className="text-xl font-black font-mono text-[#D4FF33]">₹{mvpPrize.toLocaleString('en-IN')}</p>
                    </div>
                    <Badge variant="lime">10% SHARE</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Schedule Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 space-y-4">
                <h3 className="text-base font-bold text-white uppercase font-mono">Tournament Overview</h3>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line font-normal">{tournament.description}</p>

                {announcements.length > 0 && (
                  <div className="pt-4 border-t border-[#222222] space-y-3">
                    <h4 className="text-xs font-bold uppercase text-[#D4FF33] font-mono">Latest Announcements</h4>
                    {announcements.map((a) => (
                      <div key={a.id} className="p-3 bg-[#1A1A1A] rounded-2xl border border-[#222222] text-xs space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{a.title}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{new Date(a.created_at).toLocaleTimeString('en-IN')}</span>
                        </div>
                        <p className="text-zinc-300">{a.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="space-y-4">
                <h3 className="text-base font-bold text-white uppercase font-mono">Tournament Schedule</h3>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between p-3 bg-[#1A1A1A] rounded-xl border border-[#222222]">
                    <span className="text-zinc-400">Registration Ends:</span>
                    <span className="text-zinc-200">{new Date(tournament.registration_end).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-[#1A1A1A] rounded-xl border border-[#222222]">
                    <span className="text-zinc-400">Matches Start:</span>
                    <span className="text-[#D4FF33] font-bold">{tournament.start_time}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-[#1A1A1A] rounded-xl border border-[#222222]">
                    <span className="text-zinc-400">Organized By:</span>
                    <span className="text-zinc-200">{tournament.organizer}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* DEDICATED PRIZE POOL BENTO TAB */}
        {activeTab === 'prizes' && (
          <div className="space-y-6">
            <div className="p-8 bg-[#111111] border border-[#222222] rounded-[32px] space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222222] pb-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#D4FF33] uppercase tracking-widest block">
                    GUARANTEED PAYOUT MATRIX
                  </span>
                  <h2 className="text-2xl font-bold text-white">Bento Prize Distribution Breakdown</h2>
                  <p className="text-xs text-zinc-400 font-mono mt-1">Total Allocated Prize: ₹{pool.toLocaleString('en-IN')}</p>
                </div>
                <Badge variant="lime" size="md">100% VERIFIED REWARDS</Badge>
              </div>

              {/* Grid Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1st Place */}
                <div className="bg-[#D4FF33] rounded-[32px] p-8 text-black flex flex-col justify-between space-y-6">
                  <div className="flex justify-between items-center">
                    <Badge variant="gray" className="bg-black text-[#D4FF33] border-none font-black">1ST PLACE CHAMPION</Badge>
                    <Crown className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <p className="text-6xl font-black italic tracking-tighter font-mono">₹{firstPrize.toLocaleString('en-IN')}</p>
                    <p className="text-xs font-bold font-mono mt-2">50% Total Prize Pool Allocation</p>
                  </div>
                  <ul className="text-xs font-mono space-y-1.5 pt-4 border-t border-black/20 font-bold">
                    <li>&bull; Winner Champion Trophy</li>
                    <li>&bull; Direct UPI/Bank Transfer in 24 hrs</li>
                    <li>&bull; Seeded Slot in Masters Grand Finals</li>
                  </ul>
                </div>

                {/* 2nd Place */}
                <div className="bg-[#1A1A1A] border border-[#222222] rounded-[32px] p-8 text-white flex flex-col justify-between space-y-6">
                  <div className="flex justify-between items-center">
                    <Badge variant="lime">2ND PLACE RUNNER UP</Badge>
                    <Trophy className="w-8 h-8 text-[#D4FF33]" />
                  </div>
                  <div>
                    <p className="text-5xl font-black italic tracking-tighter font-mono text-white">₹{secondPrize.toLocaleString('en-IN')}</p>
                    <p className="text-xs font-mono text-zinc-400 mt-2">25% Total Prize Pool Allocation</p>
                  </div>
                  <ul className="text-xs font-mono text-zinc-400 space-y-1.5 pt-4 border-t border-[#222222]">
                    <li>&bull; Runner-Up Silver Trophy</li>
                    <li>&bull; Verified Cash Reward Transfer</li>
                    <li>&bull; Leaderboard Ranking Boost</li>
                  </ul>
                </div>

                {/* 3rd Place */}
                <div className="bg-[#1A1A1A] border border-[#222222] rounded-[32px] p-8 text-white flex flex-col justify-between space-y-6">
                  <div className="flex justify-between items-center">
                    <Badge variant="gray">3RD PLACE 2ND RUNNER UP</Badge>
                    <Award className="w-8 h-8 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-5xl font-black italic tracking-tighter font-mono text-white">₹{thirdPrize.toLocaleString('en-IN')}</p>
                    <p className="text-xs font-mono text-zinc-400 mt-2">15% Total Prize Pool Allocation</p>
                  </div>
                  <ul className="text-xs font-mono text-zinc-400 space-y-1.5 pt-4 border-t border-[#222222]">
                    <li>&bull; Bronze Podium Medal</li>
                    <li>&bull; Verified Cash Reward Transfer</li>
                    <li>&bull; Hall of Fame Entry</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m) => (
              <RoomDetailsCard
                key={m.id}
                match={m}
                isRegisteredUserOrAdmin={isUserRegistered || isAdminOrMod}
              />
            ))}
          </div>
        )}

        {activeTab === 'standings' && (
          <LeaderboardTable leaderboard={leaderboard} />
        )}

        {activeTab === 'rules' && (
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase font-mono flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#D4FF33]" /> Official Competition Rules
            </h3>
            <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed bg-[#1A1A1A] p-4 rounded-2xl border border-[#222222]">
              {tournament.rules}
            </pre>
          </Card>
        )}

        {activeTab === 'teams' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {registrations.map((r) => {
              const team = dbStore.getTeamById(r.team_id);
              return (
                <Card key={r.id} className="flex items-center gap-3">
                  <img src={team?.logo_url} alt={team?.name} className="w-12 h-12 rounded-2xl object-cover border border-[#222222]" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{team?.name}</h4>
                    <span className="text-xs font-mono text-[#D4FF33]">{team?.tag}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

