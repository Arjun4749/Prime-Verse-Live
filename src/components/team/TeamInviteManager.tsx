import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Copy,
  Check,
  Share2,
  Trash2,
  Users,
  Shield,
  Sparkles,
  Link,
  QrCode,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Team, TeamInvite, UserProfile } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface TeamInviteManagerProps {
  team: Team;
  currentUser: UserProfile;
  onRosterUpdated?: () => void;
}

export const TeamInviteManager: React.FC<TeamInviteManagerProps> = ({
  team,
  currentUser,
  onRosterUpdated,
}) => {
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [maxUses, setMaxUses] = useState<number>(5);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const isCaptain = team.captain_id === currentUser.id || currentUser.role === 'admin';

  const loadInvites = () => {
    const list = dbStore.getTeamInvites(team.id);
    setInvites(list);
  };

  useEffect(() => {
    loadInvites();
  }, [team.id]);

  const handleGenerateInvite = () => {
    setIsGenerating(true);
    setTimeout(() => {
      dbStore.generateTeamInvite(team.id, currentUser.id, maxUses);
      loadInvites();
      setIsGenerating(false);
    }, 250);
  };

  const handleRevokeInvite = (inviteId: string) => {
    dbStore.revokeTeamInvite(inviteId);
    loadInvites();
  };

  const getFullInviteUrl = (code: string) => {
    return `${window.location.origin}/dashboard?invite=${code}`;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCopyLink = (code: string) => {
    const url = getFullInviteUrl(code);
    navigator.clipboard.writeText(url);
    setCopiedLink(code);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleShareWhatsApp = (code: string) => {
    const url = getFullInviteUrl(code);
    const text = `Join my BGMI esports squad *${team.name}* [${team.tag}] using this invite link: ${url}\nOr enter Invite Code: *${code}*`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <Card className="p-5 sm:p-6 bg-[#0f111a] border-gray-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src={team.logo_url}
            alt={team.name}
            className="w-12 h-12 rounded-2xl object-cover border border-orange-500/30 p-0.5 bg-black"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white font-mono uppercase">{team.name}</h3>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold text-xs font-mono">
                [{team.tag}]
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Manage squad members and generate unique shareable invite codes
            </p>
          </div>
        </div>

        {isCaptain && (
          <div className="flex items-center gap-2">
            <select
              value={maxUses}
              onChange={(e) => setMaxUses(Number(e.target.value))}
              className="bg-black/60 border border-gray-800 rounded-xl px-2.5 py-2 text-xs text-gray-300 font-mono focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value={1}>1 Player Limit</option>
              <option value={3}>3 Players Limit</option>
              <option value={5}>5 Players Limit</option>
              <option value={10}>10 Players Limit</option>
            </select>

            <button
              onClick={handleGenerateInvite}
              disabled={isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Create Invite Link'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Roster & Invites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Squad Roster Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-gray-400">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-orange-400" /> Current Squad Roster
            </span>
            <span className="text-orange-400">{team.members?.length || 0} Members</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto divide-y divide-gray-800/60 pr-1">
            {team.members?.map((member) => (
              <div
                key={member.id}
                className="pt-2 first:pt-0 flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-gray-800/80 hover:border-gray-700 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-black text-xs flex items-center justify-center font-mono">
                    {member.game_name.substring(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{member.game_name}</span>
                      {member.role === 'Captain' && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px] font-mono border border-amber-500/30">
                          CAPTAIN
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">
                      BGMI ID: {member.player_id}
                    </span>
                  </div>
                </div>

                <Badge variant={member.role === 'Captain' ? 'warning' : 'outline'} className="text-[10px]">
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Generated Invite Links & Codes Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-gray-400">
            <span className="flex items-center gap-1.5">
              <Link className="w-4 h-4 text-cyan-400" /> Shareable Invite Codes
            </span>
            <span className="text-gray-500">{invites.filter((i) => i.status === 'Active').length} Active</span>
          </div>

          {invites.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-gray-800 rounded-2xl space-y-2">
              <UserPlus className="w-8 h-8 text-gray-600 mx-auto" />
              <p className="text-xs font-bold text-gray-400">No Invite Links Generated Yet</p>
              <p className="text-[11px] text-gray-500">
                Generate an invite link above to quickly onboard new squad members for tournament rosters.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    inv.status === 'Active'
                      ? 'bg-black/60 border-orange-500/30 hover:border-orange-500/60'
                      : 'bg-black/20 border-gray-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-white bg-orange-950/40 px-2.5 py-1 rounded-lg border border-orange-500/30">
                        {inv.invite_code}
                      </span>
                      <Badge
                        variant={inv.status === 'Active' ? 'success' : 'danger'}
                        className="text-[9px]"
                      >
                        {inv.status}
                      </Badge>
                    </div>

                    <span className="text-[10px] text-gray-400 font-mono">
                      {inv.use_count} / {inv.max_uses || '∞'} Uses
                    </span>
                  </div>

                  {inv.status === 'Active' && (
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-800/80">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyCode(inv.invite_code)}
                          className="px-2.5 py-1 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedCode === inv.invite_code ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-orange-400" /> Copy Code
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleCopyLink(inv.invite_code)}
                          className="px-2.5 py-1 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer"
                          title="Copy Share Link"
                        >
                          {copiedLink === inv.invite_code ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Link Copied!
                            </>
                          ) : (
                            <>
                              <Link className="w-3 h-3 text-cyan-400" /> Copy Link
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleShareWhatsApp(inv.invite_code)}
                          className="p-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-400 rounded-lg transition-all cursor-pointer"
                          title="Share to WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>

                      {isCaptain && (
                        <button
                          onClick={() => handleRevokeInvite(inv.id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Revoke Invite Code"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
