import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Trophy, Users, Shield, Award, Key, Crosshair, ArrowRight, UserPlus, Sparkles, MessageSquare, ExternalLink, Crown, Palette } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { getCurrentSupabaseUser } from '../lib/supabaseAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GradientAvatar } from '../components/ui/GradientAvatar';
import { AvatarCustomizerModal } from '../components/profile/AvatarCustomizerModal';
import { RoomDetailsCard } from '../components/tournament/RoomDetailsCard';
import { SquadSlotPassCard } from '../components/tournament/SquadSlotPassCard';
import { WorkspaceHub } from '../components/workspace/WorkspaceHub';
import { TeamMatchHistory } from '../components/team/TeamMatchHistory';
import { TeamInviteManager } from '../components/team/TeamInviteManager';
import { JoinSquadModal } from '../components/team/JoinSquadModal';
import { SeasonalRankCard } from '../components/dashboard/SeasonalRankCard';
import { AceTierUnlockOverlay } from '../components/dashboard/AceTierUnlockOverlay';
import { Team, UserProfile } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const inviteCodeParam = searchParams.get('invite') || '';

  const [currentUser, setCurrentUser] = useState<UserProfile>(dbStore.getCurrentUser());
  const [teams, setTeams] = useState<Team[]>(dbStore.getTeams());
  // Never open the Join Squad modal before Supabase authentication is confirmed.
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAceOverlayOpen, setIsAceOverlayOpen] = useState<boolean>(
    Boolean(currentUser.pending_ace_unlock)
  );

  const refreshUserData = () => {
    const updatedUser = dbStore.getCurrentUser();
    setCurrentUser(updatedUser);
    if (updatedUser.pending_ace_unlock) {
      setIsAceOverlayOpen(true);
    }
  };

  const refreshTeams = () => {
    setTeams(dbStore.getTeams());
  };

  const requireSignedInUser = async (): Promise<boolean> => {
    const user = await getCurrentSupabaseUser();

    if (!user) {
      setIsJoinModalOpen(false);
      navigate('/login', { replace: true });
      return false;
    }

    return true;
  };

  const handleOpenJoinSquad = async () => {
    if (!(await requireSignedInUser())) return;
    setIsJoinModalOpen(true);
  };

  useEffect(() => {
    const checkInviteAccess = async () => {
      if (!inviteCodeParam) return;

      if (!(await requireSignedInUser())) return;

      setIsJoinModalOpen(true);
    };

    checkInviteAccess();
  }, [inviteCodeParam]);

  const myTeams = teams.filter((t) => t.captain_id === currentUser.id);
  const userMemberTeams = teams.filter((t) =>
    t.members?.some((m) => m.user_id === currentUser.id || m.player_id === currentUser.bgmi_id)
  );
  const displayTeams = userMemberTeams.length > 0 ? userMemberTeams : (myTeams.length > 0 ? myTeams : teams);
  const tournaments = dbStore.getTournaments();

  // Joined Tournaments
  const myRegistrations = dbStore.getRegistrations();
  const joinedTournaments = tournaments.filter((t) =>
    myRegistrations.some((r) => r.tournament_id === t.id && r.captain_id === currentUser.id)
  );

  // Active matches for joined tournaments
  const joinedMatches = joinedTournaments.flatMap((t) => dbStore.getMatches(t.id));

  // Automatic Room Slot Passes for Squad Leaders
  const slotPasses = dbStore.getLeaderSlotPasses(currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Player Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-950/60 via-[#0f121d] to-blue-950/60 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <GradientAvatar
            name={currentUser.game_name || currentUser.username}
            src={currentUser.avatar_url}
            size="xl"
            showGlow
            badge={currentUser.role === 'admin' ? 'admin' : currentUser.rank?.includes('Ace') ? 'ace' : 'verified'}
            onClick={() => setIsAvatarModalOpen(true)}
            title="Click to customize your initials gradient avatar!"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block">
                Player Dashboard
              </span>
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="text-[10px] text-orange-300 hover:text-white underline font-mono flex items-center gap-1 cursor-pointer"
              >
                <Palette className="w-3 h-3 text-orange-400" />
                Customize Avatar
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{currentUser.game_name}</h1>
            <p className="text-xs font-mono text-gray-400">BGMI ID: <strong className="text-white">{currentUser.bgmi_id}</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleOpenJoinSquad}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join Squad via Code</span>
          </button>

          <div className="p-3 bg-black/60 rounded-xl border border-gray-800 text-center">
            <span className="text-[10px] text-gray-400 uppercase block">Joined Matches</span>
            <span className="text-base font-bold text-white">{joinedMatches.length}</span>
          </div>
          <div className="p-3 bg-black/60 rounded-xl border border-gray-800 text-center">
            <span className="text-[10px] text-gray-400 uppercase block">Career Kills</span>
            <span className="text-base font-bold text-red-400">42</span>
          </div>
        </div>
      </div>

      {/* Seasonal Rank Badge & Admin Rank Upgrade Tracker */}
      <SeasonalRankCard
        currentUser={currentUser}
        onRankUpdated={refreshUserData}
        onTriggerAceAnimation={() => setIsAceOverlayOpen(true)}
      />

      {/* Automatic Squad Room Slot Passes (for Team Leaders) */}
      {slotPasses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white italic uppercase font-mono flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#D4FF33]" />
            Your Squad Room Slot Passes
          </h2>
          <div className="space-y-5">
            {slotPasses.map((pass) => (
              <SquadSlotPassCard key={`${pass.tournament_id}-${pass.team_id}`} slotPass={pass} />
            ))}
          </div>
        </div>
      )}

      {/* Room Details & Upcoming Matches */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-white italic uppercase font-mono flex items-center gap-2">
          <Key className="w-5 h-5 text-orange-400" />
          Active Match Rooms & Credentials
        </h2>

        {joinedMatches.length === 0 ? (
          <Card className="p-8 text-center text-xs text-gray-400 space-y-3">
            <Trophy className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="font-bold text-white uppercase">No Active Tournament Matches</p>
            <p>You have not registered for any active tournament yet.</p>
            <Link to="/tournaments">
              <Button variant="primary" size="sm" className="mt-2">
                Browse Tournaments
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {joinedMatches.map((m) => (
              <RoomDetailsCard key={m.id} match={m} isRegisteredUserOrAdmin={true} />
            ))}
          </div>
        )}
      </div>

      {/* Squad Invites & Management Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-black text-white italic uppercase font-mono flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            Squad Invite & Roster Management
          </h2>

          <button
            onClick={handleOpenJoinSquad}
            className="px-3.5 py-2 bg-gray-900 border border-gray-800 hover:border-orange-500/50 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer w-fit"
          >
            <UserPlus className="w-4 h-4 text-orange-400" />
            <span>Enter Invite Code</span>
          </button>
        </div>

        {displayTeams.map((team) => (
          <TeamInviteManager
            key={team.id}
            team={team}
            currentUser={currentUser}
            onRosterUpdated={refreshTeams}
          />
        ))}
      </div>

      {/* Team Match History & Performance Section */}
      <div className="pt-2">
        <TeamMatchHistory teams={displayTeams} />
      </div>

      {/* WHATSAPP ROOM ID & SCRIMS ACCESS BANNER */}
      <Card glow="lime" className="p-6 bg-[#0c1610] border-emerald-500/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center p-2.5 shrink-0">
              <MessageSquare className="w-6 h-6 fill-emerald-400/20 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Official WhatsApp Integration
              </span>
              <h3 className="text-lg font-black text-white italic uppercase">
                Instant Room ID & Password Alerts
              </h3>
              <p className="text-xs text-gray-300">
                Join Captains Only & Scrims WhatsApp groups to receive automated 15-minute advance custom room broadcasts.
              </p>
            </div>
          </div>

          <Link
            to="/whatsapp"
            className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Open WhatsApp Hub</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </Card>

      {/* Google Workspace Integration */}
      <div className="pt-6">
        <WorkspaceHub />
      </div>

      {/* Modal for Joining Squad via Shareable Link / Code */}
      <JoinSquadModal
        currentUser={currentUser}
        isOpen={isJoinModalOpen}
        onClose={() => {
          setIsJoinModalOpen(false);
          if (searchParams.get('invite')) {
            setSearchParams({}, { replace: true });
          }
        }}
        initialCode={inviteCodeParam}
        onJoinedSuccess={(joinedTeam) => {
          refreshTeams();
        }}
      />

      {/* Ace Tier Rank Unlock Framer Motion Animation */}
      <AceTierUnlockOverlay
        isOpen={isAceOverlayOpen}
        rankName={currentUser.rank || 'Ace Tier'}
        playerName={currentUser.game_name || currentUser.username}
        onClose={() => {
          setIsAceOverlayOpen(false);
          dbStore.clearAceUnlockAnimation(currentUser.id);
          refreshUserData();
        }}
      />

      {/* Avatar Customizer Studio Modal */}
      <AvatarCustomizerModal
        user={currentUser}
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onUpdated={() => {
          refreshUserData();
        }}
      />
    </div>
  );
};