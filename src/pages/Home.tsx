import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentSupabaseUser } from '../lib/supabaseAuth';
import {
  Trophy,
  Swords,
  Users,
  Award,
  ChevronRight,
  Tv,
  Newspaper,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Zap,
  Play,
  ArrowRight,
} from 'lucide-react';
import { QuickLoginCard } from '../components/auth/QuickLoginCard';
import { WhatsAppCommunityHub } from '../components/whatsapp/WhatsAppCommunityHub';
import { dbStore } from '../services/dbStore';
import { TournamentCard } from '../components/tournament/TournamentCard';
import { WinnerCard } from '../components/winners/WinnerCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const stats = dbStore.getDynamicStats();
  const tournaments = dbStore.getTournaments();
  const winners = dbStore.getWinnerRecords();
  const news = dbStore.getNews();
  const youtube = dbStore.getYouTubeVideos();
  const leaderboard = dbStore.getTournamentLeaderboard('tr-2');

  const featuredTournament = tournaments.find((t) => t.status === 'Registration Open') || tournaments[0];
  const upcomingTournaments = tournaments.filter((t) => t.status === 'Registration Open' || t.status === 'Upcoming');

  return (
    <div className="space-y-12 pb-16 pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HERO BENTO GRID HEADER */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#222222]">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white font-mono flex items-center gap-1">
              BGMI<span className="text-[#D4FF33]">/</span>DASH
            </h1>
            <p className="text-zinc-500 text-xs font-mono font-medium">Competitive Esports Intelligence & Tournament Hub v2.4</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-[#D4FF33] font-mono font-bold">SYSTEM_STATUS: ONLINE</p>
              <p className="text-[10px] text-zinc-500 font-mono">NEXT MATCH: 18:00 IST</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#222222] flex items-center justify-center font-black text-[#D4FF33] font-mono text-xs">
              ARENA
            </div>
          </div>
        </div>

        {/* BENTO GRID HERO SHOWCASE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Bento Block 1: Main Active Deliverables / Featured Tournament (Col-span 2, Row-span 2) */}
          <div className="md:col-span-2 md:row-span-2 bg-[#111111] border border-[#222222] rounded-[32px] p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#D4FF33]" />
                  Active Featured Arena
                </h2>
                <Badge variant="lime">
                  {featuredTournament ? `${featuredTournament.registered_teams}/${featuredTournament.max_teams} Teams` : '6 Live'}
                </Badge>
              </div>

              {featuredTournament && (
                <div className="space-y-5">
                  <div className="bg-[#1A1A1A] border border-[#222222] p-5 rounded-2xl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-base font-bold text-white">{featuredTournament.title}</p>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">{featuredTournament.format} &bull; {featuredTournament.mode} &bull; {featuredTournament.map}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#D4FF33] bg-[#0A0A0A] px-2.5 py-1 rounded-full border border-[#222222]">
                        ₹{featuredTournament.prize_pool.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-zinc-400">
                        <span>Registration Slot Capacity</span>
                        <span className="text-[#D4FF33] font-bold">
                          {Math.round((featuredTournament.registered_teams / featuredTournament.max_teams) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#0A0A0A] rounded-full overflow-hidden border border-[#222222]">
                        <div
                          className="h-full bg-[#D4FF33] transition-all duration-500"
                          style={{
                            width: `${Math.round((featuredTournament.registered_teams / featuredTournament.max_teams) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {featuredTournament.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-6">
              <Button
                variant="primary"
                size="md"
                className="w-full flex-1"
                onClick={async () => {
              const user = await getCurrentSupabaseUser();

              if (!user) {
                navigate('/login', { replace: true });
                return;
              }

              navigate(
                featuredTournament
                ? `/tournaments/${featuredTournament.slug}`
                : '/tournaments'
                );
              }}
            >
              <Swords className="w-4 h-4" /> JOIN FEATURED ARENA
              </Button>
              <Link to="/signup">
                <Button variant="outline" size="md">
                  CREATE SQUAD
                </Button>
              </Link>
            </div>
          </div>

          {/* Bento Block 2: Solid Lime Metric Highlight Card */}
          <div className="bg-[#D4FF33] rounded-[32px] p-6 lg:p-8 flex flex-col justify-between text-black min-h-[220px]">
            <p className="text-[10px] font-black uppercase tracking-widest font-mono">Total Prize Distributed</p>
            <div>
              <p className="text-5xl lg:text-6xl font-black tracking-tighter italic leading-none font-mono">
                ₹{(stats.totalPrizePool / 1000).toFixed(0)}K
              </p>
              <p className="text-xs font-bold font-mono mt-2">Verified Bank & UPI Payouts</p>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <span className="text-[11px] font-bold font-mono">+100% Guaranteed</span>
              <div className="flex-1 h-[1px] bg-black/20" />
            </div>
          </div>

          {/* Bento Block 3: Match Schedule Timeline (1x2 Span) */}
          <div className="md:row-span-2 bg-[#111111] border border-[#222222] rounded-[32px] p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 font-mono mb-6">Match Schedule</h3>
              <div className="space-y-6">
                <div className="relative pl-5 border-l border-zinc-800">
                  <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#D4FF33]" />
                  <p className="text-[10px] text-[#D4FF33] font-mono font-bold">18:00 IST &bull; LIVE NOW</p>
                  <p className="text-sm font-bold text-white mt-0.5">Custom Room Lobby #1</p>
                  <p className="text-xs text-zinc-500 font-mono">Erangel &bull; Squad Battle</p>
                </div>

                <div className="relative pl-5 border-l border-zinc-800">
                  <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-white" />
                  <p className="text-[10px] text-zinc-400 font-mono">20:30 IST</p>
                  <p className="text-sm font-bold text-white mt-0.5">Semi Finals Showdown</p>
                  <p className="text-xs text-zinc-500 font-mono">Miramar &bull; Map 2</p>
                </div>

                <div className="relative pl-5 border-l border-zinc-800">
                  <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <p className="text-[10px] text-zinc-500 font-mono">TOMORROW</p>
                  <p className="text-sm font-bold text-white mt-0.5">Grand Finals Stage</p>
                  <p className="text-xs text-zinc-500 font-mono">Sanlok &bull; Trophy Round</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#222222] mt-6">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mb-3">Top Contenders</p>
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full bg-zinc-800 border-2 border-[#111111] flex items-center justify-center text-[10px] font-bold font-mono text-white">TX</div>
                <div className="w-9 h-9 rounded-full bg-zinc-700 border-2 border-[#111111] flex items-center justify-center text-[10px] font-bold font-mono text-white">S8</div>
                <div className="w-9 h-9 rounded-full bg-[#D4FF33] border-2 border-[#111111] flex items-center justify-center text-[10px] font-black text-black font-mono">+12</div>
              </div>
            </div>
          </div>

          {/* Bento Block 4: Match Countdown Timer Block */}
          <div className="bg-[#111111] border border-[#222222] rounded-[32px] p-6 flex flex-col justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 font-mono">Next Match Lobby</p>
            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl lg:text-4xl font-bold tracking-tighter font-mono text-white">25:00</p>
                <span className="text-[#D4FF33] animate-pulse text-lg">●</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">Room ID releases at 17:45</p>
            </div>
            <Link to="/tournaments">
              <button className="w-full py-2.5 bg-[#1A1A1A] rounded-xl border border-[#222222] text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-300 hover:text-white hover:border-[#D4FF33] transition-all cursor-pointer">
                Enter Room Lobby
              </button>
            </Link>
          </div>

          {/* Bento Block 5: System Metrics Bar Chart (Col-span 2) */}
          <div className="md:col-span-2 bg-[#111111] border border-[#222222] rounded-[32px] p-6 lg:p-8 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Platform Activity Stream</h3>
              <p className="text-xs text-zinc-500 font-mono">{stats.tournamentsHosted} Tournaments &bull; {stats.matchesPlayed} Matches</p>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[10px] font-mono text-[#D4FF33] bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#222222]">
                  {stats.activePlayers} Active Players
                </span>
              </div>
            </div>

            <div className="flex gap-2 items-end h-16 shrink-0">
              <div className="w-3.5 h-[35%] bg-zinc-800 rounded-sm" />
              <div className="w-3.5 h-[50%] bg-zinc-800 rounded-sm" />
              <div className="w-3.5 h-[90%] bg-[#D4FF33] rounded-sm" />
              <div className="w-3.5 h-[65%] bg-[#D4FF33] rounded-sm" />
              <div className="w-3.5 h-[45%] bg-zinc-800 rounded-sm" />
              <div className="w-3.5 h-[80%] bg-[#D4FF33] rounded-sm" />
              <div className="w-3.5 h-[100%] bg-[#D4FF33] rounded-sm" />
            </div>
          </div>

          {/* Bento Block 6: Quick Arena Sign In Card */}
          <div className="md:col-span-2 lg:col-span-1">
            <QuickLoginCard compact className="h-full rounded-[32px]" />
          </div>
        </div>
      </section>

      {/* 2. ACTIVE TOURNAMENTS BENTO GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#D4FF33]" />
            Active & Upcoming Tournaments
          </h2>
          <Link to="/tournaments" className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4FF33] hover:underline">
            View All ({tournaments.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      </section>

      {/* 3. LEADERBOARD & CHAMPIONS BENTO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Highlights (Col Span 2) */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#222222] rounded-[32px] p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#222222] pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#D4FF33] uppercase tracking-widest block">
                Live Standings Ticker
              </span>
              <h2 className="text-xl font-bold text-white">Leaderboard Highlights</h2>
            </div>
            <Link to="/leaderboard">
              <Button variant="outline" size="sm">
                Full Leaderboard <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {leaderboard.slice(0, 3).map((entry) => (
              <div
                key={entry.team_id}
                className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#222222] flex items-center justify-between gap-4 hover:border-[#D4FF33]/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#0A0A0A] text-[#D4FF33] border border-[#222222] font-mono font-bold text-xs flex items-center justify-center">
                    #{entry.rank}
                  </span>
                  <img
                    src={entry.team_logo_url}
                    alt={entry.team_name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#222222]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{entry.team_name}</h4>
                    <span className="text-xs font-mono text-zinc-500">{entry.chicken_dinners} Dinners &bull; {entry.total_kills} Kills</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-lg font-black text-[#D4FF33]">{entry.total_points}</span>
                  <span className="text-[10px] text-zinc-500 block">PTS</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Champion Highlight Card */}
        {winners[0] && (
          <div className="bg-[#111111] border border-[#222222] rounded-[32px] p-6 lg:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="lime" pulse>Verified Winner</Badge>
                <span className="text-[10px] font-mono text-zinc-500">RECENT CHAMP</span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#222222] h-40 relative">
                <img src={winners[0].winner_screenshot} alt={winners[0].winning_team_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <img src={winners[0].winning_team_logo} alt={winners[0].winning_team_name} className="w-8 h-8 rounded-lg object-cover border border-[#D4FF33]" />
                  <span className="text-sm font-bold text-white">{winners[0].winning_team_name}</span>
                </div>
              </div>

              <div className="p-3 bg-[#1A1A1A] rounded-2xl border border-[#222222] flex justify-between font-mono text-xs">
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">Prize Claimed</span>
                  <span className="text-sm font-black text-[#D4FF33]">₹{winners[0].prize_amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 block uppercase">Points</span>
                  <span className="text-sm font-bold text-white">{winners[0].total_points}</span>
                </div>
              </div>
            </div>

            <Link to="/winners" className="pt-4">
              <Button variant="outline" size="sm" className="w-full">
                Hall of Champions <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* 4. HOW IT WORKS BENTO GRID */}
      <section className="bg-[#111111] border border-[#222222] rounded-[32px] p-8 space-y-6">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <span className="text-[10px] font-mono font-bold text-[#D4FF33] uppercase tracking-widest block">
            PLAYER WORKFLOW
          </span>
          <h2 className="text-2xl font-bold text-white">How To Compete & Win</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#1A1A1A] rounded-2xl border border-[#222222] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#222222] text-[#D4FF33] font-mono font-bold text-sm flex items-center justify-center">
              01
            </div>
            <h4 className="text-sm font-bold text-white uppercase">Register Squad</h4>
            <p className="text-xs text-zinc-400">Add player in-game BGMI IDs & select captain.</p>
          </div>

          <div className="p-5 bg-[#1A1A1A] rounded-2xl border border-[#222222] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#222222] text-[#D4FF33] font-mono font-bold text-sm flex items-center justify-center">
              02
            </div>
            <h4 className="text-sm font-bold text-white uppercase">Enter Tournament</h4>
            <p className="text-xs text-zinc-400">Choose mode, confirm schedule, and claim entry slot.</p>
          </div>

          <div className="p-5 bg-[#1A1A1A] rounded-2xl border border-[#222222] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#222222] text-[#D4FF33] font-mono font-bold text-sm flex items-center justify-center">
              03
            </div>
            <h4 className="text-sm font-bold text-white uppercase">Get Room Access</h4>
            <p className="text-xs text-zinc-400">Room ID & Pass published 15 mins before drop.</p>
          </div>

          <div className="p-5 bg-[#1A1A1A] rounded-2xl border border-[#222222] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#222222] text-[#D4FF33] font-mono font-bold text-sm flex items-center justify-center">
              04
            </div>
            <h4 className="text-sm font-bold text-white uppercase">Verified Rewards</h4>
            <p className="text-xs text-zinc-400">Scorecard confirmed, leaderboard updated & cash paid.</p>
          </div>
        </div>
      </section>

      {/* WHATSAPP OFFICIAL COMMUNITY SECTION */}
      <section className="space-y-4">
        <WhatsAppCommunityHub />
      </section>

      {/* 5. NEWS & MEDIA BENTO GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest News */}
        <div className="bg-[#111111] border border-[#222222] rounded-[32px] p-6 lg:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222222] pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#D4FF33]" /> Esports Intelligence News
            </h3>
            <Link to="/news" className="text-xs font-mono font-bold uppercase text-[#D4FF33] hover:underline">
              All Articles
            </Link>
          </div>

          <div className="space-y-3">
            {news.slice(0, 2).map((item) => (
              <div key={item.id} className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#222222] space-y-1.5">
                <Badge variant="lime">{item.category}</Badge>
                <Link to={`/news/${item.slug}`}>
                  <h4 className="text-sm font-bold text-white hover:text-[#D4FF33] transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                </Link>
                <p className="text-xs text-zinc-400 line-clamp-2">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured YouTube Stream */}
        {youtube[0] && (
          <div className="bg-[#111111] border border-[#222222] rounded-[32px] p-6 lg:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-red-500" /> Live Media & Broadcast
              </h3>
              <Link to="/youtube" className="text-xs font-mono font-bold uppercase text-[#D4FF33] hover:underline">
                Media Hub
              </Link>
            </div>

            <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#222222] space-y-3">
              <div className="relative h-44 rounded-xl overflow-hidden border border-[#222222] bg-black group">
                <img src={youtube[0].thumbnail_url} alt={youtube[0].title} className="w-full h-full object-cover" />
                <a
                  href={youtube[0].youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-[#D4FF33] text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-black" />
                  </div>
                </a>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{youtube[0].title}</h4>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
