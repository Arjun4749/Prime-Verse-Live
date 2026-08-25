import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Shield, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RegistrationSuccessModal } from '../components/tournament/RegistrationSuccessModal';

export const TeamRegistration: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const DEMO_SESSION_KEY = 'prime_verse_demo_session';

const [authChecking, setAuthChecking] = useState(true);
const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  const demoSession =
    sessionStorage.getItem(DEMO_SESSION_KEY) === 'true';

  if (demoSession) {
    setIsAuthenticated(true);
  } else {
    navigate('/login', {
      replace: true,
      state: {
        from: `/tournaments/${slug}/register`,
      },
    });
  }

  setAuthChecking(false);
}, [navigate, slug]);

  const tournament = dbStore.getTournamentBySlug(slug || '');
  const currentUser = dbStore.getCurrentUser();
  const userTeams = dbStore.getTeams().filter((t) => t.captain_id === currentUser.id);

  const [selectedTeamId, setSelectedTeamId] = useState(userTeams[0]?.id || '');
  const [showCreateTeam, setShowCreateTeam] = useState(userTeams.length === 0);

  // New Team Form
  const [teamName, setTeamName] = useState('');
  const [teamTag, setTeamTag] = useState('');
  const [captainGameName, setCaptainGameName] = useState(currentUser.game_name || '');
  const [captainBgmiId, setCaptainBgmiId] = useState(currentUser.bgmi_id || '');

  const [player2Name, setPlayer2Name] = useState('');
  const [player2Id, setPlayer2Id] = useState('');

  const [player3Name, setPlayer3Name] = useState('');
  const [player3Id, setPlayer3Id] = useState('');

  const [player4Name, setPlayer4Name] = useState('');
  const [player4Id, setPlayer4Id] = useState('');

  const [substituteName, setSubstituteName] = useState('');
  const [substituteId, setSubstituteId] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredSquadData, setRegisteredSquadData] = useState<{ name: string; tag: string; captain: string } | null>(null);

  if (!tournament) return null;

  if (authChecking) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const authenticatedUser = await getCurrentSupabaseUser();

    if (!authenticatedUser) {
      navigate('/login', { replace: true });
      return;
    }

    let teamIdToRegister = selectedTeamId;
    let registeredTeamName = '';
    let registeredTeamTag = '';
    let registeredCaptainName = currentUser.game_name || 'Captain';

    if (showCreateTeam) {
      if (!teamName || !teamTag || !captainGameName || !captainBgmiId) {
        setErrorMsg('Please complete all captain and team name fields.');
        return;
      }

      if (tournament.format === 'Squad' && (!player2Name || !player3Name || !player4Name)) {
        setErrorMsg('Squad tournaments require 4 active players.');
        return;
      }

      // Check duplicate BGMI IDs in squad
      const ids = [captainBgmiId, player2Id, player3Id, player4Id, substituteId].filter(Boolean);
      if (new Set(ids).size !== ids.length) {
        setErrorMsg('Duplicate BGMI Player IDs detected in squad roster.');
        return;
      }

      const createdTeam = dbStore.createTeam({
        name: teamName,
        tag: teamTag,
        captain_id: currentUser.id,
        members: [
          { game_name: captainGameName, player_id: captainBgmiId, user_id: currentUser.id },
          { game_name: player2Name, player_id: player2Id },
          { game_name: player3Name, player_id: player3Id },
          { game_name: player4Name, player_id: player4Id },
          ...(substituteName ? [{ game_name: substituteName, player_id: substituteId }] : []),
        ],
      });

      teamIdToRegister = createdTeam.id;
      registeredTeamName = createdTeam.name;
      registeredTeamTag = createdTeam.tag;
      registeredCaptainName = captainGameName;
    } else {
      const selectedTeam = userTeams.find((t) => t.id === selectedTeamId);
      registeredTeamName = selectedTeam?.name || 'Squad';
      registeredTeamTag = selectedTeam?.tag || 'SQD';
      registeredCaptainName = currentUser.game_name || 'Captain';
    }

    dbStore.registerTeamForTournament(tournament.id, teamIdToRegister, currentUser.id);
    setSuccessMsg('Registration successful! Your squad is confirmed for this tournament.');
    setRegisteredSquadData({
      name: registeredTeamName,
      tag: registeredTeamTag,
      captain: registeredCaptainName,
    });
    setShowSuccessModal(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
          Registration Portal
        </span>
        <h1 className="text-3xl font-black italic uppercase text-white font-mono">
          Register Team for {tournament.title}
        </h1>
        <p className="text-xs text-gray-400">Format: {tournament.format} &bull; Entry Fee: {tournament.entry_fee === 0 ? 'FREE' : `₹${tournament.entry_fee}`}</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-400 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <Card className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Select Existing or Create New */}
          {userTeams.length > 0 && (
            <div className="p-3 bg-black/60 rounded-xl border border-gray-800 space-y-2">
              <label className="block text-gray-300 font-bold uppercase">Select Registered Team</label>
              <select
                value={selectedTeamId}
                onChange={(e) => {
                  setSelectedTeamId(e.target.value);
                  setShowCreateTeam(false);
                }}
                className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white"
              >
                {userTeams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} [{t.tag}]
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowCreateTeam(!showCreateTeam)}
                className="text-orange-400 underline font-semibold text-[11px] block mt-1 cursor-pointer"
              >
                {showCreateTeam ? 'Use Existing Team' : '+ Create New Squad'}
              </button>
            </div>
          )}

          {showCreateTeam && (
            <div className="space-y-4 pt-2 border-t border-gray-800">
              <h3 className="text-sm font-bold uppercase text-white">Create Squad Roster</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GodLike eSports"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Team Tag</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="e.g. GODL"
                    value={teamTag}
                    onChange={(e) => setTeamTag(e.target.value)}
                    className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-white uppercase font-mono"
                  />
                </div>
              </div>

              {/* Player 1 (Captain) */}
              <div className="p-3 bg-orange-950/20 border border-orange-500/30 rounded-xl space-y-2">
                <span className="font-bold text-orange-400 uppercase tracking-wide block">Player 1 (Captain)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="In-Game Name"
                    value={captainGameName}
                    onChange={(e) => setCaptainGameName(e.target.value)}
                    className="bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="BGMI ID (e.g. 5129849102)"
                    value={captainBgmiId}
                    onChange={(e) => setCaptainBgmiId(e.target.value)}
                    className="bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Player 2 */}
              <div className="p-3 bg-black/40 border border-gray-800 rounded-xl space-y-2">
                <span className="font-bold text-gray-300 uppercase tracking-wide block">Player 2</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="In-Game Name"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    className="bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="BGMI Player ID"
                    value={player2Id}
                    onChange={(e) => setPlayer2Id(e.target.value)}
                    className="bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Player 3 */}
              <div className="p-3 bg-black/40 border border-gray-800 rounded-xl space-y-2">
                <span className="font-bold text-gray-300 uppercase tracking-wide block">Player 3</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="In-Game Name"
                    value={player3Name}
                    onChange={(e) => setPlayer3Name(e.target.value)}
                    className="bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="BGMI Player ID"
                    value={player3Id}
                    onChange={(e) => setPlayer3Id(e.target.value)}
                    className="bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Player 4 */}
              <div className="p-3 bg-black/40 border border-gray-800 rounded-xl space-y-2">
                <span className="font-bold text-gray-300 uppercase tracking-wide block">Player 4</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="In-Game Name"
                    value={player4Name}
                    onChange={(e) => setPlayer4Name(e.target.value)}
                    className="bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="BGMI Player ID"
                    value={player4Id}
                    onChange={(e) => setPlayer4Id(e.target.value)}
                    className="bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-800">
            <Button variant="primary" size="lg" glow type="submit" className="w-full">
              CONFIRM REGISTRATION <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>

      {/* Visual Success Feedback Animation Overlay */}
      {showSuccessModal && registeredSquadData && (
        <RegistrationSuccessModal
          tournament={tournament}
          teamName={registeredSquadData.name}
          teamTag={registeredSquadData.tag}
          captainName={registeredSquadData.captain}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};
